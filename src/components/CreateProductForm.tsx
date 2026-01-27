"use client";

import React from "react";
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
  DialogFooter,
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
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { useSession } from "@/components/SessionContextProvider";

const formSchema = z.object({
  kode_barang: z.string().min(1, "Kode Barang harus diisi."),
  nama_barang: z.string().min(1, "Nama Barang harus diisi."),
  satuan: z.string().optional().nullable(),
  harga_beli: z.number().min(0, "Harga Beli tidak boleh negatif."),
  harga_jual: z.number().min(0, "Harga Jual tidak boleh negatif."),
  safe_stock_limit: z.number().int().min(0, "Batas Stok Aman tidak boleh negatif.").optional().nullable(),
  supplier_id: z.string().optional().nullable(), // Assuming supplier_id is a string UUID
});

interface CreateProductFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateProductForm: React.FC<CreateProductFormProps> = ({ isOpen, onOpenChange, onSuccess }) => {
  const { session } = useSession();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode_barang: "",
      nama_barang: "",
      satuan: null,
      harga_beli: 0,
      harga_jual: 0,
      safe_stock_limit: 0,
      supplier_id: null,
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("Anda harus login untuk membuat produk.");
      }

      const { data, error } = await supabase
        .from("products")
        .insert({
          user_id: userId,
          kode_barang: values.kode_barang,
          nama_barang: values.nama_barang,
          satuan: values.satuan,
          harga_beli: values.harga_beli,
          harga_jual: values.harga_jual,
          safe_stock_limit: values.safe_stock_limit,
          supplier_id: values.supplier_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      showSuccess("Produk berhasil dibuat!");
      onOpenChange(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["productsWithInventories"] });
      onSuccess();
    },
    onError: (err: any) => {
      showError(`Gagal membuat produk: ${err.message}`);
      console.error("Error creating product:", err);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createProductMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Produk Baru</DialogTitle>
          <DialogDescription>
            Isi detail produk baru di sini.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="kode_barang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Barang</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={createProductMutation.isPending} />
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
                    <Input {...field} disabled={createProductMutation.isPending} />
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
                  <FormLabel>Satuan (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} disabled={createProductMutation.isPending} />
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
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      disabled={createProductMutation.isPending}
                    />
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
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      disabled={createProductMutation.isPending}
                    />
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
                  <FormLabel>Batas Stok Aman (Opsional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      value={field.value ?? 0}
                      disabled={createProductMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Supplier ID field can be added here if needed, e.g., with a combobox */}
            <DialogFooter>
              <Button type="submit" disabled={createProductMutation.isPending}>
                {createProductMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Buat Produk"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductForm;