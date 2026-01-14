"use client";

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { CalendarIcon, PlusIcon, TrashIcon, Loader2 } from 'lucide-react'; // Import Loader2
import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { fetchProducts, Product } from '@/api/stock';
import { DeliveryOrder, DeliveryOrderItem } from '@/api/deliveryOrders'; // Import DeliveryOrder type

const deliveryOrderItemSchema = z.object({
  product_id: z.string().min(1, { message: 'Produk wajib dipilih.' }),
  product_name: z.string().min(1, { message: 'Nama produk wajib diisi.' }),
  quantity: z.coerce.number().min(1, { message: 'Kuantitas harus minimal 1.' }),
  unit_type: z.string().min(1, { message: 'Satuan wajib diisi.' }),
});

const formSchema = z.object({
  request_id: z.string().optional(),
  do_number: z.string().min(1, { message: 'Nomor DO wajib diisi.' }),
  items_json: z.array(deliveryOrderItemSchema).min(1, { message: 'Minimal harus ada 1 item.' }),
  delivery_date: z.date({ required_error: "Tanggal pengiriman wajib diisi." }),
  delivery_time: z.string().optional(),
  notes: z.string().optional(),
});

interface AddDeliveryOrderFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
  existingOrder?: DeliveryOrder | null; // New prop for existing order
  onCancelEdit?: () => void; // New prop to cancel edit
}

const AddDeliveryOrderForm: React.FC<AddDeliveryOrderFormProps> = ({ onSubmit, isLoading, existingOrder, onCancelEdit }) => {
  const { session } = useSession();
  const userId = session?.user?.id;

  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['products', userId],
    queryFn: () => fetchProducts(userId!),
    enabled: !!userId,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      request_id: '',
      do_number: '',
      items_json: [
        {
          product_id: '',
          product_name: '',
          quantity: 1,
          unit_type: 'pcs',
        },
      ],
      delivery_date: undefined,
      delivery_time: '',
      notes: '',
    },
  });

  React.useEffect(() => {
    if (existingOrder) {
      form.reset({
        request_id: existingOrder.request_id || '',
        do_number: existingOrder.do_number,
        items_json: existingOrder.items_json.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_type: item.unit_type,
        })),
        delivery_date: new Date(existingOrder.delivery_date),
        delivery_time: existingOrder.delivery_time || '',
        notes: existingOrder.notes || '',
      });
    } else {
      form.reset({
        request_id: '',
        do_number: '',
        items_json: [
          {
            product_id: '',
            product_name: '',
            quantity: 1,
            unit_type: 'pcs',
          },
        ],
        delivery_date: undefined,
        delivery_time: '',
        notes: '',
      });
    }
  }, [existingOrder, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items_json",
  });

  const handleAddItem = () => {
    append({
      product_id: '',
      product_name: '',
      quantity: 1,
      unit_type: 'pcs',
    });
  };

  const handleRemoveItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handleProductChange = (index: number, productId: string) => {
    const selectedProduct = products?.find(p => p.id === productId);
    if (selectedProduct) {
      form.setValue(`items_json.${index}.product_id`, selectedProduct.id);
      form.setValue(`items_json.${index}.product_name`, selectedProduct.nama_barang);
      form.setValue(`items_json.${index}.unit_type`, selectedProduct.satuan || 'pcs');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="do_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor DO</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: DO-2023-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="request_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Permintaan (Opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: ID Permintaan Terkait" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="delivery_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Pengiriman</FormLabel>
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
                      disabled={(date) => date < new Date()}
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
            name="delivery_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waktu Pengiriman (Opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 09:00 - 12:00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Item Pengiriman</h3>
            <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Tambah Item
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-lg">
              <div className="md:col-span-5">
                <FormField
                  control={form.control}
                  name={`items_json.${index}.product_id`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel>Produk</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          itemField.onChange(value);
                          handleProductChange(index, value);
                        }}
                        value={itemField.value}
                        disabled={isLoadingProducts}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Produk" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingProducts ? (
                            <SelectItem value="loading" disabled>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Memuat produk...
                            </SelectItem>
                          ) : (
                            products?.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.nama_barang} ({product.kode_barang})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-3">
                <FormField
                  control={form.control}
                  name={`items_json.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kuantitas</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" placeholder="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name={`items_json.${index}.unit_type`}
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
              </div>

              <div className="md:col-span-2 flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveItem(index)}
                  disabled={fields.length <= 1}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {form.formState.errors.items_json && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.items_json.message}
            </p>
          )}
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan (Opsional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Catatan tambahan untuk pesanan pengiriman" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : (existingOrder ? 'Update Pesanan Pengiriman' : 'Buat Pesanan Pengiriman')}
          </Button>
          {existingOrder && (
            <Button type="button" variant="outline" onClick={onCancelEdit} disabled={isLoading}>
              Batal Edit
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default AddDeliveryOrderForm;