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
import AddStockTransactionForm from "@/components/AddStockTransactionForm";
import PaginationControls from "@/components/PaginationControls";
import ExportDataButton from "@/components/ExportDataButton"; // Import new component
import { Loader2, Edit, Trash2, PlusCircle, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const StockPage = () => {
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [filteredStockData, setFilteredStockData] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState<StockItem | null>(null);

  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"in" | "out" | "return" | "damage_loss" | undefined>(undefined);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchStockData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("stock_items")
        .select("id, user_id, kode_barang, nama_barang, satuan, harga_beli, harga_jual, stock_awal, stock_masuk, stock_keluar, stock_akhir, safe_stock_limit, created_at")
        .order("nama_barang", { ascending: true });

      if (error) {
        throw error;
      }

      const fetchedStock: StockItem[] = data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        NO: 0, // This will be assigned sequentially for display if needed, but not stored in DB
        "KODE BARANG": item.kode_barang,
        "NAMA BARANG": item.nama_barang,
        SATUAN: item.satuan || "",
        "HARGA BELI": item.harga_beli,
        "HARGA JUAL": item.harga_jual,
        "STOCK AWAL": item.stock_awal,
        "STOCK MASUK": item.stock_masuk,
        "STOCK KELUAR": item.stock_keluar,
        "STOCK AKHIR": item.stock_akhir,
        safe_stock_limit: item.safe_stock_limit,
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

  const fetchAllStockDataForExport = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("stock_items")
        .select("id, user_id, kode_barang, nama_barang, satuan, harga_beli, harga_jual, stock_awal, stock_masuk, stock_keluar, stock_akhir, safe_stock_limit, created_at")
        .order("nama_barang", { ascending: true });

      if (error) {
        throw error;
      }
      return data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        NO: 0, // Placeholder, actual NO might be assigned during export if needed
        "KODE BARANG": item.kode_barang,
        "NAMA BARANG": item.nama_barang,
        SATUAN: item.satuan || "",
        "HARGA BELI": item.harga_beli,
        "HARGA JUAL": item.harga_jual,
        "STOCK AWAL": item.stock_awal,
        "STOCK MASUK": item.stock_masuk,
        "STOCK KELUAR": item.stock_keluar,
        "STOCK AKHIR": item.stock_akhir,
        safe_stock_limit: item.safe_stock_limit,
        created_at: item.created_at,
      })) as StockItem[];
    } catch (err: any) {
      console.error("Error fetching all stock data for export:", err);
      showError("Gagal memuat semua data stok untuk ekspor.");
      return null;
    }
  }, []);

  const stockItemHeaders: { key: keyof StockItem; label: string }[] = [
    { key: "KODE BARANG", label: "Kode Barang" },
    { key: "NAMA BARANG", label: "Nama Barang" },
    { key: "SATUAN", label: "Satuan" },
    { key: "HARGA BELI", label: "Harga Beli" },
    { key: "HARGA JUAL", label: "Harga Jual" },
    { key: "STOCK AWAL", label: "Stok Awal" },
    { key: "STOCK MASUK", label: "Stok Masuk" },
    { key: "STOCK KELUAR", label: "Stok Keluar" },
    { key: "STOCK AKHIR", label: "Stok Akhir" },
    { key: "safe_stock_limit", label: "Batas Aman" },
    { key: "created_at", label: "Created At" },
  ];

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

  // Modified handleTransactionClick to open the form without a specific initial type
  const handleOpenTransactionForm = (item: StockItem) => {
    setSelectedStockItem(item);
    setTransactionType(undefined); // Let the form's default handle the initial type
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
          <div className="flex gap-2"> {/* Group buttons */}
            <AddStockItemForm onSuccess={fetchStockData} />
            <ExportDataButton
              fetchDataFunction={fetchAllStockDataForExport}
              fileName="stock_items.csv"
              headers={stockItemHeaders}
            />
          </div>
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
                    <TableHead className="text-right">Batas Aman</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((item) => (
                    <TableRow key={item.id}><TableCell>{item["KODE BARANG"]}</TableCell><TableCell>{item["NAMA BARANG"]}</TableCell><TableCell>{item.SATUAN}</TableCell><TableCell className="text-right">{item["HARGA BELI"].toLocaleString('id-ID')}</TableCell><TableCell className="text-right">{item["HARGA JUAL"].toLocaleString('id-ID')}</TableCell><TableCell className="text-right">{item["STOCK AWAL"]}</TableCell><TableCell className="text-right">{item["STOCK MASUK"]}</TableCell><TableCell className="text-right">{item["STOCK KELUAR"]}</TableCell><TableCell className="text-right">{item["STOCK AKHIR"]}</TableCell><TableCell className="text-right">{item.safe_stock_limit}</TableCell><TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <Settings className="h-4 w-4" /> Atur Barang
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditClick(item)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit Item
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenTransactionForm(item)}>
                              <Settings className="mr-2 h-4 w-4" /> Atur Stok
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
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
          initialTransactionType={transactionType} // This will be undefined, letting the form's default
        />
      )}
    </Card>
  );
};

export default StockPage;