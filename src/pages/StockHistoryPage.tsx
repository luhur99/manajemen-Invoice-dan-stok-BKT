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

const getCategoryDisplayName = (code: WarehouseCategoryEnum) => {
  switch (code) {
    case WarehouseCategoryEnum.GUDANG_UTAMA: return "Gudang Utama";
    case WarehouseCategoryEnum.GUDANG_TRANSIT: return "Gudang Transit";
    case WarehouseCategoryEnum.GUDANG_TEKNISI: return "Gudang Teknisi";
    case WarehouseCategoryEnum.GUDANG_RETUR: return "Gudang Retur";
    case WarehouseCategoryEnum.SIAP_JUAL: return "Siap Jual"; // Added Siap Jual
    default: return code;
  }
};

const StockHistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Apply debounce
  const [selectedEventType, setSelectedEventType] = useState<StockEventType | "all">("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { data: stockHistory, isLoading, error } = useQuery<StockLedgerWithProduct[], Error>({
    queryKey: ["stockHistory", debouncedSearchTerm, selectedEventType, dateRange], // Include all filters
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
        .order("created_at", { ascending: false });

      if (debouncedSearchTerm) {
        query = query.or(
          `products.nama_barang.ilike.%${debouncedSearchTerm}%,products.kode_barang.ilike.%${debouncedSearchTerm}%,notes.ilike.%${debouncedSearchTerm}%`
        );
      }

      if (selectedEventType !== "all") {
        query = query.eq("event_type", selectedEventType);
      }

      if (dateRange?.from) {
        query = query.gte("created_at", format(startOfDay(dateRange.from), "yyyy-MM-dd"));
      }
      if (dateRange?.to) {
        query = query.lte("created_at", format(endOfDay(dateRange.to), "yyyy-MM-dd"));
      }

      const { data, error } = await query;
      if (error) {
        showError("Gagal memuat riwayat stok.");
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
          Gagal memuat riwayat stok: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Riwayat Transaksi Produk</h1>

      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Input
              type="text"
              placeholder="Cari item, kode, atau catatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
          <Select
            onValueChange={(value: StockEventType | "all") => setSelectedEventType(value)}
            value={selectedEventType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Tipe Event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              {Object.values(StockEventType).map((type) => (
                <SelectItem key={type as string} value={type as string}>
                  {getEventTypeDisplay(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              <TableHead>Tipe Event</TableHead>
              <TableHead>Kuantitas</TableHead>
              <TableHead>Dari Gudang</TableHead>
              <TableHead>Ke Gudang</TableHead>
              <TableHead>Catatan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockHistory?.length === 0 ? ( // Use 'stockHistory' directly
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Tidak ada riwayat stok ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              stockHistory?.map((entry) => ( // Use 'stockHistory' directly
                <TableRow key={entry.id}>
                  <TableCell>{format(new Date(entry.created_at), "dd-MM-yyyy HH:mm")}</TableCell>
                  <TableCell>{entry.products?.nama_barang || "N/A"}</TableCell>
                  <TableCell>{entry.products?.kode_barang || "N/A"}</TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      entry.event_type === StockEventType.IN || entry.event_type === StockEventType.INITIAL ? "bg-green-100 text-green-800" :
                      entry.event_type === StockEventType.OUT ? "bg-red-100 text-red-800" :
                      entry.event_type === StockEventType.TRANSFER ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {getEventTypeDisplay(entry.event_type)}
                    </span>
                  </TableCell>
                  <TableCell>{entry.quantity}</TableCell>
                  <TableCell>{entry.from_warehouse_category ? getCategoryDisplayName(entry.from_warehouse_category) : "-"}</TableCell>
                  <TableCell>{entry.to_warehouse_category ? getCategoryDisplayName(entry.to_warehouse_category) : "-"}</TableCell>
                  <TableCell>{entry.notes || "-"}</TableCell>
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