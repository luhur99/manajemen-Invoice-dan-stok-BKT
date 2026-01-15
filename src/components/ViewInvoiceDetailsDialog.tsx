"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Invoice, InvoiceItem, InvoiceDocumentStatus } from "@/types/data"; // Import InvoiceDocumentStatus
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { showError } from "@/utils/toast";

interface ViewInvoiceDetailsDialogProps {
  invoice: Invoice;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const getInvoiceDocumentStatusDisplay = (status: InvoiceDocumentStatus) => {
  switch (status) {
    case InvoiceDocumentStatus.COMPLETED: return "Completed";
    case InvoiceDocumentStatus.WAITING_DOCUMENT_INV: return "Waiting Document";
    default: return status;
  }
};

const ViewInvoiceDetailsDialog: React.FC<ViewInvoiceDetailsDialogProps> = ({
  invoice,
  isOpen,
  onOpenChange,
}) => {
  const { data: items, isLoading, error } = useQuery<InvoiceItem[], Error>({
    queryKey: ["invoiceItems", invoice.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoice_items")
        .select("*")
        .eq("invoice_id", invoice.id);
      if (error) {
        showError("Gagal memuat item invoice.");
        throw error;
      }
      return data;
    },
    enabled: isOpen,
  });

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Detail Invoice</DialogTitle>
            <DialogDescription>Memuat detail invoice...</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Detail Invoice</DialogTitle>
            <DialogDescription>Terjadi kesalahan saat memuat detail invoice.</DialogDescription>
          </DialogHeader>
          <div className="text-red-500">Error: {error.message}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Invoice: {invoice.invoice_number}</DialogTitle>
          <DialogDescription>Informasi lengkap mengenai invoice ini.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Nomor Invoice:</strong> {invoice.invoice_number}</p>
            <p><strong>Tanggal Invoice:</strong> {format(new Date(invoice.invoice_date), "dd-MM-yyyy")}</p>
            <p><strong>Jatuh Tempo:</strong> {invoice.due_date ? format(new Date(invoice.due_date), "dd-MM-yyyy") : "-"}</p>
            <p><strong>Pelanggan:</strong> {invoice.customer_name}</p>
            <p><strong>Perusahaan:</strong> {invoice.company_name || "-"}</p>
            <p><strong>Status Pembayaran:</strong> {invoice.payment_status}</p>
            <p><strong>Status Dokumen:</strong> {getInvoiceDocumentStatusDisplay(invoice.invoice_status)}</p> {/* New field */}
            <p><strong>Tipe Invoice:</strong> {invoice.type || "-"}</p>
            <p><strong>Tipe Pelanggan:</strong> {invoice.customer_type || "-"}</p>
            <p><strong>Metode Pembayaran:</strong> {invoice.payment_method || "-"}</p>
            <p><strong>Layanan Kurir:</strong> {invoice.courier_service || "-"}</p>
          </div>
          <p><strong>Catatan:</strong> {invoice.notes || "-"}</p>

          <h3 className="text-lg font-semibold mt-4 mb-2">Item Invoice</h3>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Item</TableHead>
                  <TableHead>Kode Item</TableHead>
                  <TableHead className="text-right">Kuantitas</TableHead>
                  <TableHead className="text-right">Harga Satuan</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.item_name}</TableCell>
                    <TableCell>{item.item_code || "-"}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">Rp {item.unit_price.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right">Rp {item.subtotal.toLocaleString('id-ID')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end items-center mt-4">
            <span className="text-lg font-semibold mr-2">Total Jumlah:</span>
            <span className="text-xl font-bold">
              Rp {invoice.total_amount.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewInvoiceDetailsDialog;