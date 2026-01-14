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
import { useQuery } from '@tanstack/react-query';
import { fetchProductByCodeOrName, Product } from '@/api/stock';
import { useSession } from '@/components/SessionContextProvider';
import { Loader2 } from 'lucide-react';

// Helper hook for debouncing values
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const formSchema = z.object({
  kode_barang: z.string().min(1, { message: 'Kode barang wajib diisi.' }),
  nama_barang: z.string().min(1, { message: 'Nama barang wajib diisi.' }),
  satuan: z.string().min(1, { message: 'Satuan wajib diisi.' }),
  harga_beli: z.coerce.number().min(0, { message: 'Harga beli harus positif.' }),
  harga_jual: z.coerce.number().min(0, { message: 'Harga jual harus positif.' }),
  safe_stock_limit: z.coerce.number().min(0, { message: 'Batas stok aman harus positif.' }),
});

interface AddProductFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isLoading: boolean; // isLoading dari mutasi di StockPage
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onSubmit, isLoading }) => {
  const { session } = useSession();
  const userId = session?.user?.id;

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

  const kodeBarangWatch = form.watch('kode_barang');
  const namaBarangWatch = form.watch('nama_barang');

  const debouncedKodeBarang = useDebounce(kodeBarangWatch, 500);
  const debouncedNamaBarang = useDebounce(namaBarangWatch, 500);

  const { data: existingProduct, isLoading: isLoadingExistingProduct } = useQuery<Product | null>({
    queryKey: ['checkDuplicateProduct', userId, debouncedKodeBarang, debouncedNamaBarang],
    queryFn: () => {
      if (!userId || (!debouncedKodeBarang && !debouncedNamaBarang)) return Promise.resolve(null);
      return fetchProductByCodeOrName(userId, debouncedKodeBarang, debouncedNamaBarang);
    },
    enabled: !!userId && (!!debouncedKodeBarang || !!debouncedNamaBarang),
  });

  const isDuplicate = !!existingProduct;

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (isDuplicate) {
      form.setError('kode_barang', { type: 'manual', message: 'Produk dengan kode atau nama ini sudah ada.' });
      form.setError('nama_barang', { type: 'manual', message: 'Produk dengan kode atau nama ini sudah ada.' });
      return;
    }
    onSubmit(values);
    form.reset(); // Reset form setelah berhasil submit
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                  />
                </FormControl>
                {isLoadingExistingProduct && debouncedKodeBarang && <p className="text-sm text-muted-foreground flex items-center"><Loader2 className="h-4 w-4 animate-spin mr-2" /> Memeriksa duplikat...</p>}
                {isDuplicate && form.formState.errors.kode_barang && <FormMessage className="text-orange-500">{form.formState.errors.kode_barang.message}</FormMessage>}
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
                  />
                </FormControl>
                {isLoadingExistingProduct && debouncedNamaBarang && <p className="text-sm text-muted-foreground flex items-center"><Loader2 className="h-4 w-4 animate-spin mr-2" /> Memeriksa duplikat...</p>}
                {isDuplicate && form.formState.errors.nama_barang && <FormMessage className="text-orange-500">{form.formState.errors.nama_barang.message}</FormMessage>}
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
        <Button type="submit" disabled={isLoading || isDuplicate || isLoadingExistingProduct}>
          {isLoading ? 'Menambahkan...' : 'Tambah Produk'}
        </Button>
      </form>
    </Form>
  );
};

export default AddProductForm;