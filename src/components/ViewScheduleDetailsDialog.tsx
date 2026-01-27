"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScheduleWithDetails, ScheduleStatus, ScheduleType, ProductCategory } from "@/types/data";
import { format } from "date-fns";

interface ViewScheduleDetailsDialogProps {
  schedule: ScheduleWithDetails;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewScheduleDetailsDialog: React.FC<ViewScheduleDetailsDialogProps> = ({
  schedule,
  isOpen,
  onOpenChange,
}) => {
  const formatStatus = (status: ScheduleStatus) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatType = (type: ScheduleType) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatProductCategory = (category: ProductCategory | null) => {
    if (!category) return '-';
    return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detail Jadwal</DialogTitle>
          <DialogDescription>Informasi lengkap mengenai jadwal ini.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p><strong>Nomor DO:</strong> {schedule.do_number || "-"}</p>
          <p><strong>Nomor SR:</strong> {schedule.sr_number || "-"}</p>
          <p><strong>Tanggal Jadwal:</strong> {format(new Date(schedule.schedule_date), "dd-MM-yyyy")}</p>
          {schedule.product_category && <p><strong>Kategori Produk:</strong> {formatProductCategory(schedule.product_category)}</p>} {/* New field */}
          <p><strong>Waktu Jadwal:</strong> {schedule.schedule_time || "-"}</p>
          <p><strong>Tipe:</strong> {formatType(schedule.type)}</p>
          <p><strong>Nama Pelanggan:</strong> {schedule.customer_name}</p>
          <p><strong>Alamat:</strong> {schedule.address || "-"}</p>
          <p><strong>Nomor Telepon:</strong> {schedule.phone_number || "-"}</p>
          <p><strong>Nama Teknisi:</strong> {schedule.technician_name || "-"}</p>
          <p><strong>Nomor Invoice Terkait:</strong> {schedule.invoices?.invoice_number || "-"}</p>
          <p><strong>Layanan Kurir:</strong> {schedule.courier_service || "-"}</p>
          <p><strong>Status:</strong> {formatStatus(schedule.status)}</p>
          <p><strong>Catatan:</strong> {schedule.notes || "-"}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewScheduleDetailsDialog;