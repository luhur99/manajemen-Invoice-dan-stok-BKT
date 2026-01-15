"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SchedulingRequest, SchedulingRequestStatus, SchedulingRequestType } from "@/types/data";
import { format } from "date-fns";

interface ViewSchedulingRequestDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  request: SchedulingRequest | null;
}

const getStatusDisplay = (status: SchedulingRequestStatus) => {
  switch (status) {
    case SchedulingRequestStatus.PENDING: return "Pending";
    case SchedulingRequestStatus.APPROVED: return "Disetujui";
    case SchedulingRequestStatus.REJECTED: return "Ditolak";
    case SchedulingRequestStatus.COMPLETED: return "Selesai";
    case SchedulingRequestStatus.CANCELLED: return "Dibatalkan";
    default: return status;
  }
};

const getTypeDisplay = (type: SchedulingRequestType) => {
  return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const ViewSchedulingRequestDetailsDialog: React.FC<ViewSchedulingRequestDetailsDialogProps> = ({
  isOpen,
  onClose,
  request,
}) => {
  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Permintaan Jadwal</DialogTitle>
          <DialogDescription>
            Detail lengkap untuk permintaan jadwal #{request.sr_number || request.id}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Nomor SR:</p>
            <p>{request.sr_number || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Nama Pelanggan:</p>
            <p>{request.customer_name}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Nama Perusahaan:</p>
            <p>{request.company_name || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Tipe Permintaan:</p>
            <p>{getTypeDisplay(request.type)}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Jumlah Unit Kendaraan:</p>
            <p>{request.vehicle_units || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Tipe Kendaraan:</p>
            <p>{request.vehicle_type || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Tahun Kendaraan:</p>
            <p>{request.vehicle_year || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Alamat Lengkap:</p>
            <p>{request.full_address}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Landmark:</p>
            <p>{request.landmark || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Tanggal Permintaan:</p>
            <p>{format(new Date(request.requested_date), "dd-MM-yyyy")}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Waktu Permintaan:</p>
            <p>{request.requested_time || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Kontak Person:</p>
            <p>{request.contact_person}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Nomor Telepon:</p>
            <p>{request.phone_number}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Tipe Pelanggan:</p>
            <p>{request.customer_type || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Metode Pembayaran:</p>
            <p>{request.payment_method || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Status:</p>
            <p>{getStatusDisplay(request.status)}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Catatan:</p>
            <p>{request.notes || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Dibuat Pada:</p>
            <p>{format(new Date(request.created_at), "dd-MM-yyyy HH:mm")}</p>
          </div>
          {request.updated_at && (
            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">Terakhir Diperbarui:</p>
              <p>{format(new Date(request.updated_at), "dd-MM-yyyy HH:mm")}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSchedulingRequestDetailsDialog;