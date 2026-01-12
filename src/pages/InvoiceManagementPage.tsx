"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/types/data";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import AddInvoiceForm from "@/components/AddInvoiceForm";
import EditInvoiceForm from "@/components/EditInvoiceForm";
import ViewInvoiceDetailsDialog from "@/components/ViewInvoiceDetailsDialog"; // Import new component
import AddScheduleForm from "@/components/AddScheduleForm"; // Import AddScheduleForm
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Import Dialog components for AddScheduleForm
import PaginationControls from "@/components/PaginationControls";
import { format } from "date-fns";
import { Loader2, Edit, Trash2, Eye, CalendarPlus } from "lucide-react"; // Import Eye and CalendarPlus icons

const InvoiceManagementPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false); // State for View Details dialog
  const [invoiceToView, setInvoiceToView] = useState<Invoice | null>(null); // State for invoice to view

  const [isConvertScheduleOpen, setIsConvertScheduleOpen] = useState(false); // State for Convert to Schedule dialog
  const [invoiceToConvert, setInvoiceToConvert] = useState<Invoice | null>(null); // State for invoice to convert

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("invoice_date", { ascending: false });

      if (error) {
        throw error;
      }

      setInvoices(data as Invoice[]);
      setFilteredInvoices(data as Invoice[]);
      setCurrentPage(1);
    } catch (err: any) {
      setError(`Gagal memuat data invoice: ${err.message}`);
      console.error("Error fetching invoices:", err);
      showError("Gagal memuat data invoice.");
      setInvoices([]);
      setFilteredInvoices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = invoices.filter(item =>
      item.invoice_number.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.customer_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.company_name?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.payment_status.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredInvoices(filtered);
    setCurrentPage(1);
  }, [searchTerm, invoices]);

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus invoice ini? Ini juga akan menghapus semua item invoice terkait.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("invoices")
        .delete()
        .eq("id", invoiceId);

      if (error) {
        throw error;
      }

      showSuccess("Invoice berhasil dihapus!");
      fetchInvoices(); // Refresh the list
    } catch (err: any) {
      showError(`Gagal menghapus invoice: ${err.message}`);
      console.error("Error deleting invoice:", err);
    }
  };

  const handleEditClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsEditFormOpen(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setInvoiceToView(invoice);
    setIsViewDetailsOpen(true);
  };

  const handleConvertToSchedule = (invoice: Invoice) => {
    setInvoiceToConvert(invoice);
    setIsConvertScheduleOpen(true);
  };

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredInvoices.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Manajemen Invoice</CardTitle>
          <CardDescription>Kelola semua invoice penjualan Anda di sini.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">Memuat data invoice...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-2xl font-semibold">Manajemen Invoice</CardTitle>
          <AddInvoiceForm onSuccess={fetchInvoices} />
        </div>
        <CardDescription>Kelola semua invoice penjualan Anda di sini.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
        <Input
          type="text"
          placeholder="Cari berdasarkan nomor invoice, konsumen, perusahaan, atau status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        {filteredInvoices.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Nomor Invoice</TableHead>
                    <TableHead>Tanggal Invoice</TableHead>
                    <TableHead>Jatuh Tempo</TableHead>
                    <TableHead>Nama Konsumen</TableHead>
                    <TableHead>Perusahaan</TableHead>
                    <TableHead className="text-right">Total Tagihan</TableHead>
                    <TableHead>Status Pembayaran</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.invoice_number}</TableCell>
                      <TableCell>{format(new Date(invoice.invoice_date), "dd-MM-yyyy")}</TableCell>
                      <TableCell>{invoice.due_date ? format(new Date(invoice.due_date), "dd-MM-yyyy") : "-"}</TableCell>
                      <TableCell>{invoice.customer_name}</TableCell>
                      <TableCell>{invoice.company_name || "-"}</TableCell>
                      <TableCell className="text-right">{invoice.total_amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {invoice.payment_status.charAt(0).toUpperCase() + invoice.payment_status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center flex items-center justify-center space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleViewInvoice(invoice)} title="Lihat Detail">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleConvertToSchedule(invoice)} title="Konversi ke Jadwal">
                          <CalendarPlus className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(invoice)} title="Edit Invoice">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteInvoice(invoice.id)} title="Hapus Invoice">
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
          <p className="text-gray-700 dark:text-gray-300">Tidak ada data invoice yang tersedia atau cocok dengan pencarian Anda.</p>
        )}
      </CardContent>

      {selectedInvoice && (
        <EditInvoiceForm
          invoice={selectedInvoice}
          isOpen={isEditFormOpen}
          onOpenChange={setIsEditFormOpen}
          onSuccess={fetchInvoices}
        />
      )}

      {invoiceToView && (
        <ViewInvoiceDetailsDialog
          invoice={invoiceToView}
          isOpen={isViewDetailsOpen}
          onOpenChange={setIsViewDetailsOpen}
        />
      )}

      {invoiceToConvert && (
        <Dialog open={isConvertScheduleOpen} onOpenChange={setIsConvertScheduleOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Buat Jadwal dari Invoice #{invoiceToConvert.invoice_number}</DialogTitle>
            </DialogHeader>
            <AddScheduleForm
              onSuccess={() => {
                fetchInvoices(); // Refresh invoices after schedule creation
                setIsConvertScheduleOpen(false);
              }}
              onOpenChange={setIsConvertScheduleOpen}
              initialData={{
                customer_name: invoiceToConvert.customer_name,
                invoice_id: invoiceToConvert.id,
                address: invoiceToConvert.notes, // Assuming notes might contain address
                // You might want to fetch phone number from profile or another source if available
                // type: invoiceToConvert.type, // If invoice has a type that maps to schedule type
                notes: `Jadwal dibuat dari Invoice #${invoiceToConvert.invoice_number}`,
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default InvoiceManagementPage;