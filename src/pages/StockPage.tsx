"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input"; // Import Input component
import { readExcelFile } from "@/lib/excelUtils";
import { StockItem } from "@/types/data";

const StockPage = () => {
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [filteredStockData, setFilteredStockData] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await readExcelFile("/SALES ST-007 2026.xlsx");
        setStockData(data.stock);
        setFilteredStockData(data.stock);
      } catch (err) {
        setError("Gagal memuat data stok dari file Excel.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = stockData.filter(item =>
      item["KODE BARANG"].toLowerCase().includes(lowerCaseSearchTerm) ||
      item["NAMA BARANG"].toLowerCase().includes(lowerCaseSearchTerm) ||
      item.SATUAN.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredStockData(filtered);
  }, [searchTerm, stockData]);

  if (loading) {
    return (
      <Card className="border-none shadow-none">
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

  if (error) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Data Stok Barang</CardTitle>
          <CardDescription>Informasi mengenai stok barang yang tersedia.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Data Stok Barang</CardTitle>
        <CardDescription>Informasi mengenai stok barang yang tersedia.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          placeholder="Cari berdasarkan kode, nama barang, atau satuan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        {filteredStockData.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
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
                {filteredStockData.map((item, index) => (
                  <TableRow key={index}>
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
        ) : (
          <p className="text-gray-700 dark:text-gray-300">Tidak ada data stok yang tersedia atau cocok dengan pencarian Anda.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StockPage;