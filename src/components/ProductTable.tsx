"use client";

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Product, WarehouseInventory } from '@/api/stock';
import { Loader2 } from 'lucide-react';

interface ProductWithInventory extends Product {
  inventories: WarehouseInventory[];
}

interface ProductTableProps {
  products: ProductWithInventory[];
  isLoading: boolean;
  error: Error | null;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Memuat produk...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-destructive">
        <p>Error: {error.message}</p>
        <p>Gagal memuat produk. Silakan coba lagi.</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        <p>Belum ada produk yang ditambahkan.</p>
      </div>
    );
  }

  const getStock = (inventories: WarehouseInventory[], category: string) => {
    return inventories.find(inv => inv.warehouse_category === category)?.quantity || 0;
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kode Barang</TableHead>
            <TableHead>Nama Barang</TableHead>
            <TableHead>Satuan</TableHead>
            <TableHead className="text-right">Harga Beli</TableHead>
            <TableHead className="text-right">Harga Jual</TableHead>
            <TableHead className="text-right">Batas Stok Aman</TableHead>
            <TableHead className="text-right">Stok Siap Jual</TableHead>
            <TableHead className="text-right">Stok Riset</TableHead>
            <TableHead className="text-right">Stok Retur</TableHead>
            <TableHead className="text-right">Total Stok</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const stockSiapJual = getStock(product.inventories, 'siap_jual');
            const stockRiset = getStock(product.inventories, 'riset');
            const stockRetur = getStock(product.inventories, 'retur');
            const totalStock = stockSiapJual + stockRiset + stockRetur;

            return (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.kode_barang}</TableCell>
                <TableCell>{product.nama_barang}</TableCell>
                <TableCell>{product.satuan}</TableCell>
                <TableCell className="text-right">Rp {product.harga_beli.toLocaleString('id-ID')}</TableCell>
                <TableCell className="text-right">Rp {product.harga_jual.toLocaleString('id-ID')}</TableCell>
                <TableCell className="text-right">{product.safe_stock_limit}</TableCell>
                <TableCell className="text-right">{stockSiapJual}</TableCell>
                <TableCell className="text-right">{stockRiset}</TableCell>
                <TableCell className="text-right">{stockRetur}</TableCell>
                <TableCell className="text-right font-bold">{totalStock}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTable;