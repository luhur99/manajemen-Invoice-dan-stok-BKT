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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { StockItem, WarehouseInventory } from "@/types/data";

// Schema validasi menggunakan Zod
const formSchema = z.object({
  quantity: z.coerce.number().min(1, "Kuantitas harus lebih besar dari 0"),
  transaction_date: z.date({ required_error: "Tanggal transaksi wajib diisi" }),
  notes: z.string().optional(),
  transaction_type: z.enum(["in", "out", "return", "damage_loss"], {
    required_error: "Tipe transaksi wajib dipilih",
  }),
  warehouse_category: z.enum(["siap_jual", "riset", "retur"], {
    required_error: "Kategori Gudang wajib dipilih",
  }),
});

interface AddStockTransactionFormProps {
  stockItem: StockItem;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialTransactionType?: "in" | "out" | "return" | "damage_loss";
}

const AddStockTransactionForm: React.FC<AddStockTransactionFormProps> = ({
  stockItem,
  isOpen,
  onOpenChange,
  onSuccess,
  initialTransactionType,
}) => {
  const [currentInventories, setCurrentInventories] = useState<WarehouseInventory[]>([]);
  const [loadingInventories, setLoadingInventories] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      transaction_date: new Date(),
      notes: "",
      transaction_type: initialTransactionType || "in",
      warehouse_category: "siap_jual", // Default category
    },
  });

  const selectedCategory = form.watch("warehouse_category");
  const transactionTypeWatch = form.watch("transaction_type");

  const fetchInventories = useCallback(async () => {
    if (!stockItem?.id) return;
    setLoadingInventories(true);
    const { data, error } = await supabase
      .from("warehouse_inventories")
      .select("*")
      .eq("product_id", stockItem.id);

    if (error) {
      showError("Gagal memuat inventaris item.");
      console.error("Error fetching warehouse inventories:", error);
      setCurrentInventories([]);
    } else {
      setCurrentInventories(data as WarehouseInventory[]);
    }
    setLoadingInventories(false);
  }, [stockItem?.id]);

  useEffect(() => {
    if (isOpen) {
      form.reset({
        quantity: 1,
        transaction_date: new Date(),
        notes: "",
        transaction_type: initialTransactionType || "in",
        warehouse_category: "siap_jual",
      });
      fetchInventories();
    }
  }, [isOpen, initialTransactionType, form, fetchInventories]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    try {
      // Get current quantity for the selected category
      const currentInventory = currentInventories.find(
        (inv) => inv.warehouse_category === values.warehouse_category
      );
      const currentQuantity = currentInventory ? currentInventory.quantity : 0;

      let newQuantityInInventory = currentQuantity;

      if (values.transaction_type === "in" || values.transaction_type === "return") {
        newQuantityInInventory += values.quantity;
      } else if (values.transaction_type === "out" || values.transaction_type === "damage_loss") {
        if (currentQuantity < values.quantity) {
          showError(`Stok tidak mencukupi di kategori "${getCategoryDisplay(values.warehouse_category)}". Tersedia: ${currentQuantity}, Diminta: ${values.quantity}`);
          return;
        }
        newQuantityInInventory -= values.quantity;
      }

      // Update or insert into warehouse_inventories
      const { error: upsertInventoryError } = await supabase
        .from("warehouse_inventories")
        .upsert(
          {
            product_id: stockItem.id,
            warehouse_category: values.warehouse_category,
            quantity: newQuantityInInventory,
            user_id: userId,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "product_id, warehouse_category" }
        );

      if (upsertInventoryError) {
        throw upsertInventoryError;
      }

      // Insert into stock_transactions table
      const { error: transactionError } = await supabase
        .from("stock_transactions")
        .insert({
          user_id: userId,
          stock_item_id: stockItem.id,
          transaction_type: values.transaction_type,
          quantity: values.quantity,
          notes: values.notes || null,
          transaction_date: format(values.transaction_date, "yyyy-MM-dd"),
          warehouse_category: values.warehouse_category, // Save the category
        });

      if (transactionError) {
        throw transactionError;
      }

      showSuccess("Transaksi stok berhasil dicatat!");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      showError(`Gagal mencatat transaksi stok: ${error.message}`);
      console.error("Error adding stock transaction:", error);
    }
  };

  const getCategoryDisplay = (category?: 'siap_jual' | 'riset' | 'retur') => {
    switch (category) {
      case "siap_jual": return "Siap Jual";
      case "riset": return "Riset";
      case "retur": return "Retur";
      default: return "-";
    }
  };

  const dialogTitle = {
    in: "Tambah Stok Masuk",
    out: "Kurangi Stok Keluar",
    return: "Catat Retur Barang",
    damage_loss: "Catat Stok Rusak/Hilang",
  }[transactionTypeWatch];

  const dialogDescription = `Catat transaksi stok untuk item "${stockItem["NAMA BARANG"]}".`;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="transaction_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Transaksi</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe transaksi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="in">Stok Masuk</SelectItem>
                      <SelectItem value="out">Stok Keluar (Manual)</SelectItem>
                      <SelectItem value="return">Retur Barang</SelectItem>
                      <SelectItem value="damage_loss">Rusak/Hilang</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="warehouse_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Gudang</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={loadingInventories}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingInventories ? "Memuat kategori..." : "Pilih kategori gudang"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["siap_jual", "riset", "retur"].map(category => (
                        <SelectItem key={category} value={category}>
                          {getCategoryDisplay(category as 'siap_jual' | 'riset' | 'retur')} (Stok: {currentInventories.find(inv => inv.warehouse_category === category)?.quantity || 0})
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
              name="transaction_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal Transaksi</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pilih tanggal</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tambahkan keterangan transaksi..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Simpan Transaksi"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStockTransactionForm;