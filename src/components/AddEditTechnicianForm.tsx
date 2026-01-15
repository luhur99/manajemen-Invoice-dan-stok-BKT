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
import { useSession } from "@/components/SessionContextProvider";
import { Technician, TechnicianType } from "@/types/data";

// Schema validasi menggunakan Zod
const formSchema = z.object({
  name: z.string().min(1, "Nama teknisi wajib diisi."),
  phone_number: z.string().optional().nullable(),
  type: z.nativeEnum(TechnicianType, {
    required_error: "Tipe teknisi wajib dipilih.",
  }),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  province: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.type === TechnicianType.EXTERNAL) {
    if (!data.address || data.address.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Alamat wajib diisi untuk teknisi eksternal.",
        path: ['address'],
      });
    }
    if (!data.city || data.city.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Kabupaten/Kota wajib diisi untuk teknisi eksternal.",
        path: ['city'],
      });
    }
    if (!data.province || data.province.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provinsi wajib diisi untuk teknisi eksternal.",
        path: ['province'],
      });
    }
  }
});

interface AddEditTechnicianFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData?: Technician | null;
}

const AddEditTechnicianForm: React.FC<AddEditTechnicianFormProps> = ({ isOpen, onOpenChange, onSuccess, initialData }) => {
  const { session } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone_number: null,
      type: TechnicianType.INTERNAL,
      address: null,
      city: null,
      province: null,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          phone_number: initialData.phone_number || null,
          type: initialData.type,
          address: initialData.address || null,
          city: initialData.city || null,
          province: initialData.province || null,
        });
      } else {
        form.reset({
          name: "",
          phone_number: null,
          type: TechnicianType.INTERNAL,
          address: null,
          city: null,
          province: null,
        });
      }
    }
  }, [isOpen, initialData, form]);

  const watchedType = form.watch("type");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const userId = session?.user?.id;

    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    try {
      const dataToSubmit = {
        name: values.name.trim(),
        phone_number: values.phone_number?.trim() || null,
        type: values.type,
        address: values.type === TechnicianType.EXTERNAL ? (values.address?.trim() || null) : null,
        city: values.type === TechnicianType.EXTERNAL ? (values.city?.trim() || null) : null,
        province: values.type === TechnicianType.EXTERNAL ? (values.province?.trim() || null) : null,
      };

      if (initialData) {
        const { error } = await supabase
          .from("technicians")
          .update({
            ...dataToSubmit,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData.id);

        if (error) {
          throw error;
        }
        showSuccess("Detail teknisi berhasil diperbarui!");
      } else {
        const { error } = await supabase
          .from("technicians")
          .insert({
            ...dataToSubmit,
            user_id: userId,
          });

        if (error) {
          throw error;
        }
        showSuccess("Teknisi berhasil ditambahkan!");
      }

      onOpenChange(false);
      onSuccess();
      form.reset();
    } catch (error: any) {
      showError(`Gagal menyimpan teknisi: ${error.message}`);
      console.error("Error saving technician:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Teknisi" : "Tambah Teknisi Baru"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Perbarui detail teknisi ini." : "Isi detail untuk menambahkan teknisi baru."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Teknisi</FormLabel>
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Teknisi</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe teknisi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TechnicianType).map((type) => (
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

            {watchedType === TechnicianType.EXTERNAL && (
              <>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Alamat Lengkap</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Alamat lengkap teknisi eksternal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kabupaten/Kota</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provinsi</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="md:col-span-2">
              <Button type="submit" className="w-full mt-6" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  initialData ? "Simpan Perubahan" : "Tambah Teknisi"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditTechnicianForm;