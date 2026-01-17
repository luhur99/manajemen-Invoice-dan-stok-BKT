"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { showError, showSuccess } from "@/utils/toast";
import { Product as ProductType, WarehouseCategory as WarehouseCategoryType, WarehouseInventory } from "@/types/data";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  from_category: z.string({
    required_error: "Kategori asal harus dipilih.",
  }).min(1, "Kategori asal harus dipilih."),
  to_category: z.string({
    required_error: "Kategori tujuan harus dipilih.",
  }).min(1, "Kategori tujuan harus dipilih."),
  quantity: z.number().int().positive("Kuantitas harus lebih dari 0."),
  notes: z.string().optional(),
});

interface StockMovementFormProps {
  product: ProductType;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const StockMovementForm: React.FC<StockMovementFormProps> = ({
  product,
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const [warehouseCategories, setWarehouseCategories] = useState<WarehouseCategoryType[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const fetchWarehouseCategories = useCallback(async () => {
    setLoadingCategories(true);
    const { data, error } = await supabase
      .from("warehouse_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      showError("Gagal memuat kategori gudang.");
      console.error("Error fetching warehouse categories:", error);
    } else {
      setWarehouseCategories(data as WarehouseCategoryType[]);
    }
    setLoadingCategories(false);
  }, []);

  const getCategoryDisplayName = (code: string) => {
    const category = warehouseCategories.find(cat => cat.code === code);
    return category ? category.name : code;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from_category: "",
      to_category: "",
      quantity: 0,
      notes: "",
    },
  });

  const { data: productInventories, isLoading: loadingInventories, error: inventoriesError, refetch: refetchInventories } = useQuery<WarehouseInventory[], Error>({
    queryKey: ["productInventories", product.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warehouse_inventories")
        .select("*")
        .eq("product_id", product.id);
      if (error) throw error;
      return data;
    },
    enabled: isOpen,
  });

  const availableFromCategories = productInventories?.filter(inv => inv.quantity > 0) || [];
  const allWarehouseCategoryCodes = warehouseCategories.map(cat => cat.code);

  const selectedFromCategory = form.watch("from_category");
  const availableToCategories = allWarehouseCategoryCodes.filter(
    (code) => code !== selectedFromCategory
  );

  const currentFromCategoryQuantity = productInventories?.find(
    (inv) => inv.warehouse_category === selectedFromCategory
  )?.quantity || 0;

  useEffect(() => {
    if (isOpen) {
      fetchWarehouseCategories();
      form.reset({
        from_category: "",
        to_category: "",
        quantity: 0,
        notes: "",
      });
      refetchInventories();
    }
  }, [isOpen, form, refetchInventories, fetchWarehouseCategories]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.quantity > currentFromCategoryQuantity) {
      form.setError("quantity", {
        type: "manual",
        message: `Kuantitas yang dipindahkan melebihi stok yang tersedia (${currentFromCategoryQuantity}).`,
      });
      return;
    }

    try {
      // Use Edge Function for atomic transaction
      const { data, error } = await supabase.functions.invoke('move-stock', {
        body: JSON.stringify({
          product_id: product.id,
          from_category: values.from_category,
          to_category: values.to_category,
          quantity: values.quantity,
          reason: values.notes // Map notes to reason for the function
        }),
      });

      if (error) throw error;
      if (data && data.error) throw new Error(data.error);

      showSuccess("Stok berhasil dipindahkan!");
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      showError(`Gagal memindahkan stok: ${err.message}`);
      console.error("Error moving stock:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pindahkan Stok Produk: {product.nama_barang}</DialogTitle>
          <DialogDescription>
            Pindahkan stok dari satu kategori gudang ke kategori lainnya.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="from_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dari Kategori</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={loadingInventories || loadingCategories}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingCategories ? "Memuat kategori..." : "Pilih kategori asal"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loadingInventories || loadingCategories ? (
                        <SelectItem value="loading" disabled>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" /> Memuat...
                        </SelectItem>
                      ) : availableFromCategories.length === 0 ? (
                        <SelectItem value="no-stock" disabled>
                          Tidak ada stok di kategori manapun
                        </SelectItem>
                      ) : (
                        availableFromCategories.map((inv) => (
                          <SelectItem key={inv.warehouse_category} value={inv.warehouse_category}>
                            {getCategoryDisplayName(inv.warehouse_category)} (Stok: {inv.quantity})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {selectedFromCategory && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Stok tersedia: {currentFromCategoryQuantity}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="to_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ke Kategori</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedFromCategory || loadingCategories}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingCategories ? "Memuat kategori..." : "Pilih kategori tujuan"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loadingCategories ? (
                        <SelectItem value="loading" disabled>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" /> Memuat...
                        </SelectItem>
                      ) : availableToCategories.length === 0 ? (
                        <SelectItem value="no-target" disabled>
                          Pilih kategori asal terlebih dahulu
                        </SelectItem>
                      ) : (
                        availableToCategories.map((code) => (
                          <SelectItem key={code} value={code}>
                            {getCategoryDisplayName(code)}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kuantitas</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      disabled={!selectedFromCategory}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alasan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Misalnya: Untuk riset produk baru" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting || loadingInventories || loadingCategories}>
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Pindahkan Stok"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StockMovementForm;