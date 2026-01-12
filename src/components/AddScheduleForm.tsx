"use client";

import React, { useEffect, useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Invoice } from "@/types/data"; // Import Invoice type

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
  document_url: z.string().optional(),
});

interface AddScheduleFormProps {
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void; // New prop to control parent dialog
  initialData?: Partial<z.infer<typeof formSchema>>; // New prop for initial data
}

const AddScheduleForm: React.FC<AddScheduleFormProps> = ({ onSuccess, onOpenChange, initialData }) => {
  const [invoicesList, setInvoicesList] = useState<Invoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schedule_date: initialData?.schedule_date ? new Date(initialData.schedule_date) : new Date(),
      schedule_time: initialData?.schedule_time || "",
      type: initialData?.type || undefined,
      customer_name: initialData?.customer_name || "",
      phone_number: initialData?.phone_number || "",
      address: initialData?.address || "",
      technician_name: (initialData?.technician_name as "Jubed" | "Daffa" | "Teknisi Lain") || undefined, // Cast to enum type
      invoice_id: initialData?.invoice_id || "",
      status: initialData?.status || "scheduled",
      notes: initialData?.notes || "",
      courier_service: initialData?.courier_service || "",
      document_url: initialData?.document_url || "",
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

  useEffect(() => {
    form.reset({
      schedule_date: initialData?.schedule_date ? new Date(initialData.schedule_date) : new Date(),
      schedule_time: initialData?.schedule_time || "",
      type: initialData?.type || undefined,
      customer_name: initialData?.customer_name || "",
      phone_number: initialData?.phone_number || "",
      address: initialData?.address || "",
      technician_name: (initialData?.technician_name as "Jubed" | "Daffa" | "Teknisi Lain") || undefined,
      invoice_id: initialData?.invoice_id || "",
      status: initialData?.status || "scheduled",
      notes: initialData?.notes || "",
      courier_service: initialData?.courier_service || "",
      document_url: initialData?.document_url || "",
    });
  }, [form, initialData]);

  const scheduleType = form.watch("type");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("schedules")
        .insert({
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
          document_url: values.document_url || null,
        })
        .select();

      if (error) {
        throw error;
      }

      showSuccess("Jadwal berhasil ditambahkan!");
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      showError(`Gagal menambahkan jadwal: ${error.message}`);
      console.error("Error adding schedule:", error);
    }
  };

  return (
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
            "Simpan Jadwal"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AddScheduleForm;