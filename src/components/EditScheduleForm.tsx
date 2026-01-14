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
import { Schedule, InvoiceItem, Product, Invoice, DeliveryOrder } from "@/types/data"; // Import DeliveryOrder

// Helper function for display (moved outside component)
const getRequestTypeDisplay = (type?: 'instalasi' | 'service' | 'kirim') => {
  switch (type) {
    case 'instalasi': return 'Instalasi';
    case 'service': return 'Servis';
    case 'kirim': return 'Kirim Barang';
    default: return '-';
  }
};

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
  technician_name: z.enum(["Jubed", "Daffa", "Teknisi Lain"]).optional(),
  invoice_id: z.string().uuid("ID Invoice harus format UUID yang valid").optional().or(z.literal("")),
  delivery_order_id: z.string().uuid("ID Delivery Order harus format UUID yang valid").optional().or(z.literal("")), // New field
  status: z.enum(["scheduled", "in progress", "completed", "cancelled"], {
    required_error: "Status jadwal wajib dipilih",
  }).default("scheduled"),
  notes: z.string().optional(),
  courier_service: z.string().optional(),
  document_url: z.string().optional(),
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
  const [deliveryOrdersList, setDeliveryOrdersList] = useState<DeliveryOrder[]>([]); // New state for DOs
  const [loadingDeliveryOrders, setLoadingDeliveryOrders] = useState(true); // New state for DO loading

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schedule_date: new Date(schedule.schedule_date),
      schedule_time: schedule.schedule_time || "",
      type: schedule.type,
      customer_name: schedule.customer_name,
      phone_number: schedule.phone_number || "",
      address: schedule.address || "",
      technician_name: (schedule.technician_name as "Jubed" | "Daffa" | "Teknisi Lain") || undefined,
      invoice_id: schedule.invoice_id || "",
      delivery_order_id: schedule.delivery_order_id || "", // Initialize new field
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

    const fetchDeliveryOrders = async () => { // New fetch function for DOs
      setLoadingDeliveryOrders(true);
      const { data, error } = await supabase
        .from("delivery_orders")
        .select(`
          *,
          scheduling_requests (customer_name, type, full_address, phone_number)
        `)
        .eq("status", "pending") // Only show pending DOs that can be scheduled
        .order("do_number", { ascending: true });

      if (error) {
        showError("Gagal memuat daftar Delivery Order.");
        console.error("Error fetching delivery orders:", error);
      } else {
        // Corrected type assertion: Supabase join returns an array for scheduling_requests
        setDeliveryOrdersList(data.map(item => ({
          ...item,
          scheduling_requests: item.scheduling_requests ? [item.scheduling_requests] : null // Ensure it's an array or null
        })) as DeliveryOrder[]);
      }
      setLoadingDeliveryOrders(false);
    };

    fetchInvoices();
    fetchDeliveryOrders();
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
        delivery_order_id: schedule.delivery_order_id || "", // Reset new field
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
          delivery_order_id: values.delivery_order_id || null, // Save new field
          status: values.status,
          notes: values.notes || null,
          courier_service: values.courier_service || null,
          document_url: values.document_url || null,
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
          .select("product_id, quantity, item_name") // Select product_id
          .eq("invoice_id", values.invoice_id);

        if (itemsError) {
          console.error("Error fetching invoice items for stock deduction:", itemsError);
          showError("Gagal mengambil item invoice untuk pengurangan stok.");
          // Continue with schedule update, but stock deduction failed
        } else if (invoiceItems && invoiceItems.length > 0) {
          for (const item of invoiceItems as InvoiceItem[]) {
            if (!item.product_id) {
              console.warn(`Invoice item "${item.item_name}" has no product_id. Skipping stock deduction.`);
              continue;
            }

            // Fetch the warehouse_inventory for 'siap_jual' category for this product
            const { data: warehouseInventory, error: inventoryError } = await supabase
              .from("warehouse_inventories")
              .select("id, quantity")
              .eq("product_id", item.product_id)
              .eq("warehouse_category", "siap_jual") // Assuming sales deduct from 'siap_jual'
              .single();

            if (inventoryError && inventoryError.code !== 'PGRST116') { // PGRST116 means no rows found
              console.error(`Error fetching warehouse inventory for product ${item.product_id}:`, inventoryError);
              showError(`Gagal memuat inventaris gudang untuk item "${item.item_name}".`);
              continue;
            }

            if (!warehouseInventory || warehouseInventory.quantity < item.quantity) {
              showError(`Stok tidak mencukupi di gudang 'Siap Jual' untuk "${item.item_name}". Tersedia: ${warehouseInventory?.quantity || 0}, Diminta: ${item.quantity}`);
              continue;
            }

            // Update warehouse_inventories: decrease quantity
            const newQuantity = warehouseInventory.quantity - item.quantity;
            const { error: updateInventoryError } = await supabase
              .from("warehouse_inventories")
              .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
              .eq("id", warehouseInventory.id);

            if (updateInventoryError) {
              console.error(`Error updating warehouse inventory for "${item.item_name}":`, updateInventoryError);
              showError(`Gagal memperbarui inventaris gudang untuk "${item.item_name}".`);
              continue;
            }

            // Record stock transaction
            const { error: transactionError } = await supabase
              .from("stock_transactions")
              .insert({
                user_id: userId,
                product_id: item.product_id, // Use product_id
                transaction_type: "out",
                quantity: item.quantity,
                notes: `Pengurangan stok untuk jadwal ${values.type} (Invoice: ${relatedInvoiceNumber || values.invoice_id})`, // Use relatedInvoiceNumber
                warehouse_category: "siap_jual", // Record the category affected
              });

            if (transactionError) {
              console.error(`Error recording stock transaction for "${item.item_name}":`, transactionError);
              showError(`Gagal mencatat transaksi stok untuk "${item.item_name}".`);
              continue;
            }
          }
          showSuccess("Stok barang terkait berhasil diperbarui.");
        }
      }

      // If schedule status changes to 'completed', update related Delivery Order status to 'completed'
      if (values.status === 'completed' && previousStatus !== 'completed' && values.delivery_order_id) {
        const { error: updateDoStatusError } = await supabase
          .from("delivery_orders")
          .update({ status: "completed" })
          .eq("id", values.delivery_order_id);

        if (updateDoStatusError) {
          console.error("Error updating related Delivery Order status to completed:", updateDoStatusError);
          showError("Gagal memperbarui status Delivery Order terkait menjadi 'completed'.");
        }
      }
      // If schedule status changes to 'cancelled', update related Delivery Order status to 'cancelled'
      else if (values.status === 'cancelled' && previousStatus !== 'cancelled' && values.delivery_order_id) {
        const { error: updateDoStatusError } = await supabase
          .from("delivery_orders")
          .update({ status: "cancelled" })
          .eq("id", values.delivery_order_id);

        if (updateDoStatusError) {
          console.error("Error updating related Delivery Order status to cancelled:", updateDoStatusError);
          showError("Gagal memperbarui status Delivery Order terkait menjadi 'cancelled'.");
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
                name="delivery_order_id"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Delivery Order Terkait (Opsional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""} disabled={true}> {/* Disabled in edit form */}
                      <FormControl>
                        <SelectTrigger disabled={loadingDeliveryOrders}>
                          <SelectValue placeholder={loadingDeliveryOrders ? "Memuat Delivery Order..." : "Pilih Delivery Order"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {deliveryOrdersList.map((doItem) => (
                          <SelectItem key={doItem.id} value={doItem.id}>
                            {doItem.do_number} - {doItem.scheduling_requests?.[0]?.customer_name} ({getRequestTypeDisplay(doItem.scheduling_requests?.[0]?.type)})
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