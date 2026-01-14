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
import { DeliveryOrder } from '@/api/deliveryOrders';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface DeliveryOrderDetailDialogProps {
  order: DeliveryOrder | null;
  onOpenChange: (open: boolean) => void;
}

const DeliveryOrderDetailDialog: React.FC<DeliveryOrderDetailDialogProps> = ({ order, onOpenChange }) => {
  if (!order) {
    return null;
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
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Pesanan Pengiriman: {order.do_number}</DialogTitle>
          <DialogDescription>Informasi lengkap mengenai pesanan pengiriman ini.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Nomor DO</p>
            <p className="text-sm font-semibold">{order.do_number}</p>
          </div>
          {order.request_id && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">ID Permintaan Terkait</p>
              <p className="text-sm">{order.request_id}</p>
            </div>
          )}
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Tanggal Pengiriman</p>
            <p className="text-sm">{format(new Date(order.delivery_date), 'dd MMMM yyyy', { locale: id })}</p>
          </div>
          {order.delivery_time && (
            <div className="grid grid-cols-2 items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Waktu Pengiriman</p>
              <p className="text-sm">{order.delivery_time}</p>
            </div>
          )}
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-sm">{getStatusBadge(order.status)}</p>
          </div>
          {order.notes && (
            <div className="grid grid-cols-2 items-start gap-4">
              <p className="text-sm font-medium text-muted-foreground">Catatan</p>
              <p className="text-sm whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}

          <Separator className="my-4" />

          <h3 className="text-lg font-semibold mb-2">Item Pengiriman</h3>
          {order.items_json && order.items_json.length > 0 ? (
            <div className="space-y-2">
              {order.items_json.map((item, index) => (
                <div key={index} className="border rounded-md p-3">
                  <p className="text-sm font-medium">{item.product_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} {item.unit_type}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Tidak ada item pengiriman.</p>
          )}

          <div className="grid grid-cols-2 items-center gap-4 mt-4">
            <p className="text-sm font-medium text-muted-foreground">Dibuat Pada</p>
            <p className="text-sm">{format(new Date(order.created_at), 'dd MMMM yyyy HH:mm', { locale: id })}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryOrderDetailDialog;