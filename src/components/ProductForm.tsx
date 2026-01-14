"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product } from '@/api/stock'; // Import Product type

const formSchema = z.object({
  kode_barang: z.string().min(1, { message: 'Kode barang wajib diisi.' }),
  nama_barang: z.string().min(1, { message: 'Nama barang wajib diisi.' }),
  satuan: z.string().min(1, { message: 'Satuan wajib diisi.' }),
  harga_beli: z.coerce.number().min(0, { message: 'Harga beli harus positif.' }),
  harga_jual: z.coerce.number().min(0, { message: 'Harga jual harus positif.' }),
  safe_stock_limit: z.coerce.number().min(0, { message: 'Batas stok aman harus positif.' }),
});

interface ProductFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
  existingProduct?: Product | null; // Produk yang sudah ada untuk pre-populasi
  onInputChange?: (field: 'kode_barang' | 'nama_barang', value: string) => void; // Callback untuk perubahan input
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, isLoading, existingProduct, onInputChange }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode_barang: '',
      nama_barang: '',
      satuan: 'pcs',
      harga_beli: 0,
      harga_jual: 0,
      safe_stock_limit: 0,
    },
  });

  React.useEffect(() => {
    if (existingProduct) {
      // Use setValue for more reliable pre-population
      form.setValue('kode_barang', existingProduct.kode_barang);
      form.setValue('nama_barang', existingProduct.nama_barang);
      form.setValue('satuan', existingProduct.satuan);
      form.setValue('harga_beli', existingProduct.harga_beli);
      form.setValue('harga_jual', existingProduct.harga_jual);
      form.setValue('safe_stock_limit', existingProduct.safe_stock_limit);
    } else {
      // Reset form to default values if no existing product is found
      form.reset({
        kode_barang: '',
        nama_barang: '',
        satuan: 'pcs',
        harga_beli: 0,
        harga_jual: 0,
        safe_stock_limit: 0,
      });
    }
  }, [existingProduct, form]);

  const isDuplicate = existingProduct && (
    form.watch('kode_barang') === existingProduct.kode_barang ||
    form.watch('nama_barang') === existingProduct.nama_barang
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="kode_barang"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kode Barang</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: BRG001"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      onInputChange?.('kode_barang', e.target.value);
                    }}
                  />
                </FormControl>
                {isDuplicate && <FormMessage className="text-orange-500">Produk dengan kode ini sudah ada.</FormMessage>}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nama_barang"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Barang</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Kipas Angin"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      onInputChange?.('nama_barang', e.target.value);
                    }}
                  />
                </FormControl>
                {isDuplicate && <FormMessage className="text-orange-500">Produk dengan nama ini sudah ada.</FormMessage>}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="satuan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Satuan</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih satuan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pcs">Pcs</SelectItem>
                    <SelectItem value="unit">Unit</SelectItem>
                    <SelectItem value="box">Box</SelectItem>
                    <SelectItem value="set">Set</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="harga_beli"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga Beli</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="harga_jual"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga Jual</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="safe_stock_limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batas Stok Aman</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isLoading || isDuplicate}>
          {isLoading ? 'Menambahkan...' : 'Tambah Produk'}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;