"use client";

import React, { useState } from "react";
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
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form"; // Only Form component from ui/form
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/components/SessionContextProvider";
import { format } from "date-fns";

// Import the new modular sections
import BasicInfoSection from "./AddSalesDetailForm/BasicInfoSection";
import CustomerInfoSection from "./AddSalesDetailForm/CustomerInfoSection";
import ProductInfoSection from "./AddSalesDetailForm/ProductInfoSection";
import OtherDetailsSection from "./AddSalesDetailForm/OtherDetailsSection";

// Schema validasi menggunakan Zod
const formSchema = z.object({
  no: z.coerce.number().min(1, "Nomor wajib diisi"),
  kirim_install: z.enum(["Kirim", "Install"], {
    required_error: "Tipe Kirim/Install wajib dipilih",
  }),
  no_transaksi: z.string().min(1, "Nomor Transaksi wajib diisi").trim(),
  invoice_number: z.string().min(1, "Nomor Invoice wajib diisi").trim(),
  new_old: z.enum(["New", "Old"]).optional().nullable(),
  perusahaan: z.string().optional().nullable().trim(),
  tanggal: z.date({ required_error: "Tanggal wajib diisi" }),
  hari: z.string().optional().nullable().trim(),
  jam: z.string().optional().nullable().trim(),
  customer: z.string().min(1, "Nama Customer wajib diisi").trim(),
  alamat_install: z.string().optional().nullable().trim(),
  no_hp: z.string().optional().nullable().trim(),
  type: z.string().optional().nullable().trim(),
  qty_unit: z.coerce.number().min(0, "Kuantitas unit tidak boleh negatif").default(0),
  stock: z.coerce.number().min(0, "Stok tidak boleh negatif").default(0),
  harga: z.coerce.number().min(0, "Harga tidak boleh negatif").default(0),
  web: z.enum(["Ya", "Tidak"]).optional().nullable(),
  qty_web: z.coerce.number().min(0, "Kuantitas web tidak boleh negatif").default(0),
  kartu: z.enum(["Ada", "Tidak"]).optional().nullable(),
  qty_kartu: z.coerce.number().min(0, "Kuantitas kartu tidak boleh negatif").default(0),
  paket: z.string().optional().nullable().trim(),
  pulsa: z.coerce.number().min(0, "Pulsa tidak boleh negatif").default(0),
  teknisi: z.string().optional().nullable().trim(),
  payment: z.string().optional().nullable().trim(),
  catatan: z.string().optional().nullable().trim(),
});

interface AddSalesDetailFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddSalesDetailForm: React.FC<AddSalesDetailFormProps> = ({ isOpen, onOpenChange, onSuccess }) => {
  const { session } = useSession();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      no: 0,
      kirim_install: undefined,
      no_transaksi: "",
      invoice_number: "",
      new_old: undefined,
      perusahaan: "",
      tanggal: new Date(), // Set default date to today
      hari: "",
      jam: "",
      customer: "",
      alamat_install: "",
      no_hp: "",
      type: "",
      qty_unit: 0,
      stock: 0,
      harga: 0,
      web: undefined,
      qty_web: 0,
      kartu: undefined,
      qty_kartu: 0,
      paket: "",
      pulsa: 0,
      teknisi: "",
      payment: "",
      catatan: "",
    },
  });

  const addSalesDetailMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const userId = session?.user?.id;

      if (!userId) {
        throw new Error("Pengguna tidak terautentikasi.");
      }

      const { error } = await supabase
        .from("sales_details")
        .insert({
          user_id: userId,
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
        .select();

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess("Detil penjualan berhasil ditambahkan!");
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["salesDetails"] });
      onSuccess();
    },
    onError: (error: any) => {
      showError(`Gagal menambahkan detil penjualan: ${error.message}`);
      console.error("Error adding sales detail:", error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addSalesDetailMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Detil Penjualan Baru</DialogTitle>
          <DialogDescription>Isi detail untuk menambahkan catatan penjualan baru.</DialogDescription>
        </DialogHeader>
        <Form {...form}> {/* Use Form component from shadcn/ui */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <BasicInfoSection />
            <CustomerInfoSection />
            <ProductInfoSection />
            <OtherDetailsSection />
            
            <div className="md:col-span-full">
              <Button type="submit" className="w-full mt-6" disabled={addSalesDetailMutation.isPending}>
                {addSalesDetailMutation.isPending ? (
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

export default AddSalesDetailForm;