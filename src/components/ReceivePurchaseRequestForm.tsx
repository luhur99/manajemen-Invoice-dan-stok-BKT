"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { PurchaseRequest } from "@/types/data";
import { format } from "date-fns";
import { useSession } from "@/components/SessionContextProvider";

// Define the ENUM type for warehouse categories
type WarehouseCategory = 'siap_jual' | 'riset' | 'retur';

// Schema validasi menggunakan Zod
const formSchema = z.object({
  received_quantity: z.coerce.number().min(0, "Kuantitas diterima tidak boleh negatif"),
  returned_quantity: z.coerce.number().min(0, "Kuantitas dikembalikan tidak boleh negatif").default(0),
  damaged_quantity: z.coerce.number().min(0, "Kuantitas rusak tidak boleh negatif").default(0),
  target_warehouse_category: z.enum(["siap_jual", "riset", "retur"], {
    required_error: "Kategori Gudang Tujuan wajib dipilih",
  }),
  received_notes: z.string().optional(),
}).refine(
  (data) => data.received_quantity + data.returned_quantity + data.damaged_quantity > 0,
  {
    message: "Setidaknya satu kuantitas (diterima, dikembalikan, atau rusak) harus lebih besar dari 0.",
    path: ["received_quantity"], // Attach error to received_quantity field
  }
);

interface ReceivePurchaseRequestFormProps {
  purchaseRequest: PurchaseRequest;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ReceivePurchaseRequestForm: React.FC<ReceivePurchaseRequestFormProps> = ({
  purchaseRequest,
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const { session } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      received_quantity: purchaseRequest.quantity, // Default to requested quantity
      returned_quantity: 0,
      damaged_quantity: 0,
      target_warehouse_category: "siap_jual", // Default to siap_jual
      received_notes: "",
    },
  });

  useEffect(() => {
    if (isOpen && purchaseRequest) {
      form.reset({
        received_quantity: purchaseRequest.quantity,
        returned_quantity: 0,
        damaged_quantity: 0,
        target_warehouse_category: "siap_jual",
        received_notes: "",
      });
    }
  }, [isOpen, purchaseRequest, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const userId = session?.user?.id;

    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    const totalHandledQuantity = values.received_quantity + values.returned_quantity + values.damaged_quantity;
    if (totalHandledQuantity > purchaseRequest.quantity) {
      showError(`Total kuantitas yang ditangani (${totalHandledQuantity}) tidak boleh melebihi kuantitas yang diajukan (${purchaseRequest.quantity}).`);
      return;
    }

    try {
      // 1. Update purchase_requests status to 'closed' and record receipt details
      const { error: updateReqError } = await supabase
        .from("purchase_requests")
        .update({
          status: "closed",
          received_quantity: values.received_quantity,
          returned_quantity: values.returned_quantity,
          damaged_quantity: values.damaged_quantity,
          target_warehouse_category: values.target_warehouse_category,
          received_notes: values.received_notes || null,
          received_at: new Date().toISOString(),
        })
        .eq("id", purchaseRequest.id);

      if (updateReqError) {
        throw updateReqError;
      }

      // 2. Add received quantity to warehouse_inventories and record transaction
      if (values.received_quantity > 0) {
        // product_id is now guaranteed to be present due to changes in AddPurchaseRequestForm
        const { data: existingInventory, error: fetchInventoryError } = await supabase
          .from("warehouse_inventories")
          .select("id, quantity")
          .eq("product_id", purchaseRequest.product_id)
          .eq("warehouse_category", values.target_warehouse_category)
          .single();

        let inventoryId: string;
        let newQuantityInInventory: number;

        if (fetchInventoryError && fetchInventoryError.code === 'PGRST116') { // No rows found
          // Create new inventory entry
          const { data: newInventory, error: createInventoryError } = await supabase
            .from("warehouse_inventories")
            .insert({
              product_id: purchaseRequest.product_id,
              warehouse_category: values.target_warehouse_category,
              quantity: values.received_quantity,
              user_id: userId,
            })
            .select("id, quantity")
            .single();

          if (createInventoryError) throw createInventoryError;
          inventoryId = newInventory.id;
          newQuantityInInventory = newInventory.quantity;

        } else if (existingInventory) {
          // Update existing inventory entry
          newQuantityInInventory = existingInventory.quantity + values.received_quantity;

          const { error: updateInventoryError } = await supabase
            .from("warehouse_inventories")
            .update({ quantity: newQuantityInInventory, updated_at: new Date().toISOString() })
            .eq("id", existingInventory.id);

          if (updateInventoryError) throw updateInventoryError;
          inventoryId = existingInventory.id;

        } else {
          throw new Error("Gagal memproses inventaris gudang.");
        }

        // Record transaction in stock_transactions for received items
        const { error: transactionError } = await supabase
          .from("stock_transactions")
          .insert({
            user_id: userId,
            product_id: purchaseRequest.product_id,
            transaction_type: "in",
            quantity: values.received_quantity,
            notes: `Stok masuk dari pengajuan pembelian #${purchaseRequest.no || 'N/A'} (${purchaseRequest.item_name}). Kategori: ${getCategoryDisplay(values.target_warehouse_category)}. Catatan Penerimaan: ${values.received_notes || '-'}`,
            transaction_date: format(new Date(), "yyyy-MM-dd"),
            warehouse_category: values.target_warehouse_category,
          });

        if (transactionError) {
          throw transactionError;
        }
      }

      // 3. Record transaction for returned items
      if (values.returned_quantity > 0) {
        const { error: returnTransactionError } = await supabase
          .from("stock_transactions")
          .insert({
            user_id: userId,
            product_id: purchaseRequest.product_id,
            transaction_type: "return",
            quantity: values.returned_quantity,
            notes: `Barang dikembalikan ke pemasok dari pengajuan pembelian #${purchaseRequest.no || 'N/A'} (${purchaseRequest.item_name}). Catatan Penerimaan: ${values.received_notes || '-'}`,
            transaction_date: format(new Date(), "yyyy-MM-dd"),
            warehouse_category: values.target_warehouse_category, // Log the intended category
          });
        if (returnTransactionError) console.error("Error recording return transaction:", returnTransactionError);
      }

      // 4. Record transaction for damaged items
      if (values.damaged_quantity > 0) {
        const { error: damageTransactionError } = await supabase
          .from("stock_transactions")
          .insert({
            user_id: userId,
            product_id: purchaseRequest.product_id,
            transaction_type: "damage_loss",
            quantity: values.damaged_quantity,
            notes: `Stok rusak/cacat dari pengajuan pembelian #${purchaseRequest.no || 'N/A'} (${purchaseRequest.item_name}). Catatan Penerimaan: ${values.received_notes || '-'}`,
            transaction_date: format(new Date(), "yyyy-MM-dd"),
            warehouse_category: values.target_warehouse_category, // Log the intended category
          });
        if (damageTransactionError) console.error("Error recording damage transaction:", damageTransactionError);
      }

      showSuccess(`Pengajuan pembelian untuk "${purchaseRequest.item_name}" berhasil diterima dan stok diperbarui!`);
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      showError(`Gagal mencatat penerimaan barang: ${error.message}`); // Display specific error message
      console.error("Error receiving purchase request:", error);
    }
  };

  const getCategoryDisplay = (category?: WarehouseCategory) => {
    switch (category) {
      case "siap_jual": return "Siap Jual";
      case "riset": return "Riset";
      case "retur": return "Retur";
      default: return "-";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Terima Barang untuk Pengajuan Pembelian</DialogTitle>
          <DialogDescription>
            Catat detail penerimaan barang untuk pengajuan "{purchaseRequest.item_name}" (Kuantitas diajukan: {purchaseRequest.quantity}).
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="received_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kuantitas Diterima</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="returned_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kuantitas Dikembalikan ke Pemasok</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="damaged_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kuantitas Rusak/Cacat</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="target_warehouse_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori Gudang Tujuan</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori gudang" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="siap_jual">{getCategoryDisplay("siap_jual")}</SelectItem>
                        <SelectItem value="riset">{getCategoryDisplay("riset")}</SelectItem>
                        <SelectItem value="retur">{getCategoryDisplay("retur")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="received_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan Penerimaan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tambahkan catatan mengenai penerimaan barang, misalnya kondisi barang, perbedaan kuantitas, dll." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-6" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Konfirmasi Penerimaan"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReceivePurchaseRequestForm;