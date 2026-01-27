"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { CustomerTypeEnum } from "@/types/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/components/SessionContextProvider";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  customer_name: z.string().min(1, "Nama Pelanggan harus diisi."),
  company_name: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  phone_number: z.string().optional().nullable(),
  customer_type: z.nativeEnum(CustomerTypeEnum, { required_error: "Tipe Pelanggan harus diisi." }),
});

interface AddCustomerFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ isOpen, onOpenChange, onSuccess }) => {
  const { session } = useSession();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_name: "",
      company_name: "",
      address: "",
      phone_number: "",
      customer_type: CustomerTypeEnum.INDIVIDUAL, // Default to INDIVIDUAL
    },
  });

  const createCustomerMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!session?.user?.id) {
        throw new Error("Anda harus login untuk membuat pelanggan.");
      }
      const { data, error } = await supabase
        .from("customers")
        .insert({
          user_id: session.user.id,
          customer_name: values.customer_name,
          company_name: values.company_name,
          address: values.address,
          phone_number: values.phone_number,
          customer_type: values.customer_type,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      showSuccess("Pelanggan berhasil dibuat!");
      onOpenChange(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      onSuccess();
    },
    onError: (err: any) => {
      showError(`Gagal membuat pelanggan: ${err.message}`);
      console.error("Error creating customer:", err);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createCustomerMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
          <DialogDescription>
            Isi detail pelanggan baru di sini. Klik simpan saat Anda selesai.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pelanggan</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Nomor Telepon (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe pelanggan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(CustomerTypeEnum).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={createCustomerMutation.isPending}>
                {createCustomerMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerForm;