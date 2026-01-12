"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SalesDetailItem } from "@/types/data";
import InvoiceUpload from "@/components/InvoiceUpload";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import PaginationControls from "@/components/PaginationControls";
import { Loader2, Edit, Trash2, PlusCircle } from "lucide-react";
import AddSalesDetailForm from "@/components/AddSalesDetailForm";
import EditSalesDetailForm from "@/components/EditSalesDetailForm";
import ExportDataButton from "@/components/ExportDataButton"; // Import new component
import { format } from "date-fns";

const SalesDetailsPage = () => {
  const [salesData, setSalesData] = useState<SalesDetailItem[]>([]);
  const [filteredSalesData, setFilteredSalesData] = useState<SalesDetailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedSalesDetail, setSelectedSalesDetail] = useState<SalesDetailItem | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchSalesData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: salesDetails, error: salesError } = await supabase
        .from("sales_details")
        .select("*")
        .order("tanggal", { ascending: false })
        .order("no_transaksi", { ascending: true });

      if (salesError) {
        throw salesError;
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

      const mergedSalesData = salesDetails.map((item) => ({
        ...item,
        invoice_file_url: invoiceMap.get(item.no_transaksi) || undefined,
      }));

      setSalesData(mergedSalesData as SalesDetailItem[]);
      setFilteredSalesData(mergedSalesData as SalesDetailItem[]);
      setCurrentPage(1);
    } catch (err: any) {
      setError(`Gagal memuat data penjualan: ${err.message}`);
      console.error("Error fetching sales data:", err);
      setSalesData([]); // Fixed typo: showSalesData -> setSalesData
      setFilteredSalesData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllSalesDataForExport = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("sales_details")
        .select("*")
        .order("tanggal", { ascending: false });

      if (error) {
        throw error;
      }
      return data as SalesDetailItem[];
    } catch (err: any) {
      console.error("Error fetching all sales data for export:", err);
      showError("Gagal memuat semua data penjualan untuk ekspor.");
      return null;
    }
  }, []);

  const salesDetailHeaders: { key: keyof SalesDetailItem; label: string }[] = [ // Explicitly typed headers
    { key: "no", label: "No" },
    { key: "kirim_install", label: "Kirim/Install" },
    { key: "no_transaksi", label: "No Transaksi" },
    { key: "invoice_number", label: "Nomor Invoice" },
    { key: "new_old", label: "New/Old" },
    { key: "perusahaan", label: "Perusahaan" },
    { key: "tanggal", label: "Tanggal" },
    { key: "hari", label: "Hari" },
    { key: "jam", label: "Jam" },
    { key: "customer", label: "Customer" },
    { key: "alamat_install", label: "Alamat Install" },
    { key: "no_hp", label: "No HP" },
    { key: "type", label: "Type" },
    { key: "qty_unit", label: "Qty Unit" },
    { key: "stock", label: "Stock" },
    { key: "harga", label: "Harga" },
    { key: "web", label: "WEB" },
    { key: "qty_web", label: "Qty Web" },
    { key: "kartu", label: "Kartu" },
    { key: "qty_kartu", label: "Qty Kartu" },
    { key: "paket", label: "Paket" },
    { key: "pulsa", label: "Pulsa" },
    { key: "teknisi", label: "Teknisi" },
    { key: "payment", label: "Payment" },
    { key: "catatan", label: "Catatan" },
    { key: "created_at", label: "Created At" },
    { key: "invoice_file_url", label: "URL File Invoice" }, // Include invoice_file_url
  ];

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

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

  const handleDeleteSalesDetail = async (salesDetailId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus detil penjualan ini?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("sales_details")
        .delete()
        .eq("id", salesDetailId);

      if (error) {
        throw error;
      }

      showSuccess("Detil penjualan berhasil dihapus!");
      fetchSalesData(); // Refresh the list
    } catch (err: any) {
      showError(`Gagal menghapus detil penjualan: ${err.message}`);
      console.error("Error deleting sales detail:", err);
    }
  };

  const handleEditClick = (item: SalesDetailItem) => {
    setSelectedSalesDetail(item);
    setIsEditFormOpen(true);
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
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-2xl font-semibold">Detil List Invoice Penjualan</CardTitle>
          <div className="flex gap-2"> {/* Group buttons */}
            <Button onClick={() => setIsAddFormOpen(true)} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> Tambah Detil Penjualan
            </Button>
            <ExportDataButton
              fetchDataFunction={fetchAllSalesDataForExport}
              fileName="sales_details.csv"
              headers={salesDetailHeaders}
            />
          </div>
        </div>
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
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((item, index) => (
                    <TableRow key={item.id || index}><TableCell>{item.no}</TableCell><TableCell>{item.kirim_install}</TableCell><TableCell>{item.no_transaksi}</TableCell><TableCell>
                        <InvoiceUpload
                          salesId={item.no_transaksi}
                          currentFileUrl={item.invoice_file_url}
                          onUploadSuccess={(fileUrl) => handleInvoiceUploadSuccess(item.no_transaksi, fileUrl)}
                          onRemoveSuccess={() => handleInvoiceRemoveSuccess(item.no_transaksi)}
                        />
                      </TableCell><TableCell>{item.new_old || "-"}</TableCell><TableCell>{item.perusahaan || "-"}</TableCell><TableCell>{format(new Date(item.tanggal), "dd-MM-yyyy")}</TableCell><TableCell>{item.hari || "-"}</TableCell><TableCell>{item.jam || "-"}</TableCell><TableCell>{item.customer}</TableCell><TableCell className="max-w-[200px] truncate">{item.alamat_install || "-"}</TableCell><TableCell>{item.no_hp || "-"}</TableCell><TableCell>{item.type || "-"}</TableCell><TableCell className="text-right">{item.qty_unit}</TableCell><TableCell className="text-right">{item.stock}</TableCell><TableCell className="text-right">{item.harga?.toLocaleString('id-ID')}</TableCell><TableCell>{item.web || "-"}</TableCell><TableCell className="text-right">{item.qty_web}</TableCell><TableCell>{item.kartu || "-"}</TableCell><TableCell className="text-right">{item.qty_kartu}</TableCell><TableCell>{item.paket || "-"}</TableCell><TableCell className="text-right">{item.pulsa?.toLocaleString('id-ID')}</TableCell><TableCell>{item.teknisi || "-"}</TableCell><TableCell>{item.payment || "-"}</TableCell><TableCell className="max-w-[200px] truncate">{item.catatan || "-"}</TableCell><TableCell className="text-center">
                        <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleEditClick(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteSalesDetail(item.id!)}>
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
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">Tidak ada data penjualan yang tersedia atau cocok dengan pencarian Anda.</p>
        )}
      </CardContent>

      <AddSalesDetailForm
        isOpen={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        onSuccess={fetchSalesData}
      />

      {selectedSalesDetail && (
        <EditSalesDetailForm
          salesDetail={selectedSalesDetail}
          isOpen={isEditFormOpen}
          onOpenChange={setIsEditFormOpen}
          onSuccess={fetchSalesData}
        />
      )}
    </Card>
  );
};

export default SalesDetailsPage;