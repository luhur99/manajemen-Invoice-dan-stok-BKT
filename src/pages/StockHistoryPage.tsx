"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StockTransactionWithItemName, TransactionType, WarehouseCategory as WarehouseCategoryType } from "@/types/data"; // Import the interface
import { showError } from "@/utils/toast"; // Import showError

const getTransactionTypeDisplay = (type: TransactionType) => {
  switch (type) {
    case TransactionType.INITIAL: return "Stok Awal";
    case TransactionType.IN: return "Masuk";
    case TransactionType.OUT: return "Keluar";
    default: return type;
  }
};

const StockHistoryPage = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<TransactionType | "all">("all");
  const [selectedCategory, setSelectedCategory] = React.useState<string | "all">("all"); // Changed to string
  
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

  const { data: transactions, isLoading, error, refetch: fetchTransactions } = useQuery<StockTransactionWithItemName[], Error>({
    queryKey: ["stockTransactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock_transactions")
        .select(`
          *,
          products (nama_barang, kode_barang)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map(t => ({
        ...t,
        product_name: t.products?.nama_barang || "N/A",
        product_code: t.products?.kode_barang || "N/A",
      }));
    },
  });

  const filteredTransactions = transactions?.filter((item) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesSearch =
      item.product_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.product_code.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.transaction_type.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.notes?.toLowerCase().includes(lowerCaseSearchTerm) ||
      (item.warehouse_category && getCategoryDisplayName(item.warehouse_category).toLowerCase().includes(lowerCaseSearchTerm)) ||
      format(new Date(item.transaction_date), "dd-MM-yyyy").includes(lowerCaseSearchTerm);

    const matchesType = selectedType === "all" || item.transaction_type === selectedType;
    const matchesCategory = selectedCategory === "all" || item.warehouse_category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  if (isLoading || loadingCategories) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || categoriesError) {
    return <div className="text-red-500">Error loading stock transactions or categories: {error?.message || categoriesError?.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Riwayat Transaksi Stok</h1>

      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <Input
          placeholder="Cari transaksi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm flex-grow"
        />
        <div className="flex gap-4">
          <Select
            value={selectedType}
            onValueChange={(value: TransactionType | "all") => setSelectedType(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              {Object.values(TransactionType).map((type) => (
                <SelectItem key={type} value={type}>
                  {getTransactionTypeDisplay(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedCategory}
            onValueChange={(value: string | "all") => setSelectedCategory(value)}
            disabled={loadingCategories}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={loadingCategories ? "Memuat kategori..." : "Filter Kategori"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {warehouseCategories?.map((category) => (
                <SelectItem key={category.id} value={category.code}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal & Waktu</TableHead>
              <TableHead>Nama Produk</TableHead>
              <TableHead>Kode Produk</TableHead>
              <TableHead>Tipe Transaksi</TableHead>
              <TableHead>Kategori Gudang</TableHead>
              <TableHead className="text-right">Kuantitas</TableHead>
              <TableHead>Catatan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Tidak ada riwayat transaksi stok yang ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions?.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{format(new Date(transaction.created_at), "dd-MM-yyyy HH:mm")}</TableCell>
                  <TableCell>{transaction.product_name || "N/A"}</TableCell>
                  <TableCell>{transaction.product_code || "N/A"}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.transaction_type === TransactionType.OUT ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                    }`}>
                      {getTransactionTypeDisplay(transaction.transaction_type)}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.warehouse_category ? getCategoryDisplayName(transaction.warehouse_category) : "-"}</TableCell>
                  <TableCell className="text-right">{transaction.quantity}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{transaction.notes || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockHistoryPage;