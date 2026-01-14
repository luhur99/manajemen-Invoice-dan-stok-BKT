"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StockMovementWithItemName } from "@/types/data";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import PaginationControls from "@/components/PaginationControls";
import { format, startOfMonth, endOfMonth, subMonths, addDays } from "date-fns";
import { Loader2, CalendarIcon, Eye } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ExportDataButton from "@/components/ExportDataButton";
import ViewNotesDialog from "@/components/ViewNotesDialog";

// Define a flattened type for export
interface FlattenedStockMovementForExport {
  movement_date: string;
  created_at: string;
  item_name: string;
  item_code: string;
  from_category: string;
  to_category: string;
  quantity: number;
  reason: string;
}

const StockMovementHistoryPage = () => {
  const [movements, setMovements] = useState<StockMovementWithItemName[]>([]);
  const [filteredMovements, setFilteredMovements] = useState<StockMovementWithItemName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFromCategory, setFilterFromCategory] = useState<string>("all");
  const [filterToCategory, setFilterToCategory] = useState<string>("all");

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedDatePreset, setSelectedDatePreset] = useState<string>("all");

  const [isViewNotesOpen, setIsViewNotesOpen] = useState(false);
  const [notesToView, setNotesToView] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const calculateDateRange = useCallback((preset: string) => {
    const now = new Date();
    let newStartDate: Date | undefined;
    let newEndDate: Date | undefined;

    if (preset === "current_month") {
      newStartDate = startOfMonth(now);
      newEndDate = endOfMonth(now);
    } else if (preset === "last_3_months") {
      newStartDate = startOfMonth(subMonths(now, 2));
      newEndDate = endOfMonth(now);
    } else if (preset === "all") {
      newStartDate = undefined;
      newEndDate = undefined;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
  }, []);

  useEffect(() => {
    calculateDateRange(selectedDatePreset);
  }, [selectedDatePreset, calculateDateRange]);

  const fetchStockMovements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("stock_movements")
        .select(`
          id,
          user_id,
          stock_item_id,
          from_category,
          to_category,
          quantity,
          reason,
          movement_date,
          created_at,
          stock_items (
            nama_barang,
            kode_barang
          )
        `);

      if (startDate) {
        query = query.gte("movement_date", format(startDate, "yyyy-MM-dd"));
      }
      if (endDate) {
        const adjustedEndDate = addDays(endDate, 1);
        query = query.lte("movement_date", format(adjustedEndDate, "yyyy-MM-dd"));
      }

      if (filterFromCategory !== "all") {
        query = query.eq("from_category", filterFromCategory);
      }
      if (filterToCategory !== "all") {
        query = query.eq("to_category", filterToCategory);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const processedData: StockMovementWithItemName[] = data.map((item: any) => ({
        ...item,
        stock_items: item.stock_items || null, // Ensure it's a single object or null
      }));

      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const filteredBySearch = processedData.filter(item => {
        return (
          item.stock_items?.nama_barang?.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.stock_items?.kode_barang?.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.from_category.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.to_category.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.reason?.toLowerCase().includes(lowerCaseSearchTerm)
        );
      });

      setMovements(processedData);
      setFilteredMovements(filteredBySearch);
      setCurrentPage(1);
    } catch (err: any) {
      setError(`Gagal memuat riwayat perpindahan stok: ${err.message}`);
      console.error("Error fetching stock movements:", err);
      showError("Gagal memuat riwayat perpindahan stok.");
      setMovements([]);
      setFilteredMovements([]);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, filterFromCategory, filterToCategory, searchTerm]);

  const fetchAllStockMovementsForExport = useCallback(async () => {
    try {
      let query = supabase
        .from("stock_movements")
        .select(`
          id,
          from_category,
          to_category,
          quantity,
          reason,
          movement_date,
          created_at,
          stock_items (
            nama_barang,
            kode_barang
          )
        `);

      if (startDate) {
        query = query.gte("movement_date", format(startDate, "yyyy-MM-dd"));
      }
      if (endDate) {
        const adjustedEndDate = addDays(endDate, 1);
        query = query.lte("movement_date", format(adjustedEndDate, "yyyy-MM-dd"));
      }

      if (filterFromCategory !== "all") {
        query = query.eq("from_category", filterFromCategory);
      }
      if (filterToCategory !== "all") {
        query = query.eq("to_category", filterToCategory);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const flattenedData: FlattenedStockMovementForExport[] = data.map((item: any) => ({
        movement_date: format(new Date(item.movement_date), "yyyy-MM-dd"),
        created_at: format(new Date(item.created_at), "yyyy-MM-dd HH:mm"),
        item_name: item.stock_items?.nama_barang || "N/A",
        item_code: item.stock_items?.kode_barang || "N/A",
        from_category: getCategoryDisplay(item.from_category),
        to_category: getCategoryDisplay(item.to_category),
        quantity: item.quantity,
        reason: item.reason || "",
      }));
      return flattenedData;
    } catch (err: any) {
      console.error("Error fetching all stock movements for export:", err);
      showError("Gagal memuat semua data perpindahan stok untuk ekspor.");
      return null;
    }
  }, [startDate, endDate, filterFromCategory, filterToCategory]);

  const stockMovementHeaders: { key: keyof FlattenedStockMovementForExport; label: string }[] = [
    { key: "movement_date", label: "Tanggal Perpindahan" },
    { key: "created_at", label: "Waktu Dibuat" },
    { key: "item_name", label: "Nama Barang" },
    { key: "item_code", label: "Kode Barang" },
    { key: "from_category", label: "Dari Kategori" },
    { key: "to_category", label: "Ke Kategori" },
    { key: "quantity", label: "Kuantitas" },
    { key: "reason", label: "Alasan" },
  ];

  useEffect(() => {
    fetchStockMovements();
  }, [fetchStockMovements]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterFromCategory("all");
    setFilterToCategory("all");
    setSelectedDatePreset("all");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleViewNotes = (notes: string) => {
    setNotesToView(notes);
    setIsViewNotesOpen(true);
  };

  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredMovements.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getCategoryDisplay = (category: string) => {
    switch (category) {
      case "siap_jual": return "Siap Jual";
      case "riset": return "Riset";
      case "retur": return "Retur";
      default: return category;
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-2xl font-semibold">Riwayat Perpindahan Stok</CardTitle>
          <ExportDataButton
            fetchDataFunction={fetchAllStockMovementsForExport}
            fileName="stock_movements_history.csv"
            headers={stockMovementHeaders}
          />
        </div>
        <CardDescription>Lihat semua perpindahan stok antar kategori gudang.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
        <div className="flex flex-col md:flex-row gap-4 mb-4 flex-wrap">
          <Input
            type="text"
            placeholder="Cari berdasarkan nama/kode barang, alasan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Select value={filterFromCategory} onValueChange={setFilterFromCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Dari Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Asal</SelectItem>
              <SelectItem value="siap_jual">Siap Jual</SelectItem>
              <SelectItem value="riset">Riset</SelectItem>
              <SelectItem value="retur">Retur</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterToCategory} onValueChange={setFilterToCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ke Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tujuan</SelectItem>
              <SelectItem value="siap_jual">Siap Jual</SelectItem>
              <SelectItem value="riset">Riset</SelectItem>
              <SelectItem value="retur">Retur</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDatePreset} onValueChange={setSelectedDatePreset}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Tanggal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Waktu</SelectItem>
              <SelectItem value="current_month">Bulan Ini</SelectItem>
              <SelectItem value="last_3_months">3 Bulan Terakhir</SelectItem>
              <SelectItem value="custom">Rentang Kustom</SelectItem>
            </SelectContent>
          </Select>
          {selectedDatePreset === "custom" && (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[180px] justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Tanggal Mulai</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[180px] justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Tanggal Akhir</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </>
          )}
          <Button onClick={handleResetFilters} variant="outline">
            Reset Filter
          </Button>
        </div>

        {filteredMovements.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal Perpindahan</TableHead>
                    <TableHead>Waktu Dibuat</TableHead>
                    <TableHead>Nama Barang</TableHead>
                    <TableHead>Kode Barang</TableHead>
                    <TableHead>Dari Kategori</TableHead>
                    <TableHead>Ke Kategori</TableHead>
                    <TableHead className="text-right">Kuantitas</TableHead>
                    <TableHead>Alasan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>{format(new Date(movement.movement_date), "dd-MM-yyyy")}</TableCell>
                      <TableCell>{format(new Date(movement.created_at), "dd-MM-yyyy HH:mm")}</TableCell>
                      <TableCell>{movement.stock_items?.nama_barang || "N/A"}</TableCell>
                      <TableCell>{movement.stock_items?.kode_barang || "N/A"}</TableCell>
                      <TableCell>{getCategoryDisplay(movement.from_category)}</TableCell>
                      <TableCell>{getCategoryDisplay(movement.to_category)}</TableCell>
                      <TableCell className="text-right">{movement.quantity}</TableCell>
                      <TableCell>
                        {movement.reason ? (
                          <Button variant="outline" size="sm" onClick={() => handleViewNotes(movement.reason!)} className="h-7 px-2">
                            <Eye className="h-3 w-3 mr-1" /> Lihat
                          </Button>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">Tidak ada riwayat perpindahan stok yang tersedia atau cocok dengan pencarian Anda.</p>
        )}
      </CardContent>

      <ViewNotesDialog
        notes={notesToView}
        isOpen={isViewNotesOpen}
        onOpenChange={setIsViewNotesOpen}
      />
    </Card>
  );
};

export default StockMovementHistoryPage;