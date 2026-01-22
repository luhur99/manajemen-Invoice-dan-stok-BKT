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
    default: return code;
  }
};

const StockMovementHistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Apply debounce
  const [selectedEventType, setSelectedEventType] = useState<StockEventType | "all">("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { data: stockMovements, isLoading, error } = useQuery<StockLedgerWithProduct[], Error>({
    queryKey: ["stockMovements", debouncedSearchTerm, selectedEventType, dateRange], // Include all filters
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
          `products.nama_barang.ilike.%${debouncedSearchTerm}%,products.kode_barang.ilike.%${debouncedSearchTerm}%,from_warehouse_category.ilike.%${debouncedSearchTerm}%,to_warehouse_category.ilike.%${debouncedSearchTerm}%,notes.ilike.%${debouncedSearchTerm}%`
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
        showError("Gagal memuat riwayat pergerakan stok.");
        throw error;
      }
      return data as StockLedgerWithProduct[];
    },
  });

  // No need for local filtering anymore
  // const filteredStockMovements = useMemo(() => {
  //   if (!stockMovements) return [];
  //   const lowerCaseSearchTerm = searchTerm.toLowerCase();

  //   return stockMovements.filter((movement) => {
  //     const matchesSearch =
  //       movement.products?.nama_barang?.toLowerCase().includes(lowerCaseSearchTerm) ||
  //       movement.products?.kode_barang?.toLowerCase().includes(lowerCaseSearchTerm) ||
  //       (movement.from_warehouse_category && getCategoryDisplayName(movement.from_warehouse_category).toLowerCase().includes(lowerCaseSearchTerm)) ||
  //       (movement.to_warehouse_category && getCategoryDisplayName(movement.to_warehouse_category).toLowerCase().includes(lowerCaseSearchTerm)) ||
  //       movement.notes?.toLowerCase().includes(lowerCaseSearchTerm);

  //     const matchesEventType =
  //       selectedEventType === "all" || movement.event_type === selectedEventType;

  //     const itemDate = parseISO(movement.created_at);
  //     const matchesDateRange = dateRange?.from
  //       ? isWithinInterval(itemDate, {
  //           start: startOfDay(dateRange.from),
  //           end: dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from),
  //         })
  //       : true;

  //     return matchesSearch && matchesEventType && matchesDateRange;
  //   });
  // }, [stockMovements, searchTerm, selectedEventType, dateRange]);

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
      <h1 className="text-3xl font-bold mb-6">Riwayat Pergerakan Stok</h1>

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
            {stockMovements?.length === 0 ? ( // Use 'stockMovements' directly
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Tidak ada pergerakan stok ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              stockMovements?.map((movement) => ( // Use 'stockMovements' directly
                <TableRow key={movement.id}>
                  <TableCell>{format(new Date(movement.created_at), "dd-MM-yyyy HH:mm")}</TableCell>
                  <TableCell>{movement.products?.nama_barang || "N/A"}</TableCell>
                  <TableCell>{movement.products?.kode_barang || "N/A"}</TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      movement.event_type === StockEventType.IN || movement.event_type === StockEventType.INITIAL ? "bg-green-100 text-green-800" :
                      movement.event_type === StockEventType.OUT ? "bg-red-100 text-red-800" :
                      movement.event_type === StockEventType.TRANSFER ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {getEventTypeDisplay(movement.event_type)}
                    </span>
                  </TableCell>
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