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
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { showSuccess, showError } from "@/utils/toast";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useSession } from "@/components/SessionContextProvider";

const formSchema = z.object({
  invoice_number: z.string().optional(),
  invoice_date: z.date({ required_error: "Tanggal Invoice wajib diisi" }),
  due_date: z.date().optional(),
  customer_name: z.string().min(1, "Nama Pelanggan wajib diisi"),
  company_name: z.string().optional(),
  total_amount: z.coerce.number().min(0, "Total Jumlah tidak boleh negatif").default(0),
  payment_status: z.string().min(1, "Status Pembayaran wajib diisi"),
  type: z.string().optional(),
  customer_type: z.string().optional(),
  payment_method: z.string().optional(),
  notes: z.string().optional(),
  document_url: z.string().optional(),
  courier_service: z.string().optional(),
  invoice_status: z.string().min(1, "Status Invoice wajib diisi"),
  do_number: z.string().optional(),
});

interface AddInvoiceFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddInvoiceForm: React.FC<AddInvoiceFormProps> = ({ isOpen, onOpenChange, onSuccess }) => {
  const { session } = useSession();
  const queryClient = useQueryClient();

  // Fetch completed DOs from schedules table
  const { data: completedSchedules, isLoading: isLoadingSchedules, error: schedulesError } = useQuery({
    queryKey: ["completedSchedules"],
    queryFn: async () => {
      console.log("Fetching completed schedules...");
      
      const { data, error } = await supabase
        .from("schedules")
        .select("id, do_number, customer_name, schedule_date, status")
        .eq("status", "completed")
        .not("do_number", "is", null)
        .order("schedule_date", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching schedules:", error);
        throw error;
      }
      
      console.log("Fetched schedules data:", data);
      console.log("Number of schedules found:", data?.length || 0);
      
      return data || [];
    },
    enabled: isOpen,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoice_number: "",
      invoice_date: new Date(),
      due_date: undefined,
      customer_name: "",
      company_name: "",
      total_amount: 0,
      payment_status: "pending",
      type: "",
      customer_type: "",
      payment_method: "",
      notes: "",
      document_url: "",
      courier_service: "",
      invoice_status: "waiting_document_inv",
      do_number: "",
    },
  });

  // Effect to prepopulate form fields when a DO number is selected
  React.useEffect(() => {
    const doNumber = form.watch("do_number");
    if (doNumber && completedSchedules) {
      const selectedSchedule = completedSchedules.find(
        (schedule) => schedule.do_number === doNumber
      );

      if (selectedSchedule) {
        console.log("Selected schedule:", selectedSchedule);
        form.setValue("customer_name", selectedSchedule.customer_name || "");
        form.setValue("invoice_date", new Date(selectedSchedule.schedule_date));
      }
    }
  }, [form.watch("do_number"), completedSchedules, form]);

  const addInvoiceMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const userId = session?.user?.id;

      if (!userId) {
        throw new Error("Pengguna tidak terautentikasi.");
      }

      const { error } = await supabase
        .from("invoices")
        .insert({
          user_id: userId,
          invoice_number: values.invoice_number || null,
          invoice_date: format(values.invoice_date, "yyyy-MM-dd"),
          due_date: values.due_date ? format(values.due_date, "yyyy-MM-dd") : null,
          customer_name: values.customer_name,
          company_name: values.company_name || null,
          total_amount: values.total_amount,
          payment_status: values.payment_status,
          type: values.type || null,
          customer_type: values.customer_type || null,
          payment_method: values.payment_method || null,
          notes: values.notes || null,
          document_url: values.document_url || null,
          courier_service: values.courier_service || null,
          invoice_status: values.invoice_status,
          do_number: values.do_number || null,
        })
        .select();

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess("Invoice berhasil ditambahkan!");
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      onSuccess();
    },
    onError: (error: any) => {
      showError(`Gagal menambahkan invoice: ${error.message}`);
      console.error("Error adding invoice:", error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addInvoiceMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Invoice Baru</DialogTitle>
          <DialogDescription>
            Isi detail untuk menambahkan invoice baru. Nomor invoice akan dibuat secara otomatis.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {/* Field: DO Number */}
            <FormField
              control={form.control}
              name="do_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor DO Selesai (Opsional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih nomor DO yang sudah selesai" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingSchedules ? (
                        <SelectItem value="loading" disabled>Memuat DO...</SelectItem>
                      ) : schedulesError ? (
                        <SelectItem value="error" disabled>Error memuat data</SelectItem>
                      ) : !completedSchedules || completedSchedules.length === 0 ? (
                        <SelectItem value="no-dos" disabled>Tidak ada DO yang selesai</SelectItem>
                      ) : (
                        completedSchedules.map((schedule) => (
                          <SelectItem key={schedule.id} value={schedule.do_number || ""}>
                            {schedule.do_number} - {schedule.customer_name} ({format(new Date(schedule.schedule_date), "dd/MM/yyyy")})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Pilih DO yang sudah selesai untuk mengisi beberapa detail secara otomatis.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Field: Invoice Number */}
            <FormField
              control={form.control}
              name="invoice_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Invoice (Otomatis)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Akan dibuat otomatis" disabled />
                  </FormControl>
                  <FormDescription>Nomor invoice akan dibuat secara otomatis setelah disimpan.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="invoice_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Invoice</FormLabel>
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
              name="due_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Jatuh Tempo (Opsional)</FormLabel>
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
              name="total_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Jumlah</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Pembayaran</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status pembayaran" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe (Opsional)</FormLabel>
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
                <FormItem>
                  <FormLabel>Catatan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="document_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Dokumen (Opsional)</FormLabel>
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
              name="invoice_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Invoice</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status invoice" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="waiting_document_inv">Menunggu Dokumen Inv</SelectItem>
                      <SelectItem value="document_inv_sent">Dokumen Inv Terkirim</SelectItem>
                      <SelectItem value="completed">Selesai</SelectItem>
                      <SelectItem value="cancelled">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="md:col-span-2">
              <Button type="submit" className="w-full mt-6" disabled={addInvoiceMutation.isPending}>
                {addInvoiceMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Tambah Invoice"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInvoiceForm;