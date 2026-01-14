"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError } from '@/utils/toast';
import { fetchStockTransactions } from '@/api/stock';
import StockHistoryTable from '@/components/StockHistoryTable';
import { Loader2 } from 'lucide-react';

const StockHistoryPage: React.FC = () => {
  const { session } = useSession();
  const userId = session?.user?.id;

  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['stockTransactions', userId],
    queryFn: () => fetchStockTransactions(userId!),
    enabled: !!userId,
  });

  React.useEffect(() => {
    if (error) {
      showError(`Gagal memuat riwayat stok: ${error.message}`);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Memuat riwayat stok...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Riwayat Stok</h1>
      <p className="text-lg text-muted-foreground mb-8">Lihat semua riwayat transaksi stok Anda di sini.</p>
      
      <StockHistoryTable 
        transactions={transactions || []} 
        isLoading={isLoading} 
        error={error || null} 
      />
    </div>
  );
};

export default StockHistoryPage;