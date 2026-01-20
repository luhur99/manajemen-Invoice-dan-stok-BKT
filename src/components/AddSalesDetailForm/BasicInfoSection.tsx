"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as z from "zod";
import { Button } from "@/components/ui/button"; // Import Button component

// Define a local schema for this section's fields for clarity, though the main form will have the full schema
const basicInfoSchema = z.object({
  no: z.coerce.number().min(1, "Nomor wajib diisi"),
  kirim_install: z.enum(["Kirim", "Install"], {
    required_error: "Tipe Kirim/Install wajib dipilih",
  }),
  no_transaksi: z.string().min(1, "Nomor Transaksi wajib diisi"),
  invoice_number: z.string().min(1, "Nomor Invoice wajib diisi"),
  new_old: z.enum(["New", "Old"]).optional(),
  perusahaan: z.string().optional(),
  tanggal: z.date({ required_error: "Tanggal wajib diisi" }),
  hari: z.string().optional(),
  jam: z.string().optional(),
});

interface BasicInfoSectionProps {
  // No props needed as it uses useFormContext
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = () => {
  const { control } = useFormContext();

  return (
    <>
      <FormField
        control={control}
        name="no"
        render={({ field }) => (
          <FormItem>
            <FormLabel>No</FormLabel>
            <FormControl>
              <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="kirim_install"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kirim/Install</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Kirim">Kirim</SelectItem>
                <SelectItem value="Install">Install</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="no_transaksi"
        render={({ field }) => (
          <FormItem>
            <FormLabel>No Transaksi</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="invoice_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nomor Invoice</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="new_old"
        render={({ field }) => (
          <FormItem>
            <FormLabel>New/Old</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Old">Old</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="perusahaan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Perusahaan (Opsional)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
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
                      format(field.value, "PPP")
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
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="hari"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hari (Opsional)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="jam"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Jam (Opsional)</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 09:00" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default BasicInfoSection;