import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent, // Added import
  DialogHeader, // Added import
  DialogTitle, // Added import
  DialogDescription, // Added import
} from "@/components/ui/dialog";
import { format, startOfDay, endOfDay, parseISO } from "date-fns";
import { InvoicePaymentStatus, InvoiceDocumentStatus, Invoice } from "@/types/data";
import { Edit, Trash2, PlusCircle, Search, Loader2, Eye, Printer, UploadCloud } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";
import AddInvoiceForm from "@/components/AddInvoiceForm";
import EditInvoiceForm from "@/components/EditInvoiceForm";
import ViewInvoiceDetailsDialog from "@/components/ViewInvoiceDetailsDialog";
import InvoiceUpload from "@/components/InvoiceUpload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRangePicker } from "@/components/ui/date-range-picker"; // Corrected import
import { DateRange } from "react-day-picker";
import { useDebounce } from "@/hooks/use-debounce"; // Import useDebounce

const getPaymentStatusBadgeClass = (status: InvoicePaymentStatus) => {
  switch (status) {
    case InvoicePaymentStatus.PAID:
      return "bg-green-100 text-green-800";
    case InvoicePaymentStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case InvoicePaymentStatus.OVERDUE:
      return "bg-red-100 text-red-800";
    case InvoicePaymentStatus.PARTIAL:
      return "bg-blue-100 text-blue-800";
    case InvoicePaymentStatus.CANCELLED:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getDocumentStatusBadgeClass = (status: InvoiceDocumentStatus) => {
  switch (status) {
    case InvoiceDocumentStatus.COMPLETED:
      return "bg-green-100 text-green-800";
    case InvoiceDocumentStatus.WAITING_DOCUMENT_INV:
      return "bg-yellow-100 text-yellow-800";
    case InvoiceDocumentStatus.DOCUMENT_INV_SENT:
      return "bg-blue-100 text-blue-800";
    case InvoiceDocumentStatus.DOCUMENT_INV_RECEIVED:
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getDocumentStatusDisplay = (status: InvoiceDocumentStatus) => {
  switch (status) {
    case InvoiceDocumentStatus.COMPLETED: return "Completed";
    case InvoiceDocumentStatus.WAITING_DOCUMENT_INV: return "Waiting Document";
    case InvoiceDocumentStatus.DOCUMENT_INV_SENT: return "Document Sent";
    case InvoiceDocumentStatus.DOCUMENT_INV_RECEIVED: return "Document Received";
    default: return "Unknown";
  }
};

const InvoiceManagementPage = () => {
  const queryClient = useQueryClient();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null); // Changed to Invoice
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Apply debounce
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { data: invoices, isLoading, error } = useQuery<Invoice[], Error>({ // Changed to Invoice[]
    queryKey: ["invoices", debouncedSearchTerm, dateRange], // Include debounced search term and date range
    queryFn: async () => {
      let query = supabase
        .from("invoices")
        .select(`
          id,
          user_id,
          invoice_number,
          invoice_date,
          customer_name,
          company_name,
          total_amount,
          payment_status,
          invoice_status,
          document_url,
          created_at,
          updated_at,
          due_date,
          type,
          customer_type,
          payment_method,
          notes,
          courier_service
        `)
        .order("invoice_date", { ascending: false });

      if (debouncedSearchTerm) {
        query = query.or(
          `invoice_number.ilike.%${debouncedSearchTerm}%,customer_name.ilike.%${debouncedSearchTerm}%,company_name.ilike.%${debouncedSearchTerm}%,payment_status.ilike.%${debouncedSearchTerm}%,type.ilike.%${debouncedSearchTerm}%`
        );
      }

      if (dateRange?.from) {
        query = query.gte("invoice_date", format(startOfDay(dateRange.from), "yyyy-MM-dd"));
      }
      if (dateRange?.to) {
        query = query.lte("invoice_date", format(endOfDay(dateRange.to), "yyyy-MM-dd"));
      }

      const { data, error } = await query;
      if (error) {
        showError("Gagal memuat invoice.");
        throw error;
      }
      return data as Invoice[]; // Cast to Invoice[]
    },
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("invoices").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Invoice berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (err) => {
      showError(`Gagal menghapus invoice: ${err.message}`);
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus invoice ini?")) {
      deleteInvoiceMutation.mutate(id);
    }
  };

  const handleEdit = (invoice: Invoice) => { // Changed to Invoice
    setSelectedInvoice(invoice);
    setIsEditFormOpen(true);
  };

  const handleViewDetails = (invoice: Invoice) => { // Changed to Invoice
    setSelectedInvoice(invoice);
    setIsViewDetailsOpen(true);
  };

  const handleUploadDocument = (invoice: Invoice) => { // Changed to Invoice
    setSelectedInvoice(invoice);
    setIsUploadDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Gagal memuat invoice: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Invoice</h1>

      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Input
              type="text"
              placeholder="Cari invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>
        <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Invoice
            </Button>
          </DialogTrigger>
          <AddInvoiceForm
            isOpen={isAddFormOpen}
            onOpenChange={setIsAddFormOpen}
            onSuccess={() => setIsAddFormOpen(false)}
          />
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Invoice</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Perusahaan</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status Pembayaran</TableHead>
              <TableHead>Status Dokumen</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices?.length === 0 ? ( // Use 'invoices' directly
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Tidak ada invoice ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              invoices?.map((invoice) => ( // Use 'invoices' directly
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.invoice_number}</TableCell>
                  <TableCell>{format(parseISO(invoice.invoice_date), "dd-MM-yyyy")}</TableCell>
                  <TableCell>{invoice.customer_name}</TableCell>
                  <TableCell>{invoice.company_name || "-"}</TableCell>
                  <TableCell>Rp {invoice.total_amount.toLocaleString('id-ID')}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusBadgeClass(invoice.payment_status)}`}>
                      {invoice.payment_status.charAt(0).toUpperCase() + invoice.payment_status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDocumentStatusBadgeClass(invoice.invoice_status)}`}>
                      {getDocumentStatusDisplay(invoice.invoice_status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Buka menu</span>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(invoice)}>
                          <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(invoice)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUploadDocument(invoice)}>
                          <UploadCloud className="mr-2 h-4 w-4" /> Unggah Dokumen
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(`/print/invoice/${invoice.id}`, '_blank')}>
                          <Printer className="mr-2 h-4 w-4" /> Cetak
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(invoice.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedInvoice && (
        <>
          <EditInvoiceForm
            invoice={selectedInvoice}
            isOpen={isEditFormOpen}
            onOpenChange={setIsEditFormOpen}
            onSuccess={() => setIsEditFormOpen(false)}
          />
          <ViewInvoiceDetailsDialog
            invoiceId={selectedInvoice.id} // Pass only ID
            isOpen={isViewDetailsOpen}
            onOpenChange={setIsViewDetailsOpen}
          />
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Unggah Dokumen Invoice</DialogTitle>
                <DialogDescription>
                  Unggah dokumen terkait untuk invoice {selectedInvoice.invoice_number}.
                </DialogDescription>
              </DialogHeader>
              <InvoiceUpload
                invoiceId={selectedInvoice.id}
                onUploadSuccess={(url) => {
                  setSelectedInvoice((prev) => prev ? { ...prev, document_url: url, invoice_status: InvoiceDocumentStatus.COMPLETED } : null);
                  setIsUploadDialogOpen(false);
                }}
                currentDocumentUrl={selectedInvoice.document_url}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default InvoiceManagementPage;