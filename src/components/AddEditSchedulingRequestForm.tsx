"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Path } from "react-hook-form"; // Path is still imported but not used in useFieldArray generics
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
import { CalendarIcon, Loader2, PlusCircle, Trash2 } from "lucide-react"; // Import PlusCircle and Trash2
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { SchedulingRequest, SchedulingRequestType, SchedulingRequestStatus, Invoice, Customer, CustomerTypeEnum } from "@/types/data"; // Import Invoice and Customer, CustomerTypeEnum
import { useSession } from "@/components/SessionContextProvider";
import { useQuery } from "@tanstack/react-query"; // Import useQuery
import CustomerCombobox from "./CustomerCombobox"; // Import CustomerCombobox

const formSchema = z.object({
  sr_number: z.string().optional(),
  customer_id: z.string().uuid().optional().nullable(), // New field for customer_id
  customer_name: z.string().min(1, "Nama pelanggan wajib diisi."),
  company_name: z.string().optional(),
  type: z.nativeEnum(SchedulingRequestType, { required_error: "Tipe permintaan wajib dipilih." }),
  vehicle_units: z.coerce.number().int().min(0, "Jumlah unit kendaraan tidak boleh negatif.").default(0),
  vehicle_type: z.array(z.string()).default([]), // Changed to non-optional array with default
  vehicle_year: z.array(z.coerce.number().int().min(1900, "Tahun kendaraan tidak valid.")).default([]), // Changed to non-optional array with default
  full_address: z.string().min(1, "Alamat lengkap wajib diisi."),
  landmark: z.string().optional(),
  requested_date: z.date({ required_error: "Tanggal permintaan wajib diisi." }),
  requested_time: z.string().optional(),
  contact_person: z.string().min(1, "Nama kontak person wajib diisi."),
  phone_number: z.string().min(1, "Nomor telepon wajib diisi."),
  customer_type: z.nativeEnum(CustomerTypeEnum).optional(), // Changed to enum
  payment_method: z.string().optional(),
  status: z.nativeEnum(SchedulingRequestStatus).default(SchedulingRequestStatus.PENDING),
  notes: z.string().optional(),
  invoice_id: z.string().uuid().optional().nullable(), // New field for conditional invoice
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
      customer_id: null,
      customer_name: "",
      company_name: "",
      type: SchedulingRequestType.INSTALLATION,
      vehicle_units: 0,
      vehicle_type: [],
      vehicle_year: [],
      full_address: "",
      landmark: "",
      requested_date: new Date(),
      requested_time: "",
      contact_person: "",
      phone_number: "",
      customer_type: undefined,
      payment_method: "",
      status: SchedulingRequestStatus.PENDING,
      notes: "",
      invoice_id: null,
    },
  });

  const { fields: vehicleTypeFields, append: appendVehicleType, remove: removeVehicleType } = useFieldArray({
    control: form.control,
    name: "vehicle_type", // Removed explicit generic type
  });

  const { fields: vehicleYearFields, append: appendVehicleYear, remove: removeVehicleYearField } = useFieldArray({
    control: form.control,
    name: "vehicle_year", // Removed explicit generic type
  });

  const watchedVehicleUnits = form.watch("vehicle_units");
  const watchedRequestType = form.watch("type");
  const watchedCustomerId = form.watch("customer_id");
  const [customerSearchInput, setCustomerSearchInput] = useState("");

  // Fetch invoices for conditional input
  const { data: invoices, isLoading: loadingInvoices, error: invoicesError } = useQuery<Invoice[], Error>({
    queryKey: ["invoices"],
    queryFn: async (): Promise<Invoice[]> => { // Explicitly define return type
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
        `) // Select all fields to match Invoice interface
        .order("invoice_number", { ascending: true });
      if (error) {
        showError("Gagal memuat daftar invoice.");
        throw error;
      }
      return data as Invoice[]; // Cast data to Invoice[]
    },
    enabled: watchedRequestType === SchedulingRequestType.SERVICE_UNBILL || watchedRequestType === SchedulingRequestType.SERVICE_PAID,
  });

  // Fetch customers for combobox
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

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          ...initialData,
          requested_date: new Date(initialData.requested_date),
          vehicle_units: initialData.vehicle_units || 0,
          vehicle_type: initialData.vehicle_type || [],
          vehicle_year: initialData.vehicle_year || [],
          sr_number: initialData.sr_number || "",
          invoice_id: initialData.invoice_id || null,
          // customer_id will be set if initialData has it, otherwise it's null
          customer_name: initialData.customer_name || "",
          company_name: initialData.company_name || "",
          full_address: initialData.full_address || "",
          phone_number: initialData.phone_number || "",
          customer_type: initialData.customer_type as CustomerTypeEnum || undefined,
        });
        // If initialData has a customer_name, set the combobox input value
        if (initialData.customer_name) {
          setCustomerSearchInput(initialData.customer_name);
        }
      } else {
        generateSrNumber().then(srNum => {
          form.reset({
            sr_number: srNum,
            customer_id: null,
            customer_name: "",
            company_name: "",
            type: SchedulingRequestType.INSTALLATION,
            vehicle_units: 0,
            vehicle_type: [],
            vehicle_year: [],
            full_address: "",
            landmark: "",
            requested_date: new Date(),
            requested_time: "",
            contact_person: "",
            phone_number: "",
            customer_type: undefined,
            payment_method: "",
            status: SchedulingRequestStatus.PENDING,
            notes: "",
            invoice_id: null,
          });
          setCustomerSearchInput(""); // Clear combobox input for new form
        });
      }
    }
  }, [isOpen, initialData, form]);

  // Sync vehicle_type and vehicle_year arrays with vehicle_units
  useEffect(() => {
    const currentVehicleTypes = form.getValues("vehicle_type") || [];
    const currentVehicleYears = form.getValues("vehicle_year") || [];

    if (watchedVehicleUnits > currentVehicleTypes.length) {
      for (let i = currentVehicleTypes.length; i < watchedVehicleUnits; i++) {
        appendVehicleType("");
        appendVehicleYear(undefined);
      }
    } else if (watchedVehicleUnits < currentVehicleTypes.length) {
      for (let i = currentVehicleTypes.length - 1; i >= watchedVehicleUnits; i--) {
        removeVehicleType(i);
        removeVehicleYearField(i);
      }
    }
  }, [watchedVehicleUnits, appendVehicleType, removeVehicleType, appendVehicleYear, removeVehicleYearField, form]);

  // Populate form fields when a customer is selected from combobox
  const handleCustomerSelect = (customer: Customer | undefined) => {
    if (customer) {
      form.setValue("customer_id", customer.id);
      form.setValue("customer_name", customer.customer_name);
      form.setValue("company_name", customer.company_name || "");
      form.setValue("full_address", customer.address || "");
      form.setValue("phone_number", customer.phone_number || "");
      form.setValue("customer_type", customer.customer_type);
      setCustomerSearchInput(customer.customer_name); // Keep selected customer name in combobox input
    } else {
      form.setValue("customer_id", null);
      form.setValue("customer_name", "");
      form.setValue("company_name", "");
      form.setValue("full_address", "");
      form.setValue("phone_number", "");
      form.setValue("customer_type", undefined);
      setCustomerSearchInput(""); // Clear combobox input
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
        ...values,
        requested_date: format(values.requested_date, "yyyy-MM-dd"),
        vehicle_year: values.vehicle_year?.filter(year => year !== undefined) || null,
        vehicle_type: values.vehicle_type?.filter(type => type !== "") || null,
        vehicle_units: values.vehicle_units || 0,
        invoice_id: (watchedRequestType === SchedulingRequestType.SERVICE_UNBILL || watchedRequestType === SchedulingRequestType.SERVICE_PAID) ? values.invoice_id : null,
        customer_id: values.customer_id || null, // Ensure customer_id is passed
        customer_name: values.customer_name, // Keep for now, will be removed after full migration
        company_name: values.company_name, // Keep for now
        phone_number: values.phone_number, // Keep for now
        customer_type: values.customer_type || null, // Keep for now
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

            {/* Conditional Invoice ID Input */}
            {(watchedRequestType === SchedulingRequestType.SERVICE_UNBILL || watchedRequestType === SchedulingRequestType.SERVICE_PAID) && (
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
                        {invoices?.map((invoice: Invoice) => ( // Explicitly cast invoice to Invoice
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
              name="vehicle_units"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Unit Kendaraan (Opsional)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dynamic Vehicle Type and Year Inputs */}
            {Array.from({ length: watchedVehicleUnits }).map((_, index) => (
              <React.Fragment key={index}>
                <FormField
                  control={form.control}
                  name={`vehicle_type.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipe Kendaraan {index + 1} (Opsional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`vehicle_year.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tahun Kendaraan {index + 1} (Opsional)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </React.Fragment>
            ))}

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
              name="customer_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Pelanggan (Opsional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!!watchedCustomerId}>
                    <FormControl>
                      <SelectTrigger className={cn({ "bg-gray-100": !!watchedCustomerId })}>
                        <SelectValue placeholder="Pilih tipe pelanggan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(CustomerTypeEnum).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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