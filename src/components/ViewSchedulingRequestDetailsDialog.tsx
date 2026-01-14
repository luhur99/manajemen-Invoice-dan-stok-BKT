"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SchedulingRequest } from "@/types/data";
import { format } from "date-fns";
import { Car, MapPin, User, Phone, Building2, CalendarDays, Clock, Info, DollarSign, FileText } from "lucide-react";

interface ViewSchedulingRequestDetailsDialogProps {
  request: SchedulingRequest;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewSchedulingRequestDetailsDialog: React.FC<ViewSchedulingRequestDetailsDialogProps> = ({
  request,
  isOpen,
  onOpenChange,
}) => {
  if (!request) return null;

  const getRequestTypeDisplay = (type: 'instalasi' | 'service' | 'kirim') => {
    switch (type) {
      case 'instalasi': return 'Instalasi';
      case 'service': return 'Servis';
      case 'kirim': return 'Kirim Barang';
      default: return type;
    }
  };

  const getStatusColor = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Permintaan Penjadwalan</DialogTitle>
          <DialogDescription>Informasi lengkap mengenai permintaan penjadwalan dari {request.customer_name}.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="flex items-center"><User className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Konsumen:</strong> {request.customer_name}</p>
            {request.company_name && <p className="flex items-center"><Building2 className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Perusahaan:</strong> {request.company_name}</p>}
            <p className="flex items-center"><Info className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Tipe Permintaan:</strong> {getRequestTypeDisplay(request.type)}</p>
            <p className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Tanggal Diminta:</strong> {format(new Date(request.requested_date), "dd-MM-yyyy")}</p>
            {request.requested_time && <p className="flex items-center"><Clock className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Waktu Diminta:</strong> {request.requested_time}</p>}
            <p className="flex items-center"><User className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Kontak Person:</strong> {request.contact_person}</p>
            <p className="flex items-center"><Phone className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>No. Telepon:</strong> {request.phone_number}</p>
          </div>
          <div>
            <p className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Alamat Lengkap:</strong> {request.full_address}</p>
            {request.landmark && <p className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Patokan:</strong> {request.landmark}</p>}
            {request.customer_type && <p className="flex items-center"><User className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Tipe Konsumen:</strong> {request.customer_type.charAt(0).toUpperCase() + request.customer_type.slice(1)}</p>}
            {request.payment_method && <p className="flex items-center"><DollarSign className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Metode Pembayaran:</strong> {request.payment_method}</p>}
            {(request.type === "instalasi" || request.type === "service") && (
              <>
                {request.vehicle_units && <p className="flex items-center"><Car className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Unit Kendaraan:</strong> {request.vehicle_units}</p>}
                {request.vehicle_type && <p className="flex items-center"><Car className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Tipe Kendaraan:</strong> {request.vehicle_type}</p>}
                {request.vehicle_year && <p className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Tahun Kendaraan:</strong> {request.vehicle_year}</p>}
              </>
            )}
            <p className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" /> <strong>Status:</strong>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </p>
          </div>
        </div>
        {request.notes && (
          <div className="mt-4 text-sm">
            <p><strong>Catatan:</strong> {request.notes}</p>
          </div>
        )}
        <div className="mt-4 text-xs text-muted-foreground">
          Dibuat pada: {format(new Date(request.created_at), "dd-MM-yyyy HH:mm")}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSchedulingRequestDetailsDialog;