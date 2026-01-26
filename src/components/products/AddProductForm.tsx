import React from "react";
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

type ProductFormValues = z.infer<typeof formSchema>; // Define type for form values

export const AddProductForm = ({ onSuccess }) => {
  const queryClient = useQueryClient();
  const form = useForm<ProductFormValues>({ // Use the defined type here
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode_barang: "",
      nama_barang: "",
      satuan: "",
      harga_beli: 0,
      harga_jual: 0,
      safe_stock_limit: 0,
      supplier_id: null,
    },
  });

  const addProductMutation = useMutation({
    mutationFn: async (newProduct: ProductFormValues) => { // Explicitly type newProduct
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not logged in");
      const { data, error } = await supabase
        .from("products")
        .insert({ ...newProduct, user_id: user.id })
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk berhasil ditambahkan.");
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Gagal menambahkan produk: ${error.message}`);
    },
  });

  const onSubmit = (values: ProductFormValues) => { // Use the defined type here
    addProductMutation.mutate(values);
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
        <Button type="submit" disabled={addProductMutation.isPending}>
          {addProductMutation.isPending ? "Menambahkan..." : "Tambah Produk"}
        </Button>
      </form>
    </Form>
  );
};