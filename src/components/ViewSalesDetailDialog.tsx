"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SalesDetail } from "@/types/data";
import { formatDateSafely } from "@/lib/utils"; // Import formatDateSafely

interface ViewSalesDetailDialogProps {
  salesDetail: SalesDetail;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewSalesDetailDialog: React.FC<ViewSalesDetailDialogProps> = ({
  salesDetail,
  isOpen,
  onOpenChange,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Penjualan: {salesDetail.no_transaksi}</DialogTitle>
          <DialogDescription>Informasi lengkap mengenai detail penjualan ini.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <p><strong>No:</strong> {salesDetail.no}</p>
            <p><strong>Kirim/Install:</strong> {salesDetail.kirim_install}</p>
            <p><strong>No. Transaksi:</strong> {salesDetail.no_transaksi}</p>
            <p><strong>No. Invoice:</strong> {salesDetail.invoice_number}</p>
            <p><strong>Baru/Lama:</strong> {salesDetail.new_old || "-"}</p>
            <p><strong>Perusahaan:</strong> {salesDetail.perusahaan || "-"}</p>
            <p><strong>Tanggal:</strong> {formatDateSafely(salesDetail.tanggal, "dd-MM-yyyy")}</p>
            <p><strong>Hari:</strong> {salesDetail.hari || "-"}</p>
            <p><strong>Jam:</strong> {salesDetail.jam || "-"}</p>
            <p><strong>Pelanggan:</strong> {salesDetail.customer}</p>
            <p><strong>Alamat Install:</strong> {salesDetail.alamat_install || "-"}</p>
            <p><strong>No. HP:</strong> {salesDetail.no_hp || "-"}</p>
            <p><strong>Tipe:</strong> {salesDetail.type || "-"}</p>
            <p><strong>Qty Unit:</strong> {salesDetail.qty_unit || 0}</p>
            <p><strong>Stok:</strong> {salesDetail.stock || 0}</p>
            <p><strong>Harga:</strong> Rp {salesDetail.harga?.toLocaleString('id-ID') || 0}</p>
            <p><strong>Web:</strong> {salesDetail.web || "-"}</p>
            <p><strong>Qty Web:</strong> {salesDetail.qty_web || 0}</p>
            <p><strong>Kartu:</strong> {salesDetail.kartu || "-"}</p>
            <p><strong>Qty Kartu:</strong> {salesDetail.qty_kartu || 0}</p>
            <p><strong>Paket:</strong> {salesDetail.paket || "-"}</p>
            <p><strong>Pulsa:</strong> Rp {salesDetail.pulsa?.toLocaleString('id-ID') || 0}</p>
            <p><strong>Teknisi:</strong> {salesDetail.teknisi || "-"}</p>
            <p><strong>Pembayaran:</strong> {salesDetail.payment || "-"}</p>
          </div>
          <p><strong>Catatan:</strong> {salesDetail.catatan || "-"}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSalesDetailDialog;