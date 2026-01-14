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
import { fetchProductByCodeOrName, fetchProducts, Product } from '@/api/stock'; // Import fetchProducts
import { useSession } from '@/components/SessionContextProvider';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'; // Import icons
import { cn } from '@/lib/utils'; // Import cn utility
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

  // Query untuk memeriksa duplikat (exact match)
  const { data: existingProduct, isLoading: isLoadingExistingProduct } = useQuery<Product | null>({
    queryKey: ['checkDuplicateProduct', userId, debouncedKodeBarang, debouncedNamaBarang],
    queryFn: () => {
      if (!userId || (!debouncedKodeBarang && !debouncedNamaBarang)) return Promise.resolve(null);
      return fetchProductByCodeOrName(userId, debouncedKodeBarang, debouncedNamaBarang);
    },
    enabled: !!userId && (!!debouncedKodeBarang || !!debouncedNamaBarang),
  });

  const isDuplicate = !!existingProduct;

  // Query untuk mendapatkan semua produk sebagai saran combobox
  const { data: allProducts, isLoading: isLoadingAllProducts } = useQuery<Product[]>({
    queryKey: ['allProductsForSuggestions', userId],
    queryFn: () => fetchProducts(userId!),
    enabled: !!userId,
  });

  const [openKodeBarang, setOpenKodeBarang] = React.useState(false);
  const [openNamaBarang, setOpenNamaBarang] = React.useState(false);

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
              <FormItem className="flex flex-col">
                <FormLabel>Kode Barang</FormLabel>
                <Popover open={openKodeBarang} onOpenChange={setOpenKodeBarang}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? allProducts?.find(
                              (product) => product.kode_barang === field.value
                            )?.kode_barang
                          : "Pilih Kode Barang..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Cari kode barang..." />
                      <CommandEmpty>Tidak ada kode barang ditemukan.</CommandEmpty>
                      <CommandGroup>
                        {isLoadingAllProducts ? (
                          <CommandItem disabled className="flex items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" /> Memuat...
                          </CommandItem>
                        ) : (
                          allProducts?.filter(p => p.kode_barang.toLowerCase().includes(kodeBarangWatch.toLowerCase()))
                          .map((product) => (
                            <CommandItem
                              value={product.kode_barang}
                              key={product.id}
                              onSelect={() => {
                                form.setValue('kode_barang', product.kode_barang);
                                setOpenKodeBarang(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  product.kode_barang === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {product.kode_barang}
                            </CommandItem>
                          ))
                        )}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {isDuplicate && form.formState.errors.kode_barang && <FormMessage className="text-orange-500">{form.formState.errors.kode_barang.message}</FormMessage>}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nama_barang"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Nama Barang</FormLabel>
                <Popover open={openNamaBarang} onOpenChange={setOpenNamaBarang}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? allProducts?.find(
                              (product) => product.nama_barang === field.value
                            )?.nama_barang
                          : "Pilih Nama Barang..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Cari nama barang..." />
                      <CommandEmpty>Tidak ada nama barang ditemukan.</CommandEmpty>
                      <CommandGroup>
                        {isLoadingAllProducts ? (
                          <CommandItem disabled className="flex items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" /> Memuat...
                          </CommandItem>
                        ) : (
                          allProducts?.filter(p => p.nama_barang.toLowerCase().includes(namaBarangWatch.toLowerCase()))
                          .map((product) => (
                            <CommandItem
                              value={product.nama_barang}
                              key={product.id}
                              onSelect={() => {
                                form.setValue('nama_barang', product.nama_barang);
                                setOpenNamaBarang(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  product.nama_barang === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {product.nama_barang}
                            </CommandItem>
                          ))
                        )}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
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
        <Button type="submit" disabled={isLoading || isDuplicate || isLoadingExistingProduct || isLoadingAllProducts}>
          {isLoading ? 'Menambahkan...' : 'Tambah Produk'}
        </Button>
      </form>
    </Form>
  );
};

export default AddProductForm;