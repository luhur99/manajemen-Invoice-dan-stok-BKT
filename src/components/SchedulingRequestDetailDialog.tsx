"use client";

import React from 'react';
import { SchedulingRequest } from '@/api/schedulingRequests';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale'; // Import Indonesian locale

interface SchedulingRequestDetailDialogProps {
  request: SchedulingRequest | null;
  onOpenChange: (open: boolean) => void;
}

const getStatusBadgeVariant = (status: SchedulingRequest['status']) => {
  switch (status) {
    case 'pending':
      return 'secondary';
    case 'approved':
      return 'default';
    case 'rejected':
      return 'destructive';
    default:
      return 'outline';
  }
};

const SchedulingRequestDetailDialog: React.FC<SchedulingRequestDetailDialogProps> = ({ request, onOpenChange }) => {
  if (!request) return null;

  return (
    <Dialog open={!!request} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detail Permintaan Penjadwalan</DialogTitle>
          <DialogDescription>Informasi lengkap tentang permintaan ini.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">ID:</span>
            <span className="col-span-2 text-sm text-muted-foreground break-all">{request.id}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">Pelanggan:</span>
            <span className="col-span-2 text-sm text-muted-foreground">{request.customer_name}</span>
          </div>
          {request.company_name && (
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium">Perusahaan:</span>
              <span className="col-span-2 text-sm text-muted-foreground">{request.company_name}</span>
            </div>
          )}
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">Tipe:</span>
            <span className="col-span-2 text-sm text-muted-foreground">{request.type}</span>
          </div>
          {request.vehicle_units && (
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium">Unit Kendaraan:</span>
              <span className="col-span-2 text-sm text-muted-foreground">{request.vehicle_units}</span>
            </div>
          )}
          {request.vehicle_type && (
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium">Tipe Kendaraan:</span>
              <span className="col-span-2 text-sm text-muted-foreground">{request.vehicle_type}</span>
            </div>
          )}
          {request.vehicle_year && (
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium">Tahun Kendaraan:</span>
              <span className="col-span-2 text-sm text-muted-foreground">{request.vehicle_year}</span>
            </div>
          )}
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">Alamat:</span>
            <span className="col-span-2 text-sm text-muted-foreground">{request.full_address}</span>
          </div>
          {request.landmark && (
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium">Landmark:</span>
              <span className="col-span-2 text-sm text-muted-foreground">{request.landmark}</span>
            </div>
          )}
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">Tanggal:</span>
            <span className="col-span-2 text-sm text-muted-foreground">
              {format(new Date(request.requested_date), 'dd MMMM yyyy', { locale: idLocale })}
            </span>
          </div>
          {request.requested_time && (
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium">Waktu:</span>
              <span className="col-span-2 text-sm text-muted-foreground">{request.requested_time}</span>
            </div>
          )}
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">Kontak:</span>
            <span className="col-span-2 text-sm text-muted-foreground">{request.contact_person}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">No. Telepon:</span>
            <span className="col-span-2 text-sm text-muted-foreground">{request.phone_number}</span>
          </div>
          {request.customer_type && (
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium">Tipe Pelanggan:</span>
              <span className="col-span-2 text-sm text-muted-foreground">{request.customer_type}</span>
            </div>
          )}
          {request.payment_method && (
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium">Metode Pembayaran:</span>
              <span className="col-span-2 text-sm text-muted-foreground">{request.payment_method}</span>
            </div>
          )}
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">Status:</span>
            <span className="col-span-2">
              <Badge variant={getStatusBadgeVariant(request.status)}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
            </span>
          </div>
          {request.notes && (
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium">Catatan:</span>
              <span className="col-span-2 text-sm text-muted-foreground">{request.notes}</span>
            </div>
          )}
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">Dibuat pada:</span>
            <span className="col-span-2 text-sm text-muted-foreground">
              {format(new Date(request.created_at), 'dd MMMM yyyy HH:mm', { locale: idLocale })}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulingRequestDetailDialog;