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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Product } from "@/types/data";
import StockItemCombobox from "@/components/StockItemCombobox";

// Schema validasi menggunakan Zod
const formSchema = z.object({
  item_name: z.string().min(1, "Nama Item wajib diisi"),
  item_code: z.string().min(1, "Kode Item wajib diisi"),
  quantity: z.coerce.number().min(1, "Kuantitas minimal 1"),
  unit_price: z.coerce.number().min(0, "Harga Beli tidak boleh negatif"),
  suggested_selling_price: z.coerce.number().min(0, "Harga Jual yang disarankan tidak boleh negatif"),
  supplier: z.string().optional(),
  notes: z.string().optional(),
  // product_id_internal is used to store the selected product ID from combobox
  product_id_internal: z.string().optional(), 
});

interface AddPurchaseRequestFormProps {
  onSuccess: () => void;
}

const AddPurchaseRequestForm: React.FC<AddPurchaseRequestFormProps> = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item_name: "",
      item_code: "",
      quantity: 1,
      unit_price: 0,
      suggested_selling_price: 0,
      supplier: "",
      notes: "",
      product_id_internal: "", // Initialize internal field
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    try {
      let finalProductId: string;
      const currentProductIdFromCombobox = form.getValues("product_id_internal");

      if (currentProductIdFromCombobox) {
        // If a product was selected from the combobox, use its ID
        finalProductId = currentProductIdFromCombobox;
      } else {
        // If no product was selected from combobox (user typed manually)
        // Check if a product with the entered item_code already exists
        const { data: existingProduct, error: fetchProductError } = await supabase
          .from("products")
          .select("id")
          .eq("kode_barang", values.item_code)
          .single();

        if (fetchProductError && fetchProductError.code !== 'PGRST116') { // PGRST116 means no rows found
          throw fetchProductError;
        }

        if (existingProduct) {
          finalProductId = existingProduct.id;
        } else {
          // Create a new product if it doesn't exist
          const { data: newProductData, error: newProductError } = await supabase
            .from("products")
            .insert({
              user_id: userId,
              kode_barang: values.item_code,
              nama_barang: values.item_name,
              satuan: "PCS", // Default unit, can be made configurable
              harga_beli: values.unit_price,
              harga_jual: values.suggested_selling_price,
              safe_stock_limit: 0, // Default safe stock limit for new products
            })
            .select("id")
            .single();

          if (newProductError) {
            throw newProductError;
          }
          finalProductId = newProductData.id;
        }
      }

      if (!finalProductId) {
        showError("Gagal menentukan ID produk untuk pengajuan pembelian.");
        return;
      }

      const total_price = values.quantity * values.unit_price;

      const { error } = await supabase
        .from("purchase_requests")
        .insert({
          user_id: userId,
          product_id: finalProductId, // Use the determined product ID
          item_name: values.item_name,
          item_code: values.item_code,
          quantity: values.quantity,
          unit_price: values.unit_price,
          suggested_selling_price: values.suggested_selling_price,
          total_price: total_price,
          supplier: values.supplier || null,
          notes: values.notes || null,
          status: "pending", // Default status
        });

      if (error) {
        throw error;
      }

      showSuccess("Pengajuan pembelian berhasil dibuat!");
      form.reset();
      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      showError(`Gagal membuat pengajuan pembelian: ${error.message}`);
      console.error("Error creating purchase request:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> Buat Pengajuan Pembelian
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buat Pengajuan Pembelian Baru</DialogTitle>
          <DialogDescription>Isi detail untuk mengajukan pembelian item stok baru.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="item_name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Nama Item</FormLabel>
                  <FormControl>
                    <StockItemCombobox
                      name={field.name}
                      items={products}
                      value={field.value}
                      onValueChange={(selectedProduct) => {
                        if (selectedProduct) {
                          form.setValue("item_name", selectedProduct.nama_barang);
                          form.setValue("item_code", selectedProduct.kode_barang);
                          form.setValue("unit_price", selectedProduct.harga_beli);
                          form.setValue("suggested_selling_price", selectedProduct.harga_jual);
                          form.setValue("product_id_internal", selectedProduct.id); // Set internal product_id
                        } else {
                          form.setValue("item_name", "");
                          form.setValue("item_code", "");
                          form.setValue("unit_price", 0);
                          form.setValue("suggested_selling_price", 0);
                          form.setValue("product_id_internal", ""); // Clear internal product_id
                        }
                      }}
                      disabled={loadingProducts}
                      placeholder={loadingProducts ? "Memuat item produk..." : "Pilih item yang sudah ada atau ketik baru..."}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="item_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Item</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
              name="unit_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Beli per Unit</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="suggested_selling_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Jual yang Disarankan per Unit</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pemasok (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Catatan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tambahkan catatan tambahan untuk pengajuan ini..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Hidden field for product_id_internal */}
            <FormField
              control={form.control}
              name="product_id_internal"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>Product ID Internal</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:col-span-2">
              <Button type="submit" className="w-full mt-6" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Ajukan Pembelian"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPurchaseRequestForm;