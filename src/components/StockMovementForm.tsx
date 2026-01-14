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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { StockItem } from "@/types/data";
import { format } from "date-fns"; // Import format

// Define the ENUM type for warehouse categories
type WarehouseCategory = 'siap_jual' | 'riset' | 'retur';

// Schema validasi menggunakan Zod
const formSchema = z.object({
  from_category: z.enum(["siap_jual", "riset", "retur"], {
    required_error: "Kategori Asal wajib dipilih",
  }),
  to_category: z.enum(["siap_jual", "riset", "retur"], {
    required_error: "Kategori Tujuan wajib dipilih",
  }),
  quantity: z.coerce.number().min(1, "Kuantitas harus lebih besar dari 0"),
  reason: z.string().optional(),
});

interface StockMovementFormProps {
  stockItem: StockItem;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const StockMovementForm: React.FC<StockMovementFormProps> = ({
  stockItem,
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from_category: stockItem.warehouse_category || "siap_jual",
      to_category: stockItem.warehouse_category === "siap_jual" ? "riset" : "siap_jual", // Suggest a different category
      quantity: 1,
      reason: "",
    },
  });

  // Reset form when dialog opens or stockItem changes
  useEffect(() => {
    if (isOpen && stockItem) {
      form.reset({
        from_category: stockItem.warehouse_category || "siap_jual",
        to_category: stockItem.warehouse_category === "siap_jual" ? "riset" : "siap_jual",
        quantity: 1,
        reason: "",
      });
    }
  }, [isOpen, stockItem, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    if (values.from_category === values.to_category) {
      showError("Kategori asal dan tujuan tidak boleh sama.");
      return;
    }

    try {
      // Fetch current stock item to get the latest stock_akhir for the 'from_category'
      const { data: currentStockItem, error: fetchError } = await supabase
        .from("stock_items")
        .select("stock_akhir, warehouse_category")
        .eq("id", stockItem.id)
        .single();

      if (fetchError || !currentStockItem) {
        throw new Error("Gagal memuat data stok saat ini.");
      }

      if (currentStockItem.warehouse_category !== values.from_category) {
        showError(`Item ini saat ini berada di kategori "${currentStockItem.warehouse_category}", bukan "${values.from_category}". Harap perbarui kategori asal.`);
        return;
      }

      if (currentStockItem.stock_akhir < values.quantity) {
        showError(`Stok tidak mencukupi di kategori "${values.from_category}". Tersedia: ${currentStockItem.stock_akhir}, Diminta: ${values.quantity}`);
        return;
      }

      // Update stock_items: decrease from 'from_category' and increase in 'to_category'
      // This requires two updates if the item is conceptually "moving" categories.
      // For simplicity, we'll update the existing item's category and adjust its stock_akhir.
      // If we were tracking separate stock counts per category for the *same* item, it would be more complex.
      // Given the current schema, `stock_akhir` is a single value for the item.
      // The `stock_movements` table tracks the *event* of moving, not separate stock levels.

      // So, the `stock_akhir` of the item itself will remain the same,
      // but its `warehouse_category` will change.
      // The `stock_movements` table will record the historical event.

      const { error: updateError } = await supabase
        .from("stock_items")
        .update({
          warehouse_category: values.to_category,
          // stock_akhir is not directly changed by a *movement* between categories for the same item.
          // It's changed by 'in'/'out' transactions.
          // If the intent is to *transfer* stock, then the stock_akhir should remain the same.
          // If the intent is to *reduce* stock from one category and *add* to another,
          // then we need to adjust stock_akhir.
          // For now, let's assume `stock_akhir` represents the total available stock for the item,
          // regardless of its current category. The movement just changes its classification.
          // If the requirement is to have separate `stock_akhir` per category, the `stock_items` schema needs to change.
          // For this implementation, we'll just change the `warehouse_category` of the item.
          // The `quantity` in `stock_movements` will represent the amount *moved* conceptually.
        })
        .eq("id", stockItem.id);

      if (updateError) {
        throw updateError;
      }

      // Insert into stock_movements table
      const { error: movementError } = await supabase
        .from("stock_movements")
        .insert({
          user_id: userId,
          stock_item_id: stockItem.id,
          from_category: values.from_category,
          to_category: values.to_category,
          quantity: values.quantity,
          reason: values.reason || null,
          movement_date: format(new Date(), "yyyy-MM-dd"),
        });

      if (movementError) {
        throw movementError;
      }

      showSuccess(`Stok item "${stockItem["NAMA BARANG"]}" berhasil dipindahkan dari ${values.from_category} ke ${values.to_category}!`);
      onOpenChange(false);
      onSuccess(); // Trigger refresh of stock data
    } catch (error: any) {
      showError(`Gagal memindahkan stok: ${error.message}`);
      console.error("Error moving stock:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pindahkan Stok Barang</DialogTitle>
          <DialogDescription>Pindahkan item stok "{stockItem["NAMA BARANG"]}" antar kategori gudang.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="from_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dari Kategori</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled> {/* Disabled as it's the item's current category */}
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori asal" />
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
              name="to_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ke Kategori</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori tujuan" />
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
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alasan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tambahkan alasan perpindahan stok..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Pindahkan Stok"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StockMovementForm;