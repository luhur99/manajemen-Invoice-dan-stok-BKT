import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  kode_barang: z.string().min(1, "Kode barang wajib diisi"),
  nama_barang: z.string().min(1, "Nama barang wajib diisi"),
  satuan: z.string().optional(),
  harga_beli: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Harga beli harus positif")
  ),
  harga_jual: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Harga jual harus positif")
  ),
  safe_stock_limit: z.preprocess(
    (val) => Number(val),
    z.number().int().min(0, "Batas stok aman harus positif")
  ).optional(),
  supplier_id: z.string().uuid().optional().nullable(),
});

export const EditProductForm = ({ product, onSuccess }) => {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode_barang: product.kode_barang || "",
      nama_barang: product.nama_barang || "",
      satuan: product.satuan || "",
      harga_beli: product.harga_beli || 0,
      harga_jual: product.harga_jual || 0,
      safe_stock_limit: product.safe_stock_limit || 0,
      supplier_id: product.supplier_id || null,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        kode_barang: product.kode_barang || "",
        nama_barang: product.nama_barang || "",
        satuan: product.satuan || "",
        harga_beli: product.harga_beli || 0,
        harga_jual: product.harga_jual || 0,
        safe_stock_limit: product.safe_stock_limit || 0,
        supplier_id: product.supplier_id || null,
      });
    }
  }, [product, form]);

  const updateProductMutation = useMutation({
    mutationFn: async (updatedProduct) => {
      const { error } = await supabase
        .from("products")
        .update(updatedProduct)
        .eq("id", product.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk berhasil diperbarui.");
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Gagal memperbarui produk: ${error.message}`);
    },
  });

  const onSubmit = (values) => {
    updateProductMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
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
                <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
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
                <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={updateProductMutation.isPending}>
          {updateProductMutation.isPending ? "Memperbarui..." : "Perbarui Produk"}
        </Button>
      </form>
    </Form>
  );
};