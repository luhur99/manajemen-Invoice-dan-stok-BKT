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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Schedule, InvoiceItem, Product, Invoice } from "@/types/data"; // Changed from StockItem

// Schema validasi menggunakan Zod
const formSchema = z.object({
  schedule_date: z.date({ required_error: "Tanggal Jadwal wajib diisi" }),
  schedule_time: z.string().optional(),
  type: z.enum(["instalasi", "kirim"], {
    required_error: "Tipe jadwal wajib dipilih",
  }),
  customer_name: z.string().min(1, "Nama Konsumen wajib diisi"),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  technician_name: z.enum(["Jubed", "Daffa", "Teknisi Lain"]).optional(), // Updated to enum
  invoice_id: z.string().uuid("ID Invoice harus format UUID yang valid").optional().or(z.literal("")),
  status: z.enum(["scheduled", "in progress", "completed", "cancelled"], {
    required_error: "Status jadwal wajib dipilih",
  }).default("scheduled"),
  notes: z.string().optional(),
  courier_service: z.string().optional(),
  document_url: z.string().optional(), // New field
});

interface EditScheduleFormProps {
  schedule: Schedule;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditScheduleForm: React.FC<EditScheduleFormProps> = ({ schedule, isOpen, onOpenChange, onSuccess }) => {
  const [invoicesList, setInvoicesList] = useState<Invoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schedule_date: new Date(schedule.schedule_date),
      schedule_time: schedule.schedule_time || "",
      type: schedule.type,
      customer_name: schedule.customer_name,
      phone_number: schedule.phone_number || "",
      address: schedule.address || "",
      technician_name: (schedule.technician_name as "Jubed" | "Daffa" | "Teknisi Lain") || undefined, // Cast to enum type
      invoice_id: schedule.invoice_id || "",
      status: schedule.status,
      notes: schedule.notes || "",
      courier_service: schedule.courier_service || "",
      document_url: schedule.document_url || "",
    },
  });

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoadingInvoices(true);
      const { data, error } = await supabase
        .from("invoices")
        .select("id, invoice_number")
        .order("invoice_number", { ascending: true });

      if (error) {
        showError("Gagal memuat daftar invoice.");
        console.error("Error fetching invoices:", error);
      } else {
        setInvoicesList(data as Invoice[]);
      }
      setLoadingInvoices(false);
    };

    fetchInvoices();
  }, []);

  // Watch for status changes
  const currentStatus = form.watch("status");
  const previousStatus = schedule.status; // Get the status before editing

  // Reset form with new schedule data when the dialog opens or schedule prop changes
  useEffect(() => {
    if (isOpen && schedule) {
      form.reset({
        schedule_date: new Date(schedule.schedule_date),
        schedule_time: schedule.schedule_time || "",
        type: schedule.type,
        customer_name: schedule.customer_name,
        phone_number: schedule.phone_number || "",
        address: schedule.address || "",
        technician_name: (schedule.technician_name as "Jubed" | "Daffa" | "Teknisi Lain") || undefined,
        invoice_id: schedule.invoice_id || "",
        status: schedule.status,
        notes: schedule.notes || "",
        courier_service: schedule.courier_service || "",
        document_url: schedule.document_url || "",
      });
    }
  }, [isOpen, schedule, form]);

  const scheduleType = form.watch("type"); // Watch the type field for conditional rendering

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    try {
      // Update schedule
      const { error: scheduleUpdateError } = await supabase
        .from("schedules")
        .update({
          user_id: userId,
          schedule_date: format(values.schedule_date, "yyyy-MM-dd"),
          schedule_time: values.schedule_time || null,
          type: values.type,
          customer_name: values.customer_name,
          phone_number: values.phone_number || null,
          address: values.address || null,
          technician_name: values.technician_name || null,
          invoice_id: values.invoice_id || null,
          status: values.status,
          notes: values.notes || null,
          courier_service: values.courier_service || null,
          document_url: values.document_url || null, // Save new field
        })
        .eq("id", schedule.id);

      if (scheduleUpdateError) {
        throw scheduleUpdateError;
      }

      // Logic for stock deduction when status changes to 'completed'
      if (values.status === 'completed' && previousStatus !== 'completed' && values.invoice_id) {
        let relatedInvoiceNumber: string | null = null;
        if (values.invoice_id) {
          const { data: invoiceData, error: invoiceNumError } = await supabase
            .from("invoices")
            .select("invoice_number")
            .eq("id", values.invoice_id)
            .single();

          if (invoiceNumError) {
            console.error("Error fetching invoice number for stock deduction notes:", invoiceNumError);
            // Proceed with UUID if invoice number can't be fetched
          } else if (invoiceData) {
            relatedInvoiceNumber = invoiceData.invoice_number;
          }
        }

        const { data: invoiceItems, error: itemsError } = await supabase
          .from("invoice_items")
          .select("*")
          .eq("invoice_id", values.invoice_id);

        if (itemsError) {
          console.error("Error fetching invoice items for stock deduction:", itemsError);
          showError("Gagal mengambil item invoice untuk pengurangan stok.");
          // Continue with schedule update, but stock deduction failed
        } else if (invoiceItems && invoiceItems.length > 0) {
          for (const item of invoiceItems as InvoiceItem[]) {
            // Use product_id from invoice_item to find the product
            const { data: productData, error: productItemError } = await supabase // Changed from stockItemData, stockItemError
              .from("products") // Changed from stock_items
              .select("id, nama_barang")
              .eq("id", item.product_id) // Use product_id
              .single();

            if (productItemError) { // Changed from stockItemError
              console.warn(`Product for "${item.item_name}" not found or error:`, productItemError); // Changed message
              showError(`Produk "${item.item_name}" tidak ditemukan atau gagal diperbarui.`); // Changed message
              continue; // Skip to next invoice item
            }

            if (productData) { // Changed from stockItemData
              // Fetch current inventory for 'siap_jual' category
              const { data: currentInventory, error: inventoryFetchError } = await supabase
                .from("warehouse_inventories")
                .select("quantity")
                .eq("product_id", productData.id) // Changed from stockItemData.id
                .eq("warehouse_category", "siap_jual")
                .single();

              const currentQuantity = currentInventory ? currentInventory.quantity : 0;
              const newQuantityInInventory = currentQuantity - item.quantity;

              if (newQuantityInInventory < 0) {
                showError(`Stok akhir untuk "${item.item_name}" akan menjadi negatif di kategori 'Siap Jual'. Pengurangan dibatalkan.`);
                continue;
              }

              // Update warehouse inventory
              const { error: updateInventoryError } = await supabase
                .from("warehouse_inventories")
                .upsert(
                  {
                    product_id: productData.id, // Changed from stockItemData.id
                    warehouse_category: "siap_jual",
                    quantity: newQuantityInInventory,
                    user_id: userId,
                    updated_at: new Date().toISOString(),
                  },
                  { onConflict: "product_id, warehouse_category" }
                );

              if (updateInventoryError) {
                console.error(`Error updating inventory for "${item.item_name}":`, updateInventoryError);
                showError(`Gagal memperbarui inventaris untuk "${item.item_name}".`);
                continue;
              }

              // Record stock transaction
              const { error: transactionError } = await supabase
                .from("stock_transactions")
                .insert({
                  user_id: userId,
                  product_id: productData.id, // Changed from stock_item_id
                  transaction_type: "out",
                  quantity: item.quantity,
                  notes: `Pengurangan stok untuk jadwal ${values.type} (Invoice: ${relatedInvoiceNumber || values.invoice_id})`, // Use relatedInvoiceNumber
                  warehouse_category: "siap_jual", // Transaction happened in 'siap_jual'
                });

              if (transactionError) {
                console.error(`Error recording stock transaction for "${item.item_name}":`, transactionError);
                showError(`Gagal mencatat transaksi stok untuk "${item.item_name}".`);
                continue;
              }
            }
          }
          showSuccess("Stok produk terkait berhasil diperbarui."); // Changed message
        }
      }

      showSuccess("Jadwal berhasil diperbarui!");
      onOpenChange(false);
      onSuccess(); // Trigger refresh of schedule data
    } catch (error: any) {
      showError(`Gagal memperbarui jadwal: ${error.message}`);
      console.error("Error updating schedule:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Jadwal</DialogTitle>
          <DialogDescription>Perbarui detail untuk jadwal {schedule.customer_name} pada {format(new Date(schedule.schedule_date), "dd-MM-yyyy")}.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="schedule_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Jadwal</FormLabel>
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
                name="schedule_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waktu Jadwal (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 09:00, 14:30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe Jadwal</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe jadwal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="instalasi">Instalasi</SelectItem>
                        <SelectItem value="kirim">Kirim Barang</SelectItem>
                      </SelectContent>
                    </Select>
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
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No WA Konsumen (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 081234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {scheduleType === "kirim" && (
                <FormField
                  control={form.control}
                  name="courier_service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jasa Kurir (Opsional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., JNE, SiCepat, GoSend" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Alamat lengkap untuk instalasi/pengiriman" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="technician_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Teknisi (Opsional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih teknisi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Jubed">Jubed</SelectItem>
                        <SelectItem value="Daffa">Daffa</SelectItem>
                        <SelectItem value="Teknisi Lain">Teknisi Lain</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="invoice_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Invoice Terkait (Opsional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger disabled={loadingInvoices}>
                          <SelectValue placeholder={loadingInvoices ? "Memuat invoices..." : "Pilih nomor invoice"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {invoicesList.map((invoice) => (
                          <SelectItem key={invoice.id} value={invoice.id}>
                            {invoice.invoice_number}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Jadwal</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status jadwal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scheduled">Terjadwal</SelectItem>
                        <SelectItem value="in progress">Dalam Proses</SelectItem>
                        <SelectItem value="completed">Selesai</SelectItem>
                        <SelectItem value="cancelled">Dibatalkan</SelectItem>
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
                  <FormItem>
                    <FormLabel>Catatan (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tambahkan catatan di sini..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full mt-6" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditScheduleForm;