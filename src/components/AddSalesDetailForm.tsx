"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

const formSchema = z.object({
  no: z.coerce.number().min(1, { message: 'Nomor wajib diisi.' }),
  kirim_install: z.string().min(1, { message: 'Kirim/Install wajib diisi.' }),
  no_transaksi: z.string().min(1, { message: 'No Transaksi wajib diisi.' }),
  invoice_number: z.string().min(1, { message: 'No Faktur wajib diisi.' }),
  new_old: z.string().optional(),
  perusahaan: z.string().optional(),
  tanggal: z.date({ required_error: "Tanggal wajib diisi." }),
  hari: z.string().optional(),
  jam: z.string().optional(),
  customer: z.string().min(1, { message: 'Customer wajib diisi.' }),
  alamat_install: z.string().optional(),
  no_hp: z.string().optional(),
  type: z.string().optional(),
  qty_unit: z.coerce.number().min(0, { message: 'Qty Unit harus positif.' }).optional(),
  stock: z.coerce.number().min(0, { message: 'Stock harus positif.' }).optional(),
  harga: z.coerce.number().min(0, { message: 'Harga harus positif.' }).optional(),
  web: z.string().optional(),
  qty_web: z.coerce.number().min(0, { message: 'Qty Web harus positif.' }).optional(),
  kartu: z.string().optional(),
  qty_kartu: z.coerce.number().min(0, { message: 'Qty Kartu harus positif.' }).optional(),
  paket: z.string().optional(),
  pulsa: z.coerce.number().min(0, { message: 'Pulsa harus positif.' }).optional(),
  teknisi: z.string().optional(),
  payment: z.string().optional(),
  catatan: z.string().optional(),
});

interface AddSalesDetailFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
}

const AddSalesDetailForm: React.FC<AddSalesDetailFormProps> = ({ onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      no: 1,
      kirim_install: '',
      no_transaksi: '',
      invoice_number: '',
      new_old: '',
      perusahaan: '',
      tanggal: undefined,
      hari: '',
      jam: '',
      customer: '',
      alamat_install: '',
      no_hp: '',
      type: '',
      qty_unit: 0,
      stock: 0,
      harga: 0,
      web: '',
      qty_web: 0,
      kartu: '',
      qty_kartu: 0,
      paket: '',
      pulsa: 0,
      teknisi: '',
      payment: '',
      catatan: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="1" {...field} />
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
                      <SelectValue placeholder="Pilih Kirim/Install" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="kirim">Kirim</SelectItem>
                    <SelectItem value="install">Install</SelectItem>
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
                  <Input placeholder="Ex: TRX001" {...field} />
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
                <FormLabel>No Faktur</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: INV001" {...field} />
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
                      <SelectValue placeholder="Pilih New/Old" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="old">Old</SelectItem>
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
                <FormLabel>Perusahaan</FormLabel>
                <FormControl>
                  <Input placeholder="Nama perusahaan" {...field} />
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
                          format(field.value, "dd MMMM yyyy", { locale: id })
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
                      disabled={(date) => date > new Date()}
                      initialFocus
                      locale={id}
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
                <FormLabel>Hari</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Senin" {...field} />
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
                <FormLabel>Jam</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 09:00" {...field} />
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
                  <Input placeholder="Nama customer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alamat_install"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Alamat Install</FormLabel>
                <FormControl>
                  <Textarea placeholder="Alamat lengkap" {...field} />
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
                <FormLabel>No HP</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 081234567890" {...field} />
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
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Input placeholder="Tipe produk" {...field} />
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
                  <Input type="number" min="0" placeholder="0" {...field} />
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
                  <Input type="number" min="0" placeholder="0" {...field} />
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
                  <Input type="number" min="0" placeholder="0" {...field} />
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
                <FormLabel>Web</FormLabel>
                <FormControl>
                  <Input placeholder="Website" {...field} />
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
                <FormLabel>Qty Web</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="0" {...field} />
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
                <FormLabel>Kartu</FormLabel>
                <FormControl>
                  <Input placeholder="Jenis kartu" {...field} />
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
                <FormLabel>Qty Kartu</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="0" {...field} />
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
                <FormLabel>Paket</FormLabel>
                <FormControl>
                  <Input placeholder="Jenis paket" {...field} />
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
                  <Input type="number" min="0" placeholder="0" {...field} />
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
                <FormLabel>Teknisi</FormLabel>
                <FormControl>
                  <Input placeholder="Nama teknisi" {...field} />
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
                <FormLabel>Payment</FormLabel>
                <FormControl>
                  <Input placeholder="Metode pembayaran" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="catatan"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Catatan</FormLabel>
                <FormControl>
                  <Textarea placeholder="Catatan tambahan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : 'Simpan Detail Penjualan'}
        </Button>
      </form>
    </Form>
  );
};

export default AddSalesDetailForm;