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
import { Loader2 } from "lucide-react";
import { Product, Supplier } from "@/types/data";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/components/SessionContextProvider";

// Schema validasi menggunakan Zod
const formSchema = z.object({
  kode_barang: z.string().min(1, "Kode Barang wajib diisi"),
  nama_barang: z.string().min(1, "Nama Barang wajib diisi"),
  satuan: z.string().optional(),
  harga_beli: z.coerce.number().min(0, "Harga Beli tidak boleh negatif"),
  harga_jual: z.coerce.number().min(0, "Harga Jual tidak boleh negatif"),
  safe_stock_limit: z.coerce.number().min(0, "Batas Stok Aman tidak boleh negatif").default(0),
  supplier_id: z.string().uuid().optional().nullable(),
});

interface EditStockItemFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData: Product; // Added initialData prop
}

const EditStockItemForm: React.FC<EditStockItemFormProps> = ({ onSuccess, isOpen, onOpenChange, initialData }) => {
  const { session } = useSession();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode_barang: initialData.kode_barang,
      nama_barang: initialData.nama_barang,
      satuan: initialData.satuan || "",
      harga_beli: initialData.harga_beli,
      harga_jual: initialData.harga_jual,
      safe_stock_limit: initialData.safe_stock_limit || 0,
      supplier_id: initialData.supplier_id || null,
    },
  });

  // Fetch suppliers using useQuery
  const { data: suppliers, isLoading: loadingSuppliers } = useQuery<Supplier[], Error>({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("id, name")
        .order("name", { ascending: true });
      if (error) {
        showError("Gagal memuat daftar supplier.");
        throw error;
      }
      return data as Supplier[];
    },
    enabled: isOpen, // Only fetch when the dialog is open
  });

  // Reset form when dialog opens or initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      form.reset({
        kode_barang: initialData.kode_barang,
        nama_barang: initialData.nama_barang,
        satuan: initialData.satuan || "",
        harga_beli: initialData.harga_beli,
        harga_jual: initialData.harga_jual,
        safe_stock_limit: initialData.safe_stock_limit || 0,
        supplier_id: initialData.supplier_id || null,
      });
    }
  }, [isOpen, initialData, form]);

  // Mutation for updating a stock item
  const updateStockItemMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("Pengguna tidak terautentikasi.");
      }

      const { error } = await supabase
        .from("products")
        .update({
          kode_barang: values.kode_barang,
          nama_barang: values.nama_barang,
          satuan: values.satuan || null,
          harga_beli: values.harga_beli,
          harga_jual: values.harga_jual,
          safe_stock_limit: values.safe_stock_limit,
          supplier_id: values.supplier_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", initialData.id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess("Produk berhasil diperbarui!");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["productsMetadata"] }); // Invalidate product list
      queryClient.invalidateQueries({ queryKey: ["productsWithInventories"] }); // Invalidate stock management view
      queryClient.invalidateQueries({ queryKey: ["productInventories", initialData.id] }); // Invalidate specific product inventories
      onSuccess(); // Call parent's onSuccess
    },
    onError: (error: any) => {
      showError(`Gagal memperbarui produk: ${error.message}`);
      console.error("Error updating product:", error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateStockItemMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Produk: {initialData.nama_barang}</DialogTitle>
          <DialogDescription>Perbarui detail untuk produk ini.</DialogDescription>
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
              name="supplier_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier (Opsional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""} disabled={loadingSuppliers}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingSuppliers ? "Memuat supplier..." : "Pilih supplier"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loadingSuppliers ? (
                        <SelectItem value="loading" disabled>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" /> Memuat...
                        </SelectItem>
                      ) : suppliers?.length === 0 ? (
                        <SelectItem value="no-suppliers" disabled>
                          Tidak ada supplier tersedia
                        </SelectItem>
                      ) : (
                        suppliers?.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:col-span-2">
              <Button type="submit" className="w-full" disabled={updateStockItemMutation.isPending}>
                {updateStockItemMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStockItemForm;