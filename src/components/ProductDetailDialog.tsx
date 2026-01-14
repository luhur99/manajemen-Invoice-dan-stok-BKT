"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Product, WarehouseInventory } from '@/api/stock';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface ProductDetailDialogProps {
  product: (Product & { inventories: WarehouseInventory[] }) | null;
  onOpenChange: (open: boolean) => void;
}

const ProductDetailDialog: React.FC<ProductDetailDialogProps> = ({ product, onOpenChange }) => {
  if (!product) {
    return null;
  }

  const getStock = (category: string) => {
    return product.inventories.find(inv => inv.warehouse_category === category)?.quantity || 0;
  };

  const stockSiapJual = getStock('siap_jual');
  const stockRiset = getStock('riset');
  const stockRetur = getStock('retur');
  const totalStock = stockSiapJual + stockRiset + stockRetur;

  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Produk: {product.nama_barang}</DialogTitle>
          <DialogDescription>Informasi lengkap mengenai produk ini.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Kode Barang</p>
            <p className="text-sm font-semibold">{product.kode_barang}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Nama Barang</p>
            <p className="text-sm">{product.nama_barang}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Satuan</p>
            <p className="text-sm">{product.satuan}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Harga Beli</p>
            <p className="text-sm">Rp {product.harga_beli.toLocaleString('id-ID')}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Harga Jual</p>
            <p className="text-sm">Rp {product.harga_jual.toLocaleString('id-ID')}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Batas Stok Aman</p>
            <p className="text-sm">{product.safe_stock_limit}</p>
          </div>

          <Separator className="my-4" />

          <h3 className="text-lg font-semibold mb-2">Inventaris Stok</h3>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Stok Siap Jual</p>
            <p className="text-sm">{stockSiapJual}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Stok Riset</p>
            <p className="text-sm">{stockRiset}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Stok Retur</p>
            <p className="text-sm">{stockRetur}</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Total Stok</p>
            <p className="text-sm font-semibold">{totalStock}</p>
          </div>

          <div className="grid grid-cols-2 items-center gap-4 mt-4">
            <p className="text-sm font-medium text-muted-foreground">Dibuat Pada</p>
            <p className="text-sm">{format(new Date(product.created_at), 'dd MMMM yyyy HH:mm', { locale: id })}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;