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
import { SchedulingRequest, SchedulingRequestStatus, SchedulingRequestType, CustomerTypeEnum } from "@/types/data";
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

  // Use data from joined customers table if available, otherwise fallback to direct columns
  const customerName = (request as any).customer_name_from_customers || request.customer_name;
  const companyName = (request as any).company_name_from_customers || request.company_name;
  const phoneNumber = (request as any).phone_number_from_customers || request.phone_number;
  const customerType = (request as any).customer_type_from_customers || request.customer_type;


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
            <p>{customerName}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Nama Perusahaan:</p>
            <p>{companyName || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Tipe Permintaan:</p>
            <p>{getTypeDisplay(request.type)}</p>
          </div>
          {request.invoice_id && (
            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">Nomor Invoice Terkait:</p>
              <p>{(request as any).invoice_number || request.invoice_id}</p> {/* Display invoice number if joined */}
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Jumlah Unit Kendaraan:</p>
            <p>{request.vehicle_units || "-"}</p>
          </div>
          {request.vehicle_type && request.vehicle_type.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">Tipe Kendaraan:</p>
              <div className="flex flex-col">
                {request.vehicle_type.map((type, index) => (
                  <p key={index}>{type || "-"}</p>
                ))}
              </div>
            </div>
          )}
          {request.vehicle_year && request.vehicle_year.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">Tahun Kendaraan:</p>
              <div className="flex flex-col">
                {request.vehicle_year.map((year, index) => (
                  <p key={index}>{year || "-"}</p>
                ))}
              </div>
            </div>
          )}
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
            <p>{phoneNumber}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Tipe Pelanggan:</p>
            <p>{customerType || "-"}</p>
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