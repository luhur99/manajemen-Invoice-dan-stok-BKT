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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Loader2, PlusCircle } from "lucide-react";

// Schema validasi menggunakan Zod
const formSchema = z.object({
  kode_barang: z.string().min(1, "Kode Barang wajib diisi"),
  nama_barang: z.string().min(1, "Nama Barang wajib diisi"),
  satuan: z.string().optional(),
  harga_beli: z.coerce.number().min(0, "Harga Beli tidak boleh negatif"),
  harga_jual: z.coerce.number().min(0, "Harga Jual tidak boleh negatif"),
  stock_awal: z.coerce.number().min(0, "Stok Awal tidak boleh negatif").default(0),
  safe_stock_limit: z.coerce.number().min(0, "Batas Stok Aman tidak boleh negatif").default(0),
  warehouse_category: z.enum(["siap_jual", "riset", "retur"], { // New field
    required_error: "Kategori Gudang wajib dipilih",
  }).default("siap_jual"),
});

interface AddStockItemFormProps {
  onSuccess: () => void;
}

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
      stock_awal: 0,
      safe_stock_limit: 0,
      warehouse_category: "siap_jual", // Default value for new field
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const stock_akhir = values.stock_awal; // Stock akhir is initially just stock awal
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    try {
      const { data: stockItemData, error: stockItemError } = await supabase
        .from("stock_items")
        .insert({
          kode_barang: values.kode_barang,
          nama_barang: values.nama_barang,
          satuan: values.satuan,
          harga_beli: values.harga_beli,
          harga_jual: values.harga_jual,
          stock_awal: values.stock_awal,
          stock_masuk: 0, // Default to 0 for new item
          stock_keluar: 0, // Default to 0 for new item
          stock_akhir: stock_akhir,
          safe_stock_limit: values.safe_stock_limit,
          warehouse_category: values.warehouse_category, // Save new field
          user_id: userId,
        })
        .select("id")
        .single();

      if (stockItemError) {
        throw stockItemError;
      }

      // Record initial stock transaction if stock_awal > 0
      if (values.stock_awal > 0) {
        const { error: transactionError } = await supabase
          .from("stock_transactions")
          .insert({
            user_id: userId,
            stock_item_id: stockItemData.id,
            transaction_type: "initial",
            quantity: values.stock_awal,
            notes: `Stok awal saat penambahan item di kategori ${values.warehouse_category}`,
          });

        if (transactionError) {
          console.error("Error recording initial stock transaction:", transactionError);
          // Don't throw, just log, as the item itself was added successfully
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
      <DialogContent className="sm:max-w-[700px]">
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
              name="warehouse_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Gudang</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori gudang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="siap_jual">Siap Jual</SelectItem>
                      <SelectItem value="riset">Riset</SelectItem>
                      <SelectItem value="retur">Retur</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:col-span-2"> {/* Button spans both columns */}
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