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
import { PurchaseRequest, PurchaseRequestStatus } from "@/types/data";
import { format } from "date-fns";

interface ViewPurchaseRequestDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void; // Changed from onOpenChange
  request: PurchaseRequest | null;
}

const getStatusDisplay = (status: PurchaseRequestStatus) => {
  switch (status) {
    case PurchaseRequestStatus.PENDING:
      return "Pending";
    case PurchaseRequestStatus.APPROVED:
      return "Disetujui";
    case PurchaseRequestStatus.REJECTED:
      return "Ditolak";
    case PurchaseRequestStatus.WAITING_FOR_RECEIVED: // Corrected enum member
      return "Waiting for Received"; // Updated display text
    case PurchaseRequestStatus.CLOSED:
      return "Ditutup";
    default:
      return status;
  }
};

const ViewPurchaseRequestDetailsDialog: React.FC<ViewPurchaseRequestDetailsDialogProps> = ({
  isOpen,
  onClose, // Changed from onOpenChange
  request,
}) => {
  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}> {/* Changed onOpenChange to onClose */}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detail Permintaan Pembelian</DialogTitle>
          <DialogDescription>
            Detail lengkap untuk permintaan pembelian #{request.pr_number || request.item_code}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">No. PR:</p>
            <p>{request.pr_number || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Nama Item:</p>
            <p>{request.item_name}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Kode Item:</p>
            <p>{request.item_code}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Kuantitas:</p>
            <p>{request.quantity} {request.satuan || ''}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Harga Satuan:</p>
            <p>{request.unit_price?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Harga Jual Disarankan:</p>
            <p>{request.suggested_selling_price?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Total Harga:</p>
            <p>{request.total_price?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Supplier:</p>
            <p>{(request as any).supplier_name || "N/A"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Catatan:</p>
            <p>{request.notes || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Status:</p>
            <p>{getStatusDisplay(request.status)}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <p className="font-medium">Tanggal Dibuat:</p>
            <p>{format(new Date(request.created_at), "dd/MM/yyyy HH:mm")}</p>
          </div>
          {request.updated_at && (
            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">Terakhir Diperbarui:</p>
              <p>{format(new Date(request.updated_at), "dd/MM/yyyy HH:mm")}</p>
            </div>
          )}
          {request.document_url && (
            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">Dokumen PO/Inv:</p>
              <a href={request.document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Lihat Dokumen
              </a>
            </div>
          )}
          {request.status === PurchaseRequestStatus.CLOSED && (
            <>
              <h3 className="text-lg font-semibold mt-4 col-span-2">Detail Penerimaan</h3>
              <div className="grid grid-cols-2 gap-2">
                <p className="font-medium">Kuantitas Diterima:</p>
                <p>{request.received_quantity || 0} {request.satuan || ''}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="font-medium">Kuantitas Dikembalikan:</p>
                <p>{request.returned_quantity || 0} {request.satuan || ''}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="font-medium">Kuantitas Rusak:</p>
                <p>{request.damaged_quantity || 0} {request.satuan || ''}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="font-medium">Gudang Target:</p>
                <p>{request.target_warehouse_category || "-"}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="font-medium">Catatan Penerimaan:</p>
                <p>{request.received_notes || "-"}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <p className="font-medium">Tanggal Diterima:</p>
                <p>{request.received_at ? format(new Date(request.received_at), "dd/MM/yyyy HH:mm") : "-"}</p>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPurchaseRequestDetailsDialog;