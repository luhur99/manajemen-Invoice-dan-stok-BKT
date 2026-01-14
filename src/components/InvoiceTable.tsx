"use client";

import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, Edit, Trash, Download } from 'lucide-react';
import { Invoice } from '@/api/invoices';

interface InvoiceTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  error: Error | null;
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  onDownload: (invoice: Invoice) => void;
  deletingId: string | null;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  isLoading,
  error,
  onView,
  onEdit,
  onDelete,
  onDownload,
  deletingId,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Memuat faktur...</span>
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
          <p className="text-destructive">Gagal memuat faktur: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Tidak ada faktur.</p>
        </CardContent>
      </Card>
    );
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'paid':
        return <Badge className="bg-green-500 hover:bg-green-600">Lunas</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500 hover:bg-red-600">Jatuh Tempo</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500 hover:bg-gray-600">Dibatalkan</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Faktur</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomor Faktur</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status Pembayaran</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                  <TableCell>
                    {format(new Date(invoice.invoice_date), 'dd MMM yyyy', { locale: id })}
                  </TableCell>
                  <TableCell>
                    {invoice.due_date 
                      ? format(new Date(invoice.due_date), 'dd MMM yyyy', { locale: id })
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <div>{invoice.customer_name}</div>
                    {invoice.company_name && (
                      <div className="text-sm text-muted-foreground">{invoice.company_name}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    Rp {invoice.total_amount.toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell>{getPaymentStatusBadge(invoice.payment_status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(invoice)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(invoice)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDownload(invoice)}
                        disabled={!invoice.document_url}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(invoice.id)}
                        disabled={deletingId === invoice.id}
                      >
                        {deletingId === invoice.id ? (
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

export default InvoiceTable;