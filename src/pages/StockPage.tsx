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
import EditStockItemForm from "@/components/EditStockItemForm"; // Import EditStockItemForm
import PaginationControls from "@/components/PaginationControls";
import { Loader2, Edit, Trash2 } from "lucide-react";

const StockPage = () => {
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [filteredStockData, setFilteredStockData] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditFormOpen, setIsEditFormOpen] = useState(false); // State for edit dialog
  const [selectedStockItem, setSelectedStockItem] = useState<StockItem | null>(null); // State for selected stock item to edit

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchStockData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("stock_items")
        .select("id, user_id, no, kode_barang, nama_barang, satuan, harga_beli, harga_jual, stock_awal, stock_masuk, stock_keluar, stock_akhir, created_at") // Select 'id' and 'user_id'
        .order("no", { ascending: true });

      if (error) {
        throw error;
      }

      const fetchedStock: StockItem[] = data.map(item => ({
        id: item.id, // Map the new 'id'
        user_id: item.user_id, // Map the new 'user_id'
        NO: item.no,
        "KODE BARANG": item.kode_barang,
        "NAMA BARANG": item.nama_barang,
        SATUAN: item.satuan || "",
        "HARGA BELI": item.harga_beli,
        "HARGA JUAL": item.harga_jual,
        "STOCK AWAL": item.stock_awal,
        "STOCK MASUK": item.stock_masuk,
        "STOCK KELUAR": item.stock_keluar,
        "STOCK AKHIR": item.stock_akhir,
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

  const handleDeleteStockItem = async (stockItemId: string) => { // Changed parameter to stockItemId
    if (!window.confirm("Apakah Anda yakin ingin menghapus item stok ini?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("stock_items")
        .delete()
        .eq("id", stockItemId); // Use 'id' for deletion

      if (error) {
        throw error;
      }

      showSuccess("Item stok berhasil dihapus!");
      fetchStockData(); // Refresh the list
    } catch (err: any) {
      showError(`Gagal menghapus item stok: ${err.message}`);
      console.error("Error deleting stock item:", err);
    }
  };

  const handleEditClick = (item: StockItem) => {
    setSelectedStockItem(item);
    setIsEditFormOpen(true);
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
                    <TableHead>No</TableHead>
                    <TableHead>Kode Barang</TableHead>
                    <TableHead>Nama Barang</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead className="text-right">Harga Beli</TableHead>
                    <TableHead className="text-right">Harga Jual</TableHead>
                    <TableHead className="text-right">Stok Awal</TableHead>
                    <TableHead className="text-right">Stok Masuk</TableHead>
                    <TableHead className="text-right">Stok Keluar</TableHead>
                    <TableHead className="text-right">Stok Akhir</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((item, index) => (
                    <TableRow key={item.id || index}> {/* Use item.id for key */}
                      <TableCell>{item.NO}</TableCell>
                      <TableCell>{item["KODE BARANG"]}</TableCell>
                      <TableCell>{item["NAMA BARANG"]}</TableCell>
                      <TableCell>{item.SATUAN}</TableCell>
                      <TableCell className="text-right">{item["HARGA BELI"].toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-right">{item["HARGA JUAL"].toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-right">{item["STOCK AWAL"]}</TableCell>
                      <TableCell className="text-right">{item["STOCK MASUK"]}</TableCell>
                      <TableCell className="text-right">{item["STOCK KELUAR"]}</TableCell>
                      <TableCell className="text-right">{item["STOCK AKHIR"]}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleEditClick(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteStockItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
    </Card>
  );
};

export default StockPage;