"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Product, WarehouseInventory, WarehouseCategory as WarehouseCategoryType, StockEventType } from "@/types/data"; // Updated imports
import { format } from "date-fns";

// Schema validasi menggunakan Zod
const formSchema = z.object({
  warehouse_category: z.string({
    required_error: "Kategori Gudang wajib dipilih",
  }).min(1, "Kategori Gudang wajib dipilih"),
  new_quantity: z.coerce.number().min(0, "Kuantitas baru tidak boleh negatif"),
  notes: z.string().min(1, "Alasan penyesuaian wajib diisi"), // Changed from reason to notes
});

interface StockAdjustmentFormProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const StockAdjustmentForm: React.FC<StockAdjustmentFormProps> = ({
  product,
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const [currentInventories, setCurrentInventories] = useState<WarehouseInventory[]>([]);
  const [loadingInventories, setLoadingInventories] = useState(true);
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

  const fetchInventories = useCallback(async () => {
    if (!product?.id) return;
    setLoadingInventories(true);
    const { data, error } = await supabase
      .from("warehouse_inventories")
      .select("*")
      .eq("product_id", product.id);

    if (error) {
      showError("Gagal memuat inventaris item.");
      console.error("Error fetching warehouse inventories:", error);
      setCurrentInventories([]);
    } else {
      setCurrentInventories(data as WarehouseInventory[]);
    }
    setLoadingInventories(false);
  }, [product?.id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      warehouse_category: "", // Default empty string
      new_quantity: 0,
      notes: "", // Changed from reason to notes
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchWarehouseCategories();
      fetchInventories().then(() => {
        // Set default category and quantity after categories and inventories are loaded
        if (warehouseCategories.length > 0) {
          const defaultCategoryCode = product.inventories?.[0]?.warehouse_category || warehouseCategories[0].code;
          const initialQuantity = currentInventories.find(inv => inv.warehouse_category === defaultCategoryCode)?.quantity || 0;
          form.reset({
            warehouse_category: defaultCategoryCode,
            new_quantity: initialQuantity,
            notes: "", // Changed from reason to notes
          });
        }
      });
    }
  }, [isOpen, product, form, fetchInventories, fetchWarehouseCategories, warehouseCategories.length, currentInventories.length]);

  const selectedCategory = form.watch("warehouse_category");
  const currentQuantityForSelectedCategory = currentInventories.find(
    (inv) => inv.warehouse_category === selectedCategory
  )?.quantity || 0;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    try {
      const oldQuantity = currentQuantityForSelectedCategory;
      const newQuantity = values.new_quantity;
      const difference = newQuantity - oldQuantity;

      if (difference === 0) {
        showSuccess("Tidak ada perubahan stok yang dilakukan.");
        onOpenChange(false);
        onSuccess();
        return;
      }

      // Update or insert into warehouse_inventories
      const { error: upsertInventoryError } = await supabase
        .from("warehouse_inventories")
        .upsert(
          {
            product_id: product.id,
            warehouse_category: values.warehouse_category,
            quantity: newQuantity,
            user_id: userId,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "product_id, warehouse_category" }
        );

      if (upsertInventoryError) {
        throw upsertInventoryError;
      }

      // Insert into stock_ledger table with 'adjustment' type
      const { error: ledgerError } = await supabase
        .from("stock_ledger") // Changed table name
        .insert({
          user_id: userId,
          product_id: product.id,
          event_type: StockEventType.ADJUSTMENT, // Set event type
          quantity: Math.abs(difference),
          from_warehouse_category: difference < 0 ? values.warehouse_category : null, // If quantity decreased, it's 'from'
          to_warehouse_category: difference > 0 ? values.warehouse_category : null,   // If quantity increased, it's 'to'
          notes: `Penyesuaian stok di kategori ${getCategoryDisplayName(values.warehouse_category)} dari ${oldQuantity} menjadi ${newQuantity}. Catatan: ${values.notes}`, // Changed from reason to notes
          event_date: format(new Date(), "yyyy-MM-dd"),
        });

      if (ledgerError) {
        throw ledgerError;
      }

      showSuccess("Stok berhasil disesuaikan!");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      showError(`Gagal menyesuaikan stok: ${error.message}`);
      console.error("Error adjusting stock:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Penyesuaian Stok Produk</DialogTitle>
          <DialogDescription>Sesuaikan kuantitas stok untuk produk "{product.nama_barang}" di kategori tertentu.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="warehouse_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Gudang</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    const quantityForNewCategory = currentInventories.find(inv => inv.warehouse_category === value)?.quantity || 0;
                    form.setValue("new_quantity", quantityForNewCategory);
                  }} value={field.value} disabled={loadingInventories || loadingCategories}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingCategories ? "Memuat kategori..." : "Pilih kategori gudang"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {warehouseCategories.map((category) => (
                        <SelectItem key={category.id} value={category.code}>
                          {category.name} (Stok: {currentInventories.find(inv => inv.warehouse_category === category.code)?.quantity || 0})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Stok Saat Ini ({getCategoryDisplayName(selectedCategory)})</FormLabel>
              <FormControl>
                <Input type="number" value={currentQuantityForSelectedCategory} disabled />
              </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name="new_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kuantitas Baru</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes" // Changed from reason to notes
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alasan Penyesuaian</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Misalnya: Koreksi inventaris fisik, kerusakan, dll." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Simpan Penyesuaian"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StockAdjustmentForm;