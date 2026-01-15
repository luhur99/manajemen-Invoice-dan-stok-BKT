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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Loader2, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { WarehouseCategory as WarehouseCategoryType, TransactionType } from "@/types/data"; // Import the interface
import { useQuery } from "@tanstack/react-query";

// Schema validasi menggunakan Zod
const formSchema = z.object({
  product_id: z.string().min(1, "Produk wajib dipilih"),
  transaction_type: z.nativeEnum(TransactionType, {
    required_error: "Tipe Transaksi wajib dipilih",
  }),
  quantity: z.coerce.number().min(1, "Kuantitas harus lebih dari 0"),
  warehouse_category: z.string({ // Changed to string
    required_error: "Kategori Gudang wajib dipilih",
  }).min(1, "Kategori Gudang wajib dipilih"),
  notes: z.string().optional(),
  transaction_date: z.string().min(1, "Tanggal Transaksi wajib diisi"),
});

interface AddStockTransactionFormProps {
  onSuccess: () => void;
  products: { id: string; nama_barang: string; kode_barang: string }[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialProductId?: string;
  initialTransactionType?: TransactionType; // Changed type to TransactionType
}

const AddStockTransactionForm: React.FC<AddStockTransactionFormProps> = ({
  onSuccess,
  products,
  isOpen,
  onOpenChange,
  initialProductId,
  initialTransactionType,
}) => {
  const [warehouseCategories, setWarehouseCategories] = useState<WarehouseCategoryType[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_id: initialProductId || "",
      transaction_type: initialTransactionType || TransactionType.OUT, // Ensured type is TransactionType
      quantity: 1,
      warehouse_category: "", // Default empty string
      notes: "",
      transaction_date: format(new Date(), "yyyy-MM-dd"),
    },
  });

  useEffect(() => {
    const fetchWarehouseCategories = async () => {
      setLoadingCategories(true);
      const { data, error } = await supabase
        .from("warehouse_categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        showError("Gagal memuat kategori gudang.");
        console.error("Error fetching warehouse categories:", error);
      } else {
        setWarehouseCategories(data as WarehouseCategoryType[]);
        // Set default value if categories are loaded and form is open
        if (data.length > 0 && isOpen && !form.getValues("warehouse_category")) {
          form.setValue("warehouse_category", data[0].code);
        }
      }
      setLoadingCategories(false);
    };

    if (isOpen) {
      fetchWarehouseCategories();
      form.reset({
        product_id: initialProductId || "",
        transaction_type: initialTransactionType || TransactionType.OUT, // Ensured type is TransactionType
        quantity: 1,
        warehouse_category: "", // Reset to empty string
        notes: "",
        transaction_date: format(new Date(), "yyyy-MM-dd"),
      });
    }
  }, [isOpen, initialProductId, initialTransactionType, form]);

  const getCategoryDisplayName = (code: string) => {
    const category = warehouseCategories.find(cat => cat.code === code);
    return category ? category.name : code;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    try {
      const { data: existingInventory, error: fetchError } = await supabase
        .from("warehouse_inventories")
        .select("id, quantity")
        .eq("product_id", values.product_id)
        .eq("warehouse_category", values.warehouse_category)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      let newQuantity = existingInventory ? existingInventory.quantity : 0;

      if (values.transaction_type === TransactionType.OUT) {
        if (newQuantity < values.quantity) {
          showError(`Kuantitas stok tidak mencukupi di kategori '${getCategoryDisplayName(values.warehouse_category)}'. Tersedia: ${newQuantity}, Diminta: ${values.quantity}.`);
          return;
        }
        newQuantity -= values.quantity;
      } else if (values.transaction_type === TransactionType.INITIAL) {
        newQuantity += values.quantity;
      }

      if (existingInventory) {
        const { error: updateError } = await supabase
          .from("warehouse_inventories")
          .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
          .eq("id", existingInventory.id);

        if (updateError) {
          throw updateError;
        }
      } else if (values.transaction_type === TransactionType.INITIAL) {
        const { error: insertError } = await supabase
          .from("warehouse_inventories")
          .insert({
            user_id: userId,
            product_id: values.product_id,
            warehouse_category: values.warehouse_category,
            quantity: newQuantity,
          });

        if (insertError) {
          throw insertError;
        }
      } else {
        showError("Tidak ada inventaris yang ditemukan untuk produk dan kategori ini.");
        return;
      }

      const { error: transactionError } = await supabase
        .from("stock_transactions")
        .insert({
          user_id: userId,
          product_id: values.product_id,
          transaction_type: values.transaction_type,
          quantity: values.quantity,
          warehouse_category: values.warehouse_category,
          notes: values.notes,
          transaction_date: values.transaction_date,
        });

      if (transactionError) {
        throw transactionError;
      }

      showSuccess("Transaksi stok berhasil ditambahkan!");
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      showError(`Gagal menambahkan transaksi stok: ${error.message}`);
      console.error("Error adding stock transaction:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="hidden">Tambah Transaksi Stok</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Transaksi Stok</DialogTitle>
          <DialogDescription>Catat pergerakan stok barang.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="product_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produk</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!initialProductId}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih produk" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.kode_barang} - {product.nama_barang}
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
              name="transaction_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Transaksi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!initialTransactionType}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe transaksi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TransactionType.OUT}>Stok Keluar</SelectItem>
                      <SelectItem value={TransactionType.INITIAL}>Stok Awal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kuantitas</FormLabel>
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
                  <Select onValueChange={field.onChange} value={field.value} disabled={loadingCategories}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingCategories ? "Memuat kategori..." : "Pilih kategori gudang"} />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {warehouseCategories.map((category) => (
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
              name="transaction_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Transaksi</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Catatan</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
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
                  "Tambah Transaksi Stok"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStockTransactionForm;