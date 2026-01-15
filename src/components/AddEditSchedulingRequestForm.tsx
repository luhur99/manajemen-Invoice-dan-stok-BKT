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
import { SchedulingRequest, SchedulingRequestType, SchedulingRequestStatus, Invoice, Customer, Technician } from "@/types/data";
import { useSession } from "@/components/SessionContextProvider";
import { useQuery } from "@tanstack/react-query";
import CustomerCombobox from "./CustomerCombobox";
import TechnicianCombobox from "./TechnicianCombobox"; // Import TechnicianCombobox

const formSchema = z.object({
  sr_number: z.string().optional().nullable(),
  customer_id: z.string().uuid().optional().nullable(),
  customer_name: z.string().min(1, "Nama pelanggan wajib diisi."),
  company_name: z.string().optional().nullable(),
  type: z.nativeEnum(SchedulingRequestType, { required_error: "Tipe permintaan wajib dipilih." }),
  vehicle_details: z.string().optional().nullable(),
  full_address: z.string().min(1, "Alamat lengkap wajib diisi."),
  landmark: z.string().optional().nullable(),
  requested_date: z.date({ required_error: "Tanggal permintaan wajib diisi." }),
  requested_time: z.string().optional().nullable(),
  contact_person: z.string().min(1, "Nama kontak person wajib diisi."),
  phone_number: z.string().min(1, "Nomor telepon wajib diisi."),
  payment_method: z.string().optional().nullable(),
  status: z.nativeEnum(SchedulingRequestStatus).default(SchedulingRequestStatus.PENDING),
  notes: z.string().optional().nullable(),
  invoice_id: z.string().uuid().optional().nullable(),
  technician_name: z.string().optional().nullable(), // Keep technician_name as text for now
}).superRefine((data, ctx) => {
  // Custom validation for notes based on status
  if (['rescheduled', 'rejected', 'cancelled'].includes(data.status) && (!data.notes || data.notes.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Alasan (catatan) wajib diisi untuk status ini.",
      path: ['notes'],
    });
  }
  // Custom validation for technician_name when approved
  if (data.status === 'approved' && (!data.technician_name || data.technician_name.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Nama teknisi wajib diisi saat menyetujui permintaan.",
      path: ['technician_name'],
    });
  }
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
    console.error("Error fetching latest PR number:", error);
    return `${prefix}-${Date.now().toString().slice(-4)}`;
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
      sr_number: null,
      customer_id: null,
      customer_name: "",
      company_name: null,
      type: SchedulingRequestType.INSTALLATION,
      vehicle_details: null,
      full_address: "",
      landmark: null,
      requested_date: new Date(),
      requested_time: null,
      contact_person: "",
      phone_number: "",
      payment_method: null,
      status: SchedulingRequestStatus.PENDING, // Default status for new requests
      notes: null,
      invoice_id: null,
      technician_name: null, // New field
    },
  });

  const watchedRequestType = form.watch("type");
  const watchedCustomerId = form.watch("customer_id");
  const watchedStatus = form.watch("status"); // Watch status for conditional validation
  const [customerSearchInput, setCustomerSearchInput] = useState("");
  const [technicianSearchInput, setTechnicianSearchInput] = useState(initialData?.technician_name || ""); // State for technician combobox input

  const { data: invoices, isLoading: loadingInvoices, error: invoicesError } = useQuery<Invoice[], Error>({
    queryKey: ["invoices"],
    queryFn: async (): Promise<Invoice[]> => {
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          id,
          invoice_number,
          invoice_date,
          due_date,
          customer_name,
          company_name,
          total_amount,
          payment_status,
          created_at,
          type,
          customer_type,
          payment_method,
          notes,
          document_url,
          courier_service
        `)
        .order("invoice_number", { ascending: true });
      if (error) {
        showError("Gagal memuat daftar invoice.");
        throw error;
      }
      return data as Invoice[];
    },
    enabled: watchedRequestType === SchedulingRequestType.SERVICE_UNBILL,
  });

  const { data: customers, isLoading: loadingCustomers, error: customersError } = useQuery<Customer[], Error>({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("customer_name", { ascending: true });
      if (error) {
        showError("Gagal memuat daftar pelanggan.");
        throw error;
      }
      return data;
    },
  });

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
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          ...initialData,
          requested_date: new Date(initialData.requested_date),
          vehicle_details: initialData.vehicle_details || null,
          sr_number: initialData.sr_number || null,
          invoice_id: initialData.invoice_id || null,
          customer_name: initialData.customer_name || "",
          company_name: initialData.company_name || null,
          full_address: initialData.full_address || "",
          phone_number: initialData.phone_number || "",
          payment_method: initialData.payment_method || null,
          technician_name: initialData.technician_name || null, // Set initial technician name
        });
        if (initialData.customer_name) {
          setCustomerSearchInput(initialData.customer_name);
        }
        if (initialData.technician_name) {
          setTechnicianSearchInput(initialData.technician_name);
        }
      } else {
        generateSrNumber().then(srNum => {
          form.reset({
            sr_number: srNum,
            customer_id: null,
            customer_name: "",
            company_name: null,
            type: SchedulingRequestType.INSTALLATION,
            vehicle_details: null,
            full_address: "",
            landmark: null,
            requested_date: new Date(),
            requested_time: null,
            contact_person: "",
            phone_number: "",
            payment_method: null,
            status: SchedulingRequestStatus.PENDING, // Default status for new requests
            notes: null,
            invoice_id: null,
            technician_name: null,
          });
          setCustomerSearchInput("");
          setTechnicianSearchInput("");
        });
      }
    } else {
      setCustomerSearchInput("");
      setTechnicianSearchInput("");
    }
  }, [isOpen, initialData, form]);

  const handleCustomerSelect = (customer: Customer | undefined) => {
    if (customer) {
      form.setValue("customer_id", customer.id);
      form.setValue("customer_name", customer.customer_name);
      form.setValue("company_name", customer.company_name || null);
      form.setValue("full_address", customer.address || "");
      form.setValue("phone_number", customer.phone_number || "");
      setCustomerSearchInput(customer.customer_name);
      form.clearErrors(["customer_name", "company_name", "full_address", "phone_number"]);
    } else {
      form.setValue("customer_id", null);
      form.setValue("customer_name", "");
      form.setValue("company_name", null);
      form.setValue("full_address", "");
      form.setValue("phone_number", "");
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const userId = session?.user?.id;
    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    try {
      const dataToSubmit = {
        sr_number: values.sr_number?.trim() || null,
        customer_id: values.customer_id || null,
        customer_name: values.customer_name.trim(),
        company_name: values.company_name?.trim() || null,
        type: values.type,
        vehicle_details: values.vehicle_details?.trim() || null,
        full_address: values.full_address.trim(),
        landmark: values.landmark?.trim() || null,
        requested_date: format(values.requested_date, "yyyy-MM-dd"),
        requested_time: values.requested_time?.trim() || null,
        contact_person: values.contact_person.trim(),
        phone_number: values.phone_number.trim(),
        payment_method: values.payment_method?.trim() || null,
        status: initialData ? values.status : SchedulingRequestStatus.PENDING, // Use default PENDING for new requests
        notes: values.notes?.trim() || null,
        invoice_id: (watchedRequestType === SchedulingRequestType.SERVICE_UNBILL) ? values.invoice_id : null,
        technician_name: values.technician_name?.trim() || null, // Include technician name
      };

      if (initialData) {
        const { error } = await supabase
          .from("scheduling_requests")
          .update({
            ...dataToSubmit,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData.id);

        if (error) throw error;
        showSuccess("Permintaan jadwal berhasil diperbarui!");
      } else {
        const { error } = await supabase
          .from("scheduling_requests")
          .insert({
            ...dataToSubmit,
            user_id: userId,
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
                    <Input {...field} readOnly={!!watchedCustomerId} className={cn({ "bg-gray-100": !!watchedCustomerId })} />
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
                    <Input {...field} readOnly={!!watchedCustomerId} className={cn({ "bg-gray-100": !!watchedCustomerId })} />
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

            {watchedRequestType === SchedulingRequestType.SERVICE_UNBILL && (
              <FormField
                control={form.control}
                name="invoice_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Invoice Terkait</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""} disabled={loadingInvoices}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={loadingInvoices ? "Memuat invoice..." : "Pilih nomor invoice"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {invoices?.map((invoice: Invoice) => (
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
            )}

            <FormField
              control={form.control}
              name="vehicle_details"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Detil Kendaraan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Contoh: 2 unit mobil, 1 unit motor. Mobil: Toyota Avanza 2020, Honda Brio 2022. Motor: Yamaha NMAX 2021." {...field} />
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
                    <Textarea {...field} readOnly={!!watchedCustomerId} className={cn({ "bg-gray-100": !!watchedCustomerId })} />
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
                    <Input {...field} readOnly={!!watchedCustomerId} className={cn({ "bg-gray-100": !!watchedCustomerId })} />
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
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih metode pembayaran" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Transfer">Transfer</SelectItem>
                      <SelectItem value="DP">DP</SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Only render status field if initialData exists (i.e., editing an existing request) */}
            {initialData && (
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
                            {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {/* Technician Name field - now a combobox, only shown for existing requests */}
            {initialData && (
              <FormField
                control={form.control}
                name="technician_name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Nama Teknisi</FormLabel>
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
            )}
            {/* Conditional Notes Field */}
            {(watchedStatus === SchedulingRequestStatus.RESCHEDULED ||
              watchedStatus === SchedulingRequestStatus.REJECTED ||
              watchedStatus === SchedulingRequestStatus.CANCELLED) && (
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Alasan (Wajib)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Masukkan alasan..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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