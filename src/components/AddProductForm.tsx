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
import { fetchProductByCodeOrName, fetchProducts, Product } from '@/api/stock';
import { useSession } from '@/components/SessionContextProvider';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import ProductForm from './ProductForm'; // Import ProductForm

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

// Schema validasi Zod yang diperbarui
const formSchema = z.object({
  kode_barang: z.string().min(1, { message: 'Kode barang wajib diisi.' }),
  nama_barang: z.string().min(1, { message: 'Nama barang wajib diisi.' }),
  satuan: z.string().min(1, { message: 'Satuan wajib diisi.' }),
  harga_beli: z.coerce.number().min(0, { message: 'Harga beli harus positif.' }),
  harga_jual: z.coerce.number().min(0, { message: 'Harga jual harus positif.' }),
  safe_stock_limit: z.coerce.number().min(0, { message: 'Batas stok aman harus positif.' }),
  initial_stock: z.coerce.number().min(0, { message: 'Stok awal tidak boleh negatif.' }).default(0),
  initial_stock_warehouse: z.enum(['siap_jual', 'riset', 'retur'], {
    required_error: "Silakan pilih gudang untuk stok awal.",
  }).default('siap_jual'),
});

interface AddProductFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
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
      initial_stock: 0, // Default stok awal
      initial_stock_warehouse: 'siap_jual', // Default gudang
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

  const { data: allProducts, isLoading: isLoadingAllProducts } = useQuery<Product[]>({
    queryKey: ['allProductsForSuggestions', userId],
    queryFn: () => fetchProducts(userId!),
    enabled: !!userId,
  });

  const [openKodeBarang, setOpenKodeBarang] = React.useState(false);
  const [openNamaBarang, setOpenNamaBarang] = React.useState(false);

  const handleProductFormSubmit = (values: Omit<z.infer<typeof formSchema>, 'initial_stock' | 'initial_stock_warehouse'>) => {
    if (isDuplicate) {
      form.setError('kode_barang', { type: 'manual', message: 'Produk dengan kode atau nama ini sudah ada.' });
      form.setError('nama_barang', { type: 'manual', message: 'Produk dengan kode atau nama ini sudah ada.' });
      return;
    }
    onSubmit({ ...values, initial_stock: form.getValues('initial_stock'), initial_stock_warehouse: form.getValues('initial_stock_warehouse') });
    form.reset({
      kode_barang: '',
      nama_barang: '',
      satuan: 'pcs',
      harga_beli: 0,
      harga_jual: 0,
      safe_stock_limit: 0,
      initial_stock: 0,
      initial_stock_warehouse: 'siap_jual',
    }); // Reset form ke default setelah submit
  };

  const handleInputChange = (field: 'kode_barang' | 'nama_barang', value: string) => {
    if (field === 'kode_barang') {
      form.setValue('kode_barang', value);
    } else {
      form.setValue('nama_barang', value);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleProductFormSubmit)} className="space-y-4">
        <ProductForm
          onSubmit={handleProductFormSubmit}
          isLoading={isLoading}
          isDuplicate={isDuplicate}
          onInputChange={handleInputChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input Stok Awal */}
          <FormField
            control={form.control}
            name="initial_stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stok Awal</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pilihan Gudang untuk Stok Awal */}
          <FormField
            control={form.control}
            name="initial_stock_warehouse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gudang Stok Awal</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih gudang" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="siap_jual">Siap Jual</SelectItem>
                    <SelectItem value="riset">Riset</SelectItem>
                    <SelectItem value="retur">Retur</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default AddProductForm;