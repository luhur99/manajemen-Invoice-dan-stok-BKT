"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { Product, PurchaseRequestStatus, Supplier, WarehouseCategory as WarehouseCategoryType, WarehouseInventory, StockEventType } from "@/types/data";
import StockItemCombobox from "./StockItemCombobox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/components/SessionContextProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs components
import { format } from "date-fns"; // Import format from date-fns

// Helper function to generate PR number
const generatePrNumber = async (): Promise<string> => {
  const today = format(new Date(), "yyMMdd");
  const prefix = `PR${today}`;

  const { data, error } = await supabase
    .from("purchase_requests")
    .select("pr_number")
    .like("pr_number", `${prefix}%`)
    .order("pr_number", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error fetching latest PR number:", error);
    return `${prefix}${Date.now().toString().slice(-4)}`;
  }

  let sequence = 1;
  if (data && data.length > 0 && data[0].pr_number) {
    const latestPrNumber = data[0].pr_number;
    const currentSequence = parseInt(latestPrNumber.substring(8), 10);
    if (!isNaN(currentSequence)) {
      sequence = currentSequence + 1;
    }
  }
  return `${prefix}${String(sequence).padStart(4, '0')}`;
};

const formSchema = z.object({
  pr_number: z.string().trim().optional().nullable(), // Added pr_number to schema, corrected Zod order
  product_id: z.string().uuid().min(1, "Produk harus dipilih."),
  item_name: z.string().min(1, "Nama item harus diisi.").trim(),
  item_code: z.string().min(1, "Kode item harus diisi.").trim(),
  satuan: z.string().trim().optional().nullable(), // Corrected Zod order
  quantity: z.number().int().positive("Kuantitas harus lebih dari 0."),
  unit_price: z.number().min(0, "Harga satuan tidak boleh negatif."),
  suggested_selling_price: z.number().min(0, "Harga jual yang disarankan tidak boleh negatif."),
  total_price: z.number().min(0, "Total harga tidak boleh negatif."),
  supplier_id: z.string().uuid().min(1, "Supplier harus dipilih."),
  target_warehouse_category: z.string({
    required_error: "Kategori gudang tujuan harus dipilih.",
  }).min(1, "Kategori gudang tujuan harus dipilih."),
  notes: z.string().trim().optional().nullable(), // Corrected Zod order
});

interface AddPurchaseRequestFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddPurchaseRequestForm: React.FC<AddPurchaseRequestFormProps> = ({ isOpen, onOpenChange, onSuccess }) => {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("product_info"); // State to manage active tab
  const [productSearchInput, setProductSearchInput] = useState(""); // State for StockItemCombobox input

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pr_number: null, // Will be generated
      product_id: "",
      item_name: "",
      item_code: "",
      satuan: "",
      quantity: 1,
      unit_price: 0,
      suggested_selling_price: 0,
      total_price: 0,
      supplier_id: "",
      target_warehouse_category: "",
      notes: "",
    },
  });

  // Fetch product metadata (without inventories for purchase requests)
  const { data: products, isLoading: loadingProducts } = useQuery<Product[], Error>({
    queryKey: ["productsMetadata"], // Changed query key
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          user_id,
          created_at,
          kode_barang,
          nama_barang,
          satuan,
          harga_beli,
          harga_jual,
          safe_stock_limit,
          supplier_id
        `);
      if (error) {
        showError("Gagal memuat daftar produk.");
        throw error;
      }
      return data as Product[];
    },
    enabled: isOpen, // Only fetch when the dialog is open
  });

  // Fetch suppliers using useQuery
  const { data: suppliers, isLoading: loadingSuppliers } = useQuery<Supplier[], Error>({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("id, name") // Select specific columns
        .order("name", { ascending: true });
      if (error) {
        showError("Gagal memuat daftar supplier.");
        throw error;
      }
      return data as Supplier[];
    },
    enabled: isOpen, // Only fetch when the dialog is open
  });

  // Fetch warehouse categories using useQuery
  const { data: warehouseCategories, isLoading: loadingCategories } = useQuery<WarehouseCategoryType[], Error>({
    queryKey: ["warehouseCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warehouse_categories")
        .select("id, name, code") // Select specific columns
        .order("name", { ascending: true });
      if (error) {
        showError("Gagal memuat kategori gudang.");
        throw error;
      }
      return data as WarehouseCategoryType[];
    },
    enabled: isOpen, // Only fetch when the dialog is open
  });

  // Set default target_warehouse_category when categories load and dialog is open
  useEffect(() => {
    if (isOpen && warehouseCategories && warehouseCategories.length > 0 && !form.getValues("target_warehouse_category")) {
      form.setValue("target_warehouse_category", warehouseCategories[0].code);
    }
  }, [isOpen, warehouseCategories, form]);

  // Reset form and generate PR number when dialog opens
  useEffect(() => {
    if (isOpen) {
      generatePrNumber().then(prNum => {
        form.reset({
          pr_number: prNum,
          product_id: "",
          item_name: "",
          item_code: "",
          satuan: "",
          quantity: 1,
          unit_price: 0,
          suggested_selling_price: 0,
          total_price: 0,
          supplier_id: "",
          target_warehouse_category: warehouseCategories?.[0]?.code || "",
          notes: "",
        });
      });
      setProductSearchInput(""); // Reset product search input
      setActiveTab("product_info"); // Reset to first tab
    }
  }, [isOpen, form, warehouseCategories]);

  const selectedProductId = form.watch("product_id");
  const quantity = form.watch("quantity");
  const unitPrice = form.watch("unit_price");

  useEffect(() => {
    const product = products?.find(p => p.id === selectedProductId);
    if (product) {
      form.setValue("item_name", product.nama_barang);
      form.setValue("item_code", product.kode_barang);
      form.setValue("satuan", product.satuan || "");
      form.setValue("unit_price", product.harga_beli);
      form.setValue("suggested_selling_price", product.harga_jual);
      form.setValue("supplier_id", product.supplier_id || "");
      setProductSearchInput(product.nama_barang); // Update search input when product is selected
    } else {
      form.setValue("item_name", "");
      form.setValue("item_code", "");
      form.setValue("satuan", "");
      form.setValue("unit_price", 0);
      form.setValue("suggested_selling_price", 0);
      form.setValue("supplier_id", "");
      // Do not clear productSearchInput here if it's meant for filtering
    }
  }, [selectedProductId, products, form]);

  useEffect(() => {
    form.setValue("total_price", quantity * unitPrice);
  }, [quantity, unitPrice, form]);

  // Mutation for adding a purchase request
  const addPurchaseRequestMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("Pengguna tidak terautentikasi.");
      }

      const { error } = await supabase.from("purchase_requests").insert({
        user_id: userId,
        pr_number: values.pr_number, // Include generated PR number
        product_id: values.product_id,
        item_name: values.item_name,
        item_code: values.item_code,
        satuan: values.satuan,
        quantity: values.quantity,
        unit_price: values.unit_price,
        suggested_selling_price: values.suggested_selling_price,
        total_price: values.total_price,
        supplier_id: values.supplier_id,
        target_warehouse_category: values.target_warehouse_category,
        notes: values.notes,
        status: PurchaseRequestStatus.PENDING,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Permintaan pembelian berhasil ditambahkan!");
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["purchaseRequests"] }); // Invalidate to refetch list
      onSuccess(); // Call parent's onSuccess
    },
    onError: (err: any) => {
      showError(`Gagal menambahkan permintaan pembelian: ${err.message}`);
      console.error("Error adding purchase request:", err);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addPurchaseRequestMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Permintaan Pembelian Baru</DialogTitle>
          <DialogDescription>
            Isi detail permintaan pembelian baru di sini. Klik simpan saat Anda selesai.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="product_info">Produk</TabsTrigger>
                <TabsTrigger value="quantity_price">Kuantitas & Harga</TabsTrigger>
                <TabsTrigger value="supplier_warehouse">Supplier & Gudang</TabsTrigger>
                <TabsTrigger value="notes">Catatan</TabsTrigger>
              </TabsList>

              <TabsContent value="product_info" className="mt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="pr_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor PR</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-gray-100" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="product_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Produk</FormLabel>
                      <FormControl>
                        <StockItemCombobox
                          products={products || []}
                          selectedProductId={field.value}
                          onSelectProduct={field.onChange}
                          inputValue={productSearchInput}
                          onInputValueChange={setProductSearchInput}
                          disabled={loadingProducts}
                          loading={loadingProducts}
                          showInventory={false} // Do not show inventory in purchase request product selection
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="item_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Item</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-gray-100" />
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
                        <Input {...field} readOnly className="bg-gray-100" />
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
                        <Input {...field} readOnly className="bg-gray-100" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="quantity_price" className="mt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kuantitas</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                          min="1"
                        />
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
                      <FormLabel>Harga Satuan (Beli)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          min="0"
                        />
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
                      <FormLabel>Harga Jual Disarankan</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          min="0"
                          readOnly
                          className="bg-gray-100"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="total_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Harga</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} readOnly className="bg-gray-100" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="supplier_warehouse" className="mt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="supplier_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={loadingSuppliers}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih supplier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingSuppliers ? (
                            <SelectItem value="loading" disabled>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Memuat...
                            </SelectItem>
                          ) : suppliers?.length === 0 ? (
                            <SelectItem value="no-suppliers" disabled>
                              Tidak ada supplier tersedia
                            </SelectItem>
                          ) : (
                            suppliers?.map((supplier) => (
                              <SelectItem key={supplier.id} value={supplier.id}>
                                {supplier.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="target_warehouse_category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori Gudang Tujuan</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={loadingCategories}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={loadingCategories ? "Memuat kategori..." : "Pilih kategori gudang tujuan"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {warehouseCategories?.map((category) => (
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
              </TabsContent>

              <TabsContent value="notes" className="mt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catatan (Opsional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button type="submit" disabled={addPurchaseRequestMutation.isPending}>
                {addPurchaseRequestMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Kirim Permintaan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPurchaseRequestForm;