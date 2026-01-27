"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, isWithinInterval, startOfDay, endOfDay, parseISO } from "date-fns";
import { InvoiceWithDetails, InvoicePaymentStatus, InvoiceDocumentStatus, ScheduleType, CustomerTypeEnum, ScheduleWithDetails } from "@/types/data"; // Use InvoiceWithDetails
import { Edit, Trash2, PlusCircle, Search, Loader2, Eye, Printer, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"; // Added DialogTrigger
import { Badge } from "@/components/ui/badge";
import AddInvoiceForm from "@/components/AddInvoiceForm";
import EditInvoiceForm from "@/components/EditInvoiceForm";
import ViewInvoiceDetailsDialog from "@/components/ViewInvoiceDetailsDialog";
import { DateRangePicker } from "@/components/ui/date-range-picker"; // Corrected import
import { DateRange } from "react-day-picker";
import { Link } from "react-router-dom"; // Changed from next/link
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showError, showSuccess } from "@/utils/toast";

const getPaymentStatusBadgeClass = (status: InvoicePaymentStatus) => {
  switch (status) {
    case InvoicePaymentStatus.PAID:
      return "bg-green-100 text-green-800";
    case InvoicePaymentStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case InvoicePaymentStatus.OVERDUE:
      return "bg-red-100 text-red-800";
    case InvoicePaymentStatus.PARTIALLY_PAID: // Corrected
      return "bg-blue-100 text-blue-800";
    case InvoicePaymentStatus.CANCELLED:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getDocumentStatusBadgeClass = (status: InvoiceDocumentStatus) => {
  switch (status) {
    case InvoiceDocumentStatus.WAITING_DOCUMENT_INV:
      return "bg-yellow-100 text-yellow-800";
    case InvoiceDocumentStatus.DOCUMENT_SENT: // Corrected
      return "bg-blue-100 text-blue-800";
    case InvoiceDocumentStatus.DOCUMENT_RECEIVED: // Corrected
      return "bg-purple-100 text-purple-800";
    case InvoiceDocumentStatus.COMPLETED:
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getDocumentStatusDisplayName = (status: InvoiceDocumentStatus) => {
  switch (status) {
    case InvoiceDocumentStatus.WAITING_DOCUMENT_INV: return "Waiting Document";
    case InvoiceDocumentStatus.DOCUMENT_SENT: return "Document Sent"; // Corrected
    case InvoiceDocumentStatus.DOCUMENT_RECEIVED: return "Document Received"; // Corrected
    case InvoiceDocumentStatus.COMPLETED: return "Completed";
    default: return "Unknown";
  }
};

const InvoiceManagementPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<InvoicePaymentStatus | "all">("all");
  const [filterDocumentStatus, setFilterDocumentStatus] = useState<InvoiceDocumentStatus | "all">("all");

  const { data: invoices, isLoading, error } = useQuery<InvoiceWithDetails[], Error>({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          invoice_items (
            id,
            item_name,
            quantity,
            unit_price,
            subtotal,
            item_code,
            unit_type,
            product_id
          )
        `);
      if (error) throw error;
      return data as InvoiceWithDetails[];
    },
  });

  const { data: completedSchedules, isLoading: isLoadingSchedules, error: schedulesError } = useQuery<
    ScheduleWithDetails[], // Use ScheduleWithDetails type
    Error
  >({
    queryKey: ["completedSchedulesForInvoice"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schedules")
        .select(`
          *,
          customers (
            company_name,
            customer_type
          )
        `)
        .eq("status", "completed"); // Only fetch completed schedules
      if (error) throw error;
      return data.map(s => ({
        ...s,
        customers: Array.isArray(s.customers) ? s.customers[0] : s.customers, // Ensure customers is an object or null
      })) as ScheduleWithDetails[];
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
      setIsDeleteDialogOpen(false);
      setSelectedInvoice(null);
    },
    onError: (err: any) => {
      showError(`Gagal menghapus invoice: ${err.message}`);
      console.error("Error deleting invoice:", err);
    },
  });

  const filteredInvoices = invoices?.filter((invoice) => {
    const matchesSearch =
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.do_number?.toLowerCase().includes(searchTerm.toLowerCase());

    const invoiceDate = parseISO(invoice.invoice_date);
    const matchesDateRange = dateRange?.from
      ? isWithinInterval(invoiceDate, {
          start: startOfDay(dateRange.from),
          end: endOfDay(dateRange.to || dateRange.from),
        })
      : true;

    const matchesPaymentStatus =
      filterPaymentStatus === "all" || invoice.payment_status === filterPaymentStatus;

    const matchesDocumentStatus =
      filterDocumentStatus === "all" || invoice.invoice_status === filterDocumentStatus;

    return matchesSearch && matchesDateRange && matchesPaymentStatus && matchesDocumentStatus;
  });

  const handleDeleteClick = (invoice: InvoiceWithDetails) => {
    setSelectedInvoice(invoice);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedInvoice) {
      deleteInvoiceMutation.mutate(selectedInvoice.id);
    }
  };

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
      <h1 className="text-2xl font-bold mb-4">Manajemen Invoice</h1>

      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="relative w-full max-w-sm flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Cari invoice (Nomor, Pelanggan, Perusahaan, DO)..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        <Select value={filterPaymentStatus} onValueChange={(value: InvoicePaymentStatus | "all") => setFilterPaymentStatus(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Status Pembayaran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status Pembayaran</SelectItem>
            {Object.values(InvoicePaymentStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterDocumentStatus} onValueChange={(value: InvoiceDocumentStatus | "all") => setFilterDocumentStatus(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Status Dokumen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status Dokumen</SelectItem>
            {Object.values(InvoiceDocumentStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {getDocumentStatusDisplayName(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}> {/* Wrap AddInvoiceForm in Dialog */}
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Buat Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto"> {/* Add DialogContent for the form */}
            <DialogHeader>
              <DialogTitle>Buat Invoice Baru</DialogTitle>
              <DialogDescription>Isi detail invoice baru di sini. Nomor Invoice akan dibuat otomatis.</DialogDescription>
            </DialogHeader>
            <AddInvoiceForm
              isOpen={isAddFormOpen}
              onOpenChange={setIsAddFormOpen}
              onSuccess={() => setIsAddFormOpen(false)}
              completedSchedules={completedSchedules || []}
              isLoadingSchedules={isLoadingSchedules}
              schedulesError={schedulesError}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nomor Invoice</TableHead>
              <TableHead>Nomor DO</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Pembayaran</TableHead>
              <TableHead>Dokumen</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices?.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                <TableCell>{invoice.do_number || "-"}</TableCell>
                <TableCell>{format(parseISO(invoice.invoice_date), "dd/MM/yyyy")}</TableCell>
                <TableCell>{invoice.customer_name}</TableCell>
                <TableCell>Rp {invoice.total_amount.toLocaleString('id-ID')}</TableCell>
                <TableCell>
                  <Badge className={getPaymentStatusBadgeClass(invoice.payment_status)}>
                    {invoice.payment_status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getDocumentStatusBadgeClass(invoice.invoice_status)}>
                    {getDocumentStatusDisplayName(invoice.invoice_status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Buka menu</span>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setIsViewDetailsOpen(true);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setIsEditFormOpen(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <Link to={`/print/invoice/${invoice.id}`} target="_blank" rel="noopener noreferrer">
                        <DropdownMenuItem>
                          <Printer className="mr-2 h-4 w-4" /> Cetak Invoice
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(invoice)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* AddInvoiceForm is now rendered inside the Dialog above */}

      {selectedInvoice && (
        <EditInvoiceForm
          invoice={selectedInvoice}
          isOpen={isEditFormOpen}
          onOpenChange={setIsEditFormOpen}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["invoices"] })}
        />
      )}

      {selectedInvoice && (
        <ViewInvoiceDetailsDialog
          invoice={selectedInvoice}
          isOpen={isViewDetailsOpen}
          onOpenChange={setIsViewDetailsOpen}
        />
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus invoice "{selectedInvoice?.invoice_number}"?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteInvoiceMutation.isPending}
            >
              {deleteInvoiceMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Hapus"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceManagementPage;