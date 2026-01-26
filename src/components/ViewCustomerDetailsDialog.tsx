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
import { Customer, CustomerTypeEnum } from "@/types/data";
import { format } from "date-fns";

interface ViewCustomerDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

const ViewCustomerDetailsDialog: React.FC<ViewCustomerDetailsDialogProps> = ({
  isOpen,
  onClose,
  customer,
}) => {
  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Pelanggan</DialogTitle>
          <DialogDescription>
            Informasi lengkap mengenai pelanggan ini.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Nama Pelanggan:</p>
            <p>{customer.customer_name}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Nama Perusahaan:</p>
            <p>{customer.company_name || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Alamat:</p>
            <p>{customer.address || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Nomor Telepon:</p>
            <p>{customer.phone_number || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Tipe Pelanggan:</p>
            <p>{customer.customer_type}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Dibuat Pada:</p>
            <p>{format(new Date(customer.created_at), "dd-MM-yyyy HH:mm")}</p>
          </div>
          {customer.updated_at && (
            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">Terakhir Diperbarui:</p>
              <p>{format(new Date(customer.updated_at), "dd-MM-yyyy HH:mm")}</p>
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

export default ViewCustomerDetailsDialog;