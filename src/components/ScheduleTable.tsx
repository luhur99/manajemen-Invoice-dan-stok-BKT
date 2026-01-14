"use client";

import React from 'react';
import { Schedule, ScheduleStatus } from '@/api/schedules';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale'; // Import Indonesian locale

interface ScheduleTableProps {
  schedules: Schedule[];
  isLoading: boolean;
  error: Error | null;
  onView: (schedule: Schedule) => void;
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

const getStatusBadgeVariant = (status: ScheduleStatus) => {
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

const ScheduleTable: React.FC<ScheduleTableProps> = ({
  schedules,
  isLoading,
  error,
  onView,
  onEdit,
  onDelete,
  deletingId,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Memuat jadwal...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }

  if (!schedules || schedules.length === 0) {
    return <p className="text-muted-foreground">Tidak ada jadwal yang ditemukan.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Waktu</TableHead>
            <TableHead>Pelanggan</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell>{format(new Date(schedule.schedule_date), 'dd MMMM yyyy', { locale: idLocale })}</TableCell>
              <TableCell>{schedule.schedule_time || '-'}</TableCell>
              <TableCell>{schedule.customer_name}</TableCell>
              <TableCell>{schedule.type}</TableCell>
              <TableCell>{schedule.address || '-'}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(schedule.status)}>
                  {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onView(schedule)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEdit(schedule)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(schedule.id)}
                    disabled={deletingId === schedule.id}
                  >
                    {deletingId === schedule.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ScheduleTable;