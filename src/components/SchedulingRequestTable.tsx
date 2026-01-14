"use client";

import React from 'react';
import { SchedulingRequest, SchedulingRequestStatus } from '@/api/schedulingRequests';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, Edit, Trash2, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale'; // Import Indonesian locale

interface SchedulingRequestTableProps {
  schedulingRequests: SchedulingRequest[];
  isLoading: boolean;
  error: Error | null;
  onView: (request: SchedulingRequest) => void;
  onEdit: (request: SchedulingRequest) => void;
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  deletingId: string | null;
  isApprovingOrRejecting: boolean;
}

const getStatusBadgeVariant = (status: SchedulingRequestStatus) => {
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

const SchedulingRequestTable: React.FC<SchedulingRequestTableProps> = ({
  schedulingRequests,
  isLoading,
  error,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  deletingId,
  isApprovingOrRejecting,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Memuat permintaan penjadwalan...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }

  if (!schedulingRequests || schedulingRequests.length === 0) {
    return <p className="text-muted-foreground">Tidak ada permintaan penjadwalan yang ditemukan.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Pelanggan</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedulingRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{format(new Date(request.requested_date), 'dd MMMM yyyy', { locale: idLocale })}</TableCell>
              <TableCell>{request.customer_name}</TableCell>
              <TableCell>{request.type}</TableCell>
              <TableCell>{request.full_address}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(request.status)}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onView(request)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {request.status === 'pending' && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => onEdit(request)} disabled={isApprovingOrRejecting}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onApprove(request.id)}
                        disabled={isApprovingOrRejecting}
                      >
                        {isApprovingOrRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onReject(request.id)}
                        disabled={isApprovingOrRejecting}
                      >
                        {isApprovingOrRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                      </Button>
                    </>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(request.id)}
                    disabled={deletingId === request.id || isApprovingOrRejecting}
                  >
                    {deletingId === request.id ? (
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

export default SchedulingRequestTable;