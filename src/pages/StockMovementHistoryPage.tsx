"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError } from '@/utils/toast';
import { fetchStockMovements, StockMovement } from '@/api/stock';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale'; // Import locale for Indonesian formatting

interface StockMovementWithProduct extends StockMovement {
  product_name?: string;
  product_code?: string;
}

const StockMovementHistoryPage: React.FC = () => {
  const { session } = useSession();
  const userId = session?.user?.id;

  const { data: stockMovements, isLoading, error } = useQuery<StockMovementWithProduct[]>({
    queryKey: ['stockMovements', userId],
    queryFn: () => fetchStockMovements(userId!),
    enabled: !!userId,
  });

  React.useEffect(() => {
    if (error) {
      showError(`Gagal memuat riwayat pergerakan stok: ${error.message}`);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Memuat riwayat pergerakan stok...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Riwayat Pergerakan Stok</h1>
      <p className="text-lg text-muted-foreground mb-8">Lihat semua pergerakan stok antar gudang di sini.</p>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pergerakan Stok</CardTitle>
        </CardHeader>
        <CardContent>
          {stockMovements && stockMovements.length > 0 ? (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Kode Barang</TableHead>
                    <TableHead>Nama Barang</TableHead>
                    <TableHead>Dari Gudang</TableHead>
                    <TableHead>Ke Gudang</TableHead>
                    <TableHead className="text-right">Kuantitas</TableHead>
                    <TableHead>Alasan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>{format(new Date(movement.movement_date), 'dd MMMM yyyy', { locale: id })}</TableCell>
                      <TableCell>{movement.product_code}</TableCell>
                      <TableCell>{movement.product_name}</TableCell>
                      <TableCell>{movement.from_category ? movement.from_category.replace('_', ' ').toUpperCase() : 'Penerimaan Awal'}</TableCell>
                      <TableCell>{movement.to_category.replace('_', ' ').toUpperCase()}</TableCell>
                      <TableCell className="text-right">{movement.quantity}</TableCell>
                      <TableCell>{movement.reason || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-4 text-muted-foreground">
              <p>Belum ada riwayat pergerakan stok.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StockMovementHistoryPage;