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
import { Schedule, ScheduleType, ScheduleStatus, Technician, ScheduleProductCategory } from "@/types/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TechnicianCombobox from "./TechnicianCombobox";
import { useSession } from "@/components/SessionContextProvider";

const formSchema = z.object({
  schedule_date: z.date({ required_error: "Tanggal jadwal harus diisi." }),
  schedule_time: z.string().optional().nullable(),
  type: z.nativeEnum(ScheduleType, { required_error: "Tipe jadwal harus diisi." }),
  product_category: z.nativeEnum(ScheduleProductCategory).optional().nullable(),
  customer_name: z.string().min(1, "Nama pelanggan harus diisi."),
  address: z.string().optional().nullable(),
  technician_name: z.string().optional().nullable(),
  invoice_id: z.string().optional().nullable(),
  status: z.nativeEnum(ScheduleStatus, { required_error: "Status jadwal harus diisi." }),
  notes: z.string().optional().nullable(),
  phone_number: z.string().optional().nullable(),
  courier_service: z.string().optional().nullable(),
});

interface AddEditScheduleFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData?: Schedule | null;
}

const AddEditScheduleForm: React.FC<AddEditScheduleFormProps> = ({ isOpen, onOpenChange, onSuccess, initialData }) => {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schedule_date: new Date(),
      schedule_time: null,
      type: ScheduleType.INSTALASI,
      product_category: null,
      customer_name: "",
      address: null,
      technician_name: null,
      invoice_id: null,
      status: ScheduleStatus.SCHEDULED,
      notes: null,
      phone_number: null,
      courier_service: null,
    },
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [technicianSearchInput, setTechnicianSearchInput] = useState(initialData?.technician_name || "");

  const { data: technicians, isLoading: loadingTechnicians } = useQuery<Technician[], Error>({
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
    enabled: isOpen,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          schedule_date: new Date(initialData.schedule_date),
          schedule_time: initialData.schedule_time || null,
          type: initialData.type,
          product_category: initialData.product_category || null,
          customer_name: initialData.customer_name,
          address: initialData.address || null,
          technician_name: initialData.technician_name || null,
          invoice_id: initialData.invoice_id || null,
          status: initialData.status,
          notes: initialData.notes || null,
          phone_number: initialData.phone_number || null,
          courier_service: initialData.courier_service || null,
        });
        setTechnicianSearchInput(initialData.technician_name || "");
      } else {
        form.reset({
          schedule_date: new Date(),
          schedule_time: null,
          type: ScheduleType.INSTALASI,
          product_category: null,
          customer_name: "",
          address: null,
          technician_name: null,
          invoice_id: null,
          status: ScheduleStatus.SCHEDULED,
          notes: null,
          phone_number: null,
          courier_service: null,
        });
        setTechnicianSearchInput("");
      }
      setActiveTab("basic");
    }
  }, [isOpen, initialData, form]);

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

  const saveScheduleMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("Anda harus login untuk membuat jadwal.");
      }

      const dataToSubmit = {
        user_id: userId,
        schedule_date: format(values.schedule_date, "yyyy-MM-dd"),
        schedule_time: values.schedule_time,
        type: values.type,
        product_category: values.product_category,
        customer_name: values.customer_name,
        address: values.address,
        technician_name: values.technician_name,
        invoice_id: values.invoice_id,
        status: values.status,
        notes: values.notes,
        phone_number: values.phone_number,
        courier_service: values.courier_service,
      };

      if (initialData) {
        const { error } = await supabase
          .from("schedules")
          .update({
            ...dataToSubmit,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("schedules")
          .insert(dataToSubmit);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      showSuccess(initialData ? "Jadwal berhasil diperbarui!" : "Jadwal berhasil ditambahkan!");
      onSuccess();
      onOpenChange(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: (err: any) => {
      showError(`Gagal menyimpan jadwal: ${err.message}`);
      console.error("Error saving schedule:", err);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    saveScheduleMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Jadwal" : "Tambah Jadwal Baru"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Ubah detail jadwal di sini. Klik simpan saat Anda selesai." : "Isi detail jadwal baru di sini. Klik simpan saat Anda selesai."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Dasar</TabsTrigger>
                <TabsTrigger value="location">Lokasi & Kontak</TabsTrigger>
                <TabsTrigger value="additional">Tambahan</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="mt-4 space-y-4">
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
              </TabsContent>

              <TabsContent value="location" className="mt-4 space-y-4">
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
              </TabsContent>

              <TabsContent value="additional" className="mt-4 space-y-4">
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button type="submit" disabled={saveScheduleMutation.isPending}>
                {saveScheduleMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  initialData ? "Simpan Perubahan" : "Simpan Jadwal"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditScheduleForm;