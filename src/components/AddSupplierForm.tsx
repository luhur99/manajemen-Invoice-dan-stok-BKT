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
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { useSession } from "@/components/SessionContextProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDateSafely } from "@/lib/utils"; // Import formatDateSafely

// Schema validasi menggunakan Zod
const formSchema = z.object({
  name: z.string().min(1, "Nama pemasok wajib diisi"),
  contact_person: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  address: z.string().optional(),
  notes: z.string().optional(),
});

interface AddSupplierFormProps {
  onSuccess: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddSupplierForm: React.FC<AddSupplierFormProps> = ({ onSuccess, isOpen, onOpenChange }) => {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact_person: "",
      phone_number: "",
      email: "",
      address: "",
      notes: "",
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: "",
        contact_person: "",
        phone_number: "",
        email: "",
        address: "",
        notes: "",
      });
    }
  }, [isOpen, form]);

  // Define the mutation for adding a supplier
  const addSupplierMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("Pengguna tidak terautentikasi.");
      }

      const { error } = await supabase
        .from("suppliers")
        .insert({
          user_id: userId,
          name: values.name,
          contact_person: values.contact_person || null,
          phone_number: values.phone_number || null,
          email: values.email || null,
          address: values.address || null,
          notes: values.notes || null,
        });

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess("Pemasok berhasil ditambahkan!");
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      onSuccess();
    },
    onError: (error: any) => {
      showError(`Gagal menambahkan pemasok: ${error.message}`);
      console.error("Error adding supplier:", error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addSupplierMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* Removed DialogTrigger asChild */}
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Pemasok Baru</DialogTitle>
          <DialogDescription>Isi detail untuk menambahkan pemasok baru.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pemasok</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Kontak Person (Opsional)</FormLabel>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Opsional)</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
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
                    <Textarea placeholder="Alamat lengkap pemasok" {...field} />
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
                    <Textarea placeholder="Catatan tambahan tentang pemasok ini..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:col-span-2">
              <Button type="submit" className="w-full" disabled={addSupplierMutation.isPending}>
                {addSupplierMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Tambah Pemasok"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSupplierForm;