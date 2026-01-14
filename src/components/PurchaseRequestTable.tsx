"use client";

import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, Edit, Trash } from 'lucide-react';
import { PurchaseRequest } from '@/api/purchaseRequests';

interface PurchaseRequestTableProps {
  purchaseRequests: PurchaseRequest[];
  isLoading: boolean;
  error: Error | null;
  onView: (purchaseRequest: PurchaseRequest) => void;
  onEdit: (purchaseRequest: PurchaseRequest) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

const PurchaseRequestTable: React.FC<PurchaseRequestTableProps> = ({
  purchaseRequests,
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
        <span className="ml-2 text-muted-foreground">Memuat permintaan pembelian...</span>
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
          <p className="text-destructive">Gagal memuat permintaan pembelian: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!purchaseRequests || purchaseRequests.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Tidak ada permintaan pembelian.</p>
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
      case 'waiting_for_receipt':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Menunggu Penerimaan</Badge>;
      case 'closed':
        return <Badge className="bg-green-500 hover:bg-green-600">Selesai</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Permintaan Pembelian</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Kode Item</TableHead>
                <TableHead>Nama Item</TableHead>
                <TableHead className="text-right">Kuantitas</TableHead>
                <TableHead className="text-right">Harga Satuan</TableHead>
                <TableHead className="text-right">Total Harga</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    {format(new Date(request.created_at), 'dd MMM yyyy', { locale: id })}
                  </TableCell>
                  <TableCell>{request.item_code}</TableCell>
                  <TableCell>{request.item_name}</TableCell>
                  <TableCell className="text-right">{request.quantity}</TableCell>
                  <TableCell className="text-right">
                    Rp {request.unit_price.toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell className="text-right">
                    Rp {request.total_price.toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{request.supplier || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(request)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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

export default PurchaseRequestTable;