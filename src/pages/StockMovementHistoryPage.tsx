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
import { StockMovementWithItemName, WarehouseCategory as WarehouseCategoryType } from "@/types/data"; // Import the interface
import { showError } from "@/utils/toast"; // Import showError

const StockMovementHistoryPage = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedFromCategory, setSelectedFromCategory] = React.useState<string | "all">("all"); // Changed to string
  const [selectedToCategory, setSelectedToCategory] = React.useState<string | "all">("all"); // Changed to string
  
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

  const { data: movements, isLoading, error, refetch: fetchMovements } = useQuery<StockMovementWithItemName[], Error>({
    queryKey: ["stockMovements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock_movements")
        .select(`
          *,
          products (nama_barang, kode_barang)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map(m => ({
        ...m,
        product_name: m.products?.nama_barang || "N/A",
        product_code: m.products?.kode_barang || "N/A",
      }));
    },
  });

  const filteredMovements = movements?.filter((item) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesSearch =
      item.product_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.product_code.toLowerCase().includes(lowerCaseSearchTerm) ||
      getCategoryDisplayName(item.from_category).toLowerCase().includes(lowerCaseSearchTerm) ||
      getCategoryDisplayName(item.to_category).toLowerCase().includes(lowerCaseSearchTerm) ||
      item.reason?.toLowerCase().includes(lowerCaseSearchTerm) ||
      format(new Date(item.movement_date), "dd-MM-yyyy").includes(lowerCaseSearchTerm);

    const matchesFromCategory = selectedFromCategory === "all" || item.from_category === selectedFromCategory;
    const matchesToCategory = selectedToCategory === "all" || item.to_category === selectedToCategory;

    return matchesSearch && matchesFromCategory && matchesToCategory;
  });

  if (isLoading || loadingCategories) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || categoriesError) {
    return <div className="text-red-500">Error loading stock movements or categories: {error?.message || categoriesError?.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Riwayat Perpindahan Stok</h1>

      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <Input
          placeholder="Cari perpindahan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm flex-grow"
        />
        <div className="flex gap-4">
          <Select
            value={selectedFromCategory}
            onValueChange={(value: string | "all") => setSelectedFromCategory(value)}
            disabled={loadingCategories}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={loadingCategories ? "Memuat kategori..." : "Dari Kategori"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Asal</SelectItem>
              {warehouseCategories?.map((category) => (
                <SelectItem key={category.id} value={category.code}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedToCategory}
            onValueChange={(value: string | "all") => setSelectedToCategory(value)}
            disabled={loadingCategories}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={loadingCategories ? "Memuat kategori..." : "Ke Kategori"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tujuan</SelectItem>
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
              <TableHead>Dari Kategori</TableHead>
              <TableHead>Ke Kategori</TableHead>
              <TableHead className="text-right">Kuantitas</TableHead>
              <TableHead>Alasan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovements?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Tidak ada riwayat perpindahan stok yang ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredMovements?.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{format(new Date(movement.created_at), "dd-MM-yyyy HH:mm")}</TableCell>
                  <TableCell>{movement.product_name || "N/A"}</TableCell>
                  <TableCell>{movement.product_code || "N/A"}</TableCell>
                  <TableCell>{getCategoryDisplayName(movement.from_category)}</TableCell>
                  <TableCell>{getCategoryDisplayName(movement.to_category)}</TableCell>
                  <TableCell className="text-right">{movement.quantity}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{movement.reason || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockMovementHistoryPage;