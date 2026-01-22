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
  InvoicePaymentStatus,
  InvoiceType,
  CustomerTypeEnum,
  WarehouseInventory,
  ScheduleWithDetails,
  InvoiceDocumentStatus,
} from "@/types/data";
import StockItemCombobox from "./StockItemCombobox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/components/SessionContextProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  invoice_date: z.date({ required_error: "Tanggal Invoice harus diisi." }),
  due_date: z.date().optional(),
  customer_name: z.string().min(1, "Nama Pelanggan harus diisi."),
  company_name: z.string().optional(),
  total_amount: z.number().min(0, "Total Jumlah tidak boleh negatif."),
  payment_status: z.nativeEnum(InvoicePaymentStatus),
  type: z.nativeEnum(InvoiceType).optional(),
  customer_type: z.nativeEnum(CustomerTypeEnum).optional(),
  payment_method: z.string().optional(),
  notes: z.string().optional(),
  courier_service: z.string().optional(),
  invoice_status: z.nativeEnum(InvoiceDocumentStatus).default(InvoiceDocumentStatus.WAITING_DOCUMENT_INV),
  items: z.array(
    z.object({
      product_id: z.string().min(1, "Produk harus dipilih."),
      item_name: z.string().min(1, "Nama Item harus diisi."),
      item_code: z.string().optional(),
      quantity: z.number().int().positive("Kuantitas harus lebih dari 0."),
      unit_price: z.number().min(0, "Harga Satuan tidak boleh negatif."),
      subtotal: z.number().min(0, "Subtotal tidak boleh negatif."),
      unit_type: z.string().optional(),
    })
  ).min(1, "Setidaknya satu item harus ditambahkan."),
});

interface AddInvoiceFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialSchedule?: ScheduleWithDetails | null;
}

const AddInvoiceForm: React.FC<AddInvoiceFormProps> = ({ isOpen, onOpenChange, onSuccess, initialSchedule }) => {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("basic_info");
  const [itemSearchInputs, setItemSearchInputs] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoice_date: new Date(),
      customer_name: "",
      total_amount: 0,
      payment_status: InvoicePaymentStatus.PENDING,
      invoice_status: InvoiceDocumentStatus.WAITING_DOCUMENT_INV,
      items: [{ product_id: "", item_name: "", quantity: 1, unit_price: 0, subtotal: 0 }],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const { data: products, isLoading: loadingProducts } = useQuery<Product[], Error>({
    queryKey: ["products"],
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
          warehouse_inventories (
            warehouse_category,
            quantity
          )
        `);

      if (error) {
        showError("Gagal memuat daftar produk.");
        throw error;
      }
      return data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        created_at: item.created_at,
        kode_barang: item.kode_barang,
        nama_barang: item.nama_barang,
        harga_jual: item.harga_jual,
        harga_beli: item.harga_beli,
        satuan: item.satuan,
        safe_stock_limit: item.safe_stock_limit,
        supplier_id: item.supplier_id,
        inventories: item.warehouse_inventories as WarehouseInventory[],
      }));
    },
    enabled: isOpen,
  });

  const watchedInvoiceType = form.watch("type");

  React.useEffect(() => {
    if (isOpen) {
      let defaultNotes = "";
      if (initialSchedule?.do_number) {
        defaultNotes = `DO Number: ${initialSchedule.do_number}`;
      }

      form.reset({
        invoice_date: new Date(),
        due_date: undefined,
        customer_name: initialSchedule?.customer_name || "",
        company_name: undefined,
        total_amount: 0,
        payment_status: InvoicePaymentStatus.PENDING,
        type: initialSchedule?.type === "kirim" ? InvoiceType.KIRIM_BARANG : InvoiceType.INSTALASI,
        customer_type: initialSchedule?.customers?.customer_type || undefined,
        payment_method: initialSchedule?.payment_method || undefined,
        notes: defaultNotes,
        courier_service: initialSchedule?.courier_service || undefined,
        invoice_status: InvoiceDocumentStatus.WAITING_DOCUMENT_INV,
        items: [{ product_id: "", item_name: "", quantity: 1, unit_price: 0, subtotal: 0 }],
      });
      setItemSearchInputs(fields.map(item => item.item_name || ""));
      setActiveTab("basic_info");
    }
  }, [isOpen, initialSchedule, form, fields]); // Added fields to dependency array

  // Update itemSearchInputs when fields change (e.g., adding/removing items)
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
        subtotal: selectedProduct.harga_jual * fields[index].quantity,
      });
      setItemSearchInputs(prev => {
        const newInputs = [...prev];
        newInputs[index] = selectedProduct.nama_barang;
        return newInputs;
      });
    } else {
      update(index, {
        ...fields[index],
        product_id: "", // Set to empty string for consistency with defaultValues
        item_name: "",
        item_code: "",
        unit_price: 0,
        unit_type: "",
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

  const addInvoiceMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { data, error } = await supabase.functions.invoke('create-invoice', {
        body: JSON.stringify({
          invoice_date: format(values.invoice_date, "yyyy-MM-dd"),
          due_date: values.due_date ? format(values.due_date, "yyyy-MM-dd") : null,
          customer_name: values.customer_name,
          company_name: values.company_name,
          total_amount: values.total_amount,
          payment_status: values.payment_status,
          type: values.type,
          customer_type: values.customer_type,
          payment_method: values.payment_method,
          notes: values.notes,
          courier_service: values.type === InvoiceType.KIRIM_BARANG ? values.courier_service : null,
          invoice_status: values.invoice_status,
          items: values.items,
        }),
      });

      if (error) throw error;
      if (data && data.error) throw new Error(data.error);

      return data;
    },
    onSuccess: () => {
      showSuccess("Invoice berhasil ditambahkan!");
      onSuccess();
      onOpenChange(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (err: any) => {
      showError(`Gagal menambahkan invoice: ${err.message}`);
      console.error("Error adding invoice:", err);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addInvoiceMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Invoice Baru</DialogTitle>
          <DialogDescription>
            Isi detail invoice baru di sini. Nomor Invoice akan dibuat otomatis.
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tipe invoice" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(InvoiceType).map((type) => (
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
                  name="customer_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipe Pelanggan (Opsional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {watchedInvoiceType === InvoiceType.KIRIM_BARANG && (
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
                )}
              </TabsContent>

              <TabsContent value="items" className="mt-4 space-y-4">
                {fields.map((item, index) => (
                  <div key={item.id || index} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end border p-3 rounded-md relative">
                    <div className="md:col-span-2">
                      <FormItem>
                        <FormLabel>Produk</FormLabel>
                        <StockItemCombobox
                          products={products || []}
                          selectedProductId={item.product_id || undefined}
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
                        />
                        <FormMessage />
                      </FormItem>
                    </div>
                    <div className="md:col-span-1">
                      <FormItem>
                        <FormLabel>Kuantitas</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10))}
                            min="1"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </div>
                    <div className="md:col-span-1">
                      <FormItem>
                        <FormLabel>Harga Satuan</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={item.unit_price}
                            onChange={(e) => handleUnitPriceChange(index, parseFloat(e.target.value))}
                            min="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
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
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button type="submit" disabled={addInvoiceMutation.isPending}>
                {addInvoiceMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Simpan Invoice"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInvoiceForm;