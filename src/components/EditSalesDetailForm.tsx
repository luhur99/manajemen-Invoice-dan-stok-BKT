"use client";

import React from "react";
import { useForm } from "react-hook-form"; // Removed FormProvider from here
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
  // Removed Form from here, as we'll use FormProvider directly
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
import { SalesDetail } from "@/types/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/components/SessionContextProvider";
import { Form } from "@/components/ui/form"; // Import Form component from shadcn/ui

const formSchema = z.object({
  no: z.number().int().positive("Nomor harus lebih dari 0."),
  kirim_install: z.enum(["Kirim", "Install"], { required_error: "Kirim/Install harus diisi." }),
  no_transaksi: z.string().min(1, "Nomor Transaksi harus diisi.").trim(),
  invoice_number: z.string().min(1, "Nomor Invoice harus diisi.").trim(),
  new_old: z.enum(["New", "Old"]).optional().nullable(),
  perusahaan: z.string().trim().optional().nullable(),
  tanggal: z.date({ required_error: "Tanggal harus diisi." }),
  hari: z.string().trim().optional().nullable(),
  jam: z.string().trim().optional().nullable(),
  customer: z.string().min(1, "Nama Pelanggan harus diisi.").trim(),
  alamat_install: z.string().trim().optional().nullable(),
  no_hp: z.string().trim().optional().nullable(),
  type: z.string().trim().optional().nullable(),
  qty_unit: z.number().int().min(0, "Kuantitas Unit tidak boleh negatif.").optional().nullable(),
  stock: z.number().int().min(0, "Stok tidak boleh negatif.").optional().nullable(),
  harga: z.number().min(0, "Harga tidak boleh negatif.").optional().nullable(),
  web: z.enum(["Ya", "Tidak"]).optional().nullable(),
  qty_web: z.number().int().min(0, "Kuantitas Web tidak boleh negatif.").optional().nullable(),
  kartu: z.enum(["Ada", "Tidak"]).optional().nullable(),
  qty_kartu: z.number().int().min(0, "Kuantitas Kartu tidak boleh negatif.").optional().nullable(),
  paket: z.string().trim().optional().nullable(),
  pulsa: z.number().min(0, "Pulsa tidak boleh negatif.").optional().nullable(),
  teknisi: z.string().trim().optional().nullable(),
  payment: z.string().trim().optional().nullable(),
  catatan: z.string().trim().optional().nullable(),
});

interface EditSalesDetailFormProps {
  salesDetail: SalesDetail;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditSalesDetailForm: React.FC<EditSalesDetailFormProps> = ({ salesDetail, isOpen, onOpenChange, onSuccess }) => {
  const { session } = useSession();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      no: salesDetail.no,
      kirim_install: salesDetail.kirim_install as "Kirim" | "Install",
      no_transaksi: salesDetail.no_transaksi,
      invoice_number: salesDetail.invoice_number,
      new_old: salesDetail.new_old as "New" | "Old" | undefined,
      perusahaan: salesDetail.perusahaan || "",
      tanggal: new Date(salesDetail.tanggal),
      hari: salesDetail.hari || "",
      jam: salesDetail.jam || "",
      customer: salesDetail.customer,
      alamat_install: salesDetail.alamat_install || "",
      no_hp: salesDetail.no_hp || "",
      type: salesDetail.type || "",
      qty_unit: salesDetail.qty_unit || 0,
      stock: salesDetail.stock || 0,
      harga: salesDetail.harga || 0,
      web: salesDetail.web as "Ya" | "Tidak" | undefined,
      qty_web: salesDetail.qty_web || 0,
      kartu: salesDetail.kartu as "Ada" | "Tidak" | undefined,
      qty_kartu: salesDetail.qty_kartu || 0,
      paket: salesDetail.paket || "",
      pulsa: salesDetail.pulsa || 0,
      teknisi: salesDetail.teknisi || "",
      payment: salesDetail.payment || "",
      catatan: salesDetail.catatan || "",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        no: salesDetail.no,
        kirim_install: salesDetail.kirim_install as "Kirim" | "Install",
        no_transaksi: salesDetail.no_transaksi,
        invoice_number: salesDetail.invoice_number,
        new_old: salesDetail.new_old as "New" | "Old" | undefined,
        perusahaan: salesDetail.perusahaan || "",
        tanggal: new Date(salesDetail.tanggal),
        hari: salesDetail.hari || "",
        jam: salesDetail.jam || "",
        customer: salesDetail.customer,
        alamat_install: salesDetail.alamat_install || "",
        no_hp: salesDetail.no_hp || "",
        type: salesDetail.type || "",
        qty_unit: salesDetail.qty_unit || 0,
        stock: salesDetail.stock || 0,
        harga: salesSeta.harga || 0,
        web: salesDetail.web as "Ya" | "Tidak" | undefined,
        qty_web: salesDetail.qty_web || 0,
        kartu: salesDetail.kartu as "Ada" | "Tidak" | undefined,
        qty_kartu: salesDetail.qty_kartu || 0,
        paket: salesDetail.paket || "",
        pulsa: salesDetail.pulsa || 0,
        teknisi: salesDetail.teknisi || "",
        payment: salesDetail.payment || "",
        catatan: salesDetail.catatan || "",
      });
    }
  }, [isOpen, salesDetail, form]);

  // Mutation for updating a sales detail
  const updateSalesDetailMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("Pengguna tidak terautentikasi.");
      }

      const { error } = await supabase
        .from("sales_details")
        .update({
          no: values.no,
          kirim_install: values.kirim_install,
          no_transaksi: values.no_transaksi,
          invoice_number: values.invoice_number,
          new_old: values.new_old,
          perusahaan: values.perusahaan,
          tanggal: format(values.tanggal as Date, "yyyy-MM-dd"),
          hari: values.hari,
          jam: values.jam,
          customer: values.customer,
          alamat_install: values.alamat_install,
          no_hp: values.no_hp,
          type: values.type,
          qty_unit: values.qty_unit,
          stock: values.stock,
          harga: values.harga,
          web: values.web,
          qty_web: values.qty_web,
          kartu: values.kartu,
          qty_kartu: values.qty_kartu,
          paket: values.paket,
          pulsa: values.pulsa,
          teknisi: values.teknisi,
          payment: values.payment,
          catatan: values.catatan,
          updated_at: new Date().toISOString(),
        })
        .eq("id", salesDetail.id);

      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Detail penjualan berhasil diperbarui!");
      onSuccess();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["salesDetails"] }); // Invalidate to refetch list
    },
    onError: (err: any) => {
      showError(`Gagal memperbarui detail penjualan: ${err.message}`);
      console.error("Error updating sales detail:", err);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateSalesDetailMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Detail Penjualan</DialogTitle>
          <DialogDescription>
            Ubah detail penjualan di sini. Klik simpan saat Anda selesai.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}> {/* Use Form component from shadcn/ui */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No.</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
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
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="no_transaksi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Transaksi</FormLabel>
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
                    <FormLabel>No. Invoice</FormLabel>
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
                    <FormLabel>Baru/Lama (Opsional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                      <Input {...field} />
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
                    <FormLabel>Pelanggan</FormLabel>
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
                    <FormLabel>No. HP (Opsional)</FormLabel>
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
                name="qty_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qty Unit (Opsional)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
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
                    <FormLabel>Stok (Opsional)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
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
                    <FormLabel>Harga (Opsional)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
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
                    <FormLabel>Web (Opsional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="qty_web"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qty Web (Opsional)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
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
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="qty_kartu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qty Kartu (Opsional)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
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
                    <FormLabel>Pulsa (Opsional)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
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
                    <FormLabel>Pembayaran (Opsional)</FormLabel>
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
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updateSalesDetailMutation.isPending}>
                {updateSalesDetailMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form> {/* Close FormProvider */}
      </DialogContent>
    </Dialog>
  );
};

export default EditSalesDetailForm;