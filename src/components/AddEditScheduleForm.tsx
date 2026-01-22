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
import { Schedule, ScheduleType, ScheduleStatus, Technician, ScheduleProductCategory, Customer } from "@/types/data"; // Added Customer
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TechnicianCombobox from "./TechnicianCombobox";
import CustomerCombobox from "./CustomerCombobox"; // Added CustomerCombobox
import { useSession } from "@/components/SessionContextProvider";

const formSchema = z.object({
  customer_id: z.string().uuid().optional().nullable(), // Added customer_id
  customer_name: z.string().min(1, "Nama pelanggan harus diisi."),
  address: z.string().optional().nullable(),
  phone_number: z.string().optional().nullable(),
  schedule_date: z.date({ required_error: "Tanggal jadwal harus diisi." }),
  schedule_time: z.string().optional().nullable(),
  type: z.nativeEnum(ScheduleType, { required_error: "Tipe jadwal harus diisi." }),
  product_category: z.nativeEnum(ScheduleProductCategory).optional().nullable(),
  technician_name: z.string().optional().nullable(),
  invoice_id: z.string().optional().nullable(),
  status: z.nativeEnum(ScheduleStatus, { required_error: "Status jadwal harus diisi." }),
  notes: z.string().optional().nullable(),
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
      customer_id: null,
      customer_name: "",
      address: null,
      phone_number: null,
      schedule_date: new Date(),
      schedule_time: null,
      type: ScheduleType.INSTALASI,
      product_category: null,
      technician_name: null,
      invoice_id: null,
      status: ScheduleStatus.SCHEDULED,
      notes: null,
      courier_service: null,
    },
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [technicianSearchInput, setTechnicianSearchInput] = useState(initialData?.technician_name || "");
  const [customerSearchInput, setCustomerSearchInput] = useState(initialData?.customer_name || ""); // Added customer search input

  const { data: technicians, isLoading: loadingTechnicians } = useQuery<Technician[], Error>({
    queryKey: ["technicians"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technicians")
        .select("id, name, type") // Select specific columns
        .order("name", { ascending: true });
      if (error) {
        showError("Gagal memuat daftar teknisi.");
        throw error;
      }
      return data as Technician[];
    },
    enabled: isOpen,
  });

  const { data: customers, isLoading: loadingCustomers } = useQuery<Customer[], Error>({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("id, customer_name, company_name, address, phone_number, customer_type") // Select specific columns
        .order("customer_name", { ascending: true });
      if (error) {
        showError("Gagal memuat daftar pelanggan.");
        throw error;
      }
      return data as Customer[];
    },
    enabled: isOpen,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          customer_id: initialData.customer_id || null,
          customer_name: initialData.customer_name,
          address: initialData.address || null,
          phone_number: initialData.phone_number || null,
          schedule_date: new Date(initialData.schedule_date),
          schedule_time: initialData.schedule_time || null,
          type: initialData.type,
          product_category: initialData.product_category || null,
          technician_name: initialData.technician_name || null,
          invoice_id: initialData.invoice_id || null,
          status: initialData.status,
          notes: initialData.notes || null,
          courier_service: initialData.courier_service || null,
        });
        setTechnicianSearchInput(initialData.technician_name || "");
        setCustomerSearchInput(initialData.customer_name || "");
      } else {
        form.reset({
          customer_id: null,
          customer_name: "",
          address: null,
          phone_number: null,
          schedule_date: new Date(),
          schedule_time: null,
          type: ScheduleType.INSTALASI,
          product_category: null,
          technician_name: null,
          invoice_id: null,
          status: ScheduleStatus.SCHEDULED,
          notes: null,
          courier_service: null,
        });
        setTechnicianSearchInput("");
        setCustomerSearchInput("");
      }
      setActiveTab("basic");
    }
  }, [isOpen, initialData, form, technicians, customers]); // Added dependencies

  const handleCustomerSelect = (customer: Customer | undefined) => {
    if (customer) {
      form.setValue("customer_id", customer.id);
      form.setValue("customer_name", customer.customer_name);
      form.setValue("address", customer.address || null);
      form.setValue("phone_number", customer.phone_number || null);
      setCustomerSearchInput(customer.customer_name);
      form.clearErrors(["customer_name", "address", "phone_number"]);
    } else {
      form.setValue("customer_id", null);
      form.setValue("customer_name", "");
      form.setValue("address", null);
      form.setValue("phone_number", null);
      setCustomerSearchInput("");
    }
  };

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
        throw new Error("Pengguna tidak terautentikasi.");
      }

      const dataToSubmit = {
        user_id: userId,
        customer_id: values.customer_id || null,
        customer_name: values.customer_name.trim(),
        address: values.address?.trim() || null,
        phone_number: values.phone_number?.trim() || null,
        schedule_date: format(values.schedule_date, "yyyy-MM-dd"),
        schedule_time: values.schedule_time?.trim() || null,
        type: values.type,
        product_category: values.product_category || null,
        technician_name: values.technician_name?.trim() || null,
        invoice_id: values.invoice_id || null,
        status: values.status,
        notes: values.notes?.trim() || null,
        courier_service: values.courier_service?.trim() || null,
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
      queryClient.invalidateQueries({ queryKey: ["technicianSchedules"] }); // Invalidate technician calendar
    },
    onError: (err: any) => {
      showError(`Gagal menyimpan jadwal: ${err.message}`);
      console.error("Error saving schedule:", err);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    saveScheduleMutation.mutate(values);
  };

  if (loadingCustomers || loadingTechnicians) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{initialData ? "Edit Jadwal" : "Tambah Jadwal Baru"}</DialogTitle>
            <DialogDescription>Memuat data...</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Jadwal" : "Tambah Jadwal Baru"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Perbarui detail jadwal ini." : "Isi detail untuk jadwal baru."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Informasi Dasar</TabsTrigger>
                <TabsTrigger value="customer">Pelanggan</TabsTrigger>
                <TabsTrigger value="details">Detail Tambahan</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Input placeholder="e.g., 09:00 - 17:00" {...field} />
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
                          {Object.values(ScheduleType).map((type) => (
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
                      <FormLabel>Kategori Produk (Opsional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori produk" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ScheduleProductCategory).map((category) => (
                            <SelectItem key={category} value={category}>
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
              </TabsContent>

              <TabsContent value="customer" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customer_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pilih Pelanggan</FormLabel>
                      <FormControl>
                        <CustomerCombobox
                          customers={customers || []}
                          value={field.value || undefined}
                          onValueChange={handleCustomerSelect}
                          inputValue={customerSearchInput}
                          onInputValueChange={setCustomerSearchInput}
                          disabled={loadingCustomers}
                          loading={loadingCustomers}
                        />
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
                        <Input {...field} readOnly={!!form.watch("customer_id")} className={cn({ "bg-gray-100": !!form.watch("customer_id") })} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Alamat (Opsional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} readOnly={!!form.watch("customer_id")} className={cn({ "bg-gray-100": !!form.watch("customer_id") })} />
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
                        <Input {...field} readOnly={!!form.watch("customer_id")} className={cn({ "bg-gray-100": !!form.watch("customer_id") })} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="details" className="mt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="invoice_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Invoice Terkait (Opsional)</FormLabel>
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
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button type="submit" disabled={saveScheduleMutation.isPending}>
                {saveScheduleMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  initialData ? "Simpan Perubahan" : "Tambah Jadwal"
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