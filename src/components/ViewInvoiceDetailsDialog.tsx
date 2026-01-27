"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { InvoiceWithDetails, InvoicePaymentStatus, InvoiceDocumentStatus } from "@/types/data"; // Use InvoiceWithDetails
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer } from "lucide-react";
import Link from "next/link";

interface ViewInvoiceDetailsDialogProps {
  invoice: InvoiceWithDetails;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

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

const getDocumentStatusDisplayName = (status: InvoiceDocumentStatus) => {
  switch (status) {
    case InvoiceDocumentStatus.WAITING_DOCUMENT_INV: return "Waiting Document";
    case InvoiceDocumentStatus.DOCUMENT_SENT: return "Document Sent"; // Corrected
    case InvoiceDocumentStatus.DOCUMENT_RECEIVED: return "Document Received"; // Corrected
    case InvoiceDocumentStatus.COMPLETED: return "Completed";
    default: return "Unknown";
  }
};

const ViewInvoiceDetailsDialog: React.FC<ViewInvoiceDetailsDialogProps> = ({
  invoice,
  isOpen,
  onOpenChange,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Invoice: {invoice.invoice_number}</DialogTitle>
          <DialogDescription>Informasi lengkap mengenai invoice ini.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Nomor Invoice:</strong> {invoice.invoice_number}</p>
              <p><strong>Nomor DO:</strong> {invoice.do_number || "-"}</p>
              <p><strong>Tanggal Invoice:</strong> {format(parseISO(invoice.invoice_date), "dd MMMM yyyy")}</p>
              <p><strong>Tanggal Jatuh Tempo:</strong> {invoice.due_date ? format(parseISO(invoice.due_date), "dd MMMM yyyy") : "-"}</p>
              <p><strong>Nama Pelanggan:</strong> {invoice.customer_name}</p>
              <p><strong>Nama Perusahaan:</strong> {invoice.company_name || "-"}</p>
              <p><strong>Tipe Invoice:</strong> {invoice.type ? invoice.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "-"}</p>
              <p><strong>Tipe Pelanggan:</strong> {invoice.customer_type ? invoice.customer_type.charAt(0).toUpperCase() + invoice.customer_type.slice(1) : "-"}</p>
            </div>
            <div>
              <p><strong>Metode Pembayaran:</strong> {invoice.payment_method || "-"}</p>
              <p><strong>Layanan Kurir:</strong> {invoice.courier_service || "-"}</p>
              <p><strong>URL Dokumen:</strong> {invoice.document_url ? <a href={invoice.document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat Dokumen</a> : "-"}</p>
              <p><strong>Dibuat Pada:</strong> {invoice.created_at ? format(parseISO(invoice.created_at), "dd MMMM yyyy HH:mm") : "-"}</p>
              <p><strong>Diperbarui Pada:</strong> {invoice.updated_at ? format(parseISO(invoice.updated_at), "dd MMMM yyyy HH:mm") : "-"}</p>
              <p className="flex items-center">
                <strong>Status Pembayaran:</strong>{" "}
                <Badge className={cn("ml-2", getPaymentStatusBadgeClass(invoice.payment_status))}>
                  {invoice.payment_status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Badge>
              </p>
              <p className="flex items-center">
                <strong>Status Dokumen:</strong>{" "}
                <Badge className="ml-2">
                  {getDocumentStatusDisplayName(invoice.invoice_status)}
                </Badge>
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <h3 className="text-lg font-semibold mb-2">Item Invoice</h3>
            {invoice.invoice_items && invoice.invoice_items.length > 0 ? (
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
                    {invoice.invoice_items.map((item) => (
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
          </div>

          {invoice.notes && (
            <>
              <Separator className="my-4" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Catatan</h3>
                <p className="text-sm text-gray-600">{invoice.notes}</p>
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Link href={`/print-invoice/${invoice.id}`} passHref>
            <Button variant="outline" className="flex items-center">
              <Printer className="mr-2 h-4 w-4" /> Cetak Invoice
            </Button>
          </Link>
          <Button onClick={() => onOpenChange(false)}>Tutup</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewInvoiceDetailsDialog;