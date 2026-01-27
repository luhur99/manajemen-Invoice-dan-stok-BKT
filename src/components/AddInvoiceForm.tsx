"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { PlusCircle, Trash2, Loader2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import {
  Product,
  InvoicePaymentStatus,
  InvoiceType,
  CustomerTypeEnum,
  ScheduleWithDetails,
  InvoiceDocumentStatus,
  ScheduleType,
} from "@/types/data";
import StockItemCombobox from "@/components/StockItemCombobox";
import { useSession } from "@/components/SessionContextProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

const formSchema = z.object({
  invoice_number: z.string().optional(),
  invoice_date: z.date({ required_error: "Tanggal Invoice harus diisi." }),
  due_date: z.date().optional(),
  customer_name: z.string().min(1, "Nama Pelanggan harus diisi."),
  company_name: z.string().optional().nullable(),
  total_amount: z.number().min(0, "Total Jumlah tidak boleh negatif."),
  payment_status: z.nativeEnum(InvoicePaymentStatus, { required_error: "Status Pembayaran wajib diisi" }),
  type: z.nativeEnum(InvoiceType).optional().nullable(),
  customer_type: z.nativeEnum(CustomerTypeEnum).optional().nullable(),
  payment_method: z.string().optional().nullable(), // Tetap string karena dropdown akan menghasilkan string
  notes: z.string().optional().nullable(),
  document_url: z.string().optional().nullable(),
  courier_service: z.string().optional().nullable(),
  invoice_status: z.nativeEnum(InvoiceDocumentStatus, { required_error: "Status Invoice wajib diisi" }),
  do_number: z.string().optional(),
  items: z.array(
    z.object({
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

interface AddInvoiceFormProps {
  onSuccess: () => void;
  initialSchedule?: ScheduleWithDetails | null;
  completedSchedules: { id: string; do_number: string | null; customer_name: string | null; schedule_date: string; status: string; type: ScheduleType; phone_number: string | null; courier_service: string | null; customer_id: string | null; customers: { company_name: string | null; customer_type: CustomerTypeEnum | null } | null }[];
  isLoadingSchedules: boolean;
  schedulesError: Error | null;
}

const AddInvoiceForm: React.FC<AddInvoiceFormProps> = ({
  onSuccess,
  initialSchedule,
  completedSchedules,
  isLoadingSchedules,
  schedulesError,
}) => {
  const queryClient = useQueryClient();
  const { session } = useSession();

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
      do_number: initialSchedule?.do_number || "",
      payment_method: "", // Default value for payment method
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

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
    enabled: true, // Always enabled as it's a core dependency
  });

  const watchedInvoiceType = form.watch("type");

  useEffect(() => {
    // Reset form when initialSchedule changes or component mounts
    form.reset({
      invoice_date: new Date(),
      due_date: undefined,
      customer_name: initialSchedule?.customer_name || "",
      company_name: initialSchedule?.customers?.company_name || null,
      total_amount: 0,
      payment_status: InvoicePaymentStatus.PENDING,
      type: initialSchedule?.type === ScheduleType.KIRIM ? InvoiceType.KIRIM_BARANG : InvoiceType.INSTALASI,
      customer_type: initialSchedule?.customers?.customer_type || null,
      payment_method: initialSchedule?.payment_method || null,
      notes: initialSchedule?.do_number ? `DO Number: ${initialSchedule.do_number}` : null,
      courier_service: initialSchedule?.courier_service || null,
      invoice_status: InvoiceDocumentStatus.WAITING_DOCUMENT_INV,
      items: [{ product_id: "", item_name: "", quantity: 1, unit_price: 0, subtotal: 0 }],
      do_number: initialSchedule?.do_number || "",
    });
    setItemSearchInputs([""]);
    form.clearErrors();
    setActiveTab("basic_info");
  }, [initialSchedule, form]);


  React.useEffect(() => {
    const doNumber = form.watch("do_number");
    if (doNumber && completedSchedules) {
      const selectedSchedule = completedSchedules.find(
        (schedule) => schedule.do_number === doNumber
      );

      if (selectedSchedule) {
        console.log("Selected schedule for prepopulation:", selectedSchedule);
        form.setValue("customer_name", selectedSchedule.customer_name || "");
        form.setValue("invoice_date", new Date(selectedSchedule.schedule_date));
        form.setValue("company_name", (selectedSchedule.customers as any)?.company_name || null);
        
        let invoiceType: InvoiceType | null = null;
        if (selectedSchedule.type === ScheduleType.KIRIM) {
          invoiceType = InvoiceType.KIRIM_BARANG;
        } else if (selectedSchedule.type === ScheduleType.INSTALASI) {
          invoiceType = InvoiceType.INSTALASI;
        } else if (selectedSchedule.type === ScheduleType.SERVICE) {
          invoiceType = InvoiceType.SERVICE;
        }
        form.setValue("type", invoiceType);

        form.setValue("customer_type", (selectedSchedule.customers as any)?.customer_type || null);
        form.setValue("courier_service", selectedSchedule.courier_service || null);
      }
    }
  }, [form.watch("do_number"), completedSchedules, form]);

  useEffect(() => {
    const currentItemNames = fields.map(item => item.item_name || "");
    if (JSON.stringify(itemSearchInputs) !== JSON.stringify(currentItemNames)) {
      setItemSearchInputs(currentItemNames);
    }
  }, [fields, itemSearchInputs]);

  const calculateTotalAmount = useCallback(() => {
    const total = fields.reduce((sum, item) => sum + item.subtotal, 0);
    form.setValue("total_amount", total);
  }, [fields, form]);

  useEffect(() => {
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

  const createInvoiceMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!session?.user?.id) {
        throw new Error("Anda harus login untuk membuat invoice.");
      }

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
      showSuccess("Invoice berhasil dibuat!");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      if (initialSchedule?.id) {
        queryClient.invalidateQueries({ queryKey: ["schedules"] });
      }
      onSuccess(); // Call parent's onSuccess
    },
    onError: (error: any) => {
      showError(`Gagal membuat invoice: ${error.message || "Unknown error"}`);
      console.error("Error creating invoice:", error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createInvoiceMutation.mutate(values);
  };

  if (loadingProducts) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic_info">Informasi Dasar</TabsTrigger>
            <TabsTrigger value="items">Item Invoice</TabsTrigger>
            <TabsTrigger value="notes">Catatan</TabsTrigger>
          </TabsList>

          <TabsContent value="basic_info" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="do_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor DO Selesai (Opsional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih nomor DO yang sudah selesai" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingSchedules ? (
                        <SelectItem value="loading" disabled>Memuat DO...</SelectItem>
                      ) : schedulesError ? (
                        <SelectItem value="error" disabled>Error memuat data</SelectItem>
                      ) : !completedSchedules || completedSchedules.length === 0 ? (
                        <SelectItem value="no-dos" disabled>Tidak ada DO yang selesai</SelectItem>
                      ) : (
                        completedSchedules.map((schedule) => (
                          <SelectItem key={schedule.id} value={schedule.do_number || ""}>
                            {schedule.do_number} - {schedule.customer_name} ({format(new Date(schedule.schedule_date), "dd/MM/yyyy")})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Pilih DO yang sudah selesai untuk mengisi beberapa detail secara otomatis.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="invoice_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Invoice (Otomatis)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Akan dibuat otomatis" disabled />
                  </FormControl>
                  <FormDescription>Nomor invoice akan dibuat secara otomatis setelah disimpan.</FormDescription>
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
              name="total_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Jumlah</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} readOnly className="bg-gray-100" />
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
                      {Object.values(InvoicePaymentStatus).map((status: InvoicePaymentStatus) => (
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
                                {...field}
                                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10))}
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
                                {...field}
                                onChange={(e) => handleUnitPriceChange(index, parseFloat(e.target.value))}
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
                          <Input type="number" value={fields[index].subtotal} readOnly className="bg-gray-100" />
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
            <Button type="submit" className="w-full" disabled={createInvoiceMutation.isPending}>
              {createInvoiceMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Buat Invoice"
              )}
            </Button>
          </form>
        </Form>
  );
};

export default AddInvoiceForm;