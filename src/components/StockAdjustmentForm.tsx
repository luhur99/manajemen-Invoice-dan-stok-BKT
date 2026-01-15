"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { StockItem, WarehouseInventory } from "@/types/data";
import { format } from "date-fns";

// Schema validasi menggunakan Zod
const formSchema = z.object({
  warehouse_category: z.enum(["siap_jual", "riset", "retur", "backup_teknisi"], {
    required_error: "Kategori Gudang wajib dipilih",
  }),
  new_quantity: z.coerce.number().min(0, "Kuantitas baru tidak boleh negatif"),
  reason: z.string().min(1, "Alasan penyesuaian wajib diisi"),
});

interface StockAdjustmentFormProps {
  stockItem: StockItem;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const StockAdjustmentForm: React.FC<StockAdjustmentFormProps> = ({
  stockItem,
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const [currentInventories, setCurrentInventories] = useState<WarehouseInventory[]>([]);
  const [loadingInventories, setLoadingInventories] = useState(true);

  const getCategoryDisplay = (category?: 'siap_jual' | 'riset' | 'retur' | 'backup_teknisi') => {
    switch (category) {
      case "siap_jual": return "Siap Jual";
      case "riset": return "Riset";
      case "retur": return "Retur";
      case "backup_teknisi": return "Backup Teknisi";
      default: return "-";
    }
  };

  const fetchInventories = useCallback(async () => {
    if (!stockItem?.id) return;
    setLoadingInventories(true);
    const { data, error } = await supabase
      .from("warehouse_inventories")
      .select("*")
      .eq("product_id", stockItem.id);

    if (error) {
      showError("Gagal memuat inventaris item.");
      console.error("Error fetching warehouse inventories:", error);
      setCurrentInventories([]);
    } else {
      setCurrentInventories(data as WarehouseInventory[]);
    }
    setLoadingInventories(false);
  }, [stockItem?.id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      warehouse_category: stockItem.inventories?.[0]?.warehouse_category || "siap_jual",
      new_quantity: 0, // Will be set in useEffect
      reason: "",
    },
  });

  // Update default new_quantity when category changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchInventories().then(() => {
        const defaultCategory = stockItem.inventories?.[0]?.warehouse_category || "siap_jual";
        const initialQuantity = currentInventories.find(inv => inv.warehouse_category === defaultCategory)?.quantity || 0;
        form.reset({
          warehouse_category: defaultCategory,
          new_quantity: initialQuantity,
          reason: "",
        });
      });
    }
  }, [isOpen, stockItem, form, fetchInventories, currentInventories.length]); // Depend on currentInventories.length to re-run after fetch

  const selectedCategory = form.watch("warehouse_category");
  const currentQuantityForSelectedCategory = currentInventories.find(
    (inv) => inv.warehouse_category === selectedCategory
  )?.quantity || 0;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    try {
      const oldQuantity = currentQuantityForSelectedCategory;
      const newQuantity = values.new_quantity;
      const difference = newQuantity - oldQuantity;

      if (difference === 0) {
        showSuccess("Tidak ada perubahan stok yang dilakukan.");
        onOpenChange(false);
        onSuccess();
        return;
      }

      // Update or insert into warehouse_inventories
      const { error: upsertInventoryError } = await supabase
        .from("warehouse_inventories")
        .upsert(
          {
            product_id: stockItem.id,
            warehouse_category: values.warehouse_category,
            quantity: newQuantity,
            user_id: userId,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "product_id, warehouse_category" }
        );

      if (upsertInventoryError) {
        throw upsertInventoryError;
      }

      // Insert into stock_transactions table with 'adjustment' type
      const { error: transactionError } = await supabase
        .from("stock_transactions")
        .insert({
          user_id: userId,
          stock_item_id: stockItem.id,
          transaction_type: 'adjustment',
          quantity: Math.abs(difference), // Record the absolute change
          notes: `Penyesuaian stok di kategori ${getCategoryDisplay(values.warehouse_category)} dari ${oldQuantity} menjadi ${newQuantity}. Alasan: ${values.reason}`,
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Penyesuaian Stok Barang</DialogTitle>
          <DialogDescription>Sesuaikan kuantitas stok untuk item "{stockItem["NAMA BARANG"]}" di kategori tertentu.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="warehouse_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Gudang</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    const quantityForNewCategory = currentInventories.find(inv => inv.warehouse_category === value)?.quantity || 0;
                    form.setValue("new_quantity", quantityForNewCategory);
                  }} value={field.value} disabled={loadingInventories}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingInventories ? "Memuat kategori..." : "Pilih kategori gudang"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["siap_jual", "riset", "retur", "backup_teknisi"].map(category => (
                        <SelectItem key={category} value={category}>
                          {getCategoryDisplay(category as 'siap_jual' | 'riset' | 'retur' | 'backup_teknisi')} (Stok: {currentInventories.find(inv => inv.warehouse_category === category)?.quantity || 0})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Stok Saat Ini ({getCategoryDisplay(selectedCategory)})</FormLabel>
              <FormControl>
                <Input type="number" value={currentQuantityForSelectedCategory} disabled />
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