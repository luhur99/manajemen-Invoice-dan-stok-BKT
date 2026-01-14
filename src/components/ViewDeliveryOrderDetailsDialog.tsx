"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DeliveryOrder, SchedulingRequest } from "@/types/data";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { format } from "date-fns";
import { Loader2, Truck, CalendarDays, Clock, MapPin, Info, User, Phone } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ViewDeliveryOrderDetailsDialogProps {
  deliveryOrder: DeliveryOrder;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewDeliveryOrderDetailsDialog: React.FC<ViewDeliveryOrderDetailsDialogProps> = ({
  deliveryOrder,
  isOpen,
  onOpenChange,
}) => {
  const [schedulingRequest, setSchedulingRequest] = useState<SchedulingRequest | null>(null);
  const [loadingRequest, setLoadingRequest] = useState(true);

  useEffect(() => {
    if (isOpen && deliveryOrder?.request_id) {
      const fetchSchedulingRequest = async () => {
        setLoadingRequest(true);
        try {
          const { data, error } = await supabase
            .from("scheduling_requests")
            .select("*")
            .eq("id", deliveryOrder.request_id)
            .single();

          if (error) {
            throw error;
          }
          setSchedulingRequest(data as SchedulingRequest);
        } catch (err: any) {
          showError(`Gagal memuat detail permintaan penjadwalan: ${err.message}`);
          console.error("Error fetching scheduling request for DO:", err);
          setSchedulingRequest(null);
        } finally {
          setLoadingRequest(false);
        }
      };
      fetchSchedulingRequest();
    } else if (!isOpen) {
      setSchedulingRequest(null);
    }
  }, [isOpen, deliveryOrder?.request_id]);

  if (!deliveryOrder) return null;

  const getStatusColor = (status: 'pending' | 'in progress' | 'completed' | 'cancelled') => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestTypeDisplay = (type?: 'instalasi' | 'service' | 'kirim') => {
    switch (type) {
      case 'instalasi': return 'Instalasi';
      case 'service': return 'Servis';
      case 'kirim': return 'Kirim Barang';
      default: return '-';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Delivery Order #{deliveryOrder.do_number}</DialogTitle>
          <DialogDescription>Informasi lengkap mengenai Delivery Order ini.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="flex items-center"><Truck className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Nomor DO:</strong> {deliveryOrder.do_number}</p>
            <p className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Tanggal Pengiriman:</strong> {format(new Date(deliveryOrder.delivery_date), "dd-MM-yyyy")}</p>
            {deliveryOrder.delivery_time && <p className="flex items-center"><Clock className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Waktu Pengiriman:</strong> {deliveryOrder.delivery_time}</p>}
            <p className="flex items-center">
              <Info className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Status:</strong>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deliveryOrder.status)}`}>
                {deliveryOrder.status.charAt(0).toUpperCase() + deliveryOrder.status.slice(1)}
              </span>
            </p>
          </div>
          <div>
            {loadingRequest ? (
              <div className="flex items-center"><Loader2 className="h-4 w-4 animate-spin mr-2" /> Memuat detail permintaan...</div>
            ) : schedulingRequest ? (
              <>
                <p className="flex items-center"><User className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Konsumen:</strong> {schedulingRequest.customer_name}</p>
                <p className="flex items-center"><Phone className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>No. Telepon:</strong> {schedulingRequest.phone_number}</p>
                <p className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Alamat:</strong> {schedulingRequest.full_address}</p>
                <p className="flex items-center"><Info className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Tipe Permintaan:</strong> {getRequestTypeDisplay(schedulingRequest.type)}</p>
              </>
            ) : (
              <p className="text-red-500">Detail permintaan penjadwalan tidak ditemukan.</p>
            )}
          </div>
        </div>
        {deliveryOrder.notes && (
          <div className="mt-4 text-sm">
            <p><strong>Catatan DO:</strong> {deliveryOrder.notes}</p>
          </div>
        )}

        {deliveryOrder.items_json && deliveryOrder.items_json.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mt-6 mb-2">Item Pengiriman</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Item</TableHead>
                    <TableHead className="text-right">Kuantitas</TableHead>
                    <TableHead className="text-right">Harga Satuan</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveryOrder.items_json.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.item_name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{item.unit_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                      <TableCell className="text-right">{item.subtotal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
        <div className="mt-4 text-xs text-muted-foreground">
          Dibuat pada: {format(new Date(deliveryOrder.created_at), "dd-MM-yyyy HH:mm")}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDeliveryOrderDetailsDialog;