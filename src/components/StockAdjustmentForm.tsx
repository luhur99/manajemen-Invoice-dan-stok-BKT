"use client";

import React, { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Product } from "@/types/data"; // Changed from StockItem
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the ENUM type for warehouse categories
type WarehouseCategory = 'siap_jual' | 'riset' | 'retur';

// Schema validasi menggunakan Zod
const formSchema = z.object({
  new_quantity: z.coerce.number().min(0, "Kuantitas tidak boleh negatif"),
  warehouse_category: z.enum(["siap_jual", "riset", "retur"], {
    required_error: "Kategori Gudang wajib dipilih",
  }),
  reason: z.string().min(1, "Alasan penyesuaian wajib diisi"),
});

interface StockAdjustmentFormProps {
  product: Product; // Changed from stockItem: StockItem
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const StockAdjustmentForm: React.FC<StockAdjustmentFormProps> = ({
  product, // Changed from stockItem
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const [currentQuantity, setCurrentQuantity] = useState<number>(0);
  const [loadingCurrentQuantity, setLoadingCurrentQuantity] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      new_quantity: 0, // Will be set after fetching current quantity
      warehouse_category: "siap_jual",
      reason: "",
    },
  });

  // Fetch current quantity for the selected product and category
  useEffect(() => {
    const fetchCurrentQuantity = async () => {
      if (!product?.id || !isOpen) {
        setCurrentQuantity(0);
        setLoadingCurrentQuantity(false);
        return;
      }

      setLoadingCurrentQuantity(true);
      const selectedCategory = form.getValues().warehouse_category;

      const { data, error } = await supabase
        .from("warehouse_inventories")
        .select("quantity")
        .eq("product_id", product.id)
        .eq("warehouse_category", selectedCategory)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        showError(`Gagal memuat kuantitas saat ini: ${error.message}`);
        console.error("Error fetching current quantity:", error);
        setCurrentQuantity(0);
      } else if (data) {
        setCurrentQuantity(data.quantity);
        form.setValue("new_quantity", data.quantity);
      } else {
        setCurrentQuantity(0);
        form.setValue("new_quantity", 0);
      }
      setLoadingCurrentQuantity(false);
    };

    if (isOpen) {
      fetchCurrentQuantity();
    }
  }, [isOpen, product, form.watch("warehouse_category")]); // Re-fetch if category changes

  // Reset form when dialog opens or product prop changes
  useEffect(() => {
    if (isOpen && product) {
      form.reset({
        new_quantity: currentQuantity, // Use fetched current quantity
        warehouse_category: "siap_jual",
        reason: "",
      });
    }
  }, [isOpen, product, form, currentQuantity]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    try {
      const newQuantity = values.new_quantity;
      const difference = newQuantity - currentQuantity;

      if (difference === 0) {
        showSuccess("Tidak ada perubahan stok yang dilakukan.");
        onOpenChange(false);
        onSuccess();
        return;
      }

      // Update or insert into warehouse_inventories
      const { data: existingInventory, error: fetchInventoryError } = await supabase
        .from("warehouse_inventories")
        .select("id")
        .eq("product_id", product.id)
        .eq("warehouse_category", values.warehouse_category)
        .single();

      if (fetchInventoryError && fetchInventoryError.code === 'PGRST116') { // No rows found
        // Create new inventory entry
        const { error: createInventoryError } = await supabase
          .from("warehouse_inventories")
          .insert({
            product_id: product.id,
            warehouse_category: values.warehouse_category,
            quantity: newQuantity,
            user_id: userId,
          });
        if (createInventoryError) throw createInventoryError;
      } else if (fetchInventoryError) {
        throw fetchInventoryError;
      } else if (existingInventory) {
        // Update existing inventory
        const { error: updateInventoryError } = await supabase
          .from("warehouse_inventories")
          .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
          .eq("id", existingInventory.id);
        if (updateInventoryError) throw updateInventoryError;
      }

      // Insert into stock_transactions table with 'adjustment' type
      const { error: transactionError } = await supabase
        .from("stock_transactions")
        .insert({
          user_id: userId,
          product_id: product.id,
          transaction_type: 'adjustment', // Use the 'adjustment' type
          quantity: Math.abs(difference),
          notes: `Penyesuaian stok dari ${currentQuantity} menjadi ${newQuantity} di kategori ${getCategoryDisplay(values.warehouse_category)}. Alasan: ${values.reason}`,
          transaction_date: format(new Date(), "yyyy-MM-dd"),
          warehouse_category: values.warehouse_category,
        });

      if (transactionError) {
        throw transactionError;
      }

      showSuccess("Stok berhasil disesuaikan!");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      showError(`Gagal menyesuaikan stok: ${error.message}`);
      console.error("Error adjusting stock:", error);
    }
  };

  const getCategoryDisplay = (category: WarehouseCategory) => {
    switch (category) {
      case "siap_jual": return "Siap Jual";
      case "riset": return "Riset";
      case "retur": return "Retur";
      default: return category;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Penyesuaian Stok Barang</DialogTitle>
          <DialogDescription>Sesuaikan kuantitas stok untuk produk "{product["NAMA BARANG"]}" di kategori gudang tertentu.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="warehouse_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Gudang</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori gudang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="siap_jual">Siap Jual</SelectItem>
                      <SelectItem value="riset">Riset</SelectItem>
                      <SelectItem value="retur">Retur</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Kuantitas Saat Ini</FormLabel>
              <FormControl>
                <Input type="number" value={loadingCurrentQuantity ? "Memuat..." : currentQuantity} disabled />
              </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name="new_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kuantitas Baru</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alasan Penyesuaian</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Misalnya: Koreksi inventaris fisik, kerusakan, dll." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Simpan Penyesuaian"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StockAdjustmentForm;