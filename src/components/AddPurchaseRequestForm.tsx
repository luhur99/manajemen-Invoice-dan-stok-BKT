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
import { StockItem, Supplier } from "@/types/data";
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
  selected_stock_item_id: z.string().uuid().optional().or(z.literal("")), // New field to hold the selected stock item ID
});

interface AddPurchaseRequestFormProps {
  onSuccess: () => void;
}

const AddPurchaseRequestForm: React.FC<AddPurchaseRequestFormProps> = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]); // New state for suppliers
  const [loadingStockItems, setLoadingStockItems] = useState(true);
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
      selected_stock_item_id: "", // Initialize new field
    },
  });

  useEffect(() => {
    const fetchStockItems = async () => {
      setLoadingStockItems(true);
      const { data, error } = await supabase
        .from("stock_items")
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
        showError("Gagal memuat daftar item stok.");
        console.error("Error fetching stock items:", error);
      } else {
        setStockItems(data.map(item => ({
          id: item.id,
          "KODE BARANG": item.kode_barang,
          "NAMA BARANG": item.nama_barang,
          "HARGA BELI": item.harga_beli,
          "HARGA JUAL": item.harga_jual,
          SATUAN: item.satuan || "",
          supplier_id: item.supplier_id || undefined, // Include supplier_id
          inventories: item.warehouse_inventories || [],
          safe_stock_limit: 0,
        })) as StockItem[]);
      }
      setLoadingStockItems(false);
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

    fetchStockItems();
    fetchSuppliers();
  }, []);

  // Handler for when a stock item is selected from the combobox
  const handleStockItemSelect = (selectedItemId: string | undefined) => {
    form.setValue("selected_stock_item_id", selectedItemId || "");
    if (selectedItemId) {
      const selectedStock = stockItems.find(item => item.id === selectedItemId);
      if (selectedStock) {
        form.setValue("item_name", selectedStock["NAMA BARANG"]);
        form.setValue("item_code", selectedStock["KODE BARANG"]);
        form.setValue("unit_price", selectedStock["HARGA BELI"]);
        form.setValue("suggested_selling_price", selectedStock["HARGA JUAL"]);
        form.setValue("satuan", selectedStock.SATUAN || "");
        form.setValue("supplier_id", selectedStock.supplier_id || "");
        const selectedSupplier = suppliers.find(s => s.id === selectedStock.supplier_id);
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

  // Handler for when the stock item combobox input text changes
  const handleStockItemInputChange = (value: string) => {
    form.setValue("item_name", value);
    // If the user types, clear the selected item ID and other prepopulated fields
    // unless the typed value exactly matches an existing item.
    const matchedItem = stockItems.find(item => item["NAMA BARANG"] === value);
    if (!matchedItem) {
      form.setValue("selected_stock_item_id", "");
      form.setValue("item_code", "");
      form.setValue("unit_price", 0);
      form.setValue("suggested_selling_price", 0);
      form.setValue("satuan", "");
      form.setValue("supplier_id", "");
      form.setValue("supplier_name_input", "");
    } else if (matchedItem.id !== form.getValues().selected_stock_item_id) {
      // If it matches a different item, update all fields
      handleStockItemSelect(matchedItem.id);
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
                    <StockItemCombobox
                      name={field.name}
                      items={stockItems}
                      selectedItemId={form.watch("selected_stock_item_id")} // Pass the selected ID
                      onSelectItemId={handleStockItemSelect} // Handle ID selection
                      inputValue={field.value} // Pass the current item_name as input text
                      onInputValueChange={handleStockItemInputChange} // Handle input text changes
                      disabled={loadingStockItems}
                      placeholder={loadingStockItems ? "Memuat item stok..." : "Pilih item yang sudah ada atau ketik baru..."}
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
                      placeholder={loadingSuppliers ? "Memuat pemasok..." : "Pilih pemasok..."}
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