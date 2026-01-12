"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StockItem } from "@/types/data";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import AddStockItemForm from "@/components/AddStockItemForm";
import EditStockItemForm from "@/components/EditStockItemForm";
import AddStockTransactionForm from "@/components/AddStockTransactionForm"; // Import AddStockTransactionForm
import PaginationControls from "@/components/PaginationControls";
import { Loader2, Edit, Trash2, PlusCircle, ArrowDownCircle, ArrowUpCircle, RefreshCcw, MinusCircle } from "lucide-react"; // Import new icons
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"; // Import DropdownMenu

const StockPage = () => {
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [filteredStockData, setFilteredStockData] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState<StockItem | null>(null);

  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false); // State for transaction dialog
  const [transactionType, setTransactionType] = useState<"in" | "out" | "return" | "damage_loss" | undefined>(undefined); // State for transaction type

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchStockData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("stock_items")
        .select("id, user_id, kode_barang, nama_barang, satuan, harga_beli, harga_jual, stock_awal, stock_masuk, stock_keluar, stock_akhir, safe_stock_limit, created_at") // Select 'id', 'user_id', and 'safe_stock_limit'
        .order("nama_barang", { ascending: true }); // Order by nama_barang instead of no

      if (error) {
        throw error;
      }

      const fetchedStock: StockItem[] = data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        NO: 0, // No longer used, but keep for type compatibility if needed elsewhere
        "KODE BARANG": item.kode_barang,
        "NAMA BARANG": item.nama_barang,
        SATUAN: item.satuan || "",
        "HARGA BELI": item.harga_beli,
        "HARGA JUAL": item.harga_jual,
        "STOCK AWAL": item.stock_awal,
        "STOCK MASUK": item.stock_masuk,
        "STOCK KELUAR": item.stock_keluar,
        "STOCK AKHIR": item.stock_akhir,
        safe_stock_limit: item.safe_stock_limit, // Include new field
        created_at: item.created_at,
      }));

      setStockData(fetchedStock);
      setFilteredStockData(fetchedStock);
      setCurrentPage(1);
    } catch (err: any) {
      setError(`Gagal memuat data stok dari database: ${err.message}`);
      console.error("Error fetching stock data:", err);
      showError("Gagal memuat data stok.");
      setStockData([]);
      setFilteredStockData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = stockData.filter(item =>
      item["KODE BARANG"].toLowerCase().includes(lowerCaseSearchTerm) ||
      item["NAMA BARANG"].toLowerCase().includes(lowerCaseSearchTerm) ||
      item.SATUAN.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredStockData(filtered);
    setCurrentPage(1);
  }, [searchTerm, stockData]);

  const handleDeleteStockItem = async (stockItemId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus item stok ini?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("stock_items")
        .delete()
        .eq("id", stockItemId);

      if (error) {
        throw error;
      }

      showSuccess("Item stok berhasil dihapus!");
      fetchStockData();
    } catch (err: any) {
      showError(`Gagal menghapus item stok: ${err.message}`);
      console.error("Error deleting stock item:", err);
    }
  };

  const handleEditClick = (item: StockItem) => {
    setSelectedStockItem(item);
    setIsEditFormOpen(true);
  };

  const handleTransactionClick = (item: StockItem, type: "in" | "out" | "return" | "damage_loss") => {
    setSelectedStockItem(item);
    setTransactionType(type);
    setIsTransactionFormOpen(true);
  };

  const totalPages = Math.ceil(filteredStockData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredStockData.slice(startIndex, endIndex);

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-2xl font-semibold">Data Stok Barang</CardTitle>
          <AddStockItemForm onSuccess={fetchStockData} />
        </div>
        <CardDescription>Informasi mengenai stok barang yang tersedia.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
        <Input
          type="text"
          placeholder="Cari berdasarkan kode, nama barang, atau satuan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        {filteredStockData.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode Barang</TableHead>
                    <TableHead>Nama Barang</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead className="text-right">Harga Beli</TableHead>
                    <TableHead className="text-right">Harga Jual</TableHead>
                    <TableHead className="text-right">Stok Awal</TableHead>
                    <TableHead className="text-right">Stok Masuk</TableHead>
                    <TableHead className="text-right">Stok Keluar</TableHead>
                    <TableHead className="text-right">Stok Akhir</TableHead>
                    <TableHead className="text-right">Batas Aman</TableHead> {/* New column header */}
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item["KODE BARANG"]}</TableCell>
                      <TableCell>{item["NAMA BARANG"]}</TableCell>
                      <TableCell>{item.SATUAN}</TableCell>
                      <TableCell className="text-right">{item["HARGA BELI"].toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-right">{item["HARGA JUAL"].toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-right">{item["STOCK AWAL"]}</TableCell>
                      <TableCell className="text-right">{item["STOCK MASUK"]}</TableCell>
                      <TableCell className="text-right">{item["STOCK KELUAR"]}</TableCell>
                      <TableCell className="text-right">{item["STOCK AKHIR"]}</TableCell>
                      <TableCell className="text-right">{item.safe_stock_limit}</TableCell> {/* Display new field */}
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Aksi
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditClick(item)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit Item
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTransactionClick(item, "in")}>
                              <ArrowUpCircle className="mr-2 h-4 w-4 text-green-600" /> Stok Masuk
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTransactionClick(item, "out")}>
                              <ArrowDownCircle className="mr-2 h-4 w-4 text-red-600" /> Stok Keluar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTransactionClick(item, "return")}>
                              <RefreshCcw className="mr-2 h-4 w-4 text-blue-600" /> Retur Barang
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTransactionClick(item, "damage_loss")}>
                              <MinusCircle className="mr-2 h-4 w-4 text-orange-600" /> Rusak/Hilang
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteStockItem(item.id!)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" /> Hapus Item
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">Tidak ada data stok yang tersedia atau cocok dengan pencarian Anda.</p>
        )}
      </CardContent>

      {selectedStockItem && (
        <EditStockItemForm
          stockItem={selectedStockItem}
          isOpen={isEditFormOpen}
          onOpenChange={setIsEditFormOpen}
          onSuccess={fetchStockData}
        />
      )}

      {selectedStockItem && isTransactionFormOpen && (
        <AddStockTransactionForm
          stockItem={selectedStockItem}
          isOpen={isTransactionFormOpen}
          onOpenChange={setIsTransactionFormOpen}
          onSuccess={fetchStockData}
          initialTransactionType={transactionType}
        />
      )}
    </Card>
  );
};

export default StockPage;