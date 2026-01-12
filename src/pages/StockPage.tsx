"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { StockItem } from "@/types/data";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import AddStockItemForm from "@/components/AddStockItemForm";
import PaginationControls from "@/components/PaginationControls"; // Import PaginationControls

const StockPage = () => {
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [filteredStockData, setFilteredStockData] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // You can adjust this number

  const fetchStockData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("stock_items")
        .select("*")
        .order("no", { ascending: true });

      if (error) {
        throw error;
      }

      const fetchedStock: StockItem[] = data.map(item => ({
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
      }));

      setStockData(fetchedStock);
      setFilteredStockData(fetchedStock);
      setCurrentPage(1); // Reset to first page on new data fetch
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
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, stockData]);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredStockData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredStockData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Data Stok Barang</CardTitle>
          <CardDescription>Informasi mengenai stok barang yang tersedia.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">Memuat data stok...</p>
        </CardContent>
      </Card>
    );
  }

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
            <div className="overflow-x-auto"> {/* Ensures horizontal scrolling */}
              <Table className="min-w-full"> {/* Ensures table takes full width for scrolling */}
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((item, index) => (
                    <TableRow key={item["KODE BARANG"] || index}>
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
          <p className="text-gray-700 dark:text-gray-300">Tidak ada data stok yang tersedia atau cocok dengan pencarian Anda.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StockPage;