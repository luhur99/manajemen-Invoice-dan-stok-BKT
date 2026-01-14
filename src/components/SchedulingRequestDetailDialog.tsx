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
import { SchedulingRequest } from '@/api/schedulingRequests';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface SchedulingRequestDetailDialogProps {
  request: SchedulingRequest | null;
  onOpenChange: (open: boolean) => void;
}

const SchedulingRequestDetailDialog: React.FC<SchedulingRequestDetailDialogProps> = ({ request, onOpenChange }) => {
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
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Selesai</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500 hover:bg-gray-600">Dibatalkan</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'installation': return 'Instalasi';
      case 'maintenance': return 'Maintenance';
      case 'service': return 'Service';
      case 'delivery': return 'Pengiriman';
      default: return type;
    }
  };

  return (
    <Dialog open={!!request} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Permintaan Penjadwalan</DialogTitle>
          <DialogDescription>Informasi lengkap mengenai permintaan penjadwalan ini.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Nama Pelanggan</p>
            <p className="text-sm font-semibold">{request.customer_name}</p>
          </div>
          {request.company_name && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Nama Perusahaan</p>
              <p className="text-sm">{request.company_name}</p>
            </div>
          )}
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Jenis Permintaan</p>
            <p className="text-sm">{getTypeLabel(request.type)}</p>
          </div>
          {request.vehicle_units && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Jumlah Unit Kendaraan</p>
              <p className="text-sm">{request.vehicle_units}</p>
            </div>
          )}
          {request.vehicle_type && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Tipe Kendaraan</p>
              <p className="text-sm">{request.vehicle_type}</p>
            </div>
          )}
          {request.vehicle_year && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Tahun Kendaraan</p>
              <p className="text-sm">{request.vehicle_year}</p>
            </div>
          )}
          <div className="grid grid-cols-2 items-start gap-4">
            <p className="text-sm font-medium text-muted-foreground">Alamat Lengkap</p>
            <p className="text-sm whitespace-pre-wrap">{request.full_address}</p>
          </div>
          {request.landmark && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Landmark</p>
              <p className="text-sm">{request.landmark}</p>
            </div>
          )}
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Tanggal Permintaan</p>
            <p className="text-sm">{format(new Date(request.requested_date), 'dd MMMM yyyy', { locale: id })}</p>
          </div>
          {request.requested_time && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Waktu Permintaan</p>
              <p className="text-sm">{request.requested_time}</p>
            </div>
          )}
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Nama Kontak</p>
            <p className="text-sm">{request.contact_person}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Nomor Telepon</p>
            <p className="text-sm">{request.phone_number}</p>
          </div>
          {request.customer_type && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Tipe Pelanggan</p>
              <p className="text-sm">{request.customer_type}</p>
            </div>
          )}
          {request.payment_method && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Metode Pembayaran</p>
              <p className="text-sm">{request.payment_method}</p>
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
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Dibuat Pada</p>
            <p className="text-sm">{format(new Date(request.created_at), 'dd MMMM yyyy HH:mm', { locale: id })}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulingRequestDetailDialog;