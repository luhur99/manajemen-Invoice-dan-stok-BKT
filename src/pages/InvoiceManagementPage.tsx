"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, PlusCircle, Edit, Trash2, Eye, FileText } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import AddInvoiceForm from "@/components/AddInvoiceForm";
import EditInvoiceForm from "@/components/EditInvoiceForm";
import ViewInvoiceDetailsDialog from "@/components/ViewInvoiceDetailsDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { InvoiceWithDetails, InvoicePaymentStatus, InvoiceDocumentStatus } from "@/types/data"; // Import InvoiceDocumentStatus
import InvoiceUpload from "@/components/InvoiceUpload";

const getPaymentStatusColor = (status: InvoicePaymentStatus) => {
  switch (status) {
    case InvoicePaymentStatus.PAID:
      return "bg-green-100 text-green-800";
    case InvoicePaymentStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case InvoicePaymentStatus.OVERDUE:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getDocumentStatusColor = (status: InvoiceDocumentStatus) => {
  switch (status) {
    case InvoiceDocumentStatus.COMPLETED:
      return "bg-green-100 text-green-800";
    case InvoiceDocumentStatus.WAITING_DOCUMENT_INV:
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getDocumentStatusDisplay = (status: InvoiceDocumentStatus) => {
  switch (status) {
    case InvoiceDocumentStatus.COMPLETED: return "Completed";
    case InvoiceDocumentStatus.WAITING_DOCUMENT_INV: return "Waiting Document";
    default: return status;
  }
};

const InvoiceManagementPage = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedInvoice, setSelectedInvoice] = React.useState<InvoiceWithDetails | null>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = React.useState(false);
  const [invoiceToView, setInvoiceToView] = React.useState<InvoiceWithDetails | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [isViewDocumentOpen, setIsViewDocumentOpen] = React.useState(false); // New state for viewing document
  const [documentUrlToView, setDocumentUrlToView] = React.useState<string | null>(null); // New state for document URL

  const { data: invoices, isLoading, error, refetch: fetchInvoices } = useQuery<InvoiceWithDetails[], Error>({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          invoice_items (item_name)
        `) // Removed the SQL comment here
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((invoice, index) => {
        const itemNames = invoice.invoice_items?.map((item: { item_name: string }) => item.item_name).join(", ") || "";
        return {
          ...invoice,
          no: index + 1, // Add sequential number
          item_names_summary: itemNames,
        };
      });
    },
  });

  const handleEditClick = (invoice: InvoiceWithDetails) => {
    setSelectedInvoice(invoice);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (invoice: InvoiceWithDetails) => {
    setSelectedInvoice(invoice);
    setIsDeleteModalOpen(true);
  };

  const handleViewDetails = (invoice: InvoiceWithDetails) => {
    setInvoiceToView(invoice);
    setIsViewDetailsOpen(true);
  };

  const handleUploadClick = (invoice: InvoiceWithDetails) => {
    setSelectedInvoice(invoice);
    setIsUploadModalOpen(true);
  };

  const handleViewDocument = (url: string) => { // New handler for viewing document
    setDocumentUrlToView(url);
    setIsViewDocumentOpen(true);
  };

  const handleDeleteInvoice = async () => {
    if (!selectedInvoice) return;

    try {
      const { error } = await supabase
        .from("invoices")
        .delete()
        .eq("id", selectedInvoice.id);

      if (error) throw error;

      showSuccess("Invoice berhasil dihapus!");
      setIsDeleteModalOpen(false);
      fetchInvoices();
    } catch (err: any) {
      showError(`Gagal menghapus invoice: ${err.message}`);
      console.error("Error deleting invoice:", err);
    }
  };

  const filteredInvoices = invoices?.filter((item) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      item.invoice_number.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.customer_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.company_name?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.payment_status.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.item_names_summary?.toLowerCase().includes(lowerCaseSearchTerm) ||
      getDocumentStatusDisplay(item.invoice_status).toLowerCase().includes(lowerCaseSearchTerm) // Search by new status
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading invoices: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Invoice</h1>

      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Cari invoice..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Invoice
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Nomor Invoice</TableHead>
              <TableHead>Tanggal Invoice</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Perusahaan</TableHead>
              <TableHead className="min-w-[200px]">Item</TableHead>
              <TableHead className="text-right">Total Jumlah</TableHead>
              <TableHead>Status Pembayaran</TableHead>
              <TableHead>Status Dokumen</TableHead> {/* New column */}
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices?.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.no}</TableCell>
                <TableCell>{invoice.invoice_number}</TableCell>
                <TableCell>{format(new Date(invoice.invoice_date), "dd-MM-yyyy")}</TableCell>
                <TableCell>{invoice.customer_name}</TableCell>
                <TableCell>{invoice.company_name || "-"}</TableCell>
                <TableCell className="max-w-[200px] truncate">{invoice.item_names_summary || "-"}</TableCell>
                <TableCell className="text-right">{invoice.total_amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(invoice.payment_status)}`}>
                    {invoice.payment_status.charAt(0).toUpperCase() + invoice.payment_status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDocumentStatusColor(invoice.invoice_status)}`}>
                    {getDocumentStatusDisplay(invoice.invoice_status)}
                  </span>
                </TableCell>
                <TableCell className="flex space-x-2 justify-center">
                  <Button variant="ghost" size="icon" onClick={() => handleViewDetails(invoice)} title="Lihat Detail">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(invoice)} title="Edit Invoice">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(invoice)} title="Hapus Invoice">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleUploadClick(invoice)} title="Unggah Dokumen">
                    <FileText className="h-4 w-4" />
                  </Button>
                  {invoice.document_url && ( // Conditionally render view document button
                    <Button variant="outline" size="icon" onClick={() => handleViewDocument(invoice.document_url!)} title="Lihat Dokumen">
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddInvoiceForm
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={fetchInvoices}
      />

      {selectedInvoice && (
        <EditInvoiceForm
          invoice={selectedInvoice}
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
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

      {selectedInvoice && (
        <InvoiceUpload
          invoiceId={selectedInvoice.id}
          currentDocumentUrl={selectedInvoice.document_url}
          isOpen={isUploadModalOpen}
          onOpenChange={setIsUploadModalOpen}
          onSuccess={fetchInvoices}
        />
      )}

      {/* New Dialog for viewing documents */}
      <Dialog open={isViewDocumentOpen} onOpenChange={setIsViewDocumentOpen}>
        <DialogContent className="sm:max-w-[800px] h-[90vh]">
          <DialogHeader>
            <DialogTitle>Lihat Dokumen Invoice</DialogTitle>
            <DialogDescription>
              Dokumen terkait invoice ini.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow">
            {documentUrlToView ? (
              // Check if it's an image or PDF for direct embedding, otherwise provide a link
              documentUrlToView.match(/\.(jpeg|jpg|gif|png)$/i) != null ? (
                <img src={documentUrlToView} alt="Invoice Document" className="max-w-full h-auto mx-auto" />
              ) : documentUrlToView.match(/\.pdf$/i) != null ? (
                <iframe src={documentUrlToView} className="w-full h-full border-0" title="Invoice Document"></iframe>
              ) : (
                <a href={documentUrlToView} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block text-center py-4">
                  Buka Dokumen (Tipe file tidak dapat dipratinjau)
                </a>
              )
            ) : (
              <p className="text-center text-muted-foreground">Tidak ada dokumen untuk ditampilkan.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDocumentOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Invoice</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus invoice "{selectedInvoice?.invoice_number}"? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDeleteInvoice}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceManagementPage;