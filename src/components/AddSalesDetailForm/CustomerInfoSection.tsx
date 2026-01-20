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
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";

// Define a local schema for this section's fields for clarity
const customerInfoSchema = z.object({
  customer: z.string().min(1, "Nama Customer wajib diisi"),
  alamat_install: z.string().optional(),
  no_hp: z.string().optional(),
  type: z.string().optional(),
});

interface CustomerInfoSectionProps {
  // No props needed as it uses useFormContext
}

const CustomerInfoSection: React.FC<CustomerInfoSectionProps> = () => {
  const { control } = useFormContext();

  return (
    <>
      <FormField
        control={control}
        name="customer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Customer</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="alamat_install"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alamat Install (Opsional)</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="no_hp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>No HP (Opsional)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type (Opsional)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default CustomerInfoSection;