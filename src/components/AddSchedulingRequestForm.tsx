"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SchedulingRequest, SchedulingRequestType } from '@/api/schedulingRequests';

const formSchema = z.object({
  customer_name: z.string().min(1, 'Nama pelanggan wajib diisi'),
  company_name: z.string().optional(),
  type: z.enum(['install', 'service', 'survey'], { // FIX: Changed z.nativeEnum to z.enum
    errorMap: () => ({ message: 'Tipe permintaan wajib diisi' }),
  }),
  vehicle_units: z.coerce.number().min(0, 'Jumlah unit tidak boleh negatif').optional(),
  vehicle_type: z.string().optional(),
  vehicle_year: z.coerce.number().min(1900, 'Tahun kendaraan tidak valid').optional(),
  full_address: z.string().min(1, 'Alamat lengkap wajib diisi'),
  landmark: z.string().optional(),
  requested_date: z.date({
    required_error: 'Tanggal permintaan wajib diisi',
  }),
  requested_time: z.string().optional(),
  contact_person: z.string().min(1, 'Nama kontak wajib diisi'),
  phone_number: z.string().min(1, 'Nomor telepon wajib diisi'),
  customer_type: z.string().optional(),
  payment_method: z.string().optional(),
  notes: z.string().optional(),
});

interface AddSchedulingRequestFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
  existingRequest?: SchedulingRequest | null;
  onCancelEdit?: () => void;
}

const AddSchedulingRequestForm: React.FC<AddSchedulingRequestFormProps> = ({
  onSubmit,
  isLoading,
  existingRequest,
  onCancelEdit,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: existingRequest
      ? {
          ...existingRequest,
          requested_date: new Date(existingRequest.requested_date),
          vehicle_units: existingRequest.vehicle_units || 0,
          vehicle_year: existingRequest.vehicle_year || 0,
        }
      : {
          customer_name: '',
          company_name: '',
          type: 'install',
          vehicle_units: 0,
          vehicle_type: '',
          vehicle_year: 0,
          full_address: '',
          landmark: '',
          requested_date: new Date(),
          requested_time: '',
          contact_person: '',
          phone_number: '',
          customer_type: '',
          payment_method: '',
          notes: '',
        },
  });

  React.useEffect(() => {
    if (existingRequest) {
      form.reset({
        ...existingRequest,
        requested_date: new Date(existingRequest.requested_date),
        vehicle_units: existingRequest.vehicle_units || 0,
        vehicle_year: existingRequest.vehicle_year || 0,
      });
    } else {
      form.reset({
        customer_name: '',
        company_name: '',
        type: 'install',
        vehicle_units: 0,
        vehicle_type: '',
        vehicle_year: 0,
        full_address: '',
        landmark: '',
        requested_date: new Date(),
        requested_time: '',
        contact_person: '',
        phone_number: '',
        customer_type: '',
        payment_method: '',
        notes: '',
      });
    }
  }, [existingRequest, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Pelanggan</FormLabel>
              <FormControl>
                <Input placeholder="Nama Pelanggan" {...field} />
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
                <Input placeholder="Nama Perusahaan" {...field} />
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
              <FormLabel>Tipe Permintaan</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe permintaan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="install">Instalasi</SelectItem>
                  <SelectItem value="service">Servis</SelectItem>
                  <SelectItem value="survey">Survei</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="vehicle_units"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jumlah Unit Kendaraan (Opsional)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Jumlah Unit" {...field} />
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
                  <Input placeholder="Tipe Kendaraan" {...field} />
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
                  <Input type="number" placeholder="Tahun Kendaraan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="full_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat Lengkap</FormLabel>
              <FormControl>
                <Textarea placeholder="Alamat Lengkap" {...field} />
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
                <Input placeholder="Landmark terdekat" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pilih tanggal</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date('1900-01-01')}
                      initialFocus
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
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="contact_person"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kontak</FormLabel>
              <FormControl>
                <Input placeholder="Nama Kontak" {...field} />
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
                <Input placeholder="Nomor Telepon" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customer_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipe Pelanggan (Opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="Tipe Pelanggan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="payment_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Metode Pembayaran (Opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="Metode Pembayaran" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
        <div className="flex justify-end space-x-2">
          {existingRequest && onCancelEdit && (
            <Button type="button" variant="outline" onClick={onCancelEdit} disabled={isLoading}>
              Batal
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {existingRequest ? 'Simpan Perubahan' : 'Kirim Permintaan'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddSchedulingRequestForm;