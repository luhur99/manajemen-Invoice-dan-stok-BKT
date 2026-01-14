"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError } from '@/utils/toast';
import { Loader2 } from 'lucide-react';
import {
  fetchTotalInvoices,
  fetchScheduledSchedules, // Updated to fetchScheduledSchedules
  fetchTotalStockItems,
  fetchPendingPurchaseRequests,
  fetchPendingDeliveryOrders,
  fetchPendingSchedulingRequests, // New API call
  fetchApprovedSchedulingRequests, // New API call
} from '@/api/dashboard';
import { fetchInvoices, Invoice } from '@/api/invoices';
import InvoiceAmountChart from '@/components/InvoiceAmountChart';
import { format } from 'date-fns';

const DashboardOverviewPage: React.FC = () => {
  const { session } = useSession();
  const userId = session?.user?.id;

  // Queries untuk data dashboard
  const { data: totalInvoices, isLoading: isLoadingInvoices, error: errorInvoices } = useQuery({
    queryKey: ['dashboardTotalInvoices', userId],
    queryFn: () => fetchTotalInvoices(userId!),
    enabled: !!userId,
  });

  const { data: scheduledSchedules, isLoading: isLoadingScheduledSchedules, error: errorScheduledSchedules } = useQuery({
    queryKey: ['dashboardScheduledSchedules', userId],
    queryFn: () => fetchScheduledSchedules(userId!),
    enabled: !!userId,
  });

  const { data: totalStockItems, isLoading: isLoadingStock, error: errorStock } = useQuery({
    queryKey: ['dashboardTotalStockItems', userId],
    queryFn: () => fetchTotalStockItems(userId!),
    enabled: !!userId,
  });

  const { data: pendingPurchaseRequests, isLoading: isLoadingPurchaseRequests, error: errorPurchaseRequests } = useQuery({
    queryKey: ['dashboardPendingPurchaseRequests', userId],
    queryFn: () => fetchPendingPurchaseRequests(userId!),
    enabled: !!userId,
  });

  const { data: pendingDeliveryOrders, isLoading: isLoadingDeliveryOrders, error: errorDeliveryOrders } = useQuery({
    queryKey: ['dashboardPendingDeliveryOrders', userId],
    queryFn: () => fetchPendingDeliveryOrders(userId!),
    enabled: !!userId,
  });

  // New queries for scheduling requests
  const { data: pendingSchedulingRequests, isLoading: isLoadingPendingSchedulingRequests, error: errorPendingSchedulingRequests } = useQuery({
    queryKey: ['dashboardPendingSchedulingRequests', userId],
    queryFn: () => fetchPendingSchedulingRequests(userId!),
    enabled: !!userId,
  });

  const { data: approvedSchedulingRequests, isLoading: isLoadingApprovedSchedulingRequests, error: errorApprovedSchedulingRequests } = useQuery({
    queryKey: ['dashboardApprovedSchedulingRequests', userId],
    queryFn: () => fetchApprovedSchedulingRequests(userId!),
    enabled: !!userId,
  });

  // Query untuk data faktur yang lebih detail untuk grafik
  const { data: invoicesForChart, isLoading: isLoadingInvoicesForChart, error: errorInvoicesForChart } = useQuery<Invoice[]>({
    queryKey: ['invoicesForChart', userId],
    queryFn: () => fetchInvoices(userId!),
    enabled: !!userId,
  });

  // Proses data faktur untuk grafik
  const chartData = React.useMemo(() => {
    if (!invoicesForChart) return [];

    const monthlyData: { [key: string]: number } = {};

    invoicesForChart.forEach(invoice => {
      const monthYear = format(new Date(invoice.invoice_date), 'yyyy-MM'); // Group by year-month
      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + invoice.total_amount;
    });

    return Object.keys(monthlyData).map(date => ({
      date,
      totalAmount: monthlyData[date],
    }));
  }, [invoicesForChart]);

  // Tangani kesalahan dengan toast
  React.useEffect(() => {
    if (errorInvoices) showError(`Gagal memuat total faktur: ${errorInvoices.message}`);
    if (errorScheduledSchedules) showError(`Gagal memuat jadwal tertunda: ${errorScheduledSchedules.message}`);
    if (errorStock) showError(`Gagal memuat total stok: ${errorStock.message}`);
    if (errorPurchaseRequests) showError(`Gagal memuat permintaan pembelian tertunda: ${errorPurchaseRequests.message}`);
    if (errorDeliveryOrders) showError(`Gagal memuat pesanan pengiriman tertunda: ${errorDeliveryOrders.message}`);
    if (errorPendingSchedulingRequests) showError(`Gagal memuat permintaan penjadwalan tertunda: ${errorPendingSchedulingRequests.message}`);
    if (errorApprovedSchedulingRequests) showError(`Gagal memuat permintaan penjadwalan disetujui: ${errorApprovedSchedulingRequests.message}`);
    if (errorInvoicesForChart) showError(`Gagal memuat data faktur untuk grafik: ${errorInvoicesForChart.message}`);
  }, [
    errorInvoices,
    errorScheduledSchedules,
    errorStock,
    errorPurchaseRequests,
    errorDeliveryOrders,
    errorPendingSchedulingRequests,
    errorApprovedSchedulingRequests,
    errorInvoicesForChart
  ]);

  const isLoadingAny =
    isLoadingInvoices ||
    isLoadingScheduledSchedules ||
    isLoadingStock ||
    isLoadingPurchaseRequests ||
    isLoadingDeliveryOrders ||
    isLoadingPendingSchedulingRequests ||
    isLoadingApprovedSchedulingRequests ||
    isLoadingInvoicesForChart;

  if (isLoadingAny) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Memuat data dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Faktur</h2>
          <p className="text-3xl font-bold text-primary">{totalInvoices ?? 0}</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Jadwal Dijadwalkan</h2>
          <p className="text-3xl font-bold text-yellow-600">{scheduledSchedules ?? 0}</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Item Stok</h2>
          <p className="text-3xl font-bold text-green-600">{totalStockItems ?? 0}</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Permintaan Pembelian Pending</h2>
          <p className="text-3xl font-bold text-orange-600">{pendingPurchaseRequests ?? 0}</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Pesanan Pengiriman Pending</h2>
          <p className="text-3xl font-bold text-blue-600">{pendingDeliveryOrders ?? 0}</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Permintaan Penjadwalan Pending</h2>
          <p className="text-3xl font-bold text-purple-600">{pendingSchedulingRequests ?? 0}</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Permintaan Penjadwalan Disetujui</h2>
          <p className="text-3xl font-bold text-teal-600">{approvedSchedulingRequests ?? 0}</p>
        </div>
      </div>
      
      <div className="mt-8">
        <InvoiceAmountChart data={chartData} />
      </div>

      <div className="mt-8 bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Aktivitas Terbaru</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>Invoice #INV-2023-001 created. (Placeholder)</li>
          <li>Schedule for Customer A updated. (Placeholder)</li>
          <li>New stock item added: Product X. (Placeholder)</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;