import React from "react";
import { DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatDateSafely } from "@/lib/utils"; // Import formatDateSafely

export const ViewProductDetailsDialog = ({ product }) => {
  if (!product) {
    return <DialogDescription>Tidak ada data produk yang dipilih.</DialogDescription>;
  }

  const stockPerWarehouse = product.warehouse_inventories
    ?.map((inv) => `${inv.warehouse_category}: ${inv.quantity}`)
    .join(", ");

  return (
    <div className="space-y-4">
      <DialogDescription>Detail lengkap untuk produk ini.</DialogDescription>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Kode Barang</p>
          <p className="text-base font-semibold">{product.kode_barang}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Nama Barang</p>
          <p className="text-base font-semibold">{product.nama_barang}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Satuan</p>
          <p className="text-base">{product.satuan || "-"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Harga Beli</p>
          <p className="text-base">Rp {product.harga_beli?.toLocaleString("id-ID")}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Harga Jual</p>
          <p className="text-base">Rp {product.harga_jual?.toLocaleString("id-ID")}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Batas Stok Aman</p>
          <p className="text-base">{product.safe_stock_limit || 0}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Supplier</p>
          <p className="text-base">{product.suppliers?.name || "-"}</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm font-medium text-gray-500">Stok per Gudang</p>
          <p className="text-base">{stockPerWarehouse || "Tidak ada data stok"}</p>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Dibuat Pada</p>
          <p className="text-base">
            {formatDateSafely(product.created_at, "dd MMMM yyyy, HH:mm")}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Diperbarui Pada</p>
          <p className="text-base">
            {formatDateSafely(product.updated_at, "dd MMMM yyyy, HH:mm")}
          </p>
        </div>
      </div>
    </div>
  );
};