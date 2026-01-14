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
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { StockItem } from "@/types/data";
import { format } from "date-fns";

// Schema validasi menggunakan Zod
const formSchema = z.object({
  new_stock_akhir: z.coerce.number().min(0, "Stok Akhir tidak boleh negatif"),
  reason: z.string().min(1, "Alasan penyesuaian wajib diisi"),
});

interface StockAdjustmentFormProps {
  stockItem: StockItem;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const StockAdjustmentForm: React.FC<StockAdjustmentFormProps> = ({
  stockItem,
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      new_stock_akhir: stockItem["STOCK AKHIR"],
      reason: "",
    },
  });

  useEffect(() => {
    if (isOpen && stockItem) {
      form.reset({
        new_stock_akhir: stockItem["STOCK AKHIR"],
        reason: "",
      });
    }
  }, [isOpen, stockItem, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      showError("Pengguna tidak terautentikasi.");
      return;
    }

    try {
      const currentStockAkhir = stockItem["STOCK AKHIR"];
      const newStockAkhir = values.new_stock_akhir;
      const difference = newStockAkhir - currentStockAkhir;

      let newStockMasuk = stockItem["STOCK MASUK"];
      let newStockKeluar = stockItem["STOCK KELUAR"];
      let transactionQuantity = Math.abs(difference);
      let transactionType: 'in' | 'out' | 'adjustment';

      if (difference > 0) {
        newStockMasuk += difference;
        transactionType = 'in'; // Treat as 'in' for cumulative, but record 'adjustment' type
      } else if (difference < 0) {
        newStockKeluar += Math.abs(difference);
        transactionType = 'out'; // Treat as 'out' for cumulative, but record 'adjustment' type
      } else {
        showSuccess("Tidak ada perubahan stok yang dilakukan.");
        onOpenChange(false);
        onSuccess();
        return;
      }

      // Update stock_items table
      const { error: updateStockError } = await supabase
        .from("stock_items")
        .update({
          stock_masuk: newStockMasuk,
          stock_keluar: newStockKeluar,
          stock_akhir: newStockAkhir,
        })
        .eq("id", stockItem.id);

      if (updateStockError) {
        throw updateStockError;
      }

      // Insert into stock_transactions table with 'adjustment' type
      const { error: transactionError } = await supabase
        .from("stock_transactions")
        .insert({
          user_id: userId,
          stock_item_id: stockItem.id,
          transaction_type: 'adjustment', // Use the new 'adjustment' type
          quantity: transactionQuantity,
          notes: `Penyesuaian stok dari ${currentStockAkhir} menjadi ${newStockAkhir}. Alasan: ${values.reason}`,
          transaction_date: format(new Date(), "yyyy-MM-dd"),
        });

      if (transactionError) {
        throw transactionError;
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
          <DialogTitle>Penyesuaian Stok Barang</DialogTitle>
          <DialogDescription>Sesuaikan stok akhir untuk item "{stockItem["NAMA BARANG"]}".</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel>Stok Akhir Saat Ini</FormLabel>
              <FormControl>
                <Input type="number" value={stockItem["STOCK AKHIR"]} disabled />
              </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name="new_stock_akhir"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok Akhir Baru</FormLabel>
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