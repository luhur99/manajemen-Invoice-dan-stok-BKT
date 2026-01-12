"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { readExcelFile } from "@/lib/excelUtils";
import { SalesItem } from "@/types/data";

const SalesDetailsPage = () => {
  const [salesData, setSalesData] = useState<SalesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await readExcelFile("/SALES ST-007 2026.xlsx");
        setSalesData(data.sales);
      } catch (err) {
        setError("Gagal memuat data penjualan dari file Excel.");
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
          <CardTitle className="text-2xl font-semibold">Detil List Invoice Penjualan</CardTitle>
          <CardDescription>Daftar lengkap invoice penjualan Anda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">Memuat data penjualan...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Detil List Invoice Penjualan</CardTitle>
          <CardDescription>Daftar lengkap invoice penjualan Anda.</CardDescription>
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
        <CardTitle className="text-2xl font-semibold">Detil List Invoice Penjualan</CardTitle>
        <CardDescription>Daftar lengkap invoice penjualan Anda.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {salesData.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>No Invoice</TableHead>
                  <TableHead>Kode Barang</TableHead>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Satuan</TableHead>
                  <TableHead className="text-right">Harga Jual</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Total Harga</TableHead>
                  <TableHead>Customer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.NO}</TableCell>
                    <TableCell>{item.TANGGAL}</TableCell>
                    <TableCell>{item["NO INVOICE"]}</TableCell>
                    <TableCell>{item["KODE BARANG"]}</TableCell>
                    <TableCell>{item["NAMA BARANG"]}</TableCell>
                    <TableCell>{item.SATUAN}</TableCell>
                    <TableCell className="text-right">{item["HARGA JUAL"].toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right">{item.QTY}</TableCell>
                    <TableCell className="text-right">{item["TOTAL HARGA"].toLocaleString('id-ID')}</TableCell>
                    <TableCell>{item.CUSTOMER}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">Tidak ada data penjualan yang tersedia.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesDetailsPage;