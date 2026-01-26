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
import { Supplier } from "@/types/data";
import { formatDateSafely } from "@/lib/utils"; // Import formatDateSafely

interface ViewSupplierDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
}

const ViewSupplierDetailsDialog: React.FC<ViewSupplierDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  supplier,
}) => {
  if (!supplier) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Pemasok</DialogTitle>
          <DialogDescription>
            Informasi lengkap mengenai pemasok ini.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Nama Pemasok:</p>
            <p>{supplier.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Kontak Person:</p>
            <p>{supplier.contact_person || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Nomor Telepon:</p>
            <p>{supplier.phone_number || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Email:</p>
            <p>{supplier.email || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Alamat:</p>
            <p>{supplier.address || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Catatan:</p>
            <p>{supplier.notes || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Dibuat Pada:</p>
            <p>{formatDateSafely(supplier.created_at, "dd-MM-yyyy HH:mm")}</p>
          </div>
          {supplier.updated_at && (
            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">Terakhir Diperbarui:</p>
              <p>{formatDateSafely(supplier.updated_at, "dd-MM-yyyy HH:mm")}</p>
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

export default ViewSupplierDetailsDialog;