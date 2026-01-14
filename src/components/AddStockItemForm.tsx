"use client";

import React, { useState, useEffect } from "react";
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
  FormDescription, // Import FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Loader2, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { Product } from "@/types/data";
import StockItemCombobox from "@/components/StockItemCombobox";

// Schema validasi menggunakan Zod
const formSchema = z.object({
  kode_barang: z.string().min(1, "Kode Barang wajib diisi"),
  nama_barang: z.string().min(1, "Nama Barang wajib diisi"),
  satuan: z.string().optional(),
  harga_beli: z.coerce.number().min(0, "Harga Beli tidak boleh negatif"),
  harga_jual: z.coerce.number().min(0, "Harga Jual tidak boleh negatif"),
  stock_awal: z.coerce.number().min(0, "Stok Awal tidak boleh negatif").default(0),
  safe_stock_limit: z.coerce.number().min(0, "Batas Stok Aman tidak boleh negatif").default(0),
  warehouse_category: z.enum(["siap_jual", "riset", "retur"], {
    required_error: "Kategori Gudang wajib dipilih",
  }).default("siap_jual"),
});

interface AddStockItemFormProps {
  onSuccess: () => void;
}

const AddStockItemForm: React.FC<AddStockItemFormProps> = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedExistingProduct, setSelectedExistingProduct] = useState<Product | undefined>(undefined);

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
      warehouse_category: "siap_jual",
    },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      const { data, error } = await supabase
        .from("products")
        .select("id, kode_barang, nama_barang, satuan, harga_beli, harga_jual, safe_stock_limit");

      if (error) {
        showError("Gagal memuat daftar produk.");
        console.error("Error fetching products:", error);
      } else {
        setProducts(data as Product[]);
      }
      setLoadingProducts(false);
    };

    fetchProducts();
  }, []);

  // Reset form and selected product when dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        kode_barang: "",
        nama_barang: "",
        satuan: "",
        harga_beli: 0,
        harga_jual: 0,
        stock_awal: 0,
        safe_stock_limit: 0,
        warehouse_category: "siap_jual",
      });
      setSelectedExistingProduct(undefined);
    }
  }, [isOpen, form]);

  // Update form fields when an existing product is selected
  useEffect(() => {
    if (selectedExistingProduct) {
      form.setValue("kode_barang", selectedExistingProduct.kode_barang);
      form.setValue("nama_barang", selectedExistingProduct.nama_barang);
      form.setValue("satuan", selectedExistingProduct.satuan || "");
      form.setValue("harga_beli", selectedExistingProduct.harga_beli);
      form.setValue("harga_jual", selectedExistingProduct.harga_jual);
      form.setValue("safe_stock_limit", selectedExistingProduct.safe_stock_limit || 0);
      // stock_awal and warehouse_category are for the new addition, so they remain editable
    } else {
      // Clear fields if no existing product is selected (e.g., user types a new one)
      form.setValue("kode_barang", "");
      form.setValue("nama_barang", "");
      form.setValue("satuan", "");
      form.setValue("harga_beli", 0);
      form.setValue("harga_jual", 0);
      form.setValue("safe_stock_limit", 0);
    }
  }, [selectedExistingProduct, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    try {
      let productId: string;

      if (selectedExistingProduct) {
        // If an existing product is selected, use its ID
        productId = selectedExistingProduct.id!;
        // Optionally, update safe_stock_limit if it was changed in the form for an existing product
        if (selectedExistingProduct.safe_stock_limit !== values.safe_stock_limit) {
          const { error: updateProductError } = await supabase
            .from("products")
            .update({ safe_stock_limit: values.safe_stock_limit })
            .eq("id", productId);
          if (updateProductError) throw updateProductError;
        }
      } else {
        // If no existing product is selected, insert a new product
        const { data: productData, error: productError } = await supabase
          .from("products")
          .insert({
            user_id: userId,
            kode_barang: values.kode_barang,
            nama_barang: values.nama_barang,
            satuan: values.satuan || null,
            harga_beli: values.harga_beli,
            harga_jual: values.harga_jual,
            safe_stock_limit: values.safe_stock_limit,
          })
          .select("id")
          .single();

        if (productError) {
          throw productError;
        }
        productId = productData.id;
      }

      // 2. If stock_awal > 0, insert or update into warehouse_inventories
      if (values.stock_awal > 0) {
        const { data: existingInventory, error: fetchInventoryError } = await supabase
          .from("warehouse_inventories")
          .select("id, quantity")
          .eq("product_id", productId)
          .eq("warehouse_category", values.warehouse_category)
          .single();

        if (fetchInventoryError && fetchInventoryError.code === 'PGRST116') { // No rows found
          // Create new inventory entry
          const { error: createInventoryError } = await supabase
            .from("warehouse_inventories")
            .insert({
              product_id: productId,
              warehouse_category: values.warehouse_category,
              quantity: values.stock_awal,
              user_id: userId,
            })
            .select("id")
            .single();

          if (createInventoryError) throw createInventoryError;
        } else if (fetchInventoryError) {
          throw fetchInventoryError;
        } else if (existingInventory) {
          // Update existing inventory entry
          const newQuantity = existingInventory.quantity + values.stock_awal;
          const { error: updateInventoryError } = await supabase
            .from("warehouse_inventories")
            .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
            .eq("id", existingInventory.id);

          if (updateInventoryError) throw updateInventoryError;
        }

        // 3. Record initial stock transaction
        const { error: transactionError } = await supabase
          .from("stock_transactions")
          .insert({
            user_id: userId,
            product_id: productId,
            transaction_type: "initial",
            quantity: values.stock_awal,
            notes: `Stok awal saat penambahan produk di kategori ${values.warehouse_category}`,
            transaction_date: format(new Date(), "yyyy-MM-dd"),
            warehouse_category: values.warehouse_category,
          });

        if (transactionError) {
          console.error("Error recording initial stock transaction:", transactionError);
          showError("Gagal mencatat transaksi stok awal.");
        }
      }

      showSuccess("Produk dan stok awal berhasil ditambahkan!");
      form.reset();
      setSelectedExistingProduct(undefined); // Clear selected product
      setIsOpen(false);
      onSuccess(); // Trigger refresh of stock data
    } catch (error: any) {
      showError(`Gagal menambahkan produk: ${error.message}`);
      console.error("Error adding product:", error);
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
            <FormItem className="md:col-span-2">
              <FormLabel>Pilih Produk yang Sudah Ada (Opsional)</FormLabel>
              <FormControl>
                <StockItemCombobox
                  name="product_selector"
                  items={products}
                  value={selectedExistingProduct?.nama_barang}
                  onValueChange={(product) => setSelectedExistingProduct(product)}
                  disabled={loadingProducts}
                  placeholder={loadingProducts ? "Memuat item produk..." : "Pilih item yang sudah ada atau ketik baru..."}
                />
              </FormControl>
              <FormDescription>
                Pilih produk yang sudah ada untuk mengisi otomatis detailnya, atau biarkan kosong untuk menambahkan produk baru.
              </FormDescription>
            </FormItem>

            <FormField
              control={form.control}
              name="kode_barang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Barang</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!!selectedExistingProduct} />
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
                    <Input {...field} disabled={!!selectedExistingProduct} />
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
                    <Input {...field} disabled={!!selectedExistingProduct} />
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
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} disabled={!!selectedExistingProduct} />
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
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} disabled={!!selectedExistingProduct} />
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