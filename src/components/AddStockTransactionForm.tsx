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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { WarehouseCategory as WarehouseCategoryType, StockEventType, Product } from "@/types/data"; // Added Product
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Import useQuery, useMutation, useQueryClient

// Schema validasi menggunakan Zod
const formSchema = z.object({
  product_id: z.string().min(1, "Produk wajib dipilih"),
  event_type: z.nativeEnum(StockEventType, {
    required_error: "Tipe Peristiwa wajib dipilih",
  }),
  quantity: z.coerce.number().min(1, "Kuantitas harus lebih dari 0"),
  warehouse_category: z.string({
    required_error: "Kategori Gudang wajib dipilih",
  }).min(1, "Kategori Gudang wajib dipilih"),
  notes: z.string().optional(),
  event_date: z.string().min(1, "Tanggal Peristiwa wajib diisi"),
});

interface AddStockTransactionFormProps {
  onSuccess: () => void;
  products: Product[]; // Changed from products: { id: string; nama_barang: string; kode_barang: string }[];
  initialProductId?: string;
  initialEventType?: StockEventType;
  isOpen: boolean; // Keep isOpen and onOpenChange for direct control by parent
  onOpenChange: (open: boolean) => void; // Keep isOpen and onOpenChange for direct control by parent
}

const AddStockTransactionForm: React.FC<AddStockTransactionFormProps> = ({
  onSuccess,
  products,
  isOpen,
  onOpenChange,
  initialProductId,
  initialEventType,
}) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_id: initialProductId || "",
      event_type: initialEventType || StockEventType.OUT,
      quantity: 1,
      warehouse_category: "",
      notes: "",
      event_date: format(new Date(), "yyyy-MM-dd"),
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

  useEffect(() => {
    if (isOpen) {
      form.reset({
        product_id: initialProductId || "",
        event_type: initialEventType || StockEventType.OUT,
        quantity: 1,
        warehouse_category: warehouseCategories?.[0]?.code || "", // Set default if available
        notes: "",
        event_date: format(new Date(), "yyyy-MM-dd"),
      });
    }
  }, [isOpen, initialProductId, initialEventType, form, warehouseCategories]);

  const addStockTransactionMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // Use the new Edge Function for atomic transaction
      const { data, error } = await supabase.functions.invoke('create-stock-transaction', {
        body: JSON.stringify({
          product_id: values.product_id,
          event_type: values.event_type,
          quantity: values.quantity,
          warehouse_category: values.warehouse_category,
          notes: values.notes,
          event_date: values.event_date,
        }),
      });

      if (error) throw error;
      if (data && data.error) throw new Error(data.error);

      return data;
    },
    onSuccess: () => {
      showSuccess("Transaksi stok berhasil ditambahkan!");
      form.reset();
      onOpenChange(false);
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ["productsWithInventories"] }); // Invalidate stock management view
      queryClient.invalidateQueries({ queryKey: ["stockLedgerEntries"] }); // Invalidate stock history
      queryClient.invalidateQueries({ queryKey: ["productInventories", form.getValues("product_id")] }); // Invalidate specific product inventories
    },
    onError: (error: any) => {
      showError(`Gagal menambahkan transaksi stok: ${error.message}`);
      console.error("Error adding stock transaction:", error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addStockTransactionMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Transaksi Stok</DialogTitle>
          <DialogDescription>Catat pergerakan stok barang.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="product_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produk</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!initialProductId || addStockTransactionMutation.isPending}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih produk" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.kode_barang} - {product.nama_barang}
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
              name="event_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Peristiwa</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!initialEventType || addStockTransactionMutation.isPending}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe peristiwa" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={StockEventType.IN}>Stok Masuk</SelectItem>
                      <SelectItem value={StockEventType.OUT}>Stok Keluar</SelectItem>
                      <SelectItem value={StockEventType.INITIAL}>Stok Awal</SelectItem>
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
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} disabled={addStockTransactionMutation.isPending} />
                  </FormControl>
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
                  <Select onValueChange={field.onChange} value={field.value} disabled={loadingCategories || addStockTransactionMutation.isPending}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingCategories ? "Memuat kategori..." : "Pilih kategori gudang"} />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {warehouseCategories?.map((category) => (
                        <SelectItem key={category.id} value={category.code}>
                          {category.name}
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
              name="event_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Peristiwa</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} disabled={addStockTransactionMutation.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Catatan</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={addStockTransactionMutation.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:col-span-2">
              <Button type="submit" className="w-full" disabled={addStockTransactionMutation.isPending}>
                {addStockTransactionMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Tambah Transaksi Stok"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStockTransactionForm;