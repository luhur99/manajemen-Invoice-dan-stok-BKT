"use client";

import React from "react";
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
import { showError, showSuccess } from "@/utils/toast";
import { Supplier, WarehouseCategory, StockEventType } from "@/types/data";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useSession } from "@/components/SessionContextProvider";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  kode_barang: z.string().min(1, "Kode Barang harus diisi.").trim(),
  nama_barang: z.string().min(1, "Nama Barang harus diisi.").trim(),
  satuan: z.string().trim().optional().nullable(), // Corrected Zod order
  harga_beli: z.number().min(0, "Harga Beli tidak boleh negatif."),
  harga_jual: z.number().min(0, "Harga Jual tidak boleh negatif."),
  safe_stock_limit: z.number().int().min(0, "Batas Stok Aman tidak boleh negatif.").optional().nullable(),
  supplier_id: z.string().optional().nullable(),
  initial_stock_quantity: z.number().int().min(0, "Kuantitas stok awal tidak boleh negatif.").default(0),
  initial_warehouse_category: z.string().optional().nullable(),
});

interface AddStockItemFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddStockItemForm: React.FC<AddStockItemFormProps> = ({ isOpen, onOpenChange, onSuccess }) => {
  const { session } = useSession();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kode_barang: "",
      nama_barang: "",
      satuan: "",
      harga_beli: 0,
      harga_jual: 0,
      safe_stock_limit: 0,
      supplier_id: "",
      initial_stock_quantity: 0,
      initial_warehouse_category: "",
    },
  });

  const { data: suppliers, isLoading: loadingSuppliers } = useQuery<Supplier[], Error>({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("suppliers").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: warehouseCategories, isLoading: loadingWarehouseCategories } = useQuery<WarehouseCategory[], Error>({
    queryKey: ["warehouseCategories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("warehouse_categories").select("*");
      if (error) throw error;
      return data;
    },
  });

  const createStockItemMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!session?.user?.id) {
        throw new Error("Anda harus login untuk membuat item stok.");
      }

      const { data: newProduct, error: productError } = await supabase
        .from("products")
        .insert({
          user_id: session.user.id,
          kode_barang: values.kode_barang,
          nama_barang: values.nama_barang,
          satuan: values.satuan,
          harga_beli: values.harga_beli,
          harga_jual: values.harga_jual,
          safe_stock_limit: values.safe_stock_limit,
          supplier_id: values.supplier_id || null,
        })
        .select()
        .single();

      if (productError) throw productError;

      if (values.initial_stock_quantity > 0 && values.initial_warehouse_category) {
        const { error: inventoryError } = await supabase
          .from("warehouse_inventories")
          .insert({
            user_id: session.user.id,
            product_id: newProduct.id,
            warehouse_category: values.initial_warehouse_category,
            quantity: values.initial_stock_quantity,
          });

        if (inventoryError) throw inventoryError;

        const { error: ledgerError } = await supabase
          .from("stock_ledger")
          .insert({
            user_id: session.user.id,
            product_id: newProduct.id,
            event_type: StockEventType.INITIAL, // Corrected
            quantity: values.initial_stock_quantity,
            to_warehouse_category: values.initial_warehouse_category,
            notes: "Stok awal saat pembuatan item",
            event_date: new Date().toISOString().split('T')[0], // Current date
          });

        if (ledgerError) throw ledgerError;
      }
      return newProduct;
    },
    onSuccess: () => {
      showSuccess("Item stok berhasil dibuat!");
      onOpenChange(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["warehouse_inventories"] });
      queryClient.invalidateQueries({ queryKey: ["stock_ledger"] });
      onSuccess();
    },
    onError: (err: any) => {
      showError(`Gagal membuat item stok: ${err.message}`);
      console.error("Error creating stock item:", err);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createStockItemMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Item Stok Baru</DialogTitle>
          <DialogDescription>
            Isi detail item stok baru di sini. Anda juga dapat menambahkan stok awal.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="kode_barang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Barang</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nama_barang"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Barang</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="satuan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Satuan (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="harga_beli"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Beli</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="harga_jual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Jual</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="safe_stock_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batas Stok Aman (Opsional)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supplier_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier (Opsional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih supplier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loadingSuppliers ? (
                        <SelectItem value="loading" disabled>Memuat supplier...</SelectItem>
                      ) : (
                        suppliers?.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h3 className="text-lg font-semibold mt-4 mb-2">Stok Awal (Opsional)</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="initial_stock_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kuantitas Stok Awal</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="initial_warehouse_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori Gudang Awal</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori gudang" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingWarehouseCategories ? (
                          <SelectItem value="loading" disabled>Memuat kategori...</SelectItem>
                        ) : (
                          warehouseCategories?.map((category) => (
                            <SelectItem key={category.id} value={category.code}>
                              {category.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={createStockItemMutation.isPending}>
                {createStockItemMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Simpan Item Stok"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStockItemForm;