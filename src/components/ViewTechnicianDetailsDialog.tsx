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
import { Technician } from "@/types/data";
import { format } from "date-fns";

interface ViewTechnicianDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  technician: Technician | null;
}

const ViewTechnicianDetailsDialog: React.FC<ViewTechnicianDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  technician,
}) => {
  if (!technician) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Teknisi</DialogTitle>
          <DialogDescription>
            Informasi lengkap mengenai teknisi ini.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Nama Teknisi:</p>
            <p>{technician.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Nomor Telepon:</p>
            <p>{technician.phone_number || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Tipe:</p>
            <p>{technician.type.charAt(0).toUpperCase() + technician.type.slice(1)}</p>
          </div>
          {technician.type === 'external' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <p className="font-medium">Alamat:</p>
                <p>{technician.address || "-"}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="font-medium">Kabupaten/Kota:</p>
                <p>{technician.city || "-"}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="font-medium">Provinsi:</p>
                <p>{technician.province || "-"}</p>
              </div>
            </>
          )}
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Dibuat Pada:</p>
            <p>{format(new Date(technician.created_at), "dd-MM-yyyy HH:mm")}</p>
          </div>
          {technician.updated_at && (
            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">Terakhir Diperbarui:</p>
              <p>{format(new Date(technician.updated_at), "dd-MM-yyyy HH:mm")}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTechnicianDetailsDialog;