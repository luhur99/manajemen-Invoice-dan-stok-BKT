"use client";

import { useState, useEffect } from "react";
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
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCategory, SchedulingRequestType, PaymentMethod } from "@/types/data"; // Import PaymentMethod enum

const formSchema = z.object({
  type: z.nativeEnum(SchedulingRequestType, { required_error: "Tipe permintaan wajib dipilih." }),
  product_category: z.nativeEnum(ProductCategory, {
    required_error: "Kategori produk wajib dipilih.",
  }),
  full_address: z.string().min(1, "Alamat lengkap wajib diisi."),
  landmark: z.string().optional().nullable(),
  requested_date: z.date({ required_error: "Tanggal permintaan wajib diisi." }),
  requested_time: z.string().optional().nullable(),
  contact_person: z.string().min(1, "Nama kontak wajib diisi."),
  phone_number: z.string().min(1, "Nomor telepon wajib diisi."),
  payment_method: z.nativeEnum(PaymentMethod, { required_error: "Metode pembayaran wajib dipilih." }), // Changed to enum
  notes: z.string().optional().nullable(),
  customer_id: z.string().optional().nullable(),
  customer_name: z.string().optional().nullable(),
  company_name: z.string().optional().nullable(),
  vehicle_details: z.string().optional().nullable(),
});

interface AddEditSchedulingRequestFormProps {
  request?: any; // Use 'any' for now as the type is complex and not fully defined here
  onClose: () => void;
}

export function AddEditSchedulingRequestForm({ request, onClose }: AddEditSchedulingRequestFormProps) {
  const isEdit = !!request;
  const [activeTab, setActiveTab] = useState("basic_info");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: request?.type || SchedulingRequestType.INSTALLATION,
      product_category: request?.product_category || undefined,
      full_address: request?.full_address || "",
      landmark: request?.landmark || null,
      requested_date: request?.requested_date ? new Date(request.requested_date) : new Date(),
      requested_time: request?.requested_time || null,
      contact_person: request?.contact_person || "",
      phone_number: request?.phone_number || "",
      payment_method: request?.payment_method || undefined, // Set to undefined for initial selection
      notes: request?.notes || null,
      customer_id: request?.customer_id || null,
      customer_name: request?.customer_name || null,
      company_name: request?.company_name || null,
      vehicle_details: request?.vehicle_details || null,
    },
  });

  useEffect(() => {
    if (request) {
      form.reset({
        type: request.type,
        product_category: request.product_category,
        full_address: request.full_address,
        landmark: request.landmark || null,
        requested_date: new Date(request.requested_date),
        requested_time: request.requested_time || null,
        contact_person: request.contact_person,
        phone_number: request.phone_number,
        payment_method: request.payment_method || undefined, // Set to undefined for initial selection
        notes: request.notes || null,
        customer_id: request.customer_id || null,
        customer_name: request.customer_name || null,
        company_name: request.company_name || null,
        vehicle_details: request.vehicle_details || null,
      });
    } else {
      form.reset({
        type: SchedulingRequestType.INSTALLATION,
        product_category: undefined,
        full_address: "",
        landmark: null,
        requested_date: new Date(),
        requested_time: null,
        contact_person: "",
        phone_number: "",
        payment_method: undefined, // Set to undefined for initial selection
        notes: null,
        customer_id: null,
        customer_name: null,
        company_name: null,
        vehicle_details: null,
      });
    }
    setActiveTab("basic_info"); // Reset to first tab on open/edit
  }, [request, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      toast.error("Anda harus login untuk membuat atau memperbarui permintaan jadwal.");
      return;
    }

    const payload = {
      ...values,
      user_id: user.data.user.id,
      requested_date: format(values.requested_date, "yyyy-MM-dd"),
      // Ensure nullable fields are explicitly null if empty string
      landmark: values.landmark || null,
      requested_time: values.requested_time || null,
      notes: values.notes || null,
      customer_id: values.customer_id || null,
      customer_name: values.customer_name || null,
      company_name: values.company_name || null,
      vehicle_details: values.vehicle_details || null,
    };

    if (isEdit) {
      const { error } = await supabase
        .from("scheduling_requests")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", request.id);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Permintaan jadwal berhasil diperbarui!");
        onClose();
        window.location.reload();
      }
    } else {
      const { error } = await supabase
        .from("scheduling_requests")
        .insert(payload);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Permintaan jadwal berhasil dibuat!");
        onClose();
        window.location.reload();
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic_info">Informasi Dasar</TabsTrigger>
            <TabsTrigger value="customer_details">Detail Pelanggan</TabsTrigger>
            <TabsTrigger value="additional_details">Detail Tambahan</TabsTrigger>
          </TabsList>

          <TabsContent value="basic_info" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Permintaan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe permintaan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(SchedulingRequestType).map((type) => (
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
              name="product_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Produk</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori produk" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ProductCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
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
              name="requested_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Permintaan</FormLabel>
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
                        disabled={(date) => date < new Date("1900-01-01")}
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
              name="requested_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Waktu Permintaan (Opsional)</FormLabel>
                  <FormControl>
                    <Input type="time" placeholder="e.g., 09:00 - 17:00" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="customer_details" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pelanggan</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama pelanggan" {...field} value={field.value || ""} />
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
                    <Input placeholder="Masukkan nama perusahaan" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kontak Person</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama kontak person" {...field} value={field.value || ""} />
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
                  <FormLabel>Nomor Telepon</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nomor telepon" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="full_address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Alamat Lengkap</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Masukkan alamat lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="landmark"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Landmark (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan landmark terdekat" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="additional_details" className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="vehicle_details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detail Kendaraan (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan detail kendaraan" {...field} value={field.value || ""} />
                  </FormControl>
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
                      {Object.values(PaymentMethod).map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
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
              name="notes"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Catatan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tambahkan catatan di sini" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEdit ? "Perbarui Permintaan" : "Buat Permintaan")}
        </Button>
      </form>
    </Form>
  );
}