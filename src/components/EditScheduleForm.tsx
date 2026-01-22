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
import { Schedule, ScheduleType, ScheduleStatus, Technician, ScheduleProductCategory } from "@/types/data"; // Import ScheduleProductCategory
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Import useQuery, useMutation, useQueryClient
import TechnicianCombobox from "./TechnicianCombobox"; // Import TechnicianCombobox

const formSchema = z.object({
  schedule_date: z.date({ required_error: "Tanggal jadwal harus diisi." }),
  schedule_time: z.string().optional(),
  type: z.nativeEnum(ScheduleType, { required_error: "Tipe jadwal harus diisi." }),
  product_category: z.nativeEnum(ScheduleProductCategory).optional().nullable(), // New field
  customer_name: z.string().min(1, "Nama pelanggan harus diisi."),
  address: z.string().optional(),
  technician_name: z.string().optional().nullable(), // Keep technician_name as text for now
  invoice_id: z.string().optional(),
  status: z.nativeEnum(ScheduleStatus, { required_error: "Status jadwal harus diisi." }),
  notes: z.string().optional(),
  phone_number: z.string().optional(),
  courier_service: z.string().optional(),
});

interface EditScheduleFormProps {
  schedule: Schedule;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditScheduleForm: React.FC<EditScheduleFormProps> = ({ schedule, isOpen, onOpenChange, onSuccess }) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schedule_date: new Date(schedule.schedule_date),
      schedule_time: schedule.schedule_time || "",
      type: schedule.type as ScheduleType, // Cast to enum
      product_category: schedule.product_category || null, // Set initial product category
      customer_name: schedule.customer_name,
      address: schedule.address || "",
      technician_name: schedule.technician_name || null, // Set initial technician name
      invoice_id: schedule.invoice_id || "",
      status: schedule.status as ScheduleStatus, // Cast to enum
      notes: schedule.notes || "",
      phone_number: schedule.phone_number || "",
      courier_service: schedule.courier_service || "",
    },
  });

  const [technicianSearchInput, setTechnicianSearchInput] = useState(schedule.technician_name || ""); // State for technician combobox input

  const { data: technicians, isLoading: loadingTechnicians, error: techniciansError } = useQuery<Technician[], Error>({
    queryKey: ["technicians"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technicians")
        .select("*")
        .order("name", { ascending: true });
      if (error) {
        showError("Gagal memuat daftar teknisi.");
        throw error;
      }
      return data;
    },
    enabled: isOpen, // Only fetch when the dialog is open
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        schedule_date: new Date(schedule.schedule_date),
        schedule_time: schedule.schedule_time || "",
        type: schedule.type as ScheduleType,
        product_category: schedule.product_category || null, // Reset product category
        customer_name: schedule.customer_name,
        address: schedule.address || "",
        technician_name: schedule.technician_name || null,
        invoice_id: schedule.invoice_id || "",
        status: schedule.status as ScheduleStatus,
        notes: schedule.notes || "",
        phone_number: schedule.phone_number || "",
        courier_service: schedule.courier_service || "",
      });
      setTechnicianSearchInput(schedule.technician_name || "");
    }
  }, [isOpen, schedule, form]);

  const handleTechnicianSelect = (technician: Technician | undefined) => {
    if (technician) {
      form.setValue("technician_name", technician.name);
      setTechnicianSearchInput(technician.name);
      form.clearErrors(["technician_name"]);
    } else {
      form.setValue("technician_name", null);
      setTechnicianSearchInput("");
    }
  };

  // Mutation for updating a schedule
  const updateScheduleMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { error } = await supabase
        .from("schedules")
        .update({
          schedule_date: format(values.schedule_date, "yyyy-MM-dd"),
          schedule_time: values.schedule_time,
          type: values.type,
          product_category: values.product_category, // Include new field
          customer_name: values.customer_name,
          address: values.address,
          technician_name: values.technician_name,
          invoice_id: values.invoice_id,
          status: values.status,
          notes: values.notes,
          phone_number: values.phone_number,
          courier_service: values.courier_service,
          updated_at: new Date().toISOString(),
        })
        .eq("id", schedule.id);

      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Jadwal berhasil diperbarui!");
      onSuccess();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["schedules"] }); // Invalidate schedules to refetch
    },
    onError: (err: any) => {
      showError(`Gagal memperbarui jadwal: ${err.message}`);
      console.error("Error updating schedule:", err);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateScheduleMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Jadwal</DialogTitle>
          <DialogDescription>
            Ubah detail jadwal di sini. Klik simpan saat Anda selesai.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
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
            {/* New: Product Category Field */}
            <FormField
              control={form.control}
              name="product_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Produk (Opsional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori produk" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ScheduleProductCategory).map((category) => (
                        <SelectItem key={category as string} value={category as string}>
                          {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
              name="schedule_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Waktu Jadwal (Opsional)</FormLabel>
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
                  <FormLabel>Tipe Jadwal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe jadwal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ScheduleType).map((type) => (
                        <SelectItem key={type as string} value={type as string}>
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
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
                  <FormLabel>Nomor Telepon (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Technician Name field - now a combobox */}
            <FormField
              control={form.control}
              name="technician_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Teknisi (Opsional)</FormLabel>
                  <FormControl>
                    <TechnicianCombobox
                      technicians={technicians || []}
                      value={technicians?.find(t => t.name === field.value)?.id || undefined}
                      onValueChange={handleTechnicianSelect}
                      inputValue={technicianSearchInput}
                      onInputValueChange={setTechnicianSearchInput}
                      disabled={loadingTechnicians}
                      loading={loadingTechnicians}
                      placeholder="Pilih atau cari teknisi..."
                    />
                  </FormControl>
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
            <FormField
              control={form.control}
              name="invoice_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Invoice Terkait (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      {Object.values(ScheduleStatus).map((status) => (
                        <SelectItem key={status as string} value={status as string}>
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
            <DialogFooter>
              <Button type="submit" disabled={updateScheduleMutation.isPending}>
                {updateScheduleMutation.isPending ? (
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

export default EditScheduleForm;