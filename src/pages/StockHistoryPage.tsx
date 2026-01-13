"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StockTransactionWithItemName } from "@/types/data";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import PaginationControls from "@/components/PaginationControls";
import { format, startOfMonth, endOfMonth, subMonths, addDays } from "date-fns";
import { Loader2, History, CalendarIcon, Eye } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ExportDataButton from "@/components/ExportDataButton"; // Import ExportDataButton
import ViewNotesDialog from "@/components/ViewNotesDialog"; // Import ViewNotesDialog

// Define a flattened type for export
interface FlattenedStockTransactionForExport {
  transaction_date: string;
  created_at: string;
  item_name: string;
  item_code: string;
  transaction_type: string;
  quantity: number;
  notes: string;
}

const StockHistoryPage = () => {
  const [transactions, setTransactions] = useState<StockTransactionWithItemName[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<StockTransactionWithItemName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedDatePreset, setSelectedDatePreset] = useState<string>("all"); // "all", "current_month", "last_3_months", "custom"

  const [isViewNotesOpen, setIsViewNotesOpen] = useState(false); // State for ViewNotesDialog
  const [notesToView, setNotesToView] = useState<string>(""); // State for notes content

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Helper to calculate dates based on preset
  const calculateDateRange = useCallback((preset: string) => {
    const now = new Date();
    let newStartDate: Date | undefined;
    let newEndDate: Date | undefined;

    if (preset === "current_month") {
      newStartDate = startOfMonth(now);
      newEndDate = endOfMonth(now);
    } else if (preset === "last_3_months") {
      newStartDate = startOfMonth(subMonths(now, 2)); // Start of 3 months ago
      newEndDate = endOfMonth(now);
    } else if (preset === "all") {
      newStartDate = undefined;
      newEndDate = undefined;
    }
    // For "custom", startDate and endDate are managed by calendar pickers directly

    setStartDate(newStartDate);
    setEndDate(newEndDate);
  }, []);

  // Effect to react to preset changes
  useEffect(() => {
    calculateDateRange(selectedDatePreset);
  }, [selectedDatePreset, calculateDateRange]);

  const fetchStockTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("stock_transactions")
        .select(`
          id,
          user_id,
          stock_item_id,
          transaction_type,
          quantity,
          notes,
          transaction_date,
          created_at,
          stock_items (
            nama_barang,
            kode_barang
          )
        `);

      // Apply date filters
      if (startDate) {
        query = query.gte("transaction_date", format(startDate, "yyyy-MM-dd"));
      }
      if (endDate) {
        // Add one day to endDate to include the entire selected day
        const adjustedEndDate = addDays(endDate, 1);
        query = query.lte("transaction_date", format(adjustedEndDate, "yyyy-MM-dd"));
      }

      // Apply type filter
      if (filterType !== "all") {
        query = query.eq("transaction_type", filterType);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const processedData: StockTransactionWithItemName[] = data.map((item: any) => ({
        ...item,
        stock_items: item.stock_items ? [item.stock_items] : null,
      }));

      // Client-side search filtering
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const filteredBySearch = processedData.filter(item => {
        return (
          item.stock_items?.[0]?.nama_barang?.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.stock_items?.[0]?.kode_barang?.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.transaction_type.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.notes?.toLowerCase().includes(lowerCaseSearchTerm)
        );
      });

      setTransactions(processedData); // Keep all fetched data (date & type filtered)
      setFilteredTransactions(filteredBySearch); // Apply search filter on top
      setCurrentPage(1);
    } catch (err: any) {
      setError(`Gagal memuat riwayat transaksi stok: ${err.message}`);
      console.error("Error fetching stock transactions:", err);
      showError("Gagal memuat riwayat transaksi stok.");
      setTransactions([]);
      setFilteredTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, filterType, searchTerm]); // Dependencies for useCallback

  // Function to fetch all stock transactions for export
  const fetchAllStockTransactionsForExport = useCallback(async () => {
    try {
      let query = supabase
        .from("stock_transactions")
        .select(`
          id,
          transaction_type,
          quantity,
          notes,
          transaction_date,
          created_at,
          stock_items (
            nama_barang,
            kode_barang
          )
        `);

      // Apply date filters for export as well
      if (startDate) {
        query = query.gte("transaction_date", format(startDate, "yyyy-MM-dd"));
      }
      if (endDate) {
        const adjustedEndDate = addDays(endDate, 1);
        query = query.lte("transaction_date", format(adjustedEndDate, "yyyy-MM-dd"));
      }

      // Apply type filter for export
      if (filterType !== "all") {
        query = query.eq("transaction_type", filterType);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Flatten the data for CSV export
      const flattenedData: FlattenedStockTransactionForExport[] = await Promise.all(data.map(async (item: any) => {
        let processedNotes = item.notes || "";
        const invoiceIdRegex = /(Invoice: )([0-9a-fA-F-]+)/;
        const match = processedNotes.match(invoiceIdRegex);

        if (match && match[2]) {
          const invoiceId = match[2];
          try {
            const { data: invoiceData, error: invoiceError } = await supabase
              .from("invoices")
              .select("invoice_number")
              .eq("id", invoiceId)
              .single();

            if (!invoiceError && invoiceData) {
              processedNotes = processedNotes.replace(invoiceIdRegex, `Invoice: ${invoiceData.invoice_number}`);
            } else {
              console.warn(`Could not fetch invoice number for ID ${invoiceId}:`, invoiceError);
            }
          } catch (err) {
            console.error(`Error fetching invoice number for ID ${invoiceId}:`, err);
          }
        }

        return {
          transaction_date: format(new Date(item.transaction_date), "yyyy-MM-dd"),
          created_at: format(new Date(item.created_at), "yyyy-MM-dd HH:mm"),
          item_name: item.stock_items?.[0]?.nama_barang || "N/A",
          item_code: item.stock_items?.[0]?.kode_barang || "N/A",
          transaction_type: getTransactionTypeDisplay(item.transaction_type),
          quantity: item.quantity,
          notes: processedNotes,
        };
      }));
      return flattenedData;
    } catch (err: any) {
      console.error("Error fetching all stock transactions for export:", err);
      showError("Gagal memuat semua data riwayat stok untuk ekspor.");
      return null;
    }
  }, [startDate, endDate, filterType]); // Dependencies for export function

  const stockTransactionHeaders: { key: keyof FlattenedStockTransactionForExport; label: string }[] = [
    { key: "transaction_date", label: "Tanggal Transaksi" },
    { key: "created_at", label: "Waktu Dibuat" },
    { key: "item_name", label: "Nama Barang" },
    { key: "item_code", label: "Kode Barang" },
    { key: "transaction_type", label: "Tipe Transaksi" },
    { key: "quantity", label: "Kuantitas" },
    { key: "notes", label: "Catatan" },
  ];

  // Initial fetch and refetch on filter changes
  useEffect(() => {
    fetchStockTransactions();
  }, [fetchStockTransactions]); // This useEffect will trigger fetchStockTransactions when its dependencies change.

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setSelectedDatePreset("all");
    setStartDate(undefined);
    setEndDate(undefined);
    // fetchStockTransactions will be called via useEffect due to state changes
  };

  const handleViewNotes = (notes: string) => {
    setNotesToView(notes);
    setIsViewNotesOpen(true);
  };

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getTransactionTypeDisplay = (type: string) => {
    switch (type) {
      case "initial": return "Stok Awal";
      case "in": return "Stok Masuk";
      case "out": return "Stok Keluar";
      case "return": return "Retur Barang";
      case "damage_loss": return "Rusak/Hilang";
      default: return type;
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "in":
      case "initial":
      case "return":
        return "bg-green-100 text-green-800";
      case "out":
      case "damage_loss":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Riwayat Transaksi Stok</CardTitle>
          <CardDescription>Memuat riwayat transaksi stok...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">Memuat data riwayat stok...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-2xl font-semibold">Riwayat Transaksi Stok</CardTitle>
          <ExportDataButton
            fetchDataFunction={fetchAllStockTransactionsForExport}
            fileName="stock_transactions_history.csv"
            headers={stockTransactionHeaders}
          />
        </div>
        <CardDescription>Lihat semua transaksi keluar dan masuk stok untuk keperluan audit.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
        <div className="flex flex-col md:flex-row gap-4 mb-4 flex-wrap">
          <Input
            type="text"
            placeholder="Cari berdasarkan nama/kode barang, tipe transaksi, atau catatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Tipe Transaksi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="initial">Stok Awal</SelectItem>
              <SelectItem value="in">Stok Masuk</SelectItem>
              <SelectItem value="out">Stok Keluar</SelectItem>
              <SelectItem value="return">Retur Barang</SelectItem>
              <SelectItem value="damage_loss">Rusak/Hilang</SelectItem>
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

        {filteredTransactions.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal Transaksi</TableHead>
                    <TableHead>Waktu Dibuat</TableHead>
                    <TableHead>Nama Barang</TableHead>
                    <TableHead>Kode Barang</TableHead>
                    <TableHead>Tipe Transaksi</TableHead>
                    <TableHead className="text-right">Kuantitas</TableHead>
                    <TableHead>Catatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{format(new Date(transaction.transaction_date), "dd-MM-yyyy")}</TableCell>
                      <TableCell>{format(new Date(transaction.created_at), "dd-MM-yyyy HH:mm")}</TableCell>
                      <TableCell>{transaction.stock_items?.[0]?.nama_barang || "N/A"}</TableCell>
                      <TableCell>{transaction.stock_items?.[0]?.kode_barang || "N/A"}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.transaction_type)}`}>
                          {getTransactionTypeDisplay(transaction.transaction_type)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{transaction.quantity}</TableCell>
                      <TableCell>
                        {transaction.notes ? (
                          <Button variant="outline" size="sm" onClick={() => handleViewNotes(transaction.notes!)} className="h-7 px-2">
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
          <p className="text-gray-700 dark:text-gray-300">Tidak ada riwayat transaksi stok yang tersedia atau cocok dengan pencarian Anda.</p>
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

export default StockHistoryPage;