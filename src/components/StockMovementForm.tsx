"use client";

import React, { useEffect, useState } from "react";
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
import { Product } from "@/types/data"; // Changed from StockItem
import { format } from "date-fns"; // Import format

// Define the ENUM type for warehouse categories
type WarehouseCategory = 'siap_jual' | 'riset' | 'retur';

// Schema validasi menggunakan Zod
const formSchema = z.object({
  from_category: z.enum(["siap_jual", "riset", "retur"], {
    required_error: "Kategori Asal wajib dipilih",
  }),
  to_category: z.enum(["siap_jual", "riset", "retur"], {
    required_error: "Kategori Tujuan wajib dipilih",
  }),
  quantity: z.coerce.number().min(1, "Kuantitas harus lebih besar dari 0"),
  reason: z.string().optional(),
});

interface StockMovementFormProps {
  product: Product; // Changed from stockItem: StockItem
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const StockMovementForm: React.FC<StockMovementFormProps> = ({
  product, // Changed from stockItem
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const [currentProductCategory, setCurrentProductCategory] = useState<WarehouseCategory | undefined>(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from_category: "siap_jual", // Will be updated by useEffect
      to_category: "riset", // Will be updated by useEffect
      quantity: 1,
      reason: "",
    },
  });

  // Fetch current product's category when dialog opens or product changes
  useEffect(() => {
    const fetchProductCategory = async () => {
      if (!product?.id) return;

      const { data, error } = await supabase
        .from("warehouse_inventories")
        .select("warehouse_category")
        .eq("product_id", product.id)
        .limit(1) // Assuming a product is primarily in one category for "from_category" context
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        showError(`Gagal memuat kategori produk saat ini: ${error.message}`);
        console.error("Error fetching product category:", error);
        setCurrentProductCategory(undefined);
      } else if (data) {
        setCurrentProductCategory(data.warehouse_category);
        form.reset({
          from_category: data.warehouse_category,
          to_category: data.warehouse_category === "siap_jual" ? "riset" : "siap_jual", // Suggest a different category
          quantity: 1,
          reason: "",
        });
      } else {
        // If no inventory entry, assume it's not in any category or default to 'siap_jual'
        setCurrentProductCategory("siap_jual"); // Default if not found
        form.reset({
          from_category: "siap_jual",
          to_category: "riset",
          quantity: 1,
          reason: "",
        });
      }
    };

    if (isOpen) {
      fetchProductCategory();
    }
  }, [isOpen, product, form]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    if (values.from_category === values.to_category) {
      showError("Kategori asal dan tujuan tidak boleh sama.");
      return;
    }

    try {
      // 1. Check stock in the 'from_category'
      const { data: fromInventory, error: fetchFromError } = await supabase
        .from("warehouse_inventories")
        .select("id, quantity")
        .eq("product_id", product.id)
        .eq("warehouse_category", values.from_category)
        .single();

      if (fetchFromError && fetchFromError.code === 'PGRST116') {
        showError(`Tidak ada stok item "${product.nama_barang}" di kategori "${getCategoryDisplay(values.from_category)}".`); // Corrected access
        return;
      } else if (fetchFromError) {
        throw fetchFromError;
      }

      if (!fromInventory || fromInventory.quantity < values.quantity) {
        showError(`Stok tidak mencukupi di kategori "${getCategoryDisplay(values.from_category)}". Tersedia: ${fromInventory?.quantity || 0}, Diminta: ${values.quantity}`);
        return;
      }

      // 2. Decrease stock in 'from_category'
      const newFromQuantity = fromInventory.quantity - values.quantity;
      const { error: updateFromError } = await supabase
        .from("warehouse_inventories")
        .update({ quantity: newFromQuantity, updated_at: new Date().toISOString() })
        .eq("id", fromInventory.id);

      if (updateFromError) {
        throw updateFromError;
      }

      // 3. Increase stock in 'to_category'
      const { data: toInventory, error: fetchToError } = await supabase
        .from("warehouse_inventories")
        .select("id, quantity")
        .eq("product_id", product.id)
        .eq("warehouse_category", values.to_category)
        .single();

      if (fetchToError && fetchToError.code === 'PGRST116') {
        // If no entry in 'to_category', create one
        const { error: createToError } = await supabase
          .from("warehouse_inventories")
          .insert({
            product_id: product.id,
            warehouse_category: values.to_category,
            quantity: values.quantity,
            user_id: userId,
          });
        if (createToError) throw createToError;
      } else if (fetchToError) {
        throw fetchToError;
      } else if (toInventory) {
        // Update existing entry in 'to_category'
        const newToQuantity = toInventory.quantity + values.quantity;
        const { error: updateToError } = await supabase
          .from("warehouse_inventories")
          .update({ quantity: newToQuantity, updated_at: new Date().toISOString() })
          .eq("id", toInventory.id);
        if (updateToError) throw updateToError;
      }

      // 4. Insert into stock_movements table
      const { error: movementError } = await supabase
        .from("stock_movements")
        .insert({
          user_id: userId,
          product_id: product.id,
          from_category: values.from_category,
          to_category: values.to_category,
          quantity: values.quantity,
          reason: values.reason || null,
          movement_date: format(new Date(), "yyyy-MM-dd"),
        });

      if (movementError) {
        throw movementError;
      }

      showSuccess(`Stok item "${product.nama_barang}" berhasil dipindahkan dari ${getCategoryDisplay(values.from_category)} ke ${getCategoryDisplay(values.to_category)}!`); // Corrected access
      onOpenChange(false);
      onSuccess(); // Trigger refresh of stock data
    } catch (error: any) {
      showError(`Gagal memindahkan stok: ${error.message}`);
      console.error("Error moving stock:", error);
    }
  };

  const getCategoryDisplay = (category: WarehouseCategory) => {
    switch (category) {
      case "siap_jual": return "Siap Jual";
      case "riset": return "Riset";
      case "retur": return "Retur";
      default: return category;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pindahkan Stok Barang</DialogTitle>
          <DialogDescription>Pindahkan item stok "{product.nama_barang}" antar kategori gudang.</DialogDescription> {/* Corrected access */}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="from_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dari Kategori</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={true}> {/* Disabled as it's the item's current category */}
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori asal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="siap_jual">Siap Jual</SelectItem>
                      <SelectItem value="riset">Riset</SelectItem>
                      <SelectItem value="retur">Retur</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori tujuan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="siap_jual">Siap Jual</SelectItem>
                      <SelectItem value="riset">Riset</SelectItem>
                      <SelectItem value="retur">Retur</SelectItem>
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
                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alasan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tambahkan alasan perpindahan stok..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Pindahkan Stok"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StockMovementForm;