"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { CalendarIcon, PlusCircle, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import {
  Product,
  Invoice,
  InvoiceItem,
  InvoicePaymentStatus,
  InvoiceType,
  CustomerTypeEnum,
  WarehouseInventory,
  InvoiceDocumentStatus,
} from "@/types/data";
import StockItemCombobox from "./StockItemCombobox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/components/SessionContextProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  invoice_number: z.string().min(1, "Nomor Invoice harus diisi."),
  invoice_date: z.date({ required_error: "Tanggal Invoice harus diisi." }),
  due_date: z.date().optional(),
  customer_name: z.string().min(1, "Nama Pelanggan harus diisi."),
  company_name: z.string().optional().nullable(),
  total_amount: z.number().min(0, "Total Jumlah tidak boleh negatif."),
  payment_status: z.nativeEnum(InvoicePaymentStatus),
  type: z.nativeEnum(InvoiceType).optional().nullable(),
  customer_type: z.nativeEnum(CustomerTypeEnum).optional().nullable(),
  payment_method: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  courier_service: z.string().optional().nullable(),
  invoice_status: z.nativeEnum(InvoiceDocumentStatus),
  document_url: z.string().optional().nullable(),
  do_number: z.string().optional().nullable(), // Added do_number to schema
  items: z.array(
    z.object({
      id: z.string().optional(),
      product_id: z.string().min(1, "Produk harus dipilih."),
      item_name: z.string().min(1, "Nama Item harus diisi."),
      item_code: z.string().optional().nullable(),
      quantity: z.number().int().positive("Kuantitas harus lebih dari 0."),
      unit_price: z.number().min(0, "Harga Satuan tidak boleh negatif."),
      subtotal: z.number().min(0, "Subtotal tidak boleh negatif."),
      unit_type: z.string().optional().nullable(),
    })
  ).min(1, "Setidaknya satu item harus ditambahkan."),
});

interface EditInvoiceFormProps {
  invoice: Invoice;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditInvoiceForm: React.FC<EditInvoiceFormProps> = ({ invoice, isOpen, onOpenChange, onSuccess }) => {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("basic_info");
  const [itemSearchInputs, setItemSearchInputs] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoice_number: invoice.invoice_number,
      invoice_date: new Date(invoice.invoice_date),
      due_date: invoice.due_date ? new Date(invoice.due_date) : undefined,
      customer_name: invoice.customer_name,
      company_name: invoice.company_name || null,
      payment_status: invoice.payment_status as InvoicePaymentStatus,
      type: invoice.type as InvoiceType | undefined,
      customer_type: invoice.customer_type as CustomerTypeEnum | undefined,
      payment_method: invoice.payment_method || null,
      notes: invoice.notes || null,
      courier_service: invoice.courier_service || null,
      total_amount: invoice.total_amount,
      invoice_status: invoice.invoice_status as InvoiceDocumentStatus,
      document_url: invoice.document_url || null,
      do_number: invoice.do_number || null, // Initialize do_number
      items: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const [initialItems, setInitialItems] = React.useState<InvoiceItem[]>([]);

  // Fetch product metadata (without inventories for invoice items)
  const { data: products, isLoading: loadingProducts } = useQuery<Product[], Error>({
    queryKey: ["productsMetadata"],
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
          supplier_id,
          created_at
        `);

      if (error) {
        showError("Gagal memuat daftar produk.");
        throw error;
      }
      return data as Product[];
    },
    enabled: isOpen, // Only fetch when the dialog is open
  });

  const { data: invoiceItems, isLoading: loadingInvoiceItems } = useQuery<InvoiceItem[], Error>({
    queryKey: ["invoiceItems", invoice.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoice_items")
        .select(`
          id,
          invoice_id,
          user_id,
          item_name,
          quantity,
          unit_price,
          subtotal,
          created_at,
          unit_type,
          product_id,
          item_code,
          updated_at
        `)
        .eq("invoice_id", invoice.id);
      if (error) {
        showError("Gagal memuat item invoice.");
        throw error;
      }
      return data as InvoiceItem[];
    },
    enabled: isOpen,
  });

  useEffect(() => {
    if (isOpen && invoiceItems) {
      const items: InvoiceItem[] = invoiceItems.map(item => ({
        id: item.id,
        product_id: item.product_id || null,
        item_name: item.item_name,
        item_code: item.item_code || null,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
        unit_type: item.unit_type,
        invoice_id: item.invoice_id,
        user_id: item.user_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
      form.setValue("items", items);
      setInitialItems(items);
      setItemSearchInputs(items.map(item => item.item_name || ""));
      setActiveTab("basic_info");
    }
  }, [isOpen, invoiceItems, form]);

  useEffect(() => {
    if (isOpen && invoice) {
      form.reset({
        invoice_number: invoice.invoice_number,
        invoice_date: new Date(invoice.invoice_date),
        due_date: invoice.due_date ? new Date(invoice.due_date) : undefined,
        customer_name: invoice.customer_name,
        company_name: invoice.company_name || null,
        payment_status: invoice.payment_status as InvoicePaymentStatus,
        type: invoice.type as InvoiceType | undefined,
        customer_type: invoice.customer_type as CustomerTypeEnum | undefined,
        payment_method: invoice.payment_method || null,
        notes: invoice.notes || null,
        courier_service: invoice.courier_service || null,
        total_amount: invoice.total_amount,
        invoice_status: invoice.invoice_status as InvoiceDocumentStatus,
        document_url: invoice.document_url || null,
        do_number: invoice.do_number || null, // Reset do_number
        items: initialItems,
      });
      setItemSearchInputs(initialItems.map(item => item.item_name || ""));
    }
  }, [isOpen, invoice, form, initialItems]);

  React.useEffect(() => {
    setItemSearchInputs(fields.map(item => item.item_name || ""));
  }, [fields]);

  const calculateTotalAmount = React.useCallback(() => {
    const total = fields.reduce((sum, item) => sum + item.subtotal, 0);
    form.setValue("total_amount", total);
  }, [fields, form]);

  React.useEffect(() => {
    calculateTotalAmount();
  }, [fields, calculateTotalAmount]);

  const handleProductSelect = (index: number, productId: string | undefined) => {
    const selectedProduct = products?.find(p => p.id === productId);
    if (selectedProduct) {
      update(index, {
        ...fields[index],
        product_id: selectedProduct.id,
        item_name: selectedProduct.nama_barang,
        item_code: selectedProduct.kode_barang,
        unit_price: selectedProduct.harga_jual,
        unit_type: selectedProduct.satuan,
        quantity: fields[index].quantity || 1,
        subtotal: selectedProduct.harga_jual * (fields[index].quantity || 1),
      });
      setItemSearchInputs(prev => {
        const newInputs = [...prev];
        newInputs[index] = selectedProduct.nama_barang;
        return newInputs;
      });
    } else {
      update(index, {
        ...fields[index],
        product_id: "",
        item_name: "",
        item_code: null,
        unit_price: 0,
        unit_type: null,
        subtotal: 0,
      });
      setItemSearchInputs(prev => {
        const newInputs = [...prev];
        newInputs[index] = "";
        return newInputs;
      });
    }
  };

  const handleQuantityChange = (index: number, value: number) => {
    const unitPrice = fields[index].unit_price;
    update(index, {
      ...fields[index],
      quantity: value,
      subtotal: value * unitPrice,
    });
  };

  const handleUnitPriceChange = (index: number, value: number) => {
    const quantity = fields[index].quantity;
    update(index, {
      ...fields[index],
      unit_price: value,
      subtotal: value * quantity,
    });
  };

  const updateInvoiceMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("Anda harus login untuk memperbarui invoice.");
      }

      // Separate items into those to update, delete, and insert
      const currentFormItems = values.items;
      const itemsToUpdate = currentFormItems.filter(item => item.id);
      const itemsToInsert = currentFormItems.filter(item => !item.id);
      const itemsToDelete = initialItems.filter(
        (initialItem) => !currentFormItems.some((currentItem) => currentItem.id === initialItem.id)
      );

      const { data, error } = await supabase.functions.invoke('update-invoice-and-deduct-stock', {
        body: JSON.stringify({
          invoice_id: invoice.id,
          updated_invoice_data: {
            invoice_number: values.invoice_number,
            invoice_date: format(values.invoice_date as Date, "yyyy-MM-dd"),
            due_date: values.due_date ? format(values.due_date as Date, "yyyy-MM-dd") : null,
            customer_name: values.customer_name,
            company_name: values.company_name,
            total_amount: values.total_amount,
            payment_status: values.payment_status,
            type: values.type,
            customer_type: values.customer_type,
            payment_method: values.payment_method,
            notes: values.notes,
            courier_service: values.courier_service,
            invoice_status: values.invoice_status,
            document_url: values.document_url,
            do_number: values.do_number,
          },
          items_to_update: itemsToUpdate,
          items_to_delete: itemsToDelete,
          items_to_insert: itemsToInsert,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (error) throw error;
      if (data && data.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      showSuccess("Invoice berhasil diperbarui!");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", invoice.id] });
      queryClient.invalidateQueries({ queryKey: ["invoiceItems", invoice.id] });
      queryClient.invalidateQueries({ queryKey: ["productsWithInventories"] }); // Invalidate stock management view
      queryClient.invalidateQueries({ queryKey: ["stockHistory"] }); // Invalidate stock history
      onSuccess();
    },
    onError: (err: any) => {
      showError(`Gagal memperbarui invoice: ${err.message}`);
      console.error("Error updating invoice:", err);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateInvoiceMutation.mutate(values);
  };

  const watchedInvoiceType = form.watch("type");

  if (loadingProducts || loadingInvoiceItems) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogDescription>Memuat detail invoice...</DialogDescription>
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
          <DialogTitle>Edit Invoice</DialogTitle>
          <DialogDescription>
            Ubah detail invoice di sini. Klik simpan saat Anda selesai.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic_info">Informasi Dasar</TabsTrigger>
                <TabsTrigger value="items">Item Invoice</TabsTrigger>
                <TabsTrigger value="notes">Catatan</TabsTrigger>
              </TabsList>

              <TabsContent value="basic_info" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="invoice_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Invoice</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="do_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor DO (Opsional)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="invoice_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tanggal Invoice</FormLabel>
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
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="due_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tanggal Jatuh Tempo (Opsional)</FormLabel>
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
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Pelanggan</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Perusahaan (Opsional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="payment_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Pembayaran</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status pembayaran" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(InvoicePaymentStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipe Invoice (Opsional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tipe invoice" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(InvoiceType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
                  name="customer_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipe Pelanggan (Opsional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tipe pelanggan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(CustomerTypeEnum).map((type: CustomerTypeEnum) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
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
                  name="payment_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Metode Pembayaran (Opsional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih metode pembayaran" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Transfer">Transfer</SelectItem>
                          <SelectItem value="DP">DP</SelectItem>
                          <SelectItem value="Lainnya">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="courier_service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Layanan Kurir (Opsional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="items" className="mt-4 space-y-4">
                {fields.map((item, index) => (
                  <div key={item.id || index} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end border p-3 rounded-md relative">
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.product_id`}
                        render={({ field }) => (
                              <FormItem>
                                <FormLabel>Produk</FormLabel>
                                <StockItemCombobox
                                  products={products || []}
                                  selectedProductId={field.value || undefined}
                                  onSelectProduct={(productId) => handleProductSelect(index, productId)}
                                  inputValue={itemSearchInputs[index] || ""}
                                  onInputValueChange={(value) => {
                                    setItemSearchInputs(prev => {
                                      const newInputs = [...prev];
                                      newInputs[index] = value;
                                      return newInputs;
                                    });
                                  }}
                                  disabled={loadingProducts}
                                  loading={loadingProducts}
                                  showInventory={false}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="md:col-span-1">
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Kuantitas</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    value={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.value === "" ? "" : parseInt(e.target.value, 10));
                                      handleQuantityChange(index, parseInt(e.target.value, 10));
                                    }}
                                    min="1"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="md:col-span-1">
                          <FormField
                            control={form.control}
                            name={`items.${index}.unit_price`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Harga Satuan</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    value={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.value === "" ? "" : parseFloat(e.target.value));
                                      handleUnitPriceChange(index, parseFloat(e.target.value));
                                    }}
                                    min="0"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="md:col-span-1">
                          <FormItem>
                            <FormLabel>Subtotal</FormLabel>
                            <FormControl>
                              <Input type="number" value={item.subtotal} readOnly className="bg-gray-100" />
                            </FormControl>
                          </FormItem>
                        </div>
                        <div className="md:col-span-1 flex justify-end">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => remove(index)}
                            className="mt-2 md:mt-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        append({ product_id: "", item_name: "", quantity: 1, unit_price: 0, subtotal: 0 });
                        setItemSearchInputs(prev => [...prev, ""]);
                      }}
                      className="w-full"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Tambah Item
                    </Button>

                    <div className="flex justify-end items-center mt-4">
                      <span className="text-lg font-semibold mr-2">Total Jumlah:</span>
                      <span className="text-xl font-bold">
                        Rp {form.watch("total_amount").toLocaleString('id-ID')}
                      </span>
                    </div>
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
                    <FormField
                      control={form.control}
                      name="document_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Dokumen (Opsional)</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="invoice_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status Dokumen Invoice</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih status dokumen invoice" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(InvoiceDocumentStatus).map((status) => (
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
                  </TabsContent>
                </Tabs>
                <DialogFooter>
                  <Button type="submit" className="w-full" disabled={updateInvoiceMutation.isPending}>
                    {updateInvoiceMutation.isPending ? (
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

export default EditInvoiceForm;