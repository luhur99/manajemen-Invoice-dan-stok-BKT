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
import { PurchaseRequest } from '@/api/purchaseRequests';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface PurchaseRequestDetailDialogProps {
  request: PurchaseRequest | null;
  onOpenChange: (open: boolean) => void;
}

const PurchaseRequestDetailDialog: React.FC<PurchaseRequestDetailDialogProps> = ({ request, onOpenChange }) => {
  if (!request) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Disetujui</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600">Ditolak</Badge>;
      case 'waiting_for_receipt':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Menunggu Penerimaan</Badge>;
      case 'closed':
        return <Badge className="bg-green-500 hover:bg-green-600">Selesai</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
    }
  };

  return (
    <Dialog open={!!request} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Permintaan Pembelian</DialogTitle>
          <DialogDescription>Informasi lengkap mengenai permintaan pembelian ini.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Nama Item</p>
            <p className="text-sm font-semibold">{request.item_name}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Kode Item</p>
            <p className="text-sm">{request.item_code}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Kuantitas</p>
            <p className="text-sm">{request.quantity}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Harga Satuan</p>
            <p className="text-sm">Rp {request.unit_price.toLocaleString('id-ID')}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Harga Jual Saran</p>
            <p className="text-sm">Rp {request.suggested_selling_price.toLocaleString('id-ID')}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Total Harga</p>
            <p className="text-sm font-semibold">Rp {request.total_price.toLocaleString('id-ID')}</p>
          </div>
          {request.supplier && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Supplier</p>
              <p className="text-sm">{request.supplier}</p>
            </div>
          )}
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-sm">{getStatusBadge(request.status)}</p>
          </div>
          {request.notes && (
            <div className="grid grid-cols-2 items-start gap-4">
              <p className="text-sm font-medium text-muted-foreground">Catatan</p>
              <p className="text-sm whitespace-pre-wrap">{request.notes}</p>
            </div>
          )}
          {request.document_url && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Dokumen</p>
              <a
                href={request.document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Lihat Dokumen
              </a>
            </div>
          )}
          {request.received_quantity !== null && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Kuantitas Diterima</p>
              <p className="text-sm">{request.received_quantity}</p>
            </div>
          )}
          {request.returned_quantity !== null && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Kuantitas Dikembalikan</p>
              <p className="text-sm">{request.returned_quantity}</p>
            </div>
          )}
          {request.damaged_quantity !== null && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Kuantitas Rusak</p>
              <p className="text-sm">{request.damaged_quantity}</p>
            </div>
          )}
          {request.target_warehouse_category && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Gudang Tujuan</p>
              <p className="text-sm">{request.target_warehouse_category.replace('_', ' ').toUpperCase()}</p>
            </div>
          )}
          {request.received_notes && (
            <div className="grid grid-cols-2 items-start gap-4">
              <p className="text-sm font-medium text-muted-foreground">Catatan Penerimaan</p>
              <p className="text-sm whitespace-pre-wrap">{request.received_notes}</p>
            </div>
          )}
          {request.received_at && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Diterima Pada</p>
              <p className="text-sm">{format(new Date(request.received_at), 'dd MMMM yyyy HH:mm', { locale: id })}</p>
            </div>
          )}
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Dibuat Pada</p>
            <p className="text-sm">{format(new Date(request.created_at), 'dd MMMM yyyy HH:mm', { locale: id })}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseRequestDetailDialog;