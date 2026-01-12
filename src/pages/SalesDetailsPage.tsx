"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { readExcelFile } from "@/lib/excelUtils";
import { SalesDetailItem } from "@/types/data"; // Menggunakan SalesDetailItem
import { generateDummySalesData } from "@/lib/dummyData"; // Import dummy data generator

const SalesDetailsPage = () => {
  const [salesData, setSalesData] = useState<SalesDetailItem[]>([]);
  const [filteredSalesData, setFilteredSalesData] = useState<SalesDetailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await readExcelFile("/SALES ST-007 2026.xlsx");
        if (data.sales.length > 0) {
          setSalesData(data.sales);
          setFilteredSalesData(data.sales);
        } else {
          // Use dummy data if Excel file is empty or fails to load
          const dummy = generateDummySalesData();
          setSalesData(dummy);
          setFilteredSalesData(dummy);
          setError("File Excel kosong atau gagal dimuat. Menampilkan data dummy.");
        }
      } catch (err) {
        setError("Gagal memuat data penjualan dari file Excel. Menampilkan data dummy.");
        console.error(err);
        // Fallback to dummy data on error
        const dummy = generateDummySalesData();
        setSalesData(dummy);
        setFilteredSalesData(dummy);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = salesData.filter(item =>
      item.Invoice.toLowerCase().includes(lowerCaseSearchTerm) ||
      item["No Transaksi"].toLowerCase().includes(lowerCaseSearchTerm) ||
      item.Customer.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.Perusahaan.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.Type.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.Teknisi.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.Tanggal.toLowerCase().includes(lowerCaseSearchTerm) ||
      item["Alamat install"].toLowerCase().includes(lowerCaseSearchTerm) ||
      item["No HP"].toLowerCase().includes(lowerCaseSearchTerm) ||
      item.Catatan.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredSalesData(filtered);
  }, [searchTerm, salesData]);

  if (loading) {
    return (
      <Card className="border shadow-sm">
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

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Detil List Invoice Penjualan</CardTitle>
        <CardDescription>Daftar lengkap invoice penjualan Anda.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
        <Input
          type="text"
          placeholder="Cari berdasarkan Invoice, No Transaksi, Customer, Perusahaan, Type, Teknisi, Tanggal, dll..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        {filteredSalesData.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Kirim/Install</TableHead>
                  <TableHead>No Transaksi</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>New/Old</TableHead>
                  <TableHead>Perusahaan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Hari</TableHead>
                  <TableHead>Jam</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Alamat install</TableHead>
                  <TableHead>No HP</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Qty unit</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Harga</TableHead>
                  <TableHead>WEB</TableHead>
                  <TableHead className="text-right">Qty Web</TableHead>
                  <TableHead>Kartu</TableHead>
                  <TableHead className="text-right">Qty kartu</TableHead>
                  <TableHead>Paket</TableHead>
                  <TableHead className="text-right">Pulsa</TableHead>
                  <TableHead>Teknisi</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSalesData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.NO}</TableCell>
                    <TableCell>{item["Kirim/Install"]}</TableCell>
                    <TableCell>{item["No Transaksi"]}</TableCell>
                    <TableCell>{item.Invoice}</TableCell>
                    <TableCell>{item["New/Old"]}</TableCell>
                    <TableCell>{item.Perusahaan}</TableCell>
                    <TableCell>{item.Tanggal}</TableCell>
                    <TableCell>{item.Hari}</TableCell>
                    <TableCell>{item.Jam}</TableCell>
                    <TableCell>{item.Customer}</TableCell>
                    <TableCell>{item["Alamat install"]}</TableCell>
                    <TableCell>{item["No HP"]}</TableCell>
                    <TableCell>{item.Type}</TableCell>
                    <TableCell className="text-right">{item["Qty unit"]}</TableCell>
                    <TableCell className="text-right">{item.Stock}</TableCell>
                    <TableCell className="text-right">{item.Harga.toLocaleString('id-ID')}</TableCell>
                    <TableCell>{item.WEB}</TableCell>
                    <TableCell className="text-right">{item["Qty Web"]}</TableCell>
                    <TableCell>{item.Kartu}</TableCell>
                    <TableCell className="text-right">{item["Qty kartu"]}</TableCell>
                    <TableCell>{item.Paket}</TableCell>
                    <TableCell className="text-right">{item.Pulsa.toLocaleString('id-ID')}</TableCell>
                    <TableCell>{item.Teknisi}</TableCell>
                    <TableCell>{item.Payment}</TableCell>
                    <TableCell>{item.Catatan}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">Tidak ada data penjualan yang tersedia atau cocok dengan pencarian Anda.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesDetailsPage;