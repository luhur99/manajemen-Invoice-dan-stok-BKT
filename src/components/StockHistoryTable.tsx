"use client";

import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { StockTransaction } from '@/api/stock';

interface StockHistoryTableProps {
  transactions: StockTransaction[];
  isLoading: boolean;
  error: Error | null;
}

const StockHistoryTable: React.FC<StockHistoryTableProps> = ({ transactions, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Memuat riwayat transaksi stok...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Gagal memuat riwayat transaksi: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Tidak ada riwayat transaksi stok.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Transaksi Stok</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Kode Barang</TableHead>
                <TableHead>Nama Barang</TableHead>
                <TableHead>Jenis Transaksi</TableHead>
                <TableHead className="text-right">Kuantitas</TableHead>
                <TableHead>Catatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {format(new Date(transaction.transaction_date), 'dd MMM yyyy', { locale: id })}
                  </TableCell>
                  <TableCell>{transaction.product?.kode_barang || '-'}</TableCell>
                  <TableCell>{transaction.product?.nama_barang || '-'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.transaction_type === 'in' 
                        ? 'bg-green-100 text-green-800' 
                        : transaction.transaction_type === 'out' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {transaction.transaction_type === 'in' 
                        ? 'Masuk' 
                        : transaction.transaction_type === 'out' 
                          ? 'Keluar' 
                          : transaction.transaction_type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction.quantity > 0 ? `+${transaction.quantity}` : transaction.quantity}
                  </TableCell>
                  <TableCell>{transaction.notes || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockHistoryTable;