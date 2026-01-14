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
import { SalesDetail } from '@/api/salesDetails';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface SalesDetailDetailDialogProps {
  salesDetail: SalesDetail | null;
  onOpenChange: (open: boolean) => void;
}

const SalesDetailDetailDialog: React.FC<SalesDetailDetailDialogProps> = ({ salesDetail, onOpenChange }) => {
  if (!salesDetail) {
    return null;
  }

  return (
    <Dialog open={!!salesDetail} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Penjualan: {salesDetail.no_transaksi}</DialogTitle>
          <DialogDescription>Informasi lengkap mengenai detail penjualan ini.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">No</p>
            <p className="text-sm font-semibold">{salesDetail.no}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Kirim/Install</p>
            <p className="text-sm">
              <Badge className={`px-2 py-1 rounded-full text-xs font-medium ${
                salesDetail.kirim_install === 'kirim' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {salesDetail.kirim_install === 'kirim' ? 'Kirim' : 'Install'}
              </Badge>
            </p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">No Transaksi</p>
            <p className="text-sm">{salesDetail.no_transaksi}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">No Faktur</p>
            <p className="text-sm">{salesDetail.invoice_number}</p>
          </div>
          {salesDetail.new_old && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">New/Old</p>
              <p className="text-sm">{salesDetail.new_old}</p>
            </div>
          )}
          {salesDetail.perusahaan && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Perusahaan</p>
              <p className="text-sm">{salesDetail.perusahaan}</p>
            </div>
          )}
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Tanggal</p>
            <p className="text-sm">{format(new Date(salesDetail.tanggal), 'dd MMMM yyyy', { locale: id })}</p>
          </div>
          {salesDetail.hari && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Hari</p>
              <p className="text-sm">{salesDetail.hari}</p>
            </div>
          )}
          {salesDetail.jam && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Jam</p>
              <p className="text-sm">{salesDetail.jam}</p>
            </div>
          )}
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Customer</p>
            <p className="text-sm">{salesDetail.customer}</p>
          </div>
          {salesDetail.alamat_install && (
            <div className="grid grid-cols-2 items-start gap-4">
              <p className="text-sm font-medium text-muted-foreground">Alamat Install</p>
              <p className="text-sm whitespace-pre-wrap">{salesDetail.alamat_install}</p>
            </div>
          )}
          {salesDetail.no_hp && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">No HP</p>
              <p className="text-sm">{salesDetail.no_hp}</p>
            </div>
          )}
          {salesDetail.type && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <p className="text-sm">{salesDetail.type}</p>
            </div>
          )}
          {salesDetail.qty_unit !== null && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Qty Unit</p>
              <p className="text-sm">{salesDetail.qty_unit}</p>
            </div>
          )}
          {salesDetail.stock !== null && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Stock</p>
              <p className="text-sm">{salesDetail.stock}</p>
            </div>
          )}
          {salesDetail.harga !== null && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Harga</p>
              <p className="text-sm">Rp {salesDetail.harga.toLocaleString('id-ID')}</p>
            </div>
          )}
          {salesDetail.web && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Web</p>
              <p className="text-sm">{salesDetail.web}</p>
            </div>
          )}
          {salesDetail.qty_web !== null && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Qty Web</p>
              <p className="text-sm">{salesDetail.qty_web}</p>
            </div>
          )}
          {salesDetail.kartu && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Kartu</p>
              <p className="text-sm">{salesDetail.kartu}</p>
            </div>
          )}
          {salesDetail.qty_kartu !== null && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Qty Kartu</p>
              <p className="text-sm">{salesDetail.qty_kartu}</p>
            </div>
          )}
          {salesDetail.paket && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Paket</p>
              <p className="text-sm">{salesDetail.paket}</p>
            </div>
          )}
          {salesDetail.pulsa !== null && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Pulsa</p>
              <p className="text-sm">Rp {salesDetail.pulsa.toLocaleString('id-ID')}</p>
            </div>
          )}
          {salesDetail.teknisi && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Teknisi</p>
              <p className="text-sm">{salesDetail.teknisi}</p>
            </div>
          )}
          {salesDetail.payment && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Payment</p>
              <p className="text-sm">{salesDetail.payment}</p>
            </div>
          )}
          {salesDetail.catatan && (
            <div className="grid grid-cols-2 items-start gap-4">
              <p className="text-sm font-medium text-muted-foreground">Catatan</p>
              <p className="text-sm whitespace-pre-wrap">{salesDetail.catatan}</p>
            </div>
          )}
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Dibuat Pada</p>
            <p className="text-sm">{format(new Date(salesDetail.created_at), 'dd MMMM yyyy HH:mm', { locale: id })}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SalesDetailDetailDialog;