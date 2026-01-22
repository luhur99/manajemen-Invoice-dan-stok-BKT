"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Product, WarehouseInventory, WarehouseCategory as WarehouseCategoryType } from "@/types/data";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  warehouse_category: z.string({
    required_error: "Kategori Gudang wajib dipilih",
  }).min(1, "Kategori Gudang wajib dipilih"),
  new_quantity: z.coerce.number().min(0, "Kuantitas baru tidak boleh negatif"),
  notes: z.string().min(1, "Alasan penyesuaian wajib diisi"),
});

interface StockAdjustmentFormProps {
  product: Product;
  isOpen: boolean; // Keep isOpen and onOpenChange for direct control by parent
  onOpenChange: (open: boolean) => void; // Keep isOpen and onOpenChange for direct control by parent
  onSuccess: () => void;
}

const StockAdjustmentForm: React.FC<StockAdjustmentFormProps> = ({
  product,
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      warehouse_category: "",
      new_quantity: 0,
      notes: "",
    },
  });

  const { data: warehouseCategories, isLoading: loadingCategories, error: categoriesError } = useQuery<WarehouseCategoryType[], Error>({
    queryKey: ["warehouseCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warehouse_categories")
        .select("id, name, code") // Select specific columns
        .order("name", { ascending: true });

      if (error) {
        showError("Gagal memuat kategori gudang.");
        throw error;
      }
      return data as WarehouseCategoryType[];
    },
    enabled: isOpen, // Only fetch when the dialog is open
  });

  const getCategoryDisplayName = (code: string) => {
    const category = warehouseCategories?.find(cat => cat.code === code);
    return category ? category.name : code;
  };

  const { data: currentInventories, isLoading: loadingInventories, error: inventoriesError, refetch: refetchInventories } = useQuery<WarehouseInventory[], Error>({
    queryKey: ["productInventories", product.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warehouse_inventories")
        .select("id, product_id, warehouse_category, quantity") // Select specific columns
        .eq("product_id", product.id);

      if (error) {
        showError("Gagal memuat inventaris item.");
        throw error;
      }
      return data as WarehouseInventory[];
    },
    enabled: isOpen && !!product.id, // Only fetch if dialog is open and product ID is available
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        warehouse_category: "",
        new_quantity: 0,
        notes: "",
      });
      // Set default category and quantity after categories and inventories are loaded
      if (warehouseCategories && currentInventories) {
        const defaultCategoryCode = product.inventories?.[0]?.warehouse_category || warehouseCategories[0]?.code || "";
        const initialQuantity = currentInventories.find(inv => inv.warehouse_category === defaultCategoryCode)?.quantity || 0;
        form.setValue("warehouse_category", defaultCategoryCode);
        form.setValue("new_quantity", initialQuantity);
      }
      refetchInventories(); // Ensure latest inventories are fetched
    }
  }, [isOpen, product, form, warehouseCategories, currentInventories, refetchInventories]);

  const selectedCategory = form.watch("warehouse_category");
  const currentQuantityForSelectedCategory = currentInventories?.find(
    (inv) => inv.warehouse_category === selectedCategory
  )?.quantity || 0;

  const adjustStockMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // Atomic adjustment via Edge Function
      const { data, error } = await supabase.functions.invoke('adjust-stock', {
        body: JSON.stringify({
          product_id: product.id,
          warehouse_category: values.warehouse_category,
          new_quantity: values.new_quantity,
          notes: values.notes,
        }),
      });

      if (error) throw error;
      if (data && data.error) throw new Error(data.error);

      return data;
    },
    onSuccess: () => {
      showSuccess("Stok berhasil disesuaikan!");
      onOpenChange(false);
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ["productsWithInventories"] }); // Invalidate stock management view
      queryClient.invalidateQueries({ queryKey: ["stockLedgerEntries"] }); // Invalidate stock history
      queryClient.invalidateQueries({ queryKey: ["productInventories", product.id] }); // Invalidate specific product inventories
    },
    onError: (error: any) => {
      showError(`Gagal menyesuaikan stok: ${error.message}`);
      console.error("Error adjusting stock:", error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    adjustStockMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Penyesuaian Stok Produk</DialogTitle>
          <DialogDescription>Sesuaikan kuantitas stok untuk produk "{product.nama_barang}" di kategori tertentu.</DialogDescription>
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
                    const quantityForNewCategory = currentInventories?.find(inv => inv.warehouse_category === value)?.quantity || 0;
                    form.setValue("new_quantity", quantityForNewCategory);
                  }} value={field.value} disabled={loadingInventories || loadingCategories || adjustStockMutation.isPending}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingCategories ? "Memuat kategori..." : "Pilih kategori gudang"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {warehouseCategories?.map((category) => (
                        <SelectItem key={category.id} value={category.code}>
                          {category.name} (Stok: {currentInventories?.find(inv => inv.warehouse_category === category.code)?.quantity || 0})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Stok Saat Ini ({getCategoryDisplayName(selectedCategory)})</FormLabel>
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
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} disabled={adjustStockMutation.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alasan Penyesuaian</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Misalnya: Koreksi inventaris fisik, kerusakan, dll." {...field} disabled={adjustStockMutation.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={adjustStockMutation.isPending}>
              {adjustStockMutation.isPending ? (
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