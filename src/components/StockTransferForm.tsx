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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showError, showSuccess } from "@/utils/toast";
import { Product as ProductType, WarehouseCategory as WarehouseCategoryType, WarehouseInventory } from "@/types/data";
import { Loader2 } from "lucide-react";
import StockItemCombobox from "./StockItemCombobox"; // Assuming this component exists

const formSchema = z.object({
  product_id: z.string().min(1, "Produk harus dipilih."),
  from_category: z.string({
    required_error: "Kategori asal harus dipilih.",
  }).min(1, "Kategori asal harus dipilih."),
  to_category: z.string({
    required_error: "Kategori tujuan harus dipilih.",
  }).min(1, "Kategori tujuan harus dipilih."),
  quantity: z.number().int().positive("Kuantitas harus lebih dari 0."),
  notes: z.string().optional(),
});

interface StockTransferFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const StockTransferForm: React.FC<StockTransferFormProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [productSearchInput, setProductSearchInput] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_id: "",
      from_category: "",
      to_category: "",
      quantity: 0,
      notes: "",
    },
  });

  const { data: products, isLoading: loadingProducts } = useQuery<ProductType[], Error>({
    queryKey: ["productsMetadata"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          kode_barang,
          nama_barang,
          satuan,
          harga_beli,
          harga_jual,
          safe_stock_limit,
          supplier_id
        `);
      if (error) {
        showError("Gagal memuat daftar produk.");
        throw error;
      }
      return data as ProductType[];
    },
    enabled: isOpen,
  });

  const { data: warehouseCategories, isLoading: loadingCategories } = useQuery<WarehouseCategoryType[], Error>({
    queryKey: ["warehouseCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warehouse_categories")
        .select("*")
        .order("name", { ascending: true });
      if (error) {
        showError("Gagal memuat kategori gudang.");
        throw error;
      }
      return data;
    },
    enabled: isOpen,
  });

  const getCategoryDisplayName = (code: string) => {
    const category = warehouseCategories?.find(cat => cat.code === code);
    return category ? category.name : code;
  };

  const { data: productInventories, isLoading: loadingInventories, refetch: refetchInventories } = useQuery<WarehouseInventory[], Error>({
    queryKey: ["productInventories", selectedProduct?.id],
    queryFn: async () => {
      if (!selectedProduct?.id) return [];
      const { data, error } = await supabase
        .from("warehouse_inventories")
        .select("*")
        .eq("product_id", selectedProduct.id);
      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!selectedProduct?.id,
  });

  const availableFromCategories = productInventories?.filter(inv => inv.quantity > 0) || [];
  const allWarehouseCategoryCodes = warehouseCategories?.map(cat => cat.code) || [];

  const selectedFromCategory = form.watch("from_category");
  const availableToCategories = allWarehouseCategoryCodes.filter(
    (code) => code !== selectedFromCategory
  );

  const currentFromCategoryQuantity = productInventories?.find(
    (inv) => inv.warehouse_category === selectedFromCategory
  )?.quantity || 0;

  useEffect(() => {
    if (isOpen) {
      form.reset({
        product_id: "",
        from_category: "",
        to_category: "",
        quantity: 0,
        notes: "",
      });
      setSelectedProduct(null);
      setProductSearchInput("");
      refetchInventories(); // Refetch inventories when dialog opens
    }
  }, [isOpen, form, refetchInventories]);

  const handleProductSelect = useCallback((productId: string | undefined) => {
    const product = products?.find(p => p.id === productId);
    setSelectedProduct(product || null);
    form.setValue("product_id", productId || "");
    form.setValue("from_category", ""); // Reset categories when product changes
    form.setValue("to_category", "");
    form.setValue("quantity", 0);
    setProductSearchInput(product?.nama_barang || "");
  }, [products, form]);

  const transferStockMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (values.quantity > currentFromCategoryQuantity) {
        throw new Error(`Kuantitas yang dipindahkan melebihi stok yang tersedia (${currentFromCategoryQuantity}).`);
      }

      // Use the new Edge Function for atomic transaction
      const { data, error } = await supabase.functions.invoke('atomic-stock-transfer', {
        body: JSON.stringify({
          product_id: values.product_id,
          from_category: values.from_category,
          to_category: values.to_category,
          quantity: values.quantity,
          notes: values.notes,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (error) throw error;
      if (data && data.error) throw new Error(data.error);

      return data;
    },
    onSuccess: () => {
      showSuccess("Stok berhasil dipindahkan!");
      onSuccess();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["productsWithInventories"] }); // Invalidate stock management view
      queryClient.invalidateQueries({ queryKey: ["stockMovements"] }); // Invalidate stock movement history
      queryClient.invalidateQueries({ queryKey: ["stockLedgerEntries"] }); // Invalidate general stock history
      queryClient.invalidateQueries({ queryKey: ["productInventories", selectedProduct?.id] }); // Invalidate specific product inventories
    },
    onError: (err: any) => {
      showError(`Gagal memindahkan stok: ${err.message}`);
      console.error("Error moving stock:", err);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    transferStockMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pindahkan Stok Antar Gudang</DialogTitle>
          <DialogDescription>
            Pindahkan stok produk dari satu kategori gudang ke kategori lainnya.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="product_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produk</FormLabel>
                  <StockItemCombobox
                    products={products || []}
                    selectedProductId={field.value || undefined}
                    onSelectProduct={handleProductSelect}
                    inputValue={productSearchInput}
                    onInputValueChange={setProductSearchInput}
                    disabled={loadingProducts || transferStockMutation.isPending}
                    loading={loadingProducts}
                    showInventory={false} // This form doesn't need to show inventory in the combobox itself
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="from_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dari Kategori</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedProduct || loadingInventories || loadingCategories || transferStockMutation.isPending}>
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
                          Tidak ada stok di kategori ini
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
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedFromCategory || loadingCategories || transferStockMutation.isPending}>
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
                      disabled={!selectedFromCategory || transferStockMutation.isPending}
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
                    <Textarea {...field} placeholder="Misalnya: Untuk riset produk baru" disabled={transferStockMutation.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={transferStockMutation.isPending || loadingInventories || loadingCategories || loadingProducts}>
                {transferStockMutation.isPending ? (
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

export default StockTransferForm;