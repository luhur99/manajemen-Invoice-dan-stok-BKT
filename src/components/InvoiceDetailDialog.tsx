"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Invoice, InvoiceItem } from '@/api/invoices';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface InvoiceDetailDialogProps {
  invoice: (Invoice & { items: InvoiceItem[] }) | null;
  onOpenChange: (open: boolean) => void;
}

const InvoiceDetailDialog: React.FC<InvoiceDetailDialogProps> = ({ invoice, onOpenChange }) => {
  if (!invoice) {
    return null;
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'paid':
        return <Badge className="bg-green-500 hover:bg-green-600">Lunas</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500 hover:bg-red-600">Jatuh Tempo</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500 hover:bg-gray-600">Dibatalkan</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
    }
  };

  return (
    <Dialog open={!!invoice} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Faktur: {invoice.invoice_number}</DialogTitle>
          <DialogDescription>Informasi lengkap mengenai faktur ini.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Nomor Faktur</p>
            <p className="text-sm font-semibold">{invoice.invoice_number}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Tanggal Faktur</p>
            <p className="text-sm">{format(new Date(invoice.invoice_date), 'dd MMMM yyyy', { locale: id })}</p>
          </div>
          {invoice.due_date && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Tanggal Jatuh Tempo</p>
              <p className="text-sm">{format(new Date(invoice.due_date), 'dd MMMM yyyy', { locale: id })}</p>
            </div>
          )}
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Pelanggan</p>
            <p className="text-sm">{invoice.customer_name}</p>
          </div>
          {invoice.company_name && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Perusahaan</p>
              <p className="text-sm">{invoice.company_name}</p>
            </div>
          )}
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Total Jumlah</p>
            <p className="text-sm font-semibold">Rp {invoice.total_amount.toLocaleString('id-ID')}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Status Pembayaran</p>
            <p className="text-sm">{getPaymentStatusBadge(invoice.payment_status)}</p>
          </div>
          {invoice.type && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Jenis Faktur</p>
              <p className="text-sm">{invoice.type}</p>
            </div>
          )}
          {invoice.customer_type && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Tipe Pelanggan</p>
              <p className="text-sm">{invoice.customer_type}</p>
            </div>
          )}
          {invoice.payment_method && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Metode Pembayaran</p>
              <p className="text-sm">{invoice.payment_method}</p>
            </div>
          )}
          {invoice.courier_service && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Layanan Kurir</p>
              <p className="text-sm">{invoice.courier_service}</p>
            </div>
          )}
          {invoice.notes && (
            <div className="grid grid-cols-2 items-start gap-4">
              <p className="text-sm font-medium text-muted-foreground">Catatan</p>
              <p className="text-sm whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}

          <Separator className="my-4" />

          <h3 className="text-lg font-semibold mb-2">Item Faktur</h3>
          {invoice.items && invoice.items.length > 0 ? (
            <div className="space-y-2">
              {invoice.items.map((item, index) => (
                <div key={item.id || index} className="border rounded-md p-3">
                  <p className="text-sm font-medium">{item.item_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} {item.unit_type || 'pcs'} x Rp {item.unit_price.toLocaleString('id-ID')} = Rp {item.subtotal.toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Tidak ada item faktur.</p>
          )}

          {invoice.document_url && (
            <>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Dokumen</p>
                <a
                  href={invoice.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Lihat Dokumen
                </a>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetailDialog;