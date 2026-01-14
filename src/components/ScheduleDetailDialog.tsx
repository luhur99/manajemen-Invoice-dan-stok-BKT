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
import { Schedule } from '@/api/schedules';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface ScheduleDetailDialogProps {
  schedule: Schedule | null;
  onOpenChange: (open: boolean) => void;
}

const ScheduleDetailDialog: React.FC<ScheduleDetailDialogProps> = ({ schedule, onOpenChange }) => {
  if (!schedule) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Dijadwalkan</Badge>;
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Selesai</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 hover:bg-red-600">Dibatalkan</Badge>;
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
    <Dialog open={!!schedule} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Jadwal</DialogTitle>
          <DialogDescription>Informasi lengkap mengenai jadwal ini.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Tanggal Jadwal</p>
            <p className="text-sm font-semibold">{format(new Date(schedule.schedule_date), 'dd MMMM yyyy', { locale: id })}</p>
          </div>
          {schedule.schedule_time && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Waktu Jadwal</p>
              <p className="text-sm">{schedule.schedule_time}</p>
            </div>
          )}
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Jenis Jadwal</p>
            <p className="text-sm">{getTypeLabel(schedule.type)}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Nama Pelanggan</p>
            <p className="text-sm">{schedule.customer_name}</p>
          </div>
          {schedule.phone_number && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Nomor Telepon</p>
              <p className="text-sm">{schedule.phone_number}</p>
            </div>
          )}
          {schedule.technician_name && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Nama Teknisi</p>
              <p className="text-sm">{schedule.technician_name}</p>
            </div>
          )}
          {schedule.address && (
            <div className="grid grid-cols-2 items-start gap-4">
              <p className="text-sm font-medium text-muted-foreground">Alamat</p>
              <p className="text-sm whitespace-pre-wrap">{schedule.address}</p>
            </div>
          )}
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-sm">{getStatusBadge(schedule.status)}</p>
          </div>
          {schedule.notes && (
            <div className="grid grid-cols-2 items-start gap-4">
              <p className="text-sm font-medium text-muted-foreground">Catatan</p>
              <p className="text-sm whitespace-pre-wrap">{schedule.notes}</p>
            </div>
          )}
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Dibuat Pada</p>
            <p className="text-sm">{format(new Date(schedule.created_at), 'dd MMMM yyyy HH:mm', { locale: id })}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDetailDialog;