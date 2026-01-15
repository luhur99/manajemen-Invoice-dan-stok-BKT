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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Product, WarehouseInventory } from "@/types/data"; // Changed from StockItem
import { format } from "date-fns";

// Define the ENUM type for warehouse categories
type WarehouseCategory = 'siap_jual' | 'riset' | 'retur' | 'backup_teknisi';

// Schema validasi menggunakan Zod
const formSchema = z.object({
  from_category: z.enum(["siap_jual", "riset", "retur", "backup_teknisi"], {
    required_error: "Kategori Asal wajib dipilih",
  }),
  to_category: z.enum(["siap_jual", "riset", "retur", "backup_teknisi"], {
    required_error: "Kategori Tujuan wajib dipilih",
  }),
  quantity: z.coerce.number().min(1, "Kuantitas harus lebih besar dari 0"),
  reason: z.string().optional(),
});

interface StockMovementFormProps {
  product: Product; // Changed from stockItem
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const StockMovementForm: React.FC<StockMovementFormProps> = ({
  product, // Changed from stockItem
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
    if (!product?.id) return; // Changed from stockItem?.id
    setLoadingInventories(true);
    const { data, error } = await supabase
      .from("warehouse_inventories")
      .select("*")
      .eq("product_id", product.id); // Changed from stockItem.id

    if (error) {
      showError("Gagal memuat inventaris item.");
      console.error("Error fetching warehouse inventories:", error);
      setCurrentInventories([]);
    } else {
      setCurrentInventories(data as WarehouseInventory[]);
    }
    setLoadingInventories(false);
  }, [product?.id]); // Changed from stockItem?.id

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from_category: product.inventories?.[0]?.warehouse_category || "siap_jual", // Changed from stockItem.inventories
      to_category: product.inventories?.[0]?.warehouse_category === "siap_jual" ? "riset" : "siap_jual", // Changed from stockItem.inventories
      quantity: 1,
      reason: "",
    },
  });

  // Reset form when dialog opens or product changes
  useEffect(() => {
    if (isOpen) {
      fetchInventories();
      form.reset({
        from_category: product.inventories?.[0]?.warehouse_category || "siap_jual", // Changed from stockItem.inventories
        to_category: product.inventories?.[0]?.warehouse_category === "siap_jual" ? "riset" : "siap_jual", // Changed from stockItem.inventories
        quantity: 1,
        reason: "",
      });
    }
  }, [isOpen, product, form, fetchInventories]);

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
      // Get current quantities for from_category and to_category
      const fromInventory = currentInventories.find(
        (inv) => inv.warehouse_category === values.from_category
      );
      const fromQuantity = fromInventory ? fromInventory.quantity : 0;

      if (fromQuantity < values.quantity) {
        showError(`Stok tidak mencukupi di kategori "${getCategoryDisplay(values.from_category)}". Tersedia: ${fromQuantity}, Diminta: ${values.quantity}`);
        return;
      }

      const toInventory = currentInventories.find(
        (inv) => inv.warehouse_category === values.to_category
      );
      const toQuantity = toInventory ? toInventory.quantity : 0;

      // Update quantities in warehouse_inventories
      // Decrease from_category quantity
      const { error: fromUpdateError } = await supabase
        .from("warehouse_inventories")
        .upsert(
          {
            product_id: product.id, // Changed from stockItem.id
            warehouse_category: values.from_category,
            quantity: fromQuantity - values.quantity,
            user_id: userId,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "product_id, warehouse_category" }
        );

      if (fromUpdateError) {
        throw fromUpdateError;
      }

      // Increase to_category quantity
      const { error: toUpdateError } = await supabase
        .from("warehouse_inventories")
        .upsert(
          {
            product_id: product.id, // Changed from stockItem.id
            warehouse_category: values.to_category,
            quantity: toQuantity + values.quantity,
            user_id: userId,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "product_id, warehouse_category" }
        );

      if (toUpdateError) {
        throw toUpdateError;
      }

      // Insert into stock_movements table
      const { error: movementError } = await supabase
        .from("stock_movements")
        .insert({
          user_id: userId,
          product_id: product.id, // Changed from stock_item_id
          from_category: values.from_category,
          to_category: values.to_category,
          quantity: values.quantity,
          reason: values.reason || null,
          movement_date: format(new Date(), "yyyy-MM-dd"),
        });

      if (movementError) {
        throw movementError;
      }

      showSuccess(`Stok produk "${product["NAMA BARANG"]}" berhasil dipindahkan dari ${getCategoryDisplay(values.from_category)} ke ${getCategoryDisplay(values.to_category)}!`); // Changed message
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
          <DialogTitle>Pindahkan Stok Produk</DialogTitle> {/* Changed title */}
          <DialogDescription>Pindahkan produk "{product["NAMA BARANG"]}" antar kategori gudang.</DialogDescription> {/* Changed description */}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="from_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dari Kategori</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={loadingInventories}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingInventories ? "Memuat kategori..." : "Pilih kategori asal"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currentInventories.map(inv => (
                        <SelectItem key={inv.warehouse_category} value={inv.warehouse_category}>
                          {getCategoryDisplay(inv.warehouse_category)} (Stok: {inv.quantity})
                        </SelectItem>
                      ))}
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
                  <Select onValueChange={field.onChange} value={field.value} disabled={loadingInventories}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingInventories ? "Memuat kategori..." : "Pilih kategori tujuan"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["siap_jual", "riset", "retur", "backup_teknisi"].map(category => (
                        <SelectItem key={category} value={category}>
                          {getCategoryDisplay(category as WarehouseCategory)}
                        </SelectItem>
                      ))}
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