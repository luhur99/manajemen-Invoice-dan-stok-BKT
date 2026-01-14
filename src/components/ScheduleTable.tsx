"use client";

import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, Edit, Trash } from 'lucide-react';
import { Schedule } from '@/api/schedules';

interface ScheduleTableProps {
  schedules: Schedule[];
  isLoading: boolean;
  error: Error | null;
  onView: (schedule: Schedule) => void;
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

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
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Memuat jadwal...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Gagal memuat jadwal: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!schedules || schedules.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Tidak ada jadwal.</p>
        </CardContent>
      </Card>
    );
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Jadwal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal & Waktu</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Teknisi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    <div>
                      {format(new Date(schedule.schedule_date), 'dd MMM yyyy', { locale: id })}
                    </div>
                    {schedule.schedule_time && (
                      <div className="text-sm text-muted-foreground">
                        {schedule.schedule_time}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {schedule.type === 'installation' && 'Instalasi'}
                    {schedule.type === 'maintenance' && 'Maintenance'}
                    {schedule.type === 'service' && 'Service'}
                    {schedule.type === 'delivery' && 'Pengiriman'}
                  </TableCell>
                  <TableCell>
                    <div>{schedule.customer_name}</div>
                    {schedule.phone_number && (
                      <div className="text-sm text-muted-foreground">
                        {schedule.phone_number}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{schedule.address || '-'}</TableCell>
                  <TableCell>{schedule.technician_name || '-'}</TableCell>
                  <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(schedule)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(schedule)}
                        disabled={schedule.status === 'completed' || schedule.status === 'cancelled'}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(schedule.id)}
                        disabled={deletingId === schedule.id || schedule.status === 'completed' || schedule.status === 'cancelled'}
                      >
                        {deletingId === schedule.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleTable;