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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Product } from "@/types/data"; // Changed from StockItem

// Schema validasi menggunakan Zod
const formSchema = z.object({
  quantity: z.coerce.number().min(1, "Kuantitas harus lebih besar dari 0"),
  transaction_date: z.date({ required_error: "Tanggal transaksi wajib diisi" }),
  notes: z.string().optional(),
  transaction_type: z.enum(["in", "out", "return", "damage_loss"], {
    required_error: "Tipe transaksi wajib dipilih",
  }),
  warehouse_category: z.enum(["siap_jual", "riset", "retur"], { // New field
    required_error: "Kategori Gudang wajib dipilih",
  }).default("siap_jual"),
});

interface AddStockTransactionFormProps {
  product: Product; // Changed from stockItem: StockItem
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialTransactionType?: "in" | "out" | "return" | "damage_loss";
}

const AddStockTransactionForm: React.FC<AddStockTransactionFormProps> = ({
  product, // Changed from stockItem
  isOpen,
  onOpenChange,
  onSuccess,
  initialTransactionType,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      transaction_date: new Date(),
      notes: "",
      transaction_type: initialTransactionType || "in",
      warehouse_category: "siap_jual", // Default value for new field
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        quantity: 1,
        transaction_date: new Date(),
        notes: "",
        transaction_type: initialTransactionType || "in",
        warehouse_category: "siap_jual",
      });
    }
  }, [isOpen, initialTransactionType, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    try {
      // Fetch current warehouse inventory for the specific product and category
      const { data: currentInventory, error: fetchError } = await supabase
        .from("warehouse_inventories")
        .select("id, quantity")
        .eq("product_id", product.id)
        .eq("warehouse_category", values.warehouse_category)
        .single();

      let newQuantityInInventory: number;
      let inventoryId: string;

      if (values.transaction_type === "in" || values.transaction_type === "return") {
        if (currentInventory) {
          newQuantityInInventory = currentInventory.quantity + values.quantity;
          inventoryId = currentInventory.id;
          // Update existing inventory
          const { error: updateInventoryError } = await supabase
            .from("warehouse_inventories")
            .update({ quantity: newQuantityInInventory, updated_at: new Date().toISOString() })
            .eq("id", inventoryId);
          if (updateInventoryError) throw updateInventoryError;
        } else {
          // Create new inventory entry if none exists for this product/category
          const { data: newInventory, error: createInventoryError } = await supabase
            .from("warehouse_inventories")
            .insert({
              product_id: product.id,
              warehouse_category: values.warehouse_category,
              quantity: values.quantity,
              user_id: userId,
            })
            .select("id, quantity")
            .single();
          if (createInventoryError) throw createInventoryError;
          inventoryId = newInventory.id;
          newQuantityInInventory = newInventory.quantity;
        }
      } else if (values.transaction_type === "out" || values.transaction_type === "damage_loss") {
        if (!currentInventory || currentInventory.quantity < values.quantity) {
          showError(`Stok tidak mencukupi di kategori "${getCategoryDisplay(values.warehouse_category)}". Tersedia: ${currentInventory?.quantity || 0}, Diminta: ${values.quantity}`);
          return;
        }
        newQuantityInInventory = currentInventory.quantity - values.quantity;
        inventoryId = currentInventory.id;
        // Update existing inventory
        const { error: updateInventoryError } = await supabase
          .from("warehouse_inventories")
          .update({ quantity: newQuantityInInventory, updated_at: new Date().toISOString() })
          .eq("id", inventoryId);
        if (updateInventoryError) throw updateInventoryError;
      } else {
        // Should not happen with enum, but for safety
        showError("Tipe transaksi tidak valid.");
        return;
      }

      // Insert into stock_transactions table
      const { error: transactionError } = await supabase
        .from("stock_transactions")
        .insert({
          user_id: userId,
          product_id: product.id,
          transaction_type: values.transaction_type,
          quantity: values.quantity,
          notes: values.notes || null,
          transaction_date: format(values.transaction_date, "yyyy-MM-dd"),
          warehouse_category: values.warehouse_category, // Record the category affected
        });

      if (transactionError) {
        throw transactionError;
      }

      showSuccess("Transaksi stok berhasil dicatat!");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      showError(`Gagal mencatat transaksi stok: ${error.message}`);
      console.error("Error adding stock transaction:", error);
    }
  };

  const getCategoryDisplay = (category: "siap_jual" | "riset" | "retur") => {
    switch (category) {
      case "siap_jual": return "Siap Jual";
      case "riset": return "Riset";
      case "retur": return "Retur";
      default: return category;
    }
  };

  const dialogTitle = {
    in: "Tambah Stok Masuk",
    out: "Kurangi Stok Keluar",
    return: "Catat Retur Barang",
    damage_loss: "Catat Stok Rusak/Hilang",
  }[form.watch("transaction_type")];

  const dialogDescription = `Catat transaksi stok untuk item "${product.nama_barang}".`; // Corrected access

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="transaction_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Transaksi</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe transaksi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="in">Stok Masuk</SelectItem>
                      <SelectItem value="out">Stok Keluar (Manual)</SelectItem>
                      <SelectItem value="return">Retur Barang</SelectItem>
                      <SelectItem value="damage_loss">Rusak/Hilang</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kuantitas</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transaction_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Transaksi</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pilih tanggal</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tambahkan keterangan transaksi..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Simpan Transaksi"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStockTransactionForm;