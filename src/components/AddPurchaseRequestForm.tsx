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

const formSchema = z.object({
  item_name: z.string().min(1, { message: 'Nama item wajib diisi.' }),
  item_code: z.string().min(1, { message: 'Kode item wajib diisi.' }),
  quantity: z.coerce.number().min(1, { message: 'Kuantitas harus minimal 1.' }),
  unit_price: z.coerce.number().min(0, { message: 'Harga satuan harus positif.' }),
  suggested_selling_price: z.coerce.number().min(0, { message: 'Harga jual saran harus positif.' }),
  supplier: z.string().optional(),
  notes: z.string().optional(),
});

interface AddPurchaseRequestFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
}

const AddPurchaseRequestForm: React.FC<AddPurchaseRequestFormProps> = ({ onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item_name: '',
      item_code: '',
      quantity: 1,
      unit_price: 0,
      suggested_selling_price: 0,
      supplier: '',
      notes: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="item_name"
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

          <FormField
            control={form.control}
            name="item_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kode Item</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: BRG001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
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

          <FormField
            control={form.control}
            name="unit_price"
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

          <FormField
            control={form.control}
            name="suggested_selling_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga Jual Saran (Rp)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier (Opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="Nama supplier" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Catatan (Opsional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Catatan tambahan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : 'Simpan Permintaan'}
        </Button>
      </form>
    </Form>
  );
};

export default AddPurchaseRequestForm;