"use client";

import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, Edit, Trash } from 'lucide-react';
import { DeliveryOrder } from '@/api/deliveryOrders';

interface DeliveryOrderTableProps {
  deliveryOrders: DeliveryOrder[];
  isLoading: boolean;
  error: Error | null;
  onView: (order: DeliveryOrder) => void;
  onEdit: (order: DeliveryOrder) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

const DeliveryOrderTable: React.FC<DeliveryOrderTableProps> = ({
  deliveryOrders,
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
        <span className="ml-2 text-muted-foreground">Memuat pesanan pengiriman...</span>
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
          <p className="text-destructive">Gagal memuat pesanan pengiriman: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!deliveryOrders || deliveryOrders.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Tidak ada pesanan pengiriman.</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Dijadwalkan</Badge>;
      case 'in_transit':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Dalam Pengiriman</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500 hover:bg-green-600">Terkirim</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 hover:bg-red-600">Dibatalkan</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Pesanan Pengiriman</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomor DO</TableHead>
                <TableHead>Tanggal Pengiriman</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveryOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.do_number}</TableCell>
                  <TableCell>
                    {format(new Date(order.delivery_date), 'dd MMM yyyy', { locale: id })}
                  </TableCell>
                  <TableCell>{order.delivery_time || '-'}</TableCell>
                  <TableCell>
                    {order.items_json.map((item, idx) => (
                      <div key={idx} className="text-sm text-muted-foreground">
                        {item.product_name} ({item.quantity} {item.unit_type})
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(order)}
                        disabled={order.status === 'delivered' || order.status === 'cancelled'}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(order.id)}
                        disabled={deletingId === order.id || order.status === 'delivered' || order.status === 'cancelled'}
                      >
                        {deletingId === order.id ? (
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

export default DeliveryOrderTable;