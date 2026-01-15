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
import { Product, Supplier } from "@/types/data"; // Changed from StockItem
import StockItemCombobox from "@/components/StockItemCombobox";
import SupplierCombobox from "@/components/SupplierCombobox"; // Import new SupplierCombobox

// Schema validasi menggunakan Zod
const formSchema = z.object({
  item_name: z.string().min(1, "Nama Item wajib diisi"),
  item_code: z.string().min(1, "Kode Item wajib diisi"),
  quantity: z.coerce.number().min(1, "Kuantitas minimal 1"),
  unit_price: z.coerce.number().min(0, "Harga Beli tidak boleh negatif"),
  suggested_selling_price: z.coerce.number().min(0, "Harga Jual yang disarankan tidak boleh negatif"),
  supplier_id: z.string().uuid("ID Pemasok tidak valid").optional().or(z.literal("")),
  supplier_name_input: z.string().optional(), // For the combobox input text
  notes: z.string().optional(),
  satuan: z.string().optional(),
  selected_product_id: z.string().uuid().optional().or(z.literal("")), // Changed from selected_stock_item_id
});

interface AddPurchaseRequestFormProps {
  onSuccess: () => void;
}

const AddPurchaseRequestForm: React.FC<AddPurchaseRequestFormProps> = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]); // Changed from stockItems
  const [suppliers, setSuppliers] = useState<Supplier[]>([]); // New state for suppliers
  const [loadingProducts, setLoadingProducts] = useState(true); // Changed from loadingStockItems
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item_name: "",
      item_code: "",
      quantity: 1,
      unit_price: 0,
      suggested_selling_price: 0,
      supplier_id: "",
      supplier_name_input: "",
      notes: "",
      satuan: "",
      selected_product_id: "", // Initialize new field
    },
  });

  useEffect(() => {
    const fetchProducts = async () => { // Changed from fetchStockItems
      setLoadingProducts(true); // Changed from setLoadingStockItems
      const { data, error } = await supabase
        .from("products") // Changed from stock_items
        .select(`
          id,
          kode_barang,
          nama_barang,
          harga_beli,
          harga_jual,
          satuan,
          supplier_id,
          warehouse_inventories(warehouse_category, quantity)
        `);

      if (error) {
        showError("Gagal memuat daftar produk."); // Changed message
        console.error("Error fetching products:", error); // Changed message
      } else {
        setProducts(data.map(item => ({ // Changed from setStockItems
          id: item.id,
          kode_barang: item.kode_barang,
          nama_barang: item.nama_barang,
          harga_beli: item.harga_beli,
          harga_jual: item.harga_jual,
          satuan: item.satuan || "",
          supplier_id: item.supplier_id || undefined, // Include supplier_id
          inventories: item.warehouse_inventories || [],
          safe_stock_limit: 0,
        })) as Product[]); // Changed from StockItem[]
      }
      setLoadingProducts(false); // Changed from setLoadingStockItems
    };

    const fetchSuppliers = async () => {
      setLoadingSuppliers(true);
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        showError("Gagal memuat daftar pemasok.");
        console.error("Error fetching suppliers:", error);
      } else {
        setSuppliers(data as Supplier[]);
      }
      setLoadingSuppliers(false);
    };

    fetchProducts(); // Changed from fetchStockItems
    fetchSuppliers();
  }, []);

  // Handler for when a product is selected from the combobox
  const handleProductSelect = (selectedItemId: string | undefined) => { // Changed from handleStockItemSelect
    form.setValue("selected_product_id", selectedItemId || ""); // Changed from selected_stock_item_id
    if (selectedItemId) {
      const selectedProduct = products.find(item => item.id === selectedItemId); // Changed from selectedStock
      if (selectedProduct) {
        form.setValue("item_name", selectedProduct.nama_barang);
        form.setValue("item_code", selectedProduct.kode_barang);
        form.setValue("unit_price", selectedProduct.harga_beli);
        form.setValue("suggested_selling_price", selectedProduct.harga_jual);
        form.setValue("satuan", selectedProduct.satuan || "");
        form.setValue("supplier_id", selectedProduct.supplier_id || "");
        const selectedSupplier = suppliers.find(s => s.id === selectedProduct.supplier_id);
        form.setValue("supplier_name_input", selectedSupplier ? selectedSupplier.name : "");
      }
    } else {
      // If selection is cleared
      form.setValue("item_code", "");
      form.setValue("unit_price", 0);
      form.setValue("suggested_selling_price", 0);
      form.setValue("satuan", "");
      form.setValue("supplier_id", "");
      form.setValue("supplier_name_input", "");
    }
  };

  // Handler for when the product combobox input text changes
  const handleProductInputChange = (value: string) => { // Changed from handleStockItemInputChange
    form.setValue("item_name", value);
    // If the user types, clear the selected item ID and other prepopulated fields
    // unless the typed value exactly matches an existing item.
    const matchedItem = products.find(item => item.nama_barang === value); // Changed from stockItems
    if (!matchedItem) {
      form.setValue("selected_product_id", ""); // Changed from selected_stock_item_id
      form.setValue("item_code", "");
      form.setValue("unit_price", 0);
      form.setValue("suggested_selling_price", 0);
      form.setValue("satuan", "");
      form.setValue("supplier_id", "");
      form.setValue("supplier_name_input", "");
    } else if (matchedItem.id !== form.getValues().selected_product_id) { // Changed from selected_stock_item_id
      // If it matches a different item, update all fields
      handleProductSelect(matchedItem.id); // Changed from handleStockItemSelect
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    try {
      const total_price = values.quantity * values.unit_price;

      const { error } = await supabase
        .from("purchase_requests")
        .insert({
          user_id: userId,
          item_name: values.item_name,
          item_code: values.item_code,
          quantity: values.quantity,
          unit_price: values.unit_price,
          suggested_selling_price: values.suggested_selling_price,
          total_price: total_price,
          supplier_id: values.supplier_id || null, // Save supplier_id
          notes: values.notes || null,
          status: "pending",
          satuan: values.satuan || null,
          product_id: values.selected_product_id || null, // Save product_id
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
              name="item_name" // This field will now primarily control the input text
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Nama Item</FormLabel>
                  <FormControl>
                    <StockItemCombobox // Still using StockItemCombobox, but it will now handle Product type
                      name={field.name}
                      items={products} // Changed from stockItems
                      selectedItemId={form.watch("selected_product_id")} // Pass the selected ID
                      onSelectItemId={handleProductSelect} // Handle ID selection
                      inputValue={field.value} // Pass the current item_name as input text
                      onInputValueChange={handleProductInputChange} // Handle input text changes
                      disabled={loadingProducts} // Changed from loadingStockItems
                      placeholder={loadingProducts ? "Memuat produk..." : "Pilih produk yang sudah ada atau ketik baru..."} // Changed message
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
              name="supplier_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pemasok (Opsional)</FormLabel>
                  <FormControl>
                    <SupplierCombobox
                      name={field.name}
                      suppliers={suppliers}
                      value={field.value}
                      inputValue={form.watch("supplier_name_input") || ""}
                      onInputValueChange={(val) => form.setValue("supplier_name_input", val)}
                      onValueChange={(selectedSupplier) => {
                        form.setValue("supplier_id", selectedSupplier ? selectedSupplier.id : "");
                        form.setValue("supplier_name_input", selectedSupplier ? selectedSupplier.name : "");
                      }}
                      disabled={loadingSuppliers}
                      placeholder={loadingSuppliers ? "Memuat pemasok..." : "Cari pemasok..."}
                    />
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