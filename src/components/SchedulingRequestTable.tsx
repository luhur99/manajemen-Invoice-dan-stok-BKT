"use client";

import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, Edit, Trash, CheckCircle2, XCircle } from 'lucide-react';
import { SchedulingRequest } from '@/api/schedulingRequests';

interface SchedulingRequestTableProps {
  schedulingRequests: SchedulingRequest[];
  isLoading: boolean;
  error: Error | null;
  onView: (request: SchedulingRequest) => void;
  onEdit: (request: SchedulingRequest) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
  isAdmin: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isApprovingOrRejecting: boolean;
}

const SchedulingRequestTable: React.FC<SchedulingRequestTableProps> = ({
  schedulingRequests,
  isLoading,
  error,
  onView,
  onEdit,
  onDelete,
  deletingId,
  isAdmin,
  onApprove,
  onReject,
  isApprovingOrRejecting,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Memuat permintaan penjadwalan...</span>
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
          <p className="text-destructive">Gagal memuat permintaan penjadwalan: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!schedulingRequests || schedulingRequests.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Tidak ada permintaan penjadwalan.</p>
        </CardContent>
      </Card>
    );
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Permintaan Penjadwalan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal Permintaan</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedulingRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      {format(new Date(request.requested_date), 'dd MMM yyyy', { locale: id })}
                    </div>
                    {request.requested_time && (
                      <div className="text-sm text-muted-foreground">
                        {request.requested_time}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>{request.customer_name}</div>
                    {request.company_name && (
                      <div className="text-sm text-muted-foreground">{request.company_name}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {request.type === 'installation' && 'Instalasi'}
                    {request.type === 'maintenance' && 'Maintenance'}
                    {request.type === 'service' && 'Service'}
                    {request.type === 'delivery' && 'Pengiriman'}
                  </TableCell>
                  <TableCell>{request.full_address}</TableCell>
                  <TableCell>
                    <div>{request.contact_person}</div>
                    <div className="text-sm text-muted-foreground">{request.phone_number}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(request)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {isAdmin && request.status === 'pending' ? (
                        <>
                          <Button
                            variant="default" 
                            size="sm"
                            onClick={() => onApprove(request.id)}
                            disabled={isApprovingOrRejecting}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            {isApprovingOrRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="default" 
                            size="sm"
                            onClick={() => onReject(request.id)}
                            disabled={isApprovingOrRejecting}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            {isApprovingOrRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(request)}
                            disabled={request.status !== 'pending'}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(request.id)}
                            disabled={deletingId === request.id || request.status !== 'pending'}
                          >
                            {deletingId === request.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash className="h-4 w-4" />
                            )}
                          </Button>
                        </>
                      )}
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

export default SchedulingRequestTable;