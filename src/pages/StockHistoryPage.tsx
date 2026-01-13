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
import { format } from "date-fns";
import { Loader2, History } from "lucide-react";

const StockHistoryPage = () => {
  const [transactions, setTransactions] = useState<StockTransactionWithItemName[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<StockTransactionWithItemName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchStockTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
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
        `)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Ensure stock_items is always an array or null, then cast
      const processedData: StockTransactionWithItemName[] = data.map((item: any) => ({
        ...item,
        stock_items: item.stock_items ? [item.stock_items] : null, // Wrap single object in an array if it exists
      }));

      setTransactions(processedData);
      setFilteredTransactions(processedData);
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
  }, []);

  useEffect(() => {
    fetchStockTransactions();
  }, [fetchStockTransactions]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = transactions.filter(item => {
      const matchesSearch =
        item.stock_items?.[0]?.nama_barang?.toLowerCase().includes(lowerCaseSearchTerm) || // Corrected access
        item.stock_items?.[0]?.kode_barang?.toLowerCase().includes(lowerCaseSearchTerm) || // Corrected access
        item.transaction_type.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.notes?.toLowerCase().includes(lowerCaseSearchTerm);

      const matchesType = filterType === "all" || item.transaction_type === filterType;

      return matchesSearch && matchesType;
    });
    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterType, transactions]);

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
        <CardTitle className="text-2xl font-semibold">Riwayat Transaksi Stok</CardTitle>
        <CardDescription>Lihat semua transaksi keluar dan masuk stok untuk keperluan audit.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
        <div className="flex flex-col md:flex-row gap-4">
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
                      <TableCell>{transaction.stock_items?.[0]?.nama_barang || "N/A"}</TableCell> {/* Corrected access */}
                      <TableCell>{transaction.stock_items?.[0]?.kode_barang || "N/A"}</TableCell> {/* Corrected access */}
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.transaction_type)}`}>
                          {getTransactionTypeDisplay(transaction.transaction_type)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{transaction.quantity}</TableCell>
                      <TableCell className="max-w-[300px] truncate">{transaction.notes || "-"}</TableCell>
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
    </Card>
  );
};

export default StockHistoryPage;