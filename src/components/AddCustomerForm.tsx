"use client";

import React from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { useSession } from "@/components/SessionContextProvider";
import { CustomerTypeEnum } from "@/types/data";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import useMutation and useQueryClient

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

interface AddCustomerFormProps {
  onSuccess: () => void;
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ onSuccess }) => {
  const { session } = useSession();
  const queryClient = useQueryClient(); // Initialize queryClient
  const [isOpen, setIsOpen] = React.useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_name: "",
      company_name: "",
      address: "",
      phone_number: "",
      customer_type: CustomerTypeEnum.B2C, // Default to B2C
    },
  });

  // Define the mutation for adding a customer
  const addCustomerMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const userId = session?.user?.id;

      if (!userId) {
        throw new Error("Pengguna tidak terautentikasi.");
      }

      const { error } = await supabase
        .from("customers")
        .insert({
          user_id: userId,
          customer_name: values.customer_name,
          company_name: values.company_name || null,
          address: values.address || null,
          phone_number: values.phone_number || null,
          customer_type: values.customer_type,
        });

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess("Pelanggan berhasil ditambahkan!");
      form.reset();
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["customers"] }); // Invalidate and refetch customers
      onSuccess();
    },
    onError: (error: any) => {
      showError(`Gagal menambahkan pelanggan: ${error.message}`);
      console.error("Error adding customer:", error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addCustomerMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> Tambah Pelanggan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
          <DialogDescription>Isi detail untuk menambahkan pelanggan baru.</DialogDescription>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe pelanggan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(CustomerTypeEnum).map((type) => (
                        <SelectItem key={type as string} value={type as string}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
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
              <Button type="submit" className="w-full mt-6" disabled={addCustomerMutation.isPending}>
                {addCustomerMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Tambah Pelanggan"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerForm;