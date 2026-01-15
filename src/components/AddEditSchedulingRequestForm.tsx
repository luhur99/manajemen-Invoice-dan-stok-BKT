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
import { SchedulingRequest, SchedulingRequestType, SchedulingRequestStatus } from "@/types/data";
import { useSession } from "@/components/SessionContextProvider";

const formSchema = z.object({
  sr_number: z.string().optional(),
  customer_name: z.string().min(1, "Nama pelanggan wajib diisi."),
  company_name: z.string().optional(),
  type: z.nativeEnum(SchedulingRequestType, { required_error: "Tipe permintaan wajib dipilih." }),
  vehicle_units: z.coerce.number().int().min(0, "Jumlah unit kendaraan tidak boleh negatif.").optional(),
  vehicle_type: z.string().optional(),
  vehicle_year: z.coerce.number().int().min(1900, "Tahun kendaraan tidak valid.").optional(),
  full_address: z.string().min(1, "Alamat lengkap wajib diisi."),
  landmark: z.string().optional(),
  requested_date: z.date({ required_error: "Tanggal permintaan wajib diisi." }),
  requested_time: z.string().optional(),
  contact_person: z.string().min(1, "Nama kontak person wajib diisi."),
  phone_number: z.string().min(1, "Nomor telepon wajib diisi."),
  customer_type: z.string().optional(),
  payment_method: z.string().optional(),
  status: z.nativeEnum(SchedulingRequestStatus).default(SchedulingRequestStatus.PENDING),
  notes: z.string().optional(),
});

interface AddEditSchedulingRequestFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData?: SchedulingRequest | null;
}

const generateSrNumber = async (): Promise<string> => {
  const today = format(new Date(), "yyyyMMdd");
  const prefix = `SR-${today}`;

  const { data, error } = await supabase
    .from("scheduling_requests")
    .select("sr_number")
    .like("sr_number", `${prefix}%`)
    .order("sr_number", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error fetching latest SR number:", error);
    return `${prefix}-${Date.now().toString().slice(-4)}`; // Fallback
  }

  let sequence = 1;
  if (data && data.length > 0 && data[0].sr_number) {
    const latestSrNumber = data[0].sr_number;
    const parts = latestSrNumber.split('-');
    const lastPart = parts[parts.length - 1];
    const currentSequence = parseInt(lastPart, 10);
    if (!isNaN(currentSequence)) {
      sequence = currentSequence + 1;
    }
  }
  return `${prefix}-${String(sequence).padStart(4, '0')}`;
};

const AddEditSchedulingRequestForm: React.FC<AddEditSchedulingRequestFormProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
  initialData,
}) => {
  const { session } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sr_number: "",
      customer_name: "",
      company_name: "",
      type: SchedulingRequestType.INSTALLATION,
      vehicle_units: 0,
      vehicle_type: "",
      vehicle_year: undefined,
      full_address: "",
      landmark: "",
      requested_date: new Date(),
      requested_time: "",
      contact_person: "",
      phone_number: "",
      customer_type: "",
      payment_method: "",
      status: SchedulingRequestStatus.PENDING,
      notes: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          ...initialData,
          requested_date: new Date(initialData.requested_date),
          vehicle_year: initialData.vehicle_year || undefined,
          vehicle_units: initialData.vehicle_units || 0,
          sr_number: initialData.sr_number || "",
        });
      } else {
        // For new requests, generate SR number and reset form
        generateSrNumber().then(srNum => {
          form.reset({
            sr_number: srNum,
            customer_name: "",
            company_name: "",
            type: SchedulingRequestType.INSTALLATION,
            vehicle_units: 0,
            vehicle_type: "",
            vehicle_year: undefined,
            full_address: "",
            landmark: "",
            requested_date: new Date(),
            requested_time: "",
            contact_person: "",
            phone_number: "",
            customer_type: "",
            payment_method: "",
            status: SchedulingRequestStatus.PENDING,
            notes: "",
          });
        });
      }
    }
  }, [isOpen, initialData, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const userId = session?.user?.id;
    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    try {
      if (initialData) {
        // Update existing request
        const { error } = await supabase
          .from("scheduling_requests")
          .update({
            ...values,
            requested_date: format(values.requested_date, "yyyy-MM-dd"),
            vehicle_year: values.vehicle_year || null,
            vehicle_units: values.vehicle_units || 0,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData.id);

        if (error) throw error;
        showSuccess("Permintaan jadwal berhasil diperbarui!");
      } else {
        // Insert new request
        const { error } = await supabase
          .from("scheduling_requests")
          .insert({
            ...values,
            user_id: userId,
            requested_date: format(values.requested_date, "yyyy-MM-dd"),
            vehicle_year: values.vehicle_year || null,
            vehicle_units: values.vehicle_units || 0,
          });

        if (error) throw error;
        showSuccess("Permintaan jadwal berhasil ditambahkan!");
      }

      onSuccess();
      onOpenChange(false);
      form.reset();
    } catch (err: any) {
      showError(`Gagal menyimpan permintaan jadwal: ${err.message}`);
      console.error("Error saving scheduling request:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Permintaan Jadwal" : "Tambah Permintaan Jadwal Baru"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Perbarui detail permintaan jadwal ini." : "Isi detail untuk permintaan jadwal teknisi baru."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <FormField
              control={form.control}
              name="sr_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor SR</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className="bg-gray-100" />
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Permintaan</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
              name="vehicle_units"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Unit Kendaraan (Opsional)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicle_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Kendaraan (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicle_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tahun Kendaraan (Opsional)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} />
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
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="landmark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Landmark (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                    <Input placeholder="e.g., 09:00 - 17:00" {...field} />
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
                  <FormLabel>Nomor Telepon</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Metode Pembayaran (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
            {initialData && ( // Status is only editable for existing requests
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
                        {Object.values(SchedulingRequestStatus).map((status) => (
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
            )}
            <DialogFooter className="md:col-span-2">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  initialData ? "Simpan Perubahan" : "Kirim Permintaan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditSchedulingRequestForm;