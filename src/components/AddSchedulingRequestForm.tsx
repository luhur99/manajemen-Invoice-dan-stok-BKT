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
import { SchedulingRequest, SchedulingRequestType } from '@/api/schedulingRequests'; // Import SchedulingRequest type

const formSchema = z.object({
  customer_name: z.string().min(1, { message: 'Nama pelanggan wajib diisi.' }),
  company_name: z.string().optional(),
  type: z.enum(['installation', 'maintenance', 'service', 'delivery'], {
    required_error: "Jenis permintaan wajib diisi.",
  }),
  vehicle_units: z.coerce.number().min(0).optional(),
  vehicle_type: z.string().optional(),
  vehicle_year: z.coerce.number().min(1900).max(new Date().getFullYear() + 5).optional(),
  full_address: z.string().min(1, { message: 'Alamat lengkap wajib diisi.' }),
  landmark: z.string().optional(),
  requested_date: z.date({ required_error: "Tanggal permintaan wajib diisi." }),
  requested_time: z.string().optional(),
  contact_person: z.string().min(1, { message: 'Nama kontak wajib diisi.' }),
  phone_number: z.string().min(1, { message: 'Nomor telepon wajib diisi.' }),
  customer_type: z.string().optional(),
  payment_method: z.string().optional(),
  notes: z.string().optional(),
});

interface AddSchedulingRequestFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
  existingRequest?: SchedulingRequest | null; // New prop for existing request
  onCancelEdit?: () => void; // New prop to cancel edit
}

const AddSchedulingRequestForm: React.FC<AddSchedulingRequestFormProps> = ({ onSubmit, isLoading, existingRequest, onCancelEdit }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_name: '',
      company_name: '',
      type: 'installation',
      vehicle_units: 0,
      vehicle_type: '',
      vehicle_year: undefined,
      full_address: '',
      landmark: '',
      requested_date: undefined,
      requested_time: '',
      contact_person: '',
      phone_number: '',
      customer_type: 'individual',
      payment_method: 'cash',
      notes: '',
    },
  });

  React.useEffect(() => {
    if (existingRequest) {
      form.reset({
        customer_name: existingRequest.customer_name,
        company_name: existingRequest.company_name || '',
        type: existingRequest.type,
        vehicle_units: existingRequest.vehicle_units || 0,
        vehicle_type: existingRequest.vehicle_type || '',
        vehicle_year: existingRequest.vehicle_year || undefined,
        full_address: existingRequest.full_address,
        landmark: existingRequest.landmark || '',
        requested_date: new Date(existingRequest.requested_date),
        requested_time: existingRequest.requested_time || '',
        contact_person: existingRequest.contact_person,
        phone_number: existingRequest.phone_number,
        customer_type: existingRequest.customer_type || 'individual',
        payment_method: existingRequest.payment_method || 'cash',
        notes: existingRequest.notes || '',
      });
    } else {
      form.reset({
        customer_name: '',
        company_name: '',
        type: 'installation',
        vehicle_units: 0,
        vehicle_type: '',
        vehicle_year: undefined,
        full_address: '',
        landmark: '',
        requested_date: undefined,
        requested_time: '',
        contact_person: '',
        phone_number: '',
        customer_type: 'individual',
        payment_method: 'cash',
        notes: '',
      });
    }
  }, [existingRequest, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <FormLabel>Jenis Permintaan</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis permintaan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="installation">Instalasi</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="delivery">Pengiriman</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicle_units"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jumlah Unit Kendaraan (Opsional)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicle_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipe Kendaraan (Opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Mobil, Motor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicle_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tahun Kendaraan (Opsional)</FormLabel>
                <FormControl>
                  <Input type="number" min="1900" max={new Date().getFullYear() + 5} placeholder="Ex: 2023" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="full_address"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Alamat Lengkap</FormLabel>
                <FormControl>
                  <Textarea placeholder="Alamat lengkap untuk penjadwalan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="landmark"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Landmark (Opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Dekat lampu merah" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requested_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Permintaan</FormLabel>
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
            name="requested_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waktu Permintaan (Opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 09:00 - 12:00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_person"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Kontak</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Budi Santoso" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Telepon</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 081234567890" {...field} />
                </FormControl>
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

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Catatan (Opsional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Catatan tambahan untuk permintaan penjadwalan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex space-x-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Mengirim Permintaan...' : (existingRequest ? 'Update Permintaan' : 'Kirim Permintaan Penjadwalan')}
          </Button>
          {existingRequest && (
            <Button type="button" variant="outline" onClick={onCancelEdit} disabled={isLoading}>
              Batal Edit
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default AddSchedulingRequestForm;