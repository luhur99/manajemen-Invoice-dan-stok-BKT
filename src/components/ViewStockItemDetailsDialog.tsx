"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product, StockLedgerWithProduct, WarehouseInventory, WarehouseCategory as WarehouseCategoryType, StockEventType } from "@/types/data"; // Updated imports
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ViewStockItemDetailsDialogProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const getEventTypeDisplayName = (type: StockEventType) => {
  switch (type) {
    case StockEventType.INITIAL: return "Stok Awal"; // Corrected
    case StockEventType.IN: return "Masuk";
    case StockEventType.OUT: return "Keluar";
    case StockEventType.TRANSFER: return "Transfer";
    case StockEventType.ADJUSTMENT: return "Penyesuaian";
    default: return "Tidak Diketahui";
  }
};

const getEventTypeBadgeClass = (type: StockEventType) => {
  switch (type) {
    case StockEventType.INITIAL:
    case StockEventType.IN:
      return "bg-green-100 text-green-800";
    case StockEventType.OUT:
      return "bg-red-100 text-red-800";
    case StockEventType.TRANSFER:
      return "bg-blue-100 text-blue-800";
    case StockEventType.ADJUSTMENT:
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ViewStockItemDetailsDialog: React.FC<ViewStockItemDetailsDialogProps> = ({
  product,
  isOpen,
  onOpenChange,
}) => {
  const { data: inventories, isLoading: loadingInventories } = useQuery<WarehouseInventory[], Error>({
    queryKey: ["warehouseInventories", product.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warehouse_inventories")
        .select(`*, warehouse_categories(name)`)
        .eq("product_id", product.id);
      if (error) throw error;
      return data as WarehouseInventory[];
    },
    enabled: isOpen,
  });

  const { data: stockLedger, isLoading: loadingStockLedger } = useQuery<StockLedgerWithProduct[], Error>({
    queryKey: ["stockLedger", product.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock_ledger")
        .select(`*, products(nama_barang, kode_barang)`)
        .eq("product_id", product.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as StockLedgerWithProduct[];
    },
    enabled: isOpen,
  });

  const totalStock = inventories?.reduce((sum, inv) => sum + inv.quantity, 0) || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Item Stok: {product.nama_barang}</DialogTitle>
          <DialogDescription>Informasi lengkap mengenai item stok ini.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Kode Barang:</strong> {product.kode_barang}</p>
              <p><strong>Nama Barang:</strong> {product.nama_barang}</p>
              <p><strong>Satuan:</strong> {product.satuan || "-"}</p>
              <p><strong>Harga Beli:</strong> Rp {product.harga_beli.toLocaleString('id-ID')}</p>
              <p><strong>Harga Jual:</strong> Rp {product.harga_jual.toLocaleString('id-ID')}</p>
              <p><strong>Batas Stok Aman:</strong> {product.safe_stock_limit || 0}</p>
              <p><strong>Supplier ID:</strong> {product.supplier_id || "-"}</p>
              <p><strong>Dibuat Pada:</strong> {product.created_at ? format(parseISO(product.created_at), "dd MMMM yyyy HH:mm") : "-"}</p>
              <p><strong>Diperbarui Pada:</strong> {product.updated_at ? format(parseISO(product.updated_at), "dd MMMM yyyy HH:mm") : "-"}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Inventaris Gudang</h3>
              {loadingInventories ? (
                <div className="flex justify-center items-center h-20">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : inventories && inventories.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kategori Gudang</TableHead>
                        <TableHead className="text-right">Kuantitas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventories.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell>{(inv.warehouse_categories as WarehouseCategoryType)?.name || inv.warehouse_category}</TableCell>
                          <TableCell className="text-right">{inv.quantity}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold">
                        <TableCell>Total Stok</TableCell>
                        <TableCell className="text-right">{totalStock}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p>Tidak ada inventaris untuk item ini.</p>
              )}
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-4 mb-2">Riwayat Stok</h3>
          {loadingStockLedger ? (
            <div className="flex justify-center items-center h-20">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : stockLedger && stockLedger.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Tipe Event</TableHead>
                    <TableHead>Kuantitas</TableHead>
                    <TableHead>Dari Gudang</TableHead>
                    <TableHead>Ke Gudang</TableHead>
                    <TableHead>Catatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockLedger.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.event_date ? format(parseISO(entry.event_date), "dd/MM/yyyy") : "-"}</TableCell>
                      <TableCell>
                        <Badge className={getEventTypeBadgeClass(entry.event_type)}>
                          {getEventTypeDisplayName(entry.event_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>{entry.quantity}</TableCell>
                      <TableCell>{entry.from_warehouse_category || "-"}</TableCell>
                      <TableCell>{entry.to_warehouse_category || "-"}</TableCell>
                      <TableCell>{entry.notes || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>Tidak ada riwayat stok untuk item ini.</p>
          )}
        </div>
        <Button onClick={() => onOpenChange(false)} className="mt-4">Tutup</Button>
      </DialogContent>
    </Dialog>
  );
};

export default ViewStockItemDetailsDialog;