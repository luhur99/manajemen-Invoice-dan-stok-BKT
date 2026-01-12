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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Loader2 } from "lucide-react";
import { StockItem } from "@/types/data";

// Schema validasi menggunakan Zod
const formSchema = z.object({
  no: z.coerce.number().min(1, "Nomor harus lebih besar dari 0"),
  kode_barang: z.string().min(1, "Kode Barang wajib diisi"),
  nama_barang: z.string().min(1, "Nama Barang wajib diisi"),
  satuan: z.string().optional(),
  harga_beli: z.coerce.number().min(0, "Harga Beli tidak boleh negatif"),
  harga_jual: z.coerce.number().min(0, "Harga Jual tidak boleh negatif"),
  stock_awal: z.coerce.number().min(0, "Stok Awal tidak boleh negatif").default(0),
  stock_masuk: z.coerce.number().min(0, "Stok Masuk tidak boleh negatif").default(0),
  stock_keluar: z.coerce.number().min(0, "Stok Keluar tidak boleh negatif").default(0),
});

interface EditStockItemFormProps {
  stockItem: StockItem;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditStockItemForm: React.FC<EditStockItemFormProps> = ({ stockItem, isOpen, onOpenChange, onSuccess }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      no: stockItem.NO,
      kode_barang: stockItem["KODE BARANG"],
      nama_barang: stockItem["NAMA BARANG"],
      satuan: stockItem.SATUAN,
      harga_beli: stockItem["HARGA BELI"],
      harga_jual: stockItem["HARGA JUAL"],
      stock_awal: stockItem["STOCK AWAL"],
      stock_masuk: stockItem["STOCK MASUK"],
      stock_keluar: stockItem["STOCK KELUAR"],
    },
  });

  // Reset form with new stock item data when the dialog opens or stockItem prop changes
  useEffect(() => {
    if (isOpen && stockItem) {
      form.reset({
        no: stockItem.NO,
        kode_barang: stockItem["KODE BARANG"],
        nama_barang: stockItem["NAMA BARANG"],
        satuan: stockItem.SATUAN,
        harga_beli: stockItem["HARGA BELI"],
        harga_jual: stockItem["HARGA JUAL"],
        stock_awal: stockItem["STOCK AWAL"],
        stock_masuk: stockItem["STOCK MASUK"],
        stock_keluar: stockItem["STOCK KELUAR"],
      });
    }
  }, [isOpen, stockItem, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const stock_akhir = values.stock_awal + values.stock_masuk - values.stock_keluar;

    try {
      const { error } = await supabase
        .from("stock_items")
        .update({
          no: values.no,
          kode_barang: values.kode_barang,
          nama_barang: values.nama_barang,
          satuan: values.satuan,
          harga_beli: values.harga_beli,
          harga_jual: values.harga_jual,
          stock_awal: values.stock_awal,
          stock_masuk: values.stock_masuk,
          stock_keluar: values.stock_keluar,
          stock_akhir: stock_akhir,
        })
        .eq("kode_barang", stockItem["KODE BARANG"]); // Assuming kode_barang is unique for update

      if (error) {
        throw error;
      }

      showSuccess("Item stok berhasil diperbarui!");
      onOpenChange(false);
      onSuccess(); // Trigger refresh of stock data
    } catch (error: any) {
      showError(`Gagal memperbarui item stok: ${error.message}`);
      console.error("Error updating stock item:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Item Stok</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="stock_awal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok Awal</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock_masuk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok Masuk</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock_keluar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok Keluar</FormLabel>
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

export default EditStockItemForm;