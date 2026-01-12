"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Schedule } from "@/types/data";
import { format } from "date-fns";
import { FileText } from "lucide-react";

interface ViewScheduleDetailsDialogProps {
  schedule: Schedule;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewScheduleDetailsDialog: React.FC<ViewScheduleDetailsDialogProps> = ({
  schedule,
  isOpen,
  onOpenChange,
}) => {
  if (!schedule) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Jadwal untuk {schedule.customer_name}</DialogTitle>
          <DialogDescription>Informasi lengkap mengenai jadwal ini.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Tanggal Jadwal:</strong> {format(new Date(schedule.schedule_date), "dd-MM-yyyy")}</p>
            <p><strong>Waktu Jadwal:</strong> {schedule.schedule_time || "-"}</p>
            <p><strong>Tipe:</strong> {schedule.type.charAt(0).toUpperCase() + schedule.type.slice(1)}</p>
            <p><strong>Nama Konsumen:</strong> {schedule.customer_name}</p>
            <p><strong>No WA Konsumen:</strong> {schedule.phone_number || "-"}</p>
            {schedule.type === "kirim" && (
              <p><strong>Jasa Kurir:</strong> {schedule.courier_service || "-"}</p>
            )}
          </div>
          <div>
            <p><strong>Alamat:</strong> {schedule.address || "-"}</p>
            <p><strong>Nama Teknisi:</strong> {schedule.technician_name || "-"}</p>
            <p><strong>ID Invoice Terkait:</strong> {schedule.invoice_id || "-"}</p>
            <p><strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                schedule.status === 'completed' ? 'bg-green-100 text-green-800' :
                schedule.status === 'in progress' ? 'bg-blue-100 text-blue-800' :
                schedule.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
              </span>
            </p>
            {schedule.document_url && (
              <div className="flex items-center mt-2">
                <FileText className="h-4 w-4 text-blue-500 mr-2" />
                <a
                  href={schedule.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Lihat Dokumen
                </a>
              </div>
            )}
          </div>
        </div>
        {schedule.notes && (
          <div className="mt-4 text-sm">
            <p><strong>Catatan:</strong> {schedule.notes}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewScheduleDetailsDialog;