"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StockMovementWithItemName, WarehouseCategory } from "@/types/data";

const getCategoryDisplay = (category: WarehouseCategory) => {
  switch (category) {
    case WarehouseCategory.SIAP_JUAL: return "Siap Jual";
    case WarehouseCategory.RISET: return "Riset";
    case WarehouseCategory.RETUR: return "Retur";
    case WarehouseCategory.BACKUP_TEKNISI: return "Backup Teknisi";
    default: return category;
  }
};

const StockMovementHistoryPage = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedFromCategory, setSelectedFromCategory] = React.useState<WarehouseCategory | "all">("all");
  const [selectedToCategory, setSelectedToCategory] = React.useState<WarehouseCategory | "all">("all");

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
      getCategoryDisplay(item.from_category).toLowerCase().includes(lowerCaseSearchTerm) ||
      getCategoryDisplay(item.to_category).toLowerCase().includes(lowerCaseSearchTerm) ||
      item.reason?.toLowerCase().includes(lowerCaseSearchTerm) ||
      format(new Date(item.movement_date), "dd-MM-yyyy").includes(lowerCaseSearchTerm);

    const matchesFromCategory = selectedFromCategory === "all" || item.from_category === selectedFromCategory;
    const matchesToCategory = selectedToCategory === "all" || item.to_category === selectedToCategory;

    return matchesSearch && matchesFromCategory && matchesToCategory;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading stock movements: {error.message}</div>;
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
            onValueChange={(value: WarehouseCategory | "all") => setSelectedFromCategory(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Dari Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Asal</SelectItem>
              {Object.values(WarehouseCategory).map((category) => (
                <SelectItem key={category} value={category}>
                  {getCategoryDisplay(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedToCategory}
            onValueChange={(value: WarehouseCategory | "all") => setSelectedToCategory(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ke Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tujuan</SelectItem>
              {Object.values(WarehouseCategory).map((category) => (
                <SelectItem key={category} value={category}>
                  {getCategoryDisplay(category)}
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
                  <TableCell>{getCategoryDisplay(movement.from_category)}</TableCell>
                  <TableCell>{getCategoryDisplay(movement.to_category)}</TableCell>
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