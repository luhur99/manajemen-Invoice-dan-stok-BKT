"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { format, parseISO, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StockLedgerWithProduct, StockEventType, WarehouseCategoryEnum } from "@/types/data"; // Updated imports
import { showError } from "@/utils/toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DateRangePicker } from "@/components/ui/date-range-picker"; // Corrected import
import { DateRange } from "react-day-picker";
import { useDebounce } from "@/hooks/use-debounce"; // Import useDebounce

const getEventTypeDisplay = (type: StockEventType) => {
  switch (type) {
    case StockEventType.IN:
      return "Masuk";
    case StockEventType.OUT:
      return "Keluar";
    case StockEventType.TRANSFER:
      return "Transfer";
    case StockEventType.ADJUSTMENT:
      return "Penyesuaian";
    case StockEventType.INITIAL:
      return "Awal";
    default:
      return type;
  }
};

const getCategoryDisplayName = (code: string | null | undefined) => { // Changed type to string | null | undefined
  if (!code) return "-";
  switch (code as WarehouseCategoryEnum) { // Cast to enum for switch
    case WarehouseCategoryEnum.GUDANG_UTAMA: return "Gudang Utama";
    case WarehouseCategoryEnum.GUDANG_TRANSIT: return "Gudang Transit";
    case WarehouseCategoryEnum.GUDANG_TEKNISI: return "Gudang Teknisi";
    case WarehouseCategoryEnum.GUDANG_RETUR: return "Gudang Retur";
    case WarehouseCategoryEnum.SIAP_JUAL: return "Siap Jual"; // Added Siap Jual
    default: return code;
  }
};

const StockMovementHistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Apply debounce
  // Removed selectedEventType as this page is specifically for 'transfer'
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { data: stockMovements, isLoading, error } = useQuery<StockLedgerWithProduct[], Error>({
    queryKey: ["stockMovements", debouncedSearchTerm, dateRange], // Removed selectedEventType from queryKey
    queryFn: async () => {
      let query = supabase
        .from("stock_ledger")
        .select(`
          id,
          user_id,
          product_id,
          event_type,
          quantity,
          from_warehouse_category,
          to_warehouse_category,
          notes,
          event_date,
          created_at,
          updated_at,
          products (nama_barang, kode_barang)
        `)
        .eq("event_type", StockEventType.TRANSFER) // Filter only 'transfer' events
        .order("created_at", { ascending: false });

      if (debouncedSearchTerm) {
        query = query.or(
          `products.nama_barang.ilike.%${debouncedSearchTerm}%,products.kode_barang.ilike.%${debouncedSearchTerm}%,from_warehouse_category.ilike.%${debouncedSearchTerm}%,to_warehouse_category.ilike.%${debouncedSearchTerm}%,notes.ilike.%${debouncedSearchTerm}%`
        );
      }

      if (dateRange?.from) {
        query = query.gte("created_at", format(startOfDay(dateRange.from), "yyyy-MM-dd"));
      }
      if (dateRange?.to) {
        query = query.lte("created_at", format(endOfDay(dateRange.to), "yyyy-MM-dd"));
      }

      const { data, error } = await query;
      if (error) {
        showError("Gagal memuat riwayat pergerakan stok.");
        throw error;
      }
      return data.map((item: any) => ({
        ...item,
        products: Array.isArray(item.products) ? item.products[0] : item.products,
      })) as StockLedgerWithProduct[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Gagal memuat riwayat pergerakan stok: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Riwayat Perpindahan Produk</h1>

      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Input
              type="text"
              placeholder="Cari item, gudang, atau catatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
          {/* Removed Event Type filter as this page is specifically for 'transfer' */}
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal & Waktu</TableHead>
              <TableHead>Nama Produk</TableHead>
              <TableHead>Kode Produk</TableHead>
              <TableHead>Kuantitas</TableHead>
              <TableHead>Dari Gudang</TableHead>
              <TableHead>Ke Gudang</TableHead>
              <TableHead>Catatan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockMovements?.length === 0 ? ( // Use 'stockMovements' directly
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Tidak ada pergerakan stok ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              stockMovements?.map((movement) => ( // Use 'stockMovements' directly
                <TableRow key={movement.id}>
                  <TableCell>{format(new Date(movement.created_at), "dd-MM-yyyy HH:mm")}</TableCell>
                  <TableCell>{movement.products?.nama_barang || "N/A"}</TableCell>
                  <TableCell>{movement.products?.kode_barang || "N/A"}</TableCell>
                  <TableCell>{movement.quantity}</TableCell>
                  <TableCell>{movement.from_warehouse_category ? getCategoryDisplayName(movement.from_warehouse_category) : "-"}</TableCell>
                  <TableCell>{movement.to_warehouse_category ? getCategoryDisplayName(movement.to_warehouse_category) : "-"}</TableCell>
                  <TableCell>{movement.notes || "-"}</TableCell>
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