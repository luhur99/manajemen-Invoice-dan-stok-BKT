"use client";

import React, { useEffect, useState } from "react";
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
  from_warehouse_category: z.string().min(1, "Gudang asal wajib dipilih"),
  to_warehouse_category: z.string().min(1, "Gudang tujuan wajib dipilih"),
  quantity: z.coerce.number().min(1, "Kuantitas harus lebih dari 0"),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.from_warehouse_category === data.to_warehouse_category) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Gudang asal dan gudang tujuan tidak boleh sama.",
      path: ['to_warehouse_category'],
    });
  }
});

interface StockTransferFormProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const StockTransferForm: React.FC<StockTransferFormProps> = ({
  product,
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from_warehouse_category: "",
      to_warehouse_category: "",
      quantity: 1,
      notes: "",
    },
  });

  const { data: warehouseCategories, isLoading: loadingCategories } = useQuery<WarehouseCategoryType[], Error>({
    queryKey: ["warehouseCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warehouse_categories")
        .select("id, name, code")
        .order("name", { ascending: true });

      if (error) {
        showError("Gagal memuat kategori gudang.");
        throw error;
      }
      return data as WarehouseCategoryType[];
    },
    enabled: isOpen,
  });

  const { data: currentInventories, isLoading: loadingInventories, refetch: refetchInventories } = useQuery<WarehouseInventory[], Error>({
    queryKey: ["productInventories", product.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warehouse_inventories")
        .select("id, product_id, warehouse_category, quantity")
        .eq("product_id", product.id);

      if (error) {
        showError("Gagal memuat inventaris item.");
        throw error;
      }
      return data as WarehouseInventory[];
    },
    enabled: isOpen && !!product.id,
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        from_warehouse_category: "",
        to_warehouse_category: "",
        quantity: 1,
        notes: "",
      });
      if (warehouseCategories && warehouseCategories.length > 0) {
        form.setValue("from_warehouse_category", warehouseCategories[0].code);
        if (warehouseCategories.length > 1) {
          form.setValue("to_warehouse_category", warehouseCategories[1].code);
        }
      }
      refetchInventories();
    }
  }, [isOpen, product, form, warehouseCategories, refetchInventories]);

  const selectedFromCategory = form.watch("from_warehouse_category");
  const availableQuantityInFromCategory = currentInventories?.find(
    (inv) => inv.warehouse_category === selectedFromCategory
  )?.quantity || 0;

  const transferStockMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (values.quantity > availableQuantityInFromCategory) {
        throw new Error(`Kuantitas yang ditransfer (${values.quantity}) melebihi stok yang tersedia (${availableQuantityInFromCategory}) di gudang asal.`);
      }

      const { data, error } = await supabase.functions.invoke('transfer-stock', {
        body: JSON.stringify({
          product_id: product.id,
          from_warehouse_category: values.from_warehouse_category,
          to_warehouse_category: values.to_warehouse_category,
          quantity: values.quantity,
          notes: values.notes,
        }),
      });

      if (error) throw error;
      if (data && data.error) throw new Error(data.error);

      return data;
    },
    onSuccess: () => {
      showSuccess("Stok berhasil ditransfer!");
      onOpenChange(false);
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ["productsMetadata"] }); // Invalidate product list
      queryClient.invalidateQueries({ queryKey: ["productsWithInventories"] });
      queryClient.invalidateQueries({ queryKey: ["stockLedgerEntries"] });
      queryClient.invalidateQueries({ queryKey: ["productInventories", product.id] });
    },
    onError: (error: any) => {
      showError(`Gagal mentransfer stok: ${error.message}`);
      console.error("Error transferring stock:", error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    transferStockMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transfer Stok Produk</DialogTitle>
          <DialogDescription>Pindahkan stok produk "{product.nama_barang}" antar kategori gudang.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="from_warehouse_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dari Gudang</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={loadingCategories || loadingInventories || transferStockMutation.isPending}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingCategories ? "Memuat kategori..." : "Pilih gudang asal"} />
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
              <FormLabel>Stok Tersedia di Gudang Asal</FormLabel>
              <FormControl>
                <Input type="number" value={availableQuantityInFromCategory} disabled />
              </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name="to_warehouse_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ke Gudang</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={loadingCategories || transferStockMutation.isPending}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingCategories ? "Memuat kategori..." : "Pilih gudang tujuan"} />
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
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kuantitas Transfer</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} disabled={transferStockMutation.isPending} />
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
                  <FormLabel>Catatan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Misalnya: Transfer untuk teknisi A, pindah gudang, dll." {...field} disabled={transferStockMutation.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={transferStockMutation.isPending}>
              {transferStockMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Transfer Stok"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StockTransferForm;