"use client";

import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, Edit, Trash } from 'lucide-react';
import { SalesDetail } from '@/api/salesDetails';

interface SalesDetailTableProps {
  salesDetails: SalesDetail[];
  isLoading: boolean;
  error: Error | null;
  onView: (salesDetail: SalesDetail) => void;
  onEdit: (salesDetail: SalesDetail) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

const SalesDetailTable: React.FC<SalesDetailTableProps> = ({
  salesDetails,
  isLoading,
  error,
  onView,
  onEdit,
  onDelete,
  deletingId,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Memuat detail penjualan...</span>
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
          <p className="text-destructive">Gagal memuat detail penjualan: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!salesDetails || salesDetails.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Tidak ada detail penjualan.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Detail Penjualan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>No Transaksi</TableHead>
                <TableHead>No Faktur</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Kirim/Install</TableHead>
                <TableHead className="text-right">Harga</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesDetails.map((detail) => (
                <TableRow key={detail.id}>
                  <TableCell>{detail.no}</TableCell>
                  <TableCell>
                    {format(new Date(detail.tanggal), 'dd MMM yyyy', { locale: id })}
                  </TableCell>
                  <TableCell>{detail.no_transaksi}</TableCell>
                  <TableCell>{detail.invoice_number}</TableCell>
                  <TableCell>{detail.customer}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      detail.kirim_install === 'kirim' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {detail.kirim_install === 'kirim' ? 'Kirim' : 'Install'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {detail.harga ? `Rp ${detail.harga.toLocaleString('id-ID')}` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(detail)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(detail)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(detail.id)}
                        disabled={deletingId === detail.id}
                      >
                        {deletingId === detail.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesDetailTable;