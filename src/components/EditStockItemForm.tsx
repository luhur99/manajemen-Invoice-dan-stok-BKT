"use client";

import React, { useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Loader2 } from "lucide-react";
import { Product } from "@/types/data"; // Changed from StockItem

// Schema validasi menggunakan Zod
const formSchema = z.object({
  kode_barang: z.string().min(1, "Kode Barang wajib diisi"),
  nama_barang: z.string().min(1, "Nama Barang wajib diisi"),
  satuan: z.string().optional(),
  harga_beli: z.coerce.number().min(0, "Harga Beli tidak boleh negatif"),
  harga_jual: z.coerce.number().min(0, "Harga Jual tidak boleh negatif"),
  safe_stock_limit: z.coerce.number().min(0, "Batas Stok Aman tidak boleh negatif").default(0),
});

interface EditProductFormProps { // Changed from EditStockItemFormProps
  product: Product; // Changed from stockItem: StockItem
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ product, isOpen, onOpenChange, onSuccess }) => { // Changed from stockItem
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode_barang: product["KODE BARANG"],
      nama_barang: product["NAMA BARANG"],
      satuan: product.SATUAN,
      harga_beli: product["HARGA BELI"],
      harga_jual: product["HARGA JUAL"],
      safe_stock_limit: product.safe_stock_limit || 0,
    },
  });

  // Reset form with new product data when the dialog opens or product prop changes
  useEffect(() => {
    if (isOpen && product) {
      form.reset({
        kode_barang: product["KODE BARANG"],
        nama_barang: product["NAMA BARANG"],
        satuan: product.SATUAN,
        harga_beli: product["HARGA BELI"],
        harga_jual: product["HARGA JUAL"],
        safe_stock_limit: product.safe_stock_limit || 0,
      });
    }
  }, [isOpen, product, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from("products") // Changed from stock_items
        .update({
          kode_barang: values.kode_barang,
          nama_barang: values.nama_barang,
          satuan: values.satuan,
          harga_beli: values.harga_beli,
          harga_jual: values.harga_jual,
          safe_stock_limit: values.safe_stock_limit,
        })
        .eq("id", product.id); // Use 'id' for updating

      if (updateError) {
        throw updateError;
      }

      showSuccess("Detail produk berhasil diperbarui!"); // Changed message
      onOpenChange(false);
      onSuccess(); // Trigger refresh of product data
    } catch (error: any) {
      showError(`Gagal memperbarui detail produk: ${error.message}`); // Changed message
      console.error("Error updating product:", error); // Changed message
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Produk</DialogTitle> {/* Changed title */}
          <DialogDescription>Perbarui detail untuk produk "{product["NAMA BARANG"]}".</DialogDescription> {/* Changed description */}
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
            <div className="md:col-span-2"> {/* Button spans both columns */}
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
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

export default EditProductForm; // Changed export name