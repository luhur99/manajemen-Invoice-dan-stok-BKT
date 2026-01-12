"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { readExcelFile } from "@/lib/excelUtils";
import { StockItem } from "@/types/data";

const StockPage = () => {
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await readExcelFile("/SALES ST-007 2026.xlsx");
        setStockData(data.stock);
      } catch (err) {
        setError("Gagal memuat data stok dari file Excel.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
        {stockData.length > 0 ? (
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
                {stockData.map((item, index) => (
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
          <p className="text-gray-700 dark:text-gray-300">Tidak ada data stok yang tersedia.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StockPage;