"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Customer, CustomerTypeEnum } from "@/types/data";
import { useSession } from "@/components/SessionContextProvider";

// Schema validasi menggunakan Zod
const formSchema = z.object({
  customer_name: z.string().min(1, "Nama pelanggan wajib diisi."),
  company_name: z.string().optional(),
  address: z.string().optional(),
  phone_number: z.string().optional(),
  customer_type: z.nativeEnum(CustomerTypeEnum, {
    required_error: "Tipe pelanggan wajib dipilih.",
  }),
});

interface EditCustomerFormProps {
  customer: Customer;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditCustomerForm: React.FC<EditCustomerFormProps> = ({ customer, isOpen, onOpenChange, onSuccess }) => {
  const { session } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_name: customer.customer_name,
      company_name: customer.company_name || "",
      address: customer.address || "",
      phone_number: customer.phone_number || "",
      customer_type: customer.customer_type,
    },
  });

  useEffect(() => {
    if (isOpen && customer) {
      form.reset({
        customer_name: customer.customer_name,
        company_name: customer.company_name || "",
        address: customer.address || "",
        phone_number: customer.phone_number || "",
        customer_type: customer.customer_type,
      });
    }
  }, [isOpen, customer, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const userId = session?.user?.id;

    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    try {
      const { error } = await supabase
        .from("customers")
        .update({
          customer_name: values.customer_name,
          company_name: values.company_name || null,
          address: values.address || null,
          phone_number: values.phone_number || null,
          customer_type: values.customer_type,
          updated_at: new Date().toISOString(),
        })
        .eq("id", customer.id);

      if (error) {
        throw error;
      }

      showSuccess("Pelanggan berhasil diperbarui!");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      showError(`Gagal memperbarui pelanggan: ${error.message}`);
      console.error("Error updating customer:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Pelanggan: {customer.customer_name}</DialogTitle>
          <DialogDescription>Perbarui detail untuk pelanggan ini.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe pelanggan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(CustomerTypeEnum).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Alamat (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Alamat lengkap pelanggan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:col-span-2">
              <Button type="submit" className="w-full mt-6" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerForm;