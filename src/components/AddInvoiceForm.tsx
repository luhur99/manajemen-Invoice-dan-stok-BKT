"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2, PlusCircle, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { StockItem } from "@/types/data"; // Import StockItem type
import StockItemCombobox from "@/components/StockItemCombobox"; // Import new combobox

// Schema validasi menggunakan Zod
const invoiceItemSchema = z.object({
  item_name: z.string().min(1, "Nama Item wajib diisi"),
  item_code: z.string().optional(), // New field for item code
  quantity: z.coerce.number().min(1, "Kuantitas minimal 1"),
  unit_price: z.coerce.number().min(0, "Harga Satuan tidak boleh negatif"),
  unit_type: z.string().optional(), // New field for unit type
});

const formSchema = z.object({
  invoice_number: z.string().min(1, "Nomor Invoice wajib diisi"),
  invoice_date: z.date({ required_error: "Tanggal Invoice wajib diisi" }),
  due_date: z.date().optional(),
  customer_name: z.string().min(1, "Nama Konsumen wajib diisi"),
  company_name: z.string().optional(),
  payment_status: z.enum(["pending", "paid", "overdue"], {
    required_error: "Status Pembayaran wajib dipilih",
  }),
  type: z.enum(["instalasi", "kirim barang"], {
    required_error: "Tipe wajib dipilih",
  }),
  customer_type: z.enum(["lama", "baru"], {
    required_error: "Tipe Konsumen wajib dipilih",
  }),
  payment_method: z.string().min(1, "Metode Pembayaran wajib diisi"),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "Minimal satu item invoice diperlukan"),
});

interface AddInvoiceFormProps {
  onSuccess: () => void;
}

// Function to generate invoice number
const generateInvoiceNumber = () => {
  const now = new Date();
  const year = format(now, "yy"); // Two-digit year
  const month = format(now, "MM");
  const day = format(now, "dd");
  const hours = format(now, "HH");
  const minutes = format(now, "mm");

  // Format: INV-[YYMMDD][HHMM]
  return `INV-${year}${month}${day}${hours}${minutes}`;
};

const AddInvoiceForm: React.FC<AddInvoiceFormProps> = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loadingStockItems, setLoadingStockItems] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoice_number: generateInvoiceNumber(),
      customer_name: "",
      company_name: "",
      payment_status: "pending",
      type: undefined,
      customer_type: undefined,
      payment_method: "",
      notes: "",
      items: [{ item_name: "", item_code: "", quantity: 1, unit_price: 0, unit_type: "" }],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    const fetchStockItems = async () => {
      setLoadingStockItems(true);
      const { data, error } = await supabase
        .from("stock_items")
        .select("id, kode_barang, nama_barang, harga_jual, satuan");

      if (error) {
        showError("Gagal memuat daftar item stok.");
        console.error("Error fetching stock items:", error);
      } else {
        setStockItems(data.map(item => ({
          id: item.id,
          "KODE BARANG": item.kode_barang,
          "NAMA BARANG": item.nama_barang,
          "HARGA JUAL": item.harga_jual,
          SATUAN: item.satuan || "", // Ensure SATUAN is always a string
          // Default values for other StockItem fields not used here
          NO: 0, "HARGA BELI": 0, "STOCK AWAL": 0, "STOCK MASUK": 0, "STOCK KELUAR": 0, "STOCK AKHIR": 0,
        })) as StockItem[]);
      }
      setLoadingStockItems(false);
    };

    fetchStockItems();
  }, []);

  const totalAmount = useMemo(() => {
    return fields.reduce((sum, item, index) => {
      const quantity = form.watch(`items.${index}.quantity`);
      const unit_price = form.watch(`items.${index}.unit_price`);
      return sum + (quantity || 0) * (unit_price || 0);
    }, 0);
  }, [fields, form.watch]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    try {
      // Insert invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          user_id: userId,
          invoice_number: values.invoice_number,
          invoice_date: format(values.invoice_date, "yyyy-MM-dd"),
          due_date: values.due_date ? format(values.due_date, "yyyy-MM-dd") : null,
          customer_name: values.customer_name,
          company_name: values.company_name,
          total_amount: totalAmount,
          payment_status: values.payment_status,
          type: values.type,
          customer_type: values.customer_type,
          payment_method: values.payment_method,
          notes: values.notes,
        })
        .select("id")
        .single();

      if (invoiceError) {
        throw invoiceError;
      }

      // Insert invoice items
      const itemsToInsert = values.items.map((item) => ({
        invoice_id: invoiceData.id,
        user_id: userId,
        item_name: item.item_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.quantity * item.unit_price,
        unit_type: item.unit_type,
      }));

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(itemsToInsert);

      if (itemsError) {
        throw itemsError;
      }

      showSuccess("Invoice berhasil ditambahkan!");
      form.reset({
        invoice_number: generateInvoiceNumber(),
        customer_name: "",
        company_name: "",
        payment_status: "pending",
        type: undefined,
        customer_type: undefined,
        payment_method: "",
        notes: "",
        items: [{ item_name: "", item_code: "", quantity: 1, unit_price: 0, unit_type: "" }],
      });
      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      showError(`Gagal menambahkan invoice: ${error.message}`);
      console.error("Error adding invoice:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> Buat Invoice Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buat Invoice Baru</DialogTitle>
          <DialogDescription>Isi detail untuk membuat invoice penjualan baru.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                name="customer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Konsumen</FormLabel>
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
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Lunas</SelectItem>
                        <SelectItem value="overdue">Jatuh Tempo</SelectItem>
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
                    <FormLabel>Tipe</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe (Instalasi/Kirim Barang)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="instalasi">Instalasi</SelectItem>
                        <SelectItem value="kirim barang">Kirim Barang</SelectItem>
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
                    <FormLabel>Tipe Konsumen</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe konsumen (Lama/Baru)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lama">Lama</SelectItem>
                        <SelectItem value="baru">Baru</SelectItem>
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
                    <FormLabel>Metode Pembayaran</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih metode pembayaran" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Transfer">Transfer</SelectItem>
                        <SelectItem value="Debit Card">Debit Card</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="QRIS">QRIS</SelectItem>
                        <SelectItem value="Lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
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
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tambahkan catatan di sini..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h3 className="text-lg font-semibold mt-6 mb-2">Detail Item Invoice</h3>
            <div className="space-y-3">
              {fields.map((item, index) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end border p-3 rounded-md">
                  <FormField
                    control={form.control}
                    name={`items.${index}.item_name`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Nama Item</FormLabel>
                        <FormControl>
                          <StockItemCombobox
                            items={stockItems}
                            value={field.value}
                            onValueChange={(selectedStock) => {
                              if (selectedStock) {
                                update(index, {
                                  ...form.getValues().items[index],
                                  item_name: selectedStock["NAMA BARANG"],
                                  item_code: selectedStock["KODE BARANG"],
                                  unit_price: selectedStock["HARGA JUAL"],
                                  unit_type: selectedStock.SATUAN || "", // Ensure unit_type is always a string
                                });
                              } else {
                                update(index, {
                                  ...form.getValues().items[index],
                                  item_name: "",
                                  item_code: "",
                                  unit_price: 0,
                                  unit_type: "",
                                });
                              }
                            }}
                            disabled={loadingStockItems}
                            placeholder={loadingStockItems ? "Memuat item stok..." : "Pilih item..."}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.item_code`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kode Barang</FormLabel>
                        <FormControl>
                          <Input {...field} disabled /> {/* Disabled as it's auto-populated */}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
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
                    name={`items.${index}.unit_price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harga Satuan</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.unit_type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipe Unit</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., PCS, BOX, Bulan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-2 md:col-span-full lg:col-span-1">
                    <p className="text-sm font-medium">Subtotal: {(form.watch(`items.${index}.quantity`) || 0) * (form.watch(`items.${index}.unit_price`) || 0)}</p>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ item_name: "", item_code: "", quantity: 1, unit_price: 0, unit_type: "" })}
              className="w-full flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" /> Tambah Item
            </Button>

            <div className="text-right text-xl font-bold mt-4">
              Total Tagihan: {totalAmount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
            </div>

            <Button type="submit" className="w-full mt-6" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Simpan Invoice"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInvoiceForm;