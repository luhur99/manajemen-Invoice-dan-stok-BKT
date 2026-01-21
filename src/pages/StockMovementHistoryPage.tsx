"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Eye } from "lucide-react"; // Import Eye icon
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StockLedgerWithProduct, StockEventType, WarehouseCategory as WarehouseCategoryType } from "@/types/data"; // Updated imports
import { showError } from "@/utils/toast"; // Import showError
import ViewNotesDialog from "@/components/ViewNotesDialog"; // Import ViewNotesDialog

const StockMovementHistoryPage = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedFromCategory, setSelectedFromCategory] = React.useState<string | "all">("all");
  const [selectedToCategory, setSelectedToCategory] = React.useState<string | "all">("all");
  
  const [isViewNotesOpen, setIsViewNotesOpen] = useState(false); // State for ViewNotesDialog
  const [notesToView, setNotesToView] = useState<string>(""); // State for notes content

  const { data: warehouseCategories, isLoading: loadingCategories, error: categoriesError } = useQuery<WarehouseCategoryType[], Error>({
    queryKey: ["warehouseCategories"],
    queryFn: async () => {
      console.log("StockMovementHistoryPage: Fetching warehouse categories...");
      const { data, error } = await supabase
        .from("warehouse_categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("StockMovementHistoryPage: Supabase error fetching warehouse categories:", error);
        showError("Gagal memuat kategori gudang.");
        throw error;
      }
      console.log("StockMovementHistoryPage: Warehouse categories data received:", data);
      return data;
    },
    retry: 0, // Disable retries to surface errors faster
  });

  const getCategoryDisplayName = (code: string) => {
    const category = warehouseCategories?.find(cat => cat.code === code);
    return category ? category.name : code;
  };

  const { data: movements, isLoading, error, refetch: fetchMovements } = useQuery<StockLedgerWithProduct[], Error>({ // Updated type and query key
    queryKey: ["stockMovements"],
    queryFn: async () => {
      console.log("StockMovementHistoryPage: Fetching stock movements...");
      const { data, error } = await supabase
        .from("stock_ledger") // Changed table name
        .select(`
          *,
          products (nama_barang, kode_barang)
        `)
        .eq("event_type", StockEventType.TRANSFER) // Filter for transfer events
        .order("created_at", { ascending: false });

      if (error) {
        console.error("StockMovementHistoryPage: Supabase error fetching stock movements:", error);
        throw error;
      }
      console.log("StockMovementHistoryPage: Stock movements data received:", data);

      return data.map(m => ({
        ...m,
        product_name: m.products?.nama_barang || "N/A",
        product_code: m.products?.kode_barang || "N/A",
      }));
    },
    retry: 0, // Disable retries to surface errors faster
  });

  const handleViewNotes = (notes: string) => {
    setNotesToView(notes);
    setIsViewNotesOpen(true);
  };

  const filteredMovements = movements?.filter((item) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesSearch =
      item.product_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.product_code.toLowerCase().includes(lowerCaseSearchTerm) ||
      (item.from_warehouse_category && getCategoryDisplayName(item.from_warehouse_category).toLowerCase().includes(lowerCaseSearchTerm)) ||
      (item.to_warehouse_category && getCategoryDisplayName(item.to_warehouse_category).toLowerCase().includes(lowerCaseSearchTerm)) ||
      item.notes?.toLowerCase().includes(lowerCaseSearchTerm) || // Changed from reason to notes
      format(new Date(item.event_date), "dd-MM-yyyy").includes(lowerCaseSearchTerm); // Changed from movement_date to event_date

    const matchesFromCategory = selectedFromCategory === "all" || item.from_warehouse_category === selectedFromCategory;
    const matchesToCategory = selectedToCategory === "all" || item.to_warehouse_category === selectedToCategory;

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
              <TableHead>Catatan</TableHead> {/* Changed to button */}
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
                  <TableCell>{movement.from_warehouse_category ? getCategoryDisplayName(movement.from_warehouse_category) : "-"}</TableCell>
                  <TableCell>{movement.to_warehouse_category ? getCategoryDisplayName(movement.to_warehouse_category) : "-"}</TableCell>
                  <TableCell className="text-right">{movement.quantity}</TableCell>
                  <TableCell>
                    {movement.notes ? (
                      <Button variant="outline" size="sm" onClick={() => handleViewNotes(movement.notes!)} className="h-7 px-2">
                        <Eye className="h-3 w-3 mr-1" /> Lihat
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Notes Dialog */}
      <ViewNotesDialog
        notes={notesToView}
        isOpen={isViewNotesOpen}
        onOpenChange={setIsViewNotesOpen}
        title="Catatan Perpindahan Stok"
      />
    </div>
  );
};

export default StockMovementHistoryPage;