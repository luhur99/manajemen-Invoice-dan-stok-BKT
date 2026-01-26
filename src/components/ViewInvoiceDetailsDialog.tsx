"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { InvoiceWithDetails, InvoicePaymentStatus, InvoiceDocumentStatus, Invoice, InvoiceItem } from "@/types/data"; // Use InvoiceWithDetails
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

interface ViewInvoiceDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string; // Pass only invoice ID
}

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

const getDocumentStatusDisplay = (status: InvoiceDocumentStatus) => {
  switch (status) {
    case InvoiceDocumentStatus.COMPLETED: return "Completed"; // Fixed
    case InvoiceDocumentStatus.WAITING_DOCUMENT_INV: return "Waiting Document";
    case InvoiceDocumentStatus.DOCUMENT_INV_SENT: return "Document Sent";
    case InvoiceDocumentStatus.DOCUMENT_INV_RECEIVED: return "Document Received";
    default: return "Unknown";
  }
};

const ViewInvoiceDetailsDialog: React.FC<ViewInvoiceDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  invoiceId,
}) => {
  // Fetch full invoice details when dialog is open
  const { data: invoice, isLoading: loadingInvoice, error: invoiceError } = useQuery<Invoice, Error>({
    queryKey: ["invoice", invoiceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("id", invoiceId)
        .single();
      if (error) {
        showError("Gagal memuat detail invoice.");
        throw error;
      }
      return data as Invoice;
    },
    enabled: isOpen, // Only fetch when the dialog is open
  });

  // Fetch invoice items separately when dialog is open
  const { data: invoiceItems, isLoading: loadingItems, error: itemsError } = useQuery<InvoiceItem[], Error>({
    queryKey: ["invoiceItems", invoiceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoice_items")
        .select("*")
        .eq("invoice_id", invoiceId);
      if (error) {
        showError("Gagal memuat item invoice.");
        throw error;
      }
      return data as InvoiceItem[];
    },
    enabled: isOpen, // Only fetch when the dialog is open
  });

  if (loadingInvoice || loadingItems) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Memuat Detail Invoice...</DialogTitle>
            <DialogDescription>Harap tunggu.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (invoiceError || itemsError || !invoice) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Error Memuat Invoice</DialogTitle>
            <DialogDescription>
              Terjadi kesalahan: {invoiceError?.message || itemsError?.message || "Invoice tidak ditemukan."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Invoice: {invoice.invoice_number}</DialogTitle>
          <DialogDescription>Informasi lengkap mengenai invoice ini.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div>
            <p><strong>Nomor Invoice:</strong> {invoice.invoice_number}</p>
            <p><strong>Tanggal Invoice:</strong> {format(parseISO(invoice.invoice_date), "dd MMMM yyyy")}</p>
            <p><strong>Tanggal Jatuh Tempo:</strong> {invoice.due_date ? format(parseISO(invoice.due_date), "dd MMMM yyyy") : "-"}</p>
            <p><strong>Nama Pelanggan:</strong> {invoice.customer_name}</p>
            <p><strong>Nama Perusahaan:</strong> {invoice.company_name || "-"}</p>
            <p><strong>Tipe Invoice:</strong> {invoice.type ? invoice.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "-"}</p>
            <p><strong>Tipe Pelanggan:</strong> {invoice.customer_type ? invoice.customer_type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "-"}</p>
            <p><strong>Metode Pembayaran:</strong> {invoice.payment_method || "-"}</p>
            <p><strong>Layanan Kurir:</strong> {invoice.courier_service || "-"}</p>
          </div>
          <div>
            <p><strong>Total Jumlah:</strong> Rp {invoice.total_amount.toLocaleString('id-ID')}</p>
            <p>
              <strong>Status Pembayaran:</strong>{" "}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusBadgeClass(invoice.payment_status)}`}>
                {invoice.payment_status.charAt(0).toUpperCase() + invoice.payment_status.slice(1)}
              </span>
            </p>
            <p>
              <strong>Status Dokumen:</strong>{" "}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDocumentStatusDisplay(invoice.invoice_status).includes("Waiting") ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                {getDocumentStatusDisplay(invoice.invoice_status)}
              </span>
            </p>
            <p><strong>Dibuat Pada:</strong> {format(parseISO(invoice.created_at), "dd MMMM yyyy HH:mm")}</p>
            <p><strong>Terakhir Diperbarui:</strong> {format(parseISO(invoice.updated_at), "dd MMMM yyyy HH:mm")}</p>
            {invoice.document_url && (
              <p className="mt-2">
                <strong>Dokumen:</strong>{" "}
                <a href={invoice.document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Lihat Dokumen
                </a>
              </p>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        <h3 className="text-lg font-semibold mb-2">Item Invoice</h3>
        {invoiceItems && invoiceItems.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Kode</TableHead>
                  <TableHead>Kuantitas</TableHead>
                  <TableHead>Satuan</TableHead>
                  <TableHead className="text-right">Harga Satuan</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.item_name}</TableCell>
                    <TableCell>{item.item_code || "-"}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unit_type || "-"}</TableCell>
                    <TableCell className="text-right">Rp {item.unit_price.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right">Rp {item.subtotal.toLocaleString('id-ID')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p>Tidak ada item dalam invoice ini.</p>
        )}

        {invoice.notes && (
          <>
            <Separator className="my-4" />
            <h3 className="text-lg font-semibold mb-2">Catatan</h3>
            <p className="whitespace-pre-wrap">{invoice.notes}</p>
          </>
        )}

        <DialogFooter className="mt-4">
          <Button asChild variant="outline">
            <Link to={`/print/invoice/${invoice.id}`} target="_blank">
              <Printer className="mr-2 h-4 w-4" /> Cetak Invoice
            </Link>
          </Button>
          <Button onClick={() => onOpenChange(false)}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewInvoiceDetailsDialog;