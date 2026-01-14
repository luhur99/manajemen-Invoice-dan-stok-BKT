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
import { CalendarIcon, PlusIcon, TrashIcon } from 'lucide-react';

const invoiceItemSchema = z.object({
  item_name: z.string().min(1, { message: 'Nama item wajib diisi.' }),
  quantity: z.coerce.number().min(1, { message: 'Kuantitas harus minimal 1.' }),
  unit_price: z.coerce.number().min(0, { message: 'Harga satuan harus positif.' }),
  unit_type: z.string().optional(),
});

const formSchema = z.object({
  invoice_number: z.string().min(1, { message: 'Nomor faktur wajib diisi.' }),
  invoice_date: z.date({ required_error: "Tanggal faktur wajib diisi." }),
  due_date: z.date().optional(),
  customer_name: z.string().min(1, { message: 'Nama pelanggan wajib diisi.' }),
  company_name: z.string().optional(),
  type: z.string().optional(),
  customer_type: z.string().optional(),
  payment_method: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, { message: 'Minimal harus ada 1 item.' }),
});

interface AddInvoiceFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
}

const AddInvoiceForm: React.FC<AddInvoiceFormProps> = ({ onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoice_number: '',
      invoice_date: new Date(),
      due_date: undefined,
      customer_name: '',
      company_name: '',
      type: '',
      customer_type: '',
      payment_method: '',
      notes: '',
      items: [
        {
          item_name: '',
          quantity: 1,
          unit_price: 0,
          unit_type: 'pcs',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const handleAddItem = () => {
    append({
      item_name: '',
      quantity: 1,
      unit_price: 0,
      unit_type: 'pcs',
    });
  };

  const handleRemoveItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="invoice_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Faktur</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: INV-2023-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="invoice_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Faktur</FormLabel>
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
            name="customer_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Pelanggan</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Budi Santoso" {...field} />
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
                  <Input placeholder="Ex: PT ABC" {...field} />
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
                <FormLabel>Jenis Faktur</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis faktur" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="product">Produk</SelectItem>
                    <SelectItem value="service">Layanan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customer_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipe Pelanggan</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe pelanggan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="individual">Individu</SelectItem>
                    <SelectItem value="company">Perusahaan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payment_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Metode Pembayaran</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih metode pembayaran" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="cash">Tunai</SelectItem>
                    <SelectItem value="transfer">Transfer Bank</SelectItem>
                    <SelectItem value="credit_card">Kartu Kredit</SelectItem>
                    <SelectItem value="debit_card">Kartu Debit</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Item Faktur</h3>
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
                  name={`items.${index}.item_name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Item</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Kipas Angin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
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

              <div className="md:col-span-3">
                <FormField
                  control={form.control}
                  name={`items.${index}.unit_price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga Satuan (Rp)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" placeholder="0" {...field} />
                      </FormControl>
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

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name={`items.${index}.unit_type`}
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
            </div>
          ))}
          {form.formState.errors.items && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.items.message}
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
                <Textarea placeholder="Catatan tambahan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : 'Simpan Faktur'}
        </Button>
      </form>
    </Form>
  );
};

export default AddInvoiceForm;