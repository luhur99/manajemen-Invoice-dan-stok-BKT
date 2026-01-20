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
import * as z from "zod";

// Define a local schema for this section's fields for clarity
const productInfoSchema = z.object({
  qty_unit: z.coerce.number().min(0, "Kuantitas unit tidak boleh negatif").default(0),
  stock: z.coerce.number().min(0, "Stok tidak boleh negatif").default(0),
  harga: z.coerce.number().min(0, "Harga tidak boleh negatif").default(0),
  web: z.enum(["Ya", "Tidak"]).optional(),
  qty_web: z.coerce.number().min(0, "Kuantitas web tidak boleh negatif").default(0),
  kartu: z.enum(["Ada", "Tidak"]).optional(),
  qty_kartu: z.coerce.number().min(0, "Kuantitas kartu tidak boleh negatif").default(0),
  paket: z.string().optional(),
  pulsa: z.coerce.number().min(0, "Pulsa tidak boleh negatif").default(0),
});

interface ProductInfoSectionProps {
  // No props needed as it uses useFormContext
}

const ProductInfoSection: React.FC<ProductInfoSectionProps> = () => {
  const { control } = useFormContext();

  return (
    <>
      <FormField
        control={control}
        name="qty_unit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Qty Unit</FormLabel>
            <FormControl>
              <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="stock"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stock</FormLabel>
            <FormControl>
              <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="harga"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Harga</FormLabel>
            <FormControl>
              <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="web"
        render={({ field }) => (
          <FormItem>
            <FormLabel>WEB (Opsional)</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status WEB" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Ya">Ya</SelectItem>
                <SelectItem value="Tidak">Tidak</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="qty_web"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Qty Web</FormLabel>
            <FormControl>
              <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="kartu"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kartu (Opsional)</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status Kartu" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Ada">Ada</SelectItem>
                <SelectItem value="Tidak">Tidak</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="qty_kartu"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Qty Kartu</FormLabel>
            <FormControl>
              <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="paket"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Paket (Opsional)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="pulsa"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pulsa</FormLabel>
            <FormControl>
              <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ProductInfoSection;