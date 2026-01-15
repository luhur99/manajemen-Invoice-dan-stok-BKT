"use client";

import React from "react";
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
import { ScheduleType, ScheduleStatus } from "@/types/data";

const formSchema = z.object({
  schedule_date: z.date({ required_error: "Tanggal jadwal harus diisi." }),
  schedule_time: z.string().optional(),
  type: z.nativeEnum(ScheduleType, { required_error: "Tipe jadwal harus diisi." }),
  customer_name: z.string().min(1, "Nama pelanggan harus diisi."),
  address: z.string().optional(),
  technician_name: z.string().optional(),
  invoice_id: z.string().optional(),
  status: z.nativeEnum(ScheduleStatus, { required_error: "Status jadwal harus diisi." }),
  notes: z.string().optional(),
  phone_number: z.string().optional(),
  courier_service: z.string().optional(),
});

interface AddScheduleFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddScheduleForm: React.FC<AddScheduleFormProps> = ({ isOpen, onOpenChange, onSuccess }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schedule_date: new Date(),
      schedule_time: "",
      type: ScheduleType.INSTALASI,
      customer_name: "",
      address: "",
      technician_name: "",
      invoice_id: "",
      status: ScheduleStatus.SCHEDULED,
      notes: "",
      phone_number: "",
      courier_service: "",
    },
  });

  React.useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      showError("Anda harus login untuk membuat jadwal.");
      return;
    }

    try {
      const { error } = await supabase.from("schedules").insert({
        user_id: user.data.user.id,
        schedule_date: format(values.schedule_date, "yyyy-MM-dd"),
        schedule_time: values.schedule_time,
        type: values.type,
        customer_name: values.customer_name,
        address: values.address,
        technician_name: values.technician_name,
        invoice_id: values.invoice_id,
        status: values.status,
        notes: values.notes,
        phone_number: values.phone_number,
        courier_service: values.courier_service,
      });

      if (error) throw error;

      showSuccess("Jadwal berhasil ditambahkan!");
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      showError(`Gagal menambahkan jadwal: ${err.message}`);
      console.error("Error adding schedule:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Jadwal Baru</DialogTitle>
          <DialogDescription>
            Isi detail jadwal baru di sini. Klik simpan saat Anda selesai.
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
            <FormField
              control={form.control}
              name="technician_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Teknisi (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ScheduleStatus).map((status) => (
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
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Simpan Jadwal"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddScheduleForm;