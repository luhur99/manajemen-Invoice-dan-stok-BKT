"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product, StockTransactionWithItemName, WarehouseInventory, WarehouseCategory as WarehouseCategoryType, TransactionType } from "@/types/data"; // Import the interface
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { showError } from "@/utils/toast";
import { format } from "date-fns";

interface ViewStockItemDetailsDialogProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewStockItemDetailsDialog: React.FC<ViewStockItemDetailsDialogProps> = ({
  product,
  isOpen,
  onOpenChange,
}) => {
  const { data: warehouseCategories, isLoading: loadingCategories, error: categoriesError } = useQuery<WarehouseCategoryType[], Error>({
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
  });

  const getCategoryDisplayName = (code: string) => {
    const category = warehouseCategories?.find(cat => cat.code === code);
    return category ? category.name : code;
  };

  const getTransactionTypeDisplay = (type: TransactionType) => {
    switch (type) {
      case TransactionType.INITIAL: return "Stok Awal";
      case TransactionType.IN: return "Masuk";
      case TransactionType.OUT: return "Keluar";
      default: return type;
    }
  };

  const { data: inventories, isLoading: loadingInventories, error: inventoriesError } = useQuery<WarehouseInventory[], Error>({
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

  const { data: transactions, isLoading: loadingTransactions, error: transactionsError } = useQuery<StockTransactionWithItemName[], Error>({
    queryKey: ["productTransactions", product.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock_transactions")
        .select(`
          *,
          products (nama_barang, kode_barang)
        `)
        .eq("product_id", product.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map(t => ({
        ...t,
        product_name: t.products?.nama_barang || "N/A",
        product_code: t.products?.kode_barang || "N/A",
      }));
    },
    enabled: isOpen,
  });

  if (loadingInventories || loadingTransactions || loadingCategories) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Detail Produk Stok</DialogTitle>
            <DialogDescription>Memuat detail produk...</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (inventoriesError || transactionsError || categoriesError) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Detail Produk Stok</DialogTitle>
            <DialogDescription>Terjadi kesalahan saat memuat detail produk.</DialogDescription>
          </DialogHeader>
          <div className="text-red-500">Error: {inventoriesError?.message || transactionsError?.message || categoriesError?.message}</div>
        </DialogContent>
      </Dialog>
    );
  }

  const totalStock = inventories?.reduce((sum, inv) => sum + inv.quantity, 0) || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Produk Stok: {product.nama_barang}</DialogTitle>
          <DialogDescription>Informasi lengkap mengenai produk stok ini.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Kode Barang:</strong> {product.kode_barang}</p>
            <p><strong>Nama Barang:</strong> {product.nama_barang}</p>
            <p><strong>Satuan:</strong> {product.satuan || "-"}</p>
            <p><strong>Harga Beli:</strong> Rp {product.harga_beli.toLocaleString('id-ID')}</p>
            <p><strong>Harga Jual:</strong> Rp {product.harga_jual.toLocaleString('id-ID')}</p>
            <p><strong>Batas Stok Aman:</strong> {product.safe_stock_limit}</p>
            <p><strong>Total Stok:</strong> {totalStock}</p>
          </div>

          <h3 className="text-lg font-semibold mt-4 mb-2">Inventaris Gudang</h3>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kategori Gudang</TableHead>
                  <TableHead className="text-right">Kuantitas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventories?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      Tidak ada inventaris gudang.
                    </TableCell>
                  </TableRow>
                ) : (
                  inventories?.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell>{getCategoryDisplayName(inv.warehouse_category)}</TableCell>
                      <TableCell className="text-right">{inv.quantity}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <h3 className="text-lg font-semibold mt-4 mb-2">Riwayat Transaksi Stok</h3>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Tipe Transaksi</TableHead>
                  <TableHead>Kategori Gudang</TableHead>
                  <TableHead className="text-right">Kuantitas</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Tidak ada riwayat transaksi stok.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions?.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{format(new Date(t.transaction_date), "dd-MM-yyyy")}</TableCell>
                      <TableCell>{getTransactionTypeDisplay(t.transaction_type)}</TableCell>
                      <TableCell>{t.warehouse_category ? getCategoryDisplayName(t.warehouse_category) : "-"}</TableCell>
                      <TableCell className="text-right">{t.quantity}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{t.notes || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewStockItemDetailsDialog;