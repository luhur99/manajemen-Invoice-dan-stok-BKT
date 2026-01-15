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

const StockHistoryPage = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<StockEventType | "all">("all"); // Updated type
  const [selectedCategory, setSelectedCategory] = React.useState<string | "all">("all");
  
  const [isViewNotesOpen, setIsViewNotesOpen] = useState(false); // State for ViewNotesDialog
  const [notesToView, setNotesToView] = useState<string>(""); // State for notes content

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

  // Helper function to get display name for StockEventType
  const getEventTypeDisplay = (type: StockEventType) => {
    switch (type) {
      case StockEventType.INITIAL: return "Stok Awal";
      case StockEventType.IN: return "Masuk";
      case StockEventType.OUT: return "Keluar";
      case StockEventType.TRANSFER: return "Pindah";
      case StockEventType.ADJUSTMENT: return "Penyesuaian";
      default: return type;
    }
  };

  const { data: ledgerEntries, isLoading, error, refetch: fetchLedgerEntries } = useQuery<StockLedgerWithProduct[], Error>({ // Updated type and query key
    queryKey: ["stockLedgerEntries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock_ledger") // Changed table name
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

  const handleViewNotes = (notes: string) => {
    setNotesToView(notes);
    setIsViewNotesOpen(true);
  };

  const filteredLedgerEntries = ledgerEntries?.filter((item) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesSearch =
      item.product_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.product_code.toLowerCase().includes(lowerCaseSearchTerm) ||
      getEventTypeDisplay(item.event_type).toLowerCase().includes(lowerCaseSearchTerm) || // Updated to event_type
      item.notes?.toLowerCase().includes(lowerCaseSearchTerm) ||
      (item.from_warehouse_category && getCategoryDisplayName(item.from_warehouse_category).toLowerCase().includes(lowerCaseSearchTerm)) ||
      (item.to_warehouse_category && getCategoryDisplayName(item.to_warehouse_category).toLowerCase().includes(lowerCaseSearchTerm)) ||
      format(new Date(item.event_date), "dd-MM-yyyy").includes(lowerCaseSearchTerm); // Updated to event_date

    const matchesType = selectedType === "all" || item.event_type === selectedType;
    const matchesCategory = selectedCategory === "all" || item.from_warehouse_category === selectedCategory || item.to_warehouse_category === selectedCategory;

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
    return <div className="text-red-500">Error loading stock ledger entries or categories: {error?.message || categoriesError?.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Riwayat Stok</h1>

      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <Input
          placeholder="Cari riwayat stok..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm flex-grow"
        />
        <div className="flex gap-4">
          <Select
            value={selectedType}
            onValueChange={(value: StockEventType | "all") => setSelectedType(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              {Object.values(StockEventType).map((type) => (
                <SelectItem key={type} value={type}>
                  {getEventTypeDisplay(type)}
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
              <TableHead>Tipe Peristiwa</TableHead>
              <TableHead>Dari Kategori</TableHead>
              <TableHead>Ke Kategori</TableHead>
              <TableHead className="text-right">Kuantitas</TableHead>
              <TableHead>Catatan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLedgerEntries?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  Tidak ada riwayat stok yang ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredLedgerEntries?.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{format(new Date(entry.created_at), "dd-MM-yyyy HH:mm")}</TableCell>
                  <TableCell>{entry.product_name || "N/A"}</TableCell>
                  <TableCell>{entry.product_code || "N/A"}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      entry.event_type === StockEventType.OUT || entry.event_type === StockEventType.ADJUSTMENT ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                    }`}>
                      {getEventTypeDisplay(entry.event_type)}
                    </span>
                  </TableCell>
                  <TableCell>{entry.from_warehouse_category ? getCategoryDisplayName(entry.from_warehouse_category) : "-"}</TableCell>
                  <TableCell>{entry.to_warehouse_category ? getCategoryDisplayName(entry.to_warehouse_category) : "-"}</TableCell>
                  <TableCell className="text-right">{entry.quantity}</TableCell>
                  <TableCell>
                    {entry.notes ? (
                      <Button variant="outline" size="sm" onClick={() => handleViewNotes(entry.notes!)} className="h-7 px-2">
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
        title="Catatan Riwayat Stok"
      />
    </div>
  );
};

export default StockHistoryPage;