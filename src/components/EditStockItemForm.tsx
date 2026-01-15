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
import { StockItem } from "@/types/data";

// Schema validasi menggunakan Zod
const formSchema = z.object({
  kode_barang: z.string().min(1, "Kode Barang wajib diisi"),
  nama_barang: z.string().min(1, "Nama Barang wajib diisi"),
  satuan: z.string().optional(),
  harga_beli: z.coerce.number().min(0, "Harga Beli tidak boleh negatif"),
  harga_jual: z.coerce.number().min(0, "Harga Jual tidak boleh negatif"),
  safe_stock_limit: z.coerce.number().min(0, "Batas Stok Aman tidak boleh negatif").default(0),
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
      kode_barang: stockItem["KODE BARANG"],
      nama_barang: stockItem["NAMA BARANG"],
      satuan: stockItem.SATUAN,
      harga_beli: stockItem["HARGA BELI"],
      harga_jual: stockItem["HARGA JUAL"],
      safe_stock_limit: stockItem.safe_stock_limit || 0,
    },
  });

  // Reset form with new stock item data when the dialog opens or stockItem prop changes
  useEffect(() => {
    if (isOpen && stockItem) {
      form.reset({
        kode_barang: stockItem["KODE BARANG"],
        nama_barang: stockItem["NAMA BARANG"],
        satuan: stockItem.SATUAN,
        harga_beli: stockItem["HARGA BELI"],
        harga_jual: stockItem["HARGA JUAL"],
        safe_stock_limit: stockItem.safe_stock_limit || 0,
      });
    }
  }, [isOpen, stockItem, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error: updateError } = await supabase
        .from("stock_items")
        .update({
          kode_barang: values.kode_barang,
          nama_barang: values.nama_barang,
          satuan: values.satuan,
          harga_beli: values.harga_beli,
          harga_jual: values.harga_jual,
          safe_stock_limit: values.safe_stock_limit,
        })
        .eq("id", stockItem.id);

      if (updateError) {
        throw updateError;
      }

      showSuccess("Metadata item stok berhasil diperbarui!");
      onOpenChange(false);
      onSuccess(); // Trigger refresh of stock data
    } catch (error: any) {
      showError(`Gagal memperbarui metadata item stok: ${error.message}`);
      console.error("Error updating stock item metadata:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Item Stok Metadata</DialogTitle>
          <DialogDescription>Perbarui detail metadata untuk item stok "{stockItem["NAMA BARANG"]}".</DialogDescription>
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
            <div className="md:col-span-2">
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