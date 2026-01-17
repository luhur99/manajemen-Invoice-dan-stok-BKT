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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client"; // Used for invoking Edge Function
import { showSuccess, showError } from "@/utils/toast";
import { Profile } from "@/types/data"; // For role types

// Schema validasi menggunakan Zod
const formSchema = z.object({
  email: z.string().email("Email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
  confirmPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter."),
  first_name: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
  role: z.enum(["admin", "staff", "user"], {
    required_error: "Peran wajib dipilih.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password dan konfirmasi password tidak cocok.",
  path: ["confirmPassword"],
});

interface AddUserFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ isOpen, onOpenChange, onSuccess }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      first_name: "",
      last_name: "",
      role: "user", // Default role
    },
  });

  React.useEffect(() => {
    if (!isOpen) {
      form.reset(); // Reset form when dialog closes
    }
  }, [isOpen, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Invoke the Edge Function to create the user
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          first_name: values.first_name,
          last_name: values.last_name,
          role: values.role,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (error) {
        throw error;
      }

      // The Edge Function returns a JSON object with a message and userId
      if (data && data.error) {
        throw new Error(data.error);
      }

      showSuccess("Pengguna berhasil dibuat!");
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      showError(`Gagal membuat pengguna: ${error.message}`);
      console.error("Error creating user:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buat Pengguna Baru</DialogTitle>
          <DialogDescription>
            Isi detail untuk membuat akun pengguna baru.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konfirmasi Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Depan (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Belakang (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peran</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih peran" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-6" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Buat Pengguna"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserForm;