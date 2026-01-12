"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { readExcelFile } from "@/lib/excelUtils";
import { SalesDetailItem } from "@/types/data";
import { generateDummySalesData } from "@/lib/dummyData";
import InvoiceUpload from "@/components/InvoiceUpload";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import PaginationControls from "@/components/PaginationControls";

const SalesDetailsPage = () => {
  const [salesData, setSalesData] = useState<SalesDetailItem[]>([]);
  const [filteredSalesData, setFilteredSalesData] = useState<SalesDetailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const excelData = await readExcelFile("/SALES ST-007 2026.xlsx");
        let initialSalesData: SalesDetailItem[];

        if (excelData.sales.length > 0) {
          initialSalesData = excelData.sales;
        } else {
          initialSalesData = generateDummySalesData();
          setError("File Excel kosong atau gagal dimuat. Menampilkan data dummy.");
        }

        const { data: dbInvoices, error: dbError } = await supabase
          .from("sales_invoices")
          .select("no_transaksi, invoice_file_url");

        if (dbError) {
          console.error("Error fetching sales invoices from DB:", dbError);
          showError("Gagal memuat URL invoice dari database.");
        }

        const invoiceMap = new Map(
          dbInvoices?.map((inv) => [inv.no_transaksi, inv.invoice_file_url]) || []
        );

        const mergedSalesData = initialSalesData.map((item) => ({
          ...item,
          invoice_file_url: invoiceMap.get(item.no_transaksi) || undefined,
        }));

        setSalesData(mergedSalesData);
        setFilteredSalesData(mergedSalesData);
        setCurrentPage(1);
      } catch (err) {
        setError("Gagal memuat data penjualan. Menampilkan data dummy.");
        console.error(err);
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
      item.invoice_number.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.no_transaksi.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.customer.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.perusahaan?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.type?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.teknisi?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.tanggal.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.alamat_install?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.no_hp?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.catatan?.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredSalesData(filtered);
    setCurrentPage(1);
  }, [searchTerm, salesData]);

  const handleInvoiceUploadSuccess = async (salesId: string, fileUrl: string) => {
    setSalesData(prevData =>
      prevData.map(item =>
        item.no_transaksi === salesId ? { ...item, invoice_file_url: fileUrl } : item
      )
    );
    setFilteredSalesData(prevData =>
      prevData.map(item =>
        item.no_transaksi === salesId ? { ...item, invoice_file_url: fileUrl } : item
      )
    );

    const { error: upsertError } = await supabase
      .from("sales_invoices")
      .upsert(
        { no_transaksi: salesId, invoice_file_url: fileUrl },
        { onConflict: "no_transaksi" }
      );

    if (upsertError) {
      console.error("Error saving invoice URL to DB:", upsertError);
      showError("Gagal menyimpan URL invoice ke database.");
    }
  };

  const handleInvoiceRemoveSuccess = async (salesId: string) => {
    setSalesData(prevData =>
      prevData.map(item =>
        item.no_transaksi === salesId ? { ...item, invoice_file_url: undefined } : item
      )
    );
    setFilteredSalesData(prevData =>
      prevData.map(item =>
        item.no_transaksi === salesId ? { ...item, invoice_file_url: undefined } : item
      )
    );

    const { error: deleteError } = await supabase
      .from("sales_invoices")
      .delete()
      .eq("no_transaksi", salesId);

    if (deleteError) {
      console.error("Error removing invoice URL from DB:", deleteError);
      showError("Gagal menghapus URL invoice dari database.");
    }
  };

  const totalPages = Math.ceil(filteredSalesData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredSalesData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
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
                  {currentItems.map((item, index) => (
                    <TableRow key={item.no_transaksi || index}>
                      <TableCell>{item.no}</TableCell>
                      <TableCell>{item.kirim_install}</TableCell>
                      <TableCell>{item.no_transaksi}</TableCell>
                      <TableCell>
                        <InvoiceUpload
                          salesId={item.no_transaksi}
                          currentFileUrl={item.invoice_file_url}
                          onUploadSuccess={(fileUrl) => handleInvoiceUploadSuccess(item.no_transaksi, fileUrl)}
                          onRemoveSuccess={() => handleInvoiceRemoveSuccess(item.no_transaksi)}
                        />
                      </TableCell>
                      <TableCell>{item.new_old}</TableCell>
                      <TableCell>{item.perusahaan}</TableCell>
                      <TableCell>{item.tanggal}</TableCell>
                      <TableCell>{item.hari}</TableCell>
                      <TableCell>{item.jam}</TableCell>
                      <TableCell>{item.customer}</TableCell>
                      <TableCell>{item.alamat_install}</TableCell>
                      <TableCell>{item.no_hp}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell className="text-right">{item.qty_unit}</TableCell>
                      <TableCell className="text-right">{item.stock}</TableCell>
                      <TableCell className="text-right">{item.harga?.toLocaleString('id-ID')}</TableCell>
                      <TableCell>{item.web}</TableCell>
                      <TableCell className="text-right">{item.qty_web}</TableCell>
                      <TableCell>{item.kartu}</TableCell>
                      <TableCell className="text-right">{item.qty_kartu}</TableCell>
                      <TableCell>{item.paket}</TableCell>
                      <TableCell className="text-right">{item.pulsa?.toLocaleString('id-ID')}</TableCell>
                      <TableCell>{item.teknisi}</TableCell>
                      <TableCell>{item.payment}</TableCell>
                      <TableCell>{item.catatan}</TableCell>
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
          <p className="text-gray-700 dark:text-gray-300">Tidak ada data penjualan yang tersedia atau cocok dengan pencarian Anda.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesDetailsPage;