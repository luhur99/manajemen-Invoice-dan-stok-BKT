"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PurchaseRequestWithDetails, PurchaseRequestStatus, WarehouseCategory } from "@/types/data";
import { format } from "date-fns";

interface ViewPurchaseRequestDetailsDialogProps {
  purchaseRequest: PurchaseRequestWithDetails;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusDisplay = (status: PurchaseRequestStatus) => {
  switch (status) {
    case PurchaseRequestStatus.PENDING: return "Pending";
    case PurchaseRequestStatus.APPROVED: return "Disetujui";
    case PurchaseRequestStatus.REJECTED: return "Ditolak";
    case PurchaseRequestStatus.WAITING_FOR_RECEIPT: return "Menunggu Resi";
    case PurchaseRequestStatus.CLOSED: return "Ditutup";
    default: return status;
  }
};

const getCategoryDisplay = (category?: WarehouseCategory) => {
  switch (category) {
    case WarehouseCategory.SIAP_JUAL: return "Siap Jual";
    case WarehouseCategory.RISET: return "Riset";
    case WarehouseCategory.RETUR: return "Retur";
    case WarehouseCategory.BACKUP_TEKNISI: return "Backup Teknisi";
    default: return "-";
  }
};

const ViewPurchaseRequestDetailsDialog: React.FC<ViewPurchaseRequestDetailsDialogProps> = ({
  purchaseRequest,
  isOpen,
  onOpenChange,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Permintaan Pembelian: {purchaseRequest.item_name}</DialogTitle>
          <DialogDescription>Informasi lengkap mengenai permintaan pembelian ini.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Nama Item:</strong> {purchaseRequest.item_name}</p>
            <p><strong>Kode Item:</strong> {purchaseRequest.item_code}</p>
            <p><strong>Satuan:</strong> {purchaseRequest.satuan || "-"}</p>
            <p><strong>Kuantitas:</strong> {purchaseRequest.quantity}</p>
            <p><strong>Harga Beli/Unit:</strong> Rp {purchaseRequest.unit_price.toLocaleString('id-ID')}</p>
            <p><strong>Harga Jual Disarankan/Unit:</strong> Rp {purchaseRequest.suggested_selling_price.toLocaleString('id-ID')}</p>
            <p><strong>Total Harga:</strong> Rp {purchaseRequest.total_price.toLocaleString('id-ID')}</p>
            <p><strong>Pemasok:</strong> {purchaseRequest.supplier_name || "-"}</p>
            <p><strong>Kategori Gudang Tujuan:</strong> {purchaseRequest.target_warehouse_category ? getCategoryDisplay(purchaseRequest.target_warehouse_category) : "-"}</p>
            <p><strong>Status:</strong> {getStatusDisplay(purchaseRequest.status)}</p>
            <p><strong>Tanggal Pengajuan:</strong> {format(new Date(purchaseRequest.created_at), "dd-MM-yyyy HH:mm")}</p>
            {purchaseRequest.received_quantity !== undefined && <p><strong>Kuantitas Diterima:</strong> {purchaseRequest.received_quantity}</p>}
            {purchaseRequest.returned_quantity !== undefined && <p><strong>Kuantitas Dikembalikan:</strong> {purchaseRequest.returned_quantity}</p>}
            {purchaseRequest.damaged_quantity !== undefined && <p><strong>Kuantitas Rusak:</strong> {purchaseRequest.damaged_quantity}</p>}
            {purchaseRequest.received_at && <p><strong>Diterima Pada:</strong> {format(new Date(purchaseRequest.received_at), "dd-MM-yyyy HH:mm")}</p>}
          </div>
          <p><strong>Catatan:</strong> {purchaseRequest.notes || "-"}</p>
          {purchaseRequest.received_notes && <p><strong>Catatan Penerimaan:</strong> {purchaseRequest.received_notes}</p>}
          {purchaseRequest.document_url && (
            <p>
              <strong>Dokumen Resi:</strong>{" "}
              <a href={purchaseRequest.document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Lihat Dokumen
              </a>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPurchaseRequestDetailsDialog;