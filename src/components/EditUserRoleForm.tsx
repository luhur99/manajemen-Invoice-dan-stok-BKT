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
import { UserWithProfile } from "@/types/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  role: z.enum(["admin", "staff", "user"], {
    required_error: "Peran wajib dipilih.",
  }),
});

interface EditUserRoleFormProps {
  user: UserWithProfile;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditUserRoleForm: React.FC<EditUserRoleFormProps> = ({ user, isOpen, onOpenChange, onSuccess }) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: user.role as "admin" | "staff" | "user",
    },
  });

  useEffect(() => {
    if (isOpen && user) {
      form.reset({
        role: user.role as "admin" | "staff" | "user",
      });
    }
  }, [isOpen, user, form]);

  const updateRoleMutation = useMutation({
    mutationFn: async (newRole: "admin" | "staff" | "user") => {
      // This update needs to be done by an admin, so we'll use an Edge Function
      const { data, error } = await supabase.functions.invoke('update-user-role', {
        body: JSON.stringify({ userId: user.id, newRole }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (error) throw error;
      if (data && data.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsersWithProfiles"] });
      showSuccess("Peran pengguna berhasil diperbarui!");
      onOpenChange(false);
      onSuccess();
    },
    onError: (err) => {
      showError(`Gagal memperbarui peran: ${err.message}`);
      console.error("Error updating user role:", err);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateRoleMutation.mutate(values.role);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Peran Pengguna</DialogTitle>
          <DialogDescription>
            Perbarui peran untuk pengguna "{user.email}".
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={updateRoleMutation.isPending}>
              {updateRoleMutation.isPending ? (
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

export default EditUserRoleForm;