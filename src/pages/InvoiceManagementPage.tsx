"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Invoice, Schedule } from "@/types/data"; // Import Schedule type
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import AddInvoiceForm from "@/components/AddInvoiceForm";
import EditInvoiceForm from "@/components/EditInvoiceForm";
import ViewInvoiceDetailsDialog from "@/components/ViewInvoiceDetailsDialog";
import AddScheduleForm from "@/components/AddScheduleForm";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PaginationControls from "@/components/PaginationControls";
import { format } from "date-fns";
import { Loader2, Edit, Trash2, PlusCircle, Eye, CalendarPlus } from "lucide-react"; // Import Eye icon
import InvoiceUpload from "@/components/InvoiceUpload"; // Import InvoiceUpload component

// Extend Invoice type to include derived schedule status
interface InvoiceWithScheduleStatus extends Invoice {
  schedule_status_display?: string;
}

const InvoiceManagementPage = () => {
  const [invoices, setInvoices] = useState<InvoiceWithScheduleStatus[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceWithScheduleStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [invoiceToView, setInvoiceToView] = useState<Invoice | null>(null);

  const [isConvertScheduleOpen, setIsConvertScheduleOpen] = useState(false);
  const [invoiceToConvert, setInvoiceToConvert] = useState<Invoice | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: invoicesData, error: invoicesError } = await supabase
        .from("invoices")
        .select(`
          *,
          invoice_items (item_name),
          schedules (status, created_at)
        `)
        .order("invoice_date", { ascending: false }) // Sort by invoice_date descending (newest first)
        .order("created_at", { ascending: false }); // Secondary sort by created_at descending

      if (invoicesError) {
        throw invoicesError;
      }

      const processedInvoices: InvoiceWithScheduleStatus[] = invoicesData.map((invoice, index) => {
        // Aggregate item names
        const itemNames = invoice.invoice_items
          ? invoice.invoice_items.map((item: { item_name: string }) => item.item_name).join(", ")
          : "Tidak ada item";

        // Determine latest schedule status
        let scheduleStatusDisplay = "Belum Terjadwal";
        if (invoice.schedules && invoice.schedules.length > 0) {
          // Sort schedules by created_at to get the latest one
          const latestSchedule = invoice.schedules.sort((a: { created_at: string }, b: { created_at: string }) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0];
          scheduleStatusDisplay = latestSchedule.status;
        }

        return {
          ...invoice,
          no: index + 1, // Assign sequential number
          item_names_summary: itemNames,
          schedule_status_display: scheduleStatusDisplay,
        };
      });

      setInvoices(processedInvoices);
      setFilteredInvoices(processedInvoices);
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
      item.payment_status.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.schedule_status_display?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.item_names_summary?.toLowerCase().includes(lowerCaseSearchTerm) // Include new summary in search
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

  const handleDocumentUploadSuccess = async (invoiceId: string, fileUrl: string) => {
    const { error } = await supabase
      .from("invoices")
      .update({ document_url: fileUrl })
      .eq("id", invoiceId);

    if (error) {
      console.error("Error updating invoice with document URL:", error);
      showError("Gagal menyimpan URL dokumen ke database.");
      return;
    }
    showSuccess("URL dokumen invoice berhasil diperbarui!");
    fetchInvoices();
  };

  const handleDocumentRemoveSuccess = async (invoiceId: string) => {
    const { error } = await supabase
      .from("invoices")
      .update({ document_url: null })
      .eq("id", invoiceId);

    if (error) {
      console.error("Error removing document URL from invoice:", error);
      showError("Gagal menghapus URL dokumen dari database.");
      return;
    }
    showSuccess("URL dokumen invoice berhasil dihapus!");
    fetchInvoices();
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
          placeholder="Cari berdasarkan nomor invoice, konsumen, perusahaan, status pembayaran, status penjadwalan, atau nama barang..."
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
                    <TableHead>No</TableHead> {/* New TableHead */}
                    <TableHead>Nomor Invoice</TableHead>
                    <TableHead>Tanggal Invoice</TableHead>
                    <TableHead>Jatuh Tempo</TableHead>
                    <TableHead>Nama Konsumen</TableHead>
                    <TableHead>Perusahaan</TableHead>
                    <TableHead>Nama Barang</TableHead>
                    <TableHead className="text-right">Total Tagihan</TableHead>
                    <TableHead>Status Pembayaran</TableHead>
                    <TableHead>Status Penjadwalan</TableHead>
                    <TableHead>File Invoice</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.no}</TableCell> {/* New TableCell */}
                      <TableCell>{invoice.invoice_number}</TableCell>
                      <TableCell>{format(new Date(invoice.invoice_date), "dd-MM-yyyy")}</TableCell>
                      <TableCell>{invoice.due_date ? format(new Date(invoice.due_date), "dd-MM-yyyy") : "-"}</TableCell>
                      <TableCell>{invoice.customer_name}</TableCell>
                      <TableCell>{invoice.company_name || "-"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{invoice.item_names_summary || "-"}</TableCell>
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
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.schedule_status_display === 'completed' ? 'bg-green-100 text-green-800' :
                          invoice.schedule_status_display === 'in progress' ? 'bg-blue-100 text-blue-800' :
                          invoice.schedule_status_display === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                          invoice.schedule_status_display === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {invoice.schedule_status_display === "Belum Terjadwal" ? "Belum Terjadwal" : invoice.schedule_status_display?.charAt(0).toUpperCase() + invoice.schedule_status_display?.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <InvoiceUpload
                          salesId={invoice.id} // Use invoice.id as salesId for the component
                          currentFileUrl={invoice.document_url}
                          onUploadSuccess={(fileUrl) => handleDocumentUploadSuccess(invoice.id, fileUrl)}
                          onRemoveSuccess={() => handleDocumentRemoveSuccess(invoice.id)}
                        />
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
                type: invoiceToConvert.type === 'kirim barang' ? 'kirim' : 'instalasi', // Map invoice type to schedule type
                notes: `Jadwal dibuat dari Invoice #${invoiceToConvert.invoice_number}`,
                courier_service: invoiceToConvert.courier_service || "", // Pass courier_service
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default InvoiceManagementPage;