"use client";

import React, { useEffect } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { SalesDetailItem } from "@/types/data";

// Schema validasi menggunakan Zod
const formSchema = z.object({
  no: z.coerce.number().min(1, "Nomor wajib diisi"),
  kirim_install: z.enum(["Kirim", "Install"], {
    required_error: "Tipe Kirim/Install wajib dipilih",
  }),
  no_transaksi: z.string().min(1, "Nomor Transaksi wajib diisi"),
  invoice_number: z.string().min(1, "Nomor Invoice wajib diisi"),
  new_old: z.enum(["New", "Old"]).optional(),
  perusahaan: z.string().optional(),
  tanggal: z.date({ required_error: "Tanggal wajib diisi" }),
  hari: z.string().optional(),
  jam: z.string().optional(),
  customer: z.string().min(1, "Nama Customer wajib diisi"),
  alamat_install: z.string().optional(),
  no_hp: z.string().optional(),
  type: z.string().optional(),
  qty_unit: z.coerce.number().min(0, "Kuantitas unit tidak boleh negatif").default(0),
  stock: z.coerce.number().min(0, "Stok tidak boleh negatif").default(0),
  harga: z.coerce.number().min(0, "Harga tidak boleh negatif").default(0),
  web: z.enum(["Ya", "Tidak"]).optional(),
  qty_web: z.coerce.number().min(0, "Kuantitas web tidak boleh negatif").default(0),
  kartu: z.enum(["Ada", "Tidak"]).optional(),
  qty_kartu: z.coerce.number().min(0, "Kuantitas kartu tidak boleh negatif").default(0),
  paket: z.string().optional(),
  pulsa: z.coerce.number().min(0, "Pulsa tidak boleh negatif").default(0),
  teknisi: z.string().optional(),
  payment: z.string().optional(),
  catatan: z.string().optional(),
});

interface EditSalesDetailFormProps {
  salesDetail: SalesDetailItem;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditSalesDetailForm: React.FC<EditSalesDetailFormProps> = ({ salesDetail, isOpen, onOpenChange, onSuccess }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      no: salesDetail.no,
      kirim_install: salesDetail.kirim_install as "Kirim" | "Install", // Type assertion
      no_transaksi: salesDetail.no_transaksi,
      invoice_number: salesDetail.invoice_number,
      new_old: (salesDetail.new_old as "New" | "Old") || undefined, // Type assertion
      perusahaan: salesDetail.perusahaan || "",
      tanggal: new Date(salesDetail.tanggal),
      hari: salesDetail.hari || "",
      jam: salesDetail.jam || "",
      customer: salesDetail.customer,
      alamat_install: salesDetail.alamat_install || "",
      no_hp: salesDetail.no_hp || "",
      type: salesDetail.type || "",
      qty_unit: salesDetail.qty_unit,
      stock: salesDetail.stock,
      harga: salesDetail.harga,
      web: (salesDetail.web as "Ya" | "Tidak") || undefined, // Type assertion
      qty_web: salesDetail.qty_web,
      kartu: (salesDetail.kartu as "Ada" | "Tidak") || undefined, // Type assertion
      qty_kartu: salesDetail.qty_kartu,
      paket: salesDetail.paket || "",
      pulsa: salesDetail.pulsa,
      teknisi: salesDetail.teknisi || "",
      payment: salesDetail.payment || "",
      catatan: salesDetail.catatan || "",
    },
  });

  // Reset form with new salesDetail data when the dialog opens or salesDetail prop changes
  useEffect(() => {
    if (isOpen && salesDetail) {
      form.reset({
        no: salesDetail.no,
        kirim_install: salesDetail.kirim_install as "Kirim" | "Install", // Type assertion
        no_transaksi: salesDetail.no_transaksi,
        invoice_number: salesDetail.invoice_number,
        new_old: (salesDetail.new_old as "New" | "Old") || undefined, // Type assertion
        perusahaan: salesDetail.perusahaan || "",
        tanggal: new Date(salesDetail.tanggal),
        hari: salesDetail.hari || "",
        jam: salesDetail.jam || "",
        customer: salesDetail.customer,
        alamat_install: salesDetail.alamat_install || "",
        no_hp: salesDetail.no_hp || "",
        type: salesDetail.type || "",
        qty_unit: salesDetail.qty_unit,
        stock: salesDetail.stock,
        harga: salesDetail.harga,
        web: (salesDetail.web as "Ya" | "Tidak") || undefined, // Type assertion
        qty_web: salesDetail.qty_web,
        kartu: (salesDetail.kartu as "Ada" | "Tidak") || undefined, // Type assertion
        qty_kartu: salesDetail.qty_kartu,
        paket: salesDetail.paket || "",
        pulsa: salesDetail.pulsa,
        teknisi: salesDetail.teknisi || "",
        payment: salesDetail.payment || "",
        catatan: salesDetail.catatan || "",
      });
    }
  }, [isOpen, salesDetail, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    try {
      const { error } = await supabase
        .from("sales_details")
        .update({
          user_id: userId, // Ensure user_id is maintained
          no: values.no,
          kirim_install: values.kirim_install,
          no_transaksi: values.no_transaksi,
          invoice_number: values.invoice_number,
          new_old: values.new_old || null,
          perusahaan: values.perusahaan || null,
          tanggal: format(values.tanggal, "yyyy-MM-dd"),
          hari: values.hari || null,
          jam: values.jam || null,
          customer: values.customer,
          alamat_install: values.alamat_install || null,
          no_hp: values.no_hp || null,
          type: values.type || null,
          qty_unit: values.qty_unit,
          stock: values.stock,
          harga: values.harga,
          web: values.web || null,
          qty_web: values.qty_web,
          kartu: values.kartu || null,
          qty_kartu: values.qty_kartu,
          paket: values.paket || null,
          pulsa: values.pulsa,
          teknisi: values.teknisi || null,
          payment: values.payment || null,
          catatan: values.catatan || null,
        })
        .eq("id", salesDetail.id!); // Update based on the sales detail's ID

      if (error) {
        throw error;
      }

      showSuccess("Detil penjualan berhasil diperbarui!");
      onOpenChange(false);
      onSuccess(); // Trigger refresh of sales data
    } catch (error: any) {
      showError(`Gagal memperbarui detil penjualan: ${error.message}`);
      console.error("Error updating sales detail:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Detil Penjualan</DialogTitle>
          <DialogDescription>Perbarui detail untuk catatan penjualan #{salesDetail.no_transaksi}.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kirim_install"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kirim/Install</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Kirim">Kirim</SelectItem>
                      <SelectItem value="Install">Install</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="no_transaksi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No Transaksi</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="invoice_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Invoice</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="new_old"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New/Old</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Old">Old</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="perusahaan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perusahaan (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tanggal"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal</FormLabel>
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
              name="hari"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hari (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jam (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 09:00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alamat_install"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Install (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="no_hp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No HP (Opsional)</FormLabel>
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
                  <FormLabel>Type (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qty_unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qty Unit</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="harga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="web"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WEB (Opsional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status WEB" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Ya">Ya</SelectItem>
                      <SelectItem value="Tidak">Tidak</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qty_web"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qty Web</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kartu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kartu (Opsional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status Kartu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Ada">Ada</SelectItem>
                      <SelectItem value="Tidak">Tidak</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qty_kartu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qty Kartu</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paket"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paket (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pulsa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pulsa</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teknisi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teknisi (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="catatan"
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
            <div className="md:col-span-full">
              <Button type="submit" className="w-full mt-6" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Simpan Detil Penjualan"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSalesDetailForm;