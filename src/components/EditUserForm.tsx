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
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Profile } from "@/types/data"; // Import Profile type
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Added imports
import { formatDateSafely } from "@/lib/utils"; // Import formatDateSafely

// Define UserProfileWithAuth type as it's used in UserManagementPage
interface UserProfileWithAuth extends Profile {
  email: string;
}

const formSchema = z.object({
  first_name: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
  phone_number: z.string().optional().nullable(),
  role: z.enum(["admin", "staff", "user"], {
    required_error: "Peran wajib dipilih.",
  }),
});

interface EditUserFormProps {
  user: UserProfileWithAuth; // Changed type to UserProfileWithAuth
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, isOpen, onOpenChange, onSuccess }) => {
  const queryClient = useQueryClient(); // Corrected
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: user.first_name || "", // Access directly
      last_name: user.last_name || "",   // Access directly
      phone_number: user.phone_number || "", // Access directly
      role: user.role || "user",         // Access directly
    },
  });

  useEffect(() => {
    if (isOpen && user) {
      form.reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number || "",
        role: user.role || "user",
      });
    }
  }, [isOpen, user, form]);

  const updateProfileMutation = useMutation({ // Corrected
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // Update the role in the profiles table
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({
          first_name: values.first_name || null,
          last_name: values.last_name || null,
          phone_number: values.phone_number || null,
          role: values.role,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateProfileError) {
        throw updateProfileError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccess("Profil pengguna berhasil diperbarui!");
      onOpenChange(false);
      onSuccess();
    },
    onError: (err) => {
      showError(`Gagal memperbarui profil: ${err.message}`);
      console.error("Error updating user profile:", err);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateProfileMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Pengguna</DialogTitle>
          <DialogDescription>
            Perbarui detail dan peran untuk pengguna "{user.email}".
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peran</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
            <Button type="submit" className="w-full" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserForm;