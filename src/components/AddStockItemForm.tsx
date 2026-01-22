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
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Loader2, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { WarehouseCategory as WarehouseCategoryType, StockEventType } from "@/types/data";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/components/SessionContextProvider";

// Schema validasi menggunakan Zod
const formSchema = z.object({
  kode_barang: z.string().min(1, "Kode Barang wajib diisi"),
  nama_barang: z.string().min(1, "Nama Barang wajib diisi"),
  satuan: z.string().optional(),
  harga_beli: z.coerce.number().min(0, "Harga Beli tidak boleh negatif"),
  harga_jual: z.coerce.number().min(0, "Harga Jual tidak boleh negatif"),
  initial_stock_quantity: z.coerce.number().min(0, "Stok Awal tidak boleh negatif").default(0),
  safe_stock_limit: z.coerce.number().min(0, "Batas Stok Aman tidak boleh negatif").default(0),
  initial_warehouse_category: z.string({
    required_error: "Kategori Gudang Awal wajib dipilih",
  }).min(1, "Kategori Gudang Awal wajib dipilih"),
});

interface AddStockItemFormProps {
  onSuccess: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddStockItemForm: React.FC<AddStockItemFormProps> = ({ onSuccess, isOpen, onOpenChange }) => {
  const { session } = useSession();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode_barang: "",
      nama_barang: "",
      satuan: "",
      harga_beli: 0,
      harga_jual: 0,
      initial_stock_quantity: 0,
      safe_stock_limit: 0,
      initial_warehouse_category: "",
    },
  });

  // Fetch warehouse categories using useQuery
  const { data: warehouseCategories, isLoading: loadingCategories } = useQuery<WarehouseCategoryType[], Error>({
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

  // Set default initial_warehouse_category when categories load and dialog is open
  useEffect(() => {
    if (isOpen && warehouseCategories && warehouseCategories.length > 0 && !form.getValues("initial_warehouse_category")) {
      form.setValue("initial_warehouse_category", warehouseCategories[0].code);
    }
  }, [isOpen, warehouseCategories, form]);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        kode_barang: "",
        nama_barang: "",
        satuan: "",
        harga_beli: 0,
        harga_jual: 0,
        initial_stock_quantity: 0,
        safe_stock_limit: 0,
        initial_warehouse_category: warehouseCategories?.[0]?.code || "", // Set default if available
      });
    }
  }, [isOpen, form, warehouseCategories]);

  const getCategoryDisplayName = (code: string) => {
    const category = warehouseCategories?.find(cat => cat.code === code);
    return category ? category.name : code;
  };

  // Mutation for adding a stock item
  const addStockItemMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("Pengguna tidak terautentikasi.");
      }

      // 1. Insert into products (product metadata)
      const { data: productData, error: productError } = await supabase
        .from("products")
        .insert({
          user_id: userId,
          kode_barang: values.kode_barang,
          nama_barang: values.nama_barang,
          satuan: values.satuan,
          harga_beli: values.harga_beli,
          harga_jual: values.harga_jual,
          safe_stock_limit: values.safe_stock_limit,
        })
        .select("id")
        .single();

      if (productError) {
        throw productError;
      }

      const newProductId = productData.id;

      // 2. If initial_stock_quantity > 0, insert into warehouse_inventories
      if (values.initial_stock_quantity > 0) {
        const { error: inventoryError } = await supabase
          .from("warehouse_inventories")
          .insert({
            user_id: userId,
            product_id: newProductId,
            warehouse_category: values.initial_warehouse_category,
            quantity: values.initial_stock_quantity,
          });

        if (inventoryError) {
          console.error("Error creating initial warehouse inventory:", inventoryError);
          throw new Error(`Gagal membuat inventaris awal: ${inventoryError.message}`);
        }

        // 3. Record initial stock transaction in stock_ledger
        const { error: ledgerError } = await supabase
          .from("stock_ledger")
          .insert({
            user_id: userId,
            product_id: newProductId,
            event_type: StockEventType.INITIAL,
            quantity: values.initial_stock_quantity,
            to_warehouse_category: values.initial_warehouse_category,
            notes: `Stok awal saat penambahan item di kategori ${getCategoryDisplayName(values.initial_warehouse_category)}`,
            event_date: format(new Date(), "yyyy-MM-dd"),
          });

        if (ledgerError) {
          console.error("Error recording initial stock ledger entry:", ledgerError);
          // Don't throw here, as inventory was already created. Log and continue.
        }
      }
    },
    onSuccess: () => {
      showSuccess("Produk berhasil ditambahkan!");
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["productsMetadata"] }); // Invalidate product list
      queryClient.invalidateQueries({ queryKey: ["productsWithInventories"] }); // Invalidate stock management view
      queryClient.invalidateQueries({ queryKey: ["stockLedgerEntries"] }); // Invalidate stock history
      onSuccess(); // Call parent's onSuccess
    },
    onError: (error: any) => {
      showError(`Gagal menambahkan produk: ${error.message}`);
      console.error("Error adding product:", error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addStockItemMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* Removed DialogTrigger asChild */}
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Produk Baru</DialogTitle>
          <DialogDescription>Isi detail untuk menambahkan produk baru ke inventaris.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="kode_barang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Barang</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nama_barang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Barang</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="satuan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Satuan</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="harga_beli"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Beli</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="harga_jual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Jual</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="safe_stock_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batas Stok Aman</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="initial_warehouse_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Gudang Awal</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={loadingCategories}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingCategories ? "Memuat kategori..." : "Pilih kategori gudang awal"} />
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
              name="initial_stock_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kuantitas Stok Awal</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:col-span-2">
              <Button type="submit" className="w-full" disabled={addStockItemMutation.isPending}>
                {addStockItemMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Tambah Produk"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStockItemForm;