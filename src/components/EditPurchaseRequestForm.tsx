"use client";

import React, { useEffect, useState } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { Product, PurchaseRequestWithDetails, Supplier, WarehouseCategoryEnum, WarehouseInventory, PurchaseRequestStatus, StockEventType, WarehouseCategory as WarehouseCategoryType } from "@/types/data";
import StockItemCombobox from "./StockItemCombobox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/components/SessionContextProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  pr_number: z.string().optional().nullable(),
  item_name: z.string().min(1, "Nama item wajib diisi."),
  item_code: z.string().min(1, "Kode item wajib diisi."),
  product_id: z.string().uuid().optional().nullable(),
  quantity: z.number().int().positive("Kuantitas harus lebih dari 0."),
  unit_price: z.number().min(0, "Harga satuan tidak boleh negatif."),
  suggested_selling_price: z.number().min(0, "Harga jual yang disarankan tidak boleh negatif."),
  total_price: z.number().min(0, "Total harga tidak boleh negatif."),
  satuan: z.string().optional().nullable(),
  supplier_id: z.string().uuid().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.nativeEnum(PurchaseRequestStatus).default(PurchaseRequestStatus.PENDING),
  document_url: z.string().optional().nullable(),
  received_quantity: z.number().int().min(0, "Kuantitas diterima tidak boleh negatif.").optional().nullable(),
  returned_quantity: z.number().int().min(0, "Kuantitas dikembalikan tidak boleh negatif.").optional().nullable(),
  damaged_quantity: z.number().int().min(0, "Kuantitas rusak tidak boleh negatif.").optional().nullable(),
  target_warehouse_category: z.nativeEnum(WarehouseCategoryEnum).optional().nullable(),
  received_notes: z.string().optional().nullable(),
  received_at: z.date().optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.status === PurchaseRequestStatus.WAITING_FOR_RECEIVED && (!data.received_quantity || data.received_quantity <= 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Kuantitas diterima wajib diisi dan harus lebih dari 0 saat status 'Waiting for Received'.",
      path: ['received_quantity'],
    });
  }
  if (data.status === PurchaseRequestStatus.CLOSED && (!data.received_quantity || data.received_quantity <= 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Kuantitas diterima wajib diisi dan harus lebih dari 0 saat status 'Closed'.",
      path: ['received_quantity'],
    });
  }
  if (data.status === PurchaseRequestStatus.REJECTED && (!data.notes || data.notes.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Alasan (catatan) wajib diisi saat status 'Rejected'.",
      path: ['notes'],
    });
  }
});

interface EditPurchaseRequestFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData: PurchaseRequestWithDetails;
}

const EditPurchaseRequestForm: React.FC<EditPurchaseRequestFormProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
  initialData,
}) => {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pr_number: initialData.pr_number || null,
      item_name: initialData.item_name,
      item_code: initialData.item_code,
      product_id: initialData.product_id || null,
      quantity: initialData.quantity,
      unit_price: initialData.unit_price,
      suggested_selling_price: initialData.suggested_selling_price,
      total_price: initialData.total_price,
      satuan: initialData.satuan || null,
      supplier_id: initialData.supplier_id || null,
      notes: initialData.notes || null,
      status: initialData.status,
      document_url: initialData.document_url || null,
      received_quantity: initialData.received_quantity || 0,
      returned_quantity: initialData.returned_quantity || 0,
      damaged_quantity: initialData.damaged_quantity || 0,
      target_warehouse_category: initialData.target_warehouse_category || null,
      received_notes: initialData.received_notes || null,
      received_at: initialData.received_at ? new Date(initialData.received_at) : null,
    },
  });

  const watchedQuantity = form.watch("quantity");
  const watchedUnitPrice = form.watch("unit_price");
  const watchedProductId = form.watch("product_id");
  const watchedStatus = form.watch("status");
  const [productSearchInput, setProductSearchInput] = useState(initialData.products?.nama_barang || "");

  useEffect(() => {
    form.setValue("total_price", watchedQuantity * watchedUnitPrice);
  }, [watchedQuantity, watchedUnitPrice, form]);

  // Fetch product metadata (without inventories for purchase requests)
  const { data: products, isLoading: loadingProducts } = useQuery<Product[], Error>({
    queryKey: ["productsMetadata"], // Changed query key
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          user_id,
          kode_barang,
          nama_barang,
          satuan,
          harga_beli,
          harga_jual,
          safe_stock_limit,
          created_at,
          supplier_id
        `);
      if (error) {
        showError("Gagal memuat daftar produk.");
        throw error;
      }
      return data as Product[];
    },
    enabled: isOpen,
  });

  const { data: suppliers, isLoading: loadingSuppliers } = useQuery<Supplier[], Error>({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*") // Select all columns to match Supplier interface
        .order("name", { ascending: true });
      if (error) {
        showError("Gagal memuat daftar supplier.");
        throw error;
      }
      return data as Supplier[];
    },
    enabled: isOpen,
  });

  const { data: warehouseCategories, isLoading: loadingWarehouseCategories } = useQuery<WarehouseCategoryType[], Error>({
    queryKey: ["warehouseCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warehouse_categories")
        .select("id, name, code") // Select all relevant columns
        .order("name", { ascending: true });
      if (error) {
        showError("Gagal memuat kategori gudang.");
        throw error;
      }
      return data as WarehouseCategoryType[]; // Return array of objects
    },
    enabled: isOpen,
  });

  const handleProductSelect = (product: Product | undefined) => {
    if (product) {
      form.setValue("product_id", product.id);
      form.setValue("item_name", product.nama_barang);
      form.setValue("item_code", product.kode_barang);
      form.setValue("unit_price", product.harga_beli);
      form.setValue("suggested_selling_price", product.harga_jual);
      form.setValue("satuan", product.satuan);
      setProductSearchInput(product.nama_barang);
      form.clearErrors(["item_name", "item_code", "unit_price", "suggested_selling_price", "satuan"]);
    } else {
      form.setValue("product_id", null);
      form.setValue("item_name", "");
      form.setValue("item_code", "");
      form.setValue("unit_price", 0);
      form.setValue("suggested_selling_price", 0);
      form.setValue("satuan", null);
      setProductSearchInput("");
    }
  };

  const updatePurchaseRequestMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("Pengguna tidak terautentikasi.");
      }

      const isClosingAction = values.status === PurchaseRequestStatus.CLOSED && initialData.status !== PurchaseRequestStatus.CLOSED;

      if (isClosingAction) {
        // Call the Edge Function to close the PR and update stock
        const { data, error } = await supabase.functions.invoke('close-purchase-request', {
          body: JSON.stringify({
            request_id: initialData.id,
            received_quantity: values.received_quantity,
            returned_quantity: values.returned_quantity,
            damaged_quantity: values.damaged_quantity,
            target_warehouse_category: values.target_warehouse_category,
            received_notes: values.received_notes,
          }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (error) throw error;
        if (data && data.error) throw new Error(data.error);

      } else {
        // For any other updates (including status changes to non-CLOSED states, or other field edits)
        const dataToUpdate = {
          item_name: values.item_name.trim(),
          item_code: values.item_code.trim(),
          product_id: values.product_id || null,
          quantity: values.quantity,
          unit_price: values.unit_price,
          suggested_selling_price: values.suggested_selling_price,
          total_price: values.total_price,
          satuan: values.satuan?.trim() || null,
          supplier_id: values.supplier_id || null,
          notes: values.notes?.trim() || null,
          status: values.status,
          document_url: values.document_url || null,
          received_quantity: values.received_quantity || 0,
          returned_quantity: values.returned_quantity || 0,
          damaged_quantity: values.damaged_quantity || 0,
          target_warehouse_category: values.target_warehouse_category || null,
          received_notes: values.received_notes?.trim() || null,
          received_at: values.received_at ? format(values.received_at, "yyyy-MM-dd") : null,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from("purchase_requests")
          .update(dataToUpdate)
          .eq("id", initialData.id);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      showSuccess("Pengajuan pembelian berhasil diperbarui!");
      onSuccess();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["purchaseRequests"] });
      queryClient.invalidateQueries({ queryKey: ["stockHistory"] });
      queryClient.invalidateQueries({ queryKey: ["stockMovements"] });
      queryClient.invalidateQueries({ queryKey: ["productsMetadata"] }); // Invalidate product list
      queryClient.invalidateQueries({ queryKey: ["productsWithInventories"] }); // Invalidate stock management view
    },
    onError: (err: any) => {
      showError(`Gagal memperbarui pengajuan pembelian: ${err.message}`);
      console.error("Error updating purchase request:", err);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updatePurchaseRequestMutation.mutate(values);
  };

  if (loadingProducts || loadingSuppliers || loadingWarehouseCategories) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Pengajuan Pembelian</DialogTitle>
            <DialogDescription>Memuat data...</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Pengajuan Pembelian</DialogTitle>
          <DialogDescription>
            Perbarui detail pengajuan pembelian ini.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Informasi Dasar</TabsTrigger>
                <TabsTrigger value="details">Detail Item & Supplier</TabsTrigger>
                <TabsTrigger value="status">Status & Penerimaan</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <FormLabel>Pilih Produk (Opsional)</FormLabel>
                      <FormControl>
                        <StockItemCombobox
                          products={products || []}
                          selectedProductId={field.value || undefined}
                          onSelectProduct={(productId) => handleProductSelect(products?.find(p => p.id === productId))}
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
                        <Input {...field} readOnly={!!watchedProductId} className={watchedProductId ? "bg-gray-100" : ""} />
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
                        <Input {...field} readOnly={!!watchedProductId} className={watchedProductId ? "bg-gray-100" : ""} />
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
                  name="satuan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Satuan (Opsional)</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!!watchedProductId} className={watchedProductId ? "bg-gray-100" : ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="details" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="unit_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga Satuan</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
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
                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
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
                <FormField
                  control={form.control}
                  name="supplier_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier (Opsional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
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
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Catatan (Opsional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="status" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(PurchaseRequestStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {watchedStatus === PurchaseRequestStatus.WAITING_FOR_RECEIVED || watchedStatus === PurchaseRequestStatus.CLOSED ? (
                  <>
                    <FormField
                      control={form.control}
                      name="received_quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kuantitas Diterima</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="returned_quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kuantitas Dikembalikan (Opsional)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="damaged_quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kuantitas Rusak (Opsional)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                          </FormControl>
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
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori gudang" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {loadingWarehouseCategories ? (
                                <SelectItem value="loading" disabled>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Memuat...
                                </SelectItem>
                              ) : (
                                warehouseCategories?.map((category) => (
                                  <SelectItem key={category.id} value={category.code}>
                                    {category.name}
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
                      name="received_notes"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Catatan Penerimaan (Opsional)</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="received_at"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pilih tanggal</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value || undefined}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : null}
              </TabsContent>
            </Tabs>
            <DialogFooter className="md:col-span-2">
              <Button type="submit" disabled={updatePurchaseRequestMutation.isPending}>
                {updatePurchaseRequestMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPurchaseRequestForm;