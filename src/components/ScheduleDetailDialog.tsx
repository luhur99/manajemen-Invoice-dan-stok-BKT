"use client";

import React from 'react';
import { Schedule } from '@/api/schedules';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale'; // Import Indonesian locale

interface ScheduleDetailDialogProps {
  schedule: Schedule | null;
  onOpenChange: (open: boolean) => void;
}

const getStatusBadgeVariant = (status: Schedule['status']) => {
  switch (status) {
    case 'scheduled':
      return 'default';
    case 'completed':
      return 'secondary';
    case 'cancelled':
      return 'destructive';
    default:
      return 'outline';
  }
};

const ScheduleDetailDialog: React.FC<ScheduleDetailDialogProps> = ({ schedule, onOpenChange }) => {
  if (!schedule) return null;

  return (
    <Dialog open={!!schedule} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detail Jadwal</DialogTitle>
          <DialogDescription>Informasi lengkap tentang jadwal ini.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">ID:</span>
            <span className="col-span-2 text-sm text-muted-foreground break-all">{schedule.id}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">Pelanggan:</span>
            <span className="col-span-2 text-sm text-muted-foreground">{schedule.customer_name}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">Tipe:</span>
            <span className="col-span-2 text-sm text-muted-foreground">{schedule.type}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">Tanggal:</span>
            <span className="col-span-2 text-sm text-muted-foreground">
              {format(new Date(schedule.schedule_date), 'dd MMMM yyyy', { locale: idLocale })}
            </span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">Waktu:</span>
            <span className="col-span-2 text-sm text-muted-foreground">{schedule.schedule_time || '-'}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">Alamat:</span>
            <span className="col-span-2 text-sm text-muted-foreground">{schedule.address || '-'}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">No. Telepon:</span>
            <span className="col-span-2 text-sm text-muted-foreground">{schedule.phone_number || '-'}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">Teknisi:</span>
            <span className="col-span-2 text-sm text-muted-foreground">{schedule.technician_name || '-'}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">Status:</span>
            <span className="col-span-2">
              <Badge variant={getStatusBadgeVariant(schedule.status)}>
                {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
              </Badge>
            </span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-medium">Catatan:</span>
            <span className="col-span-2 text-sm text-muted-foreground">{schedule.notes || '-'}</span>
          </div>
          {schedule.scheduling_request_id && (
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium">ID Permintaan:</span>
              <span className="col-span-2 text-sm text-muted-foreground break-all">{schedule.scheduling_request_id}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDetailDialog;