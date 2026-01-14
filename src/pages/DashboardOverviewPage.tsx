"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError } from '@/utils/toast';
import { Loader2 } from 'lucide-react';
import {
  fetchTotalInvoices,
  fetchPendingSchedules,
  fetchTotalStockItems,
  fetchPendingPurchaseRequests,
  fetchPendingDeliveryOrders,
} from '@/api/dashboard';
import { fetchInvoices, Invoice } from '@/api/invoices'; // Import fetchInvoices
import InvoiceAmountChart from '@/components/InvoiceAmountChart'; // Import the new chart component
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

  const { data: pendingSchedules, isLoading: isLoadingSchedules, error: errorSchedules } = useQuery({
    queryKey: ['dashboardPendingSchedules', userId],
    queryFn: () => fetchPendingSchedules(userId!),
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
    if (errorSchedules) showError(`Gagal memuat jadwal tertunda: ${errorSchedules.message}`);
    if (errorStock) showError(`Gagal memuat total stok: ${errorStock.message}`);
    if (errorPurchaseRequests) showError(`Gagal memuat permintaan pembelian tertunda: ${errorPurchaseRequests.message}`);
    if (errorDeliveryOrders) showError(`Gagal memuat pesanan pengiriman tertunda: ${errorDeliveryOrders.message}`);
    if (errorInvoicesForChart) showError(`Gagal memuat data faktur untuk grafik: ${errorInvoicesForChart.message}`);
  }, [errorInvoices, errorSchedules, errorStock, errorPurchaseRequests, errorDeliveryOrders, errorInvoicesForChart]);

  const isLoadingAny = isLoadingInvoices || isLoadingSchedules || isLoadingStock || isLoadingPurchaseRequests || isLoadingDeliveryOrders || isLoadingInvoicesForChart;

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
          <h2 className="text-xl font-semibold mb-2">Total Invoices</h2>
          <p className="text-3xl font-bold text-primary">{totalInvoices ?? 0}</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Pending Schedules</h2>
          <p className="text-3xl font-bold text-yellow-600">{pendingSchedules ?? 0}</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Stock Items</h2>
          <p className="text-3xl font-bold text-green-600">{totalStockItems ?? 0}</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Pending Purchase Requests</h2>
          <p className="text-3xl font-bold text-orange-600">{pendingPurchaseRequests ?? 0}</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Pending Delivery Orders</h2>
          <p className="text-3xl font-bold text-blue-600">{pendingDeliveryOrders ?? 0}</p>
        </div>
      </div>
      
      <div className="mt-8">
        <InvoiceAmountChart data={chartData} />
      </div>

      <div className="mt-8 bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
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