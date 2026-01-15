"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScheduleWithDetails } from "@/types/data";
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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detail Jadwal</DialogTitle>
          <DialogDescription>Informasi lengkap mengenai jadwal ini.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p><strong>Nomor DO:</strong> {schedule.do_number || "-"}</p>
          <p><strong>Nomor SR:</strong> {schedule.sr_number || "-"}</p> {/* New field */}
          <p><strong>Tanggal Jadwal:</strong> {format(new Date(schedule.schedule_date), "dd-MM-yyyy")}</p>
          <p><strong>Waktu Jadwal:</strong> {schedule.schedule_time || "-"}</p>
          <p><strong>Tipe:</strong> {schedule.type}</p>
          <p><strong>Nama Pelanggan:</strong> {schedule.customer_name}</p>
          <p><strong>Alamat:</strong> {schedule.address || "-"}</p>
          <p><strong>Nomor Telepon:</strong> {schedule.phone_number || "-"}</p>
          <p><strong>Nama Teknisi:</strong> {schedule.technician_name || "-"}</p>
          <p><strong>Nomor Invoice Terkait:</strong> {schedule.invoice_number || "-"}</p>
          <p><strong>Layanan Kurir:</strong> {schedule.courier_service || "-"}</p>
          <p><strong>Status:</strong> {schedule.status}</p>
          <p><strong>Catatan:</strong> {schedule.notes || "-"}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewScheduleDetailsDialog;