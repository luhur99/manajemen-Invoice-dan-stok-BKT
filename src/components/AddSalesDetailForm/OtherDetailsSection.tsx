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
const otherDetailsSchema = z.object({
  teknisi: z.string().optional(),
  payment: z.string().optional(),
  catatan: z.string().optional(),
});

interface OtherDetailsSectionProps {
  // No props needed as it uses useFormContext
}

const OtherDetailsSection: React.FC<OtherDetailsSectionProps> = () => {
  const { control } = useFormContext();

  return (
    <>
      <FormField
        control={control}
        name="teknisi"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Teknisi (Opsional)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="payment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment (Opsional)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="catatan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Catatan (Opsional)</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default OtherDetailsSection;