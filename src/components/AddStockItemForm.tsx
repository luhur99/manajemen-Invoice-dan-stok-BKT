"use client";

import React from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Loader2, PlusCircle } from "lucide-react";
import { format } from "date-fns";

// Schema validasi menggunakan Zod
const formSchema = z.object({
  kode_barang: z.string().min(1, "Kode Barang wajib diisi"),
  nama_barang: z.string().min(1, "Nama Barang wajib diisi"),
  satuan: z.string().optional(),
  harga_beli: z.coerce.number().min(0, "Harga Beli tidak boleh negatif"),
  harga_jual: z.coerce.number().min(0, "Harga Jual tidak boleh negatif"),
  initial_stock_quantity: z.coerce.number().min(0, "Stok Awal tidak boleh negatif").default(0), // Renamed
  safe_stock_limit: z.coerce.number().min(0, "Batas Stok Aman tidak boleh negatif").default(0),
  initial_warehouse_category: z.enum(["siap_jual", "riset", "retur", "backup_teknisi"], { // Renamed
    required_error: "Kategori Gudang Awal wajib dipilih",
  }).default("siap_jual"),
});

interface AddStockItemFormProps {
  onSuccess: () => void;
}

const getCategoryDisplay = (category?: 'siap_jual' | 'riset' | 'retur' | 'backup_teknisi') => {
  switch (category) {
    case "siap_jual": return "Siap Jual";
    case "riset": return "Riset";
    case "retur": return "Retur";
    case "backup_teknisi": return "Backup Teknisi";
    default: return "-";
  }
};

const AddStockItemForm: React.FC<AddStockItemFormProps> = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = React.useState(false);
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
      initial_warehouse_category: "siap_jual",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    try {
      // 1. Insert into stock_items (product metadata)
      const { data: stockItemData, error: stockItemError } = await supabase
        .from("stock_items")
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

      if (stockItemError) {
        throw stockItemError;
      }

      const newStockItemId = stockItemData.id;

      // 2. If initial_stock_quantity > 0, insert into warehouse_inventories
      if (values.initial_stock_quantity > 0) {
        const { error: inventoryError } = await supabase
          .from("warehouse_inventories")
          .insert({
            user_id: userId,
            product_id: newStockItemId,
            warehouse_category: values.initial_warehouse_category,
            quantity: values.initial_stock_quantity,
          });

        if (inventoryError) {
          // If inventory insertion fails, consider rolling back stock_item or just log
          console.error("Error creating initial warehouse inventory:", inventoryError);
          showError(`Gagal membuat inventaris awal: ${inventoryError.message}`);
          // Optionally, delete the created stock_item here if you want a full rollback
          // await supabase.from("stock_items").delete().eq("id", newStockItemId);
          return;
        }

        // 3. Record initial stock transaction
        const { error: transactionError } = await supabase
          .from("stock_transactions")
          .insert({
            user_id: userId,
            stock_item_id: newStockItemId,
            transaction_type: "initial",
            quantity: values.initial_stock_quantity,
            notes: `Stok awal saat penambahan item di kategori ${getCategoryDisplay(values.initial_warehouse_category)}`,
            warehouse_category: values.initial_warehouse_category,
            transaction_date: format(new Date(), "yyyy-MM-dd"),
          });

        if (transactionError) {
          console.error("Error recording initial stock transaction:", transactionError);
          // Don't throw, just log, as the item and inventory were added successfully
        }
      }

      showSuccess("Item stok berhasil ditambahkan!");
      form.reset();
      setIsOpen(false);
      onSuccess(); // Trigger refresh of stock data
    } catch (error: any) {
      showError(`Gagal menambahkan item stok: ${error.message}`);
      console.error("Error adding stock item:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> Tambah Item Stok
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Item Stok Baru</DialogTitle>
          <DialogDescription>Isi detail untuk menambahkan item stok baru ke inventaris.</DialogDescription>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori gudang awal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="siap_jual">Siap Jual</SelectItem>
                      <SelectItem value="riset">Riset</SelectItem>
                      <SelectItem value="retur">Retur</SelectItem>
                      <SelectItem value="backup_teknisi">Backup Teknisi</SelectItem>
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
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Tambah Item"
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