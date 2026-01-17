"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReceiptText, CalendarDays, Package, ShoppingCart, Terminal } from "lucide-react"; // Import Terminal icon
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { format, parseISO, subMonths, startOfMonth, endOfMonth } from "date-fns";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { Product, WarehouseCategory as WarehouseCategoryType, StockEventType, Technician } from "@/types/data"; // Updated imports
import TechnicianScheduleCalendar from "@/components/TechnicianScheduleCalendar";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"; // Import useQuery
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components
import { Button } from "@/components/ui/button"; // Import Button component
import { Loader2 } from "lucide-react"; // Import Loader2 icon

// Define a type for combined activities
interface LatestActivity {
  id: string;
  type: 'invoice' | 'schedule' | 'stock_ledger' | 'purchase_request'; // Updated type
  description: string;
  date: string; // ISO date string
}

// Chart configuration
const chartConfig = {
  invoices: {
    label: "Invoices",
    color: "hsl(var(--primary))",
  },
  stock_in: {
    label: "Stok Masuk",
    color: "hsl(142.1 76.2% 36.3%)", // Green
  },
  stock_out: {
    label: "Stok Keluar",
    color: "hsl(0 84.2% 60.2%)", // Red
  },
} satisfies ChartConfig;

const DashboardOverviewPage = () => {
  const [pendingInvoices, setPendingInvoices] = useState(0);
  const [todaySchedules, setTodaySchedules] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [pendingPurchaseRequests, setPendingPurchaseRequests] = useState(0);
  const [latestActivities, setLatestActivities] = useState<LatestActivity[]>([]);
  const [monthlyInvoiceData, setMonthlyInvoiceData] = useState<{ month: string; invoices: number }[]>([]);
  const [monthlyStockData, setMonthlyStockData] = useState<{ month: string; stock_in: number; stock_out: number }[]>([]);
  const [loadingDashboardData, setLoadingDashboardData] = useState(true); // Renamed loading state
  const [dashboardDataError, setDashboardDataError] = useState<string | null>(null);

  // Fetch dashboard data via Edge Function
  const { data, isLoading: isFetchingDashboardData, error: fetchError, refetch: refetchDashboardData } = useQuery({
    queryKey: ["dashboardOverview"],
    queryFn: async () => {
      setLoadingDashboardData(true);
      setDashboardDataError(null);
      try {
        const { data, error } = await supabase.functions.invoke('get-dashboard-overview');
        if (error) {
          throw error;
        }
        if (data && data.error) {
          throw new Error(data.error);
        }
        return data;
      } catch (err: any) {
        setDashboardDataError(`Gagal memuat data dashboard: ${err.message}`);
        showError(`Gagal memuat data dashboard: ${err.message}`);
        throw err;
      } finally {
        setLoadingDashboardData(false);
      }
    },
  });

  useEffect(() => {
    if (data) {
      setPendingInvoices(data.pendingInvoices);
      setTodaySchedules(data.todaySchedules);
      setLowStockItems(data.lowStockItems);
      setPendingPurchaseRequests(data.pendingPurchaseRequests);
      setLatestActivities(data.latestActivities);
      setMonthlyInvoiceData(data.monthlyInvoiceData);
      setMonthlyStockData(data.monthlyStockData);
    }
  }, [data]);

  // Combined loading state
  const overallLoading = isFetchingDashboardData || loadingDashboardData;
  const overallError = dashboardDataError || fetchError;

  if (overallLoading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Dashboard Budi Karya Teknologi</CardTitle>
          <CardDescription>Memuat data dashboard...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (overallError) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Terjadi Kesalahan!</AlertTitle>
          <AlertDescription>
            {overallError instanceof Error ? overallError.message : overallError}
            <div className="mt-2">
              <Button onClick={() => refetchDashboardData()} disabled={overallLoading}>
                {overallLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Coba Lagi"}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard Budi Karya Teknologi</h1>
      <p className="text-gray-600 dark:text-gray-300">Selamat datang di aplikasi manajemen penjualan dan stok Anda. Berikut adalah ringkasan aktivitas terbaru.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoice Pending</CardTitle>
            <ReceiptText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {overallLoading ? (
              <div className="h-6 w-12 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{pendingInvoices}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {pendingInvoices > 0 ? `${pendingInvoices} invoice menunggu pembayaran` : "Belum ada invoice pending"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jadwal Hari Ini</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {overallLoading ? (
              <div className="h-6 w-12 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{todaySchedules}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {todaySchedules > 0 ? `${todaySchedules} jadwal hari ini` : "Tidak ada jadwal hari ini"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Item Stok Rendah</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {overallLoading ? (
              <div className="h-6 w-12 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{lowStockItems}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {lowStockItems > 0 ? `${lowStockItems} item stok rendah` : "Semua stok aman"}
            </p>
            {lowStockItems > 0 && (
              <Link to="/stock" className="text-sm text-blue-500 hover:underline mt-2 block">
                Lihat Item Stok Rendah
              </Link>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengajuan Pembelian Pending</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {overallLoading ? (
              <div className="h-6 w-12 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{pendingPurchaseRequests}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {pendingPurchaseRequests > 0 ? `${pendingPurchaseRequests} pengajuan menunggu persetujuan` : "Tidak ada pengajuan pembelian pending"}
            </p>
            {pendingPurchaseRequests > 0 && (
              <Link to="/purchase-requests" className="text-sm text-blue-500 hover:underline mt-2 block">
                Lihat Pengajuan
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Dibuat per Bulan</CardTitle>
            <CardDescription>Jumlah invoice yang dibuat selama 6 bulan terakhir.</CardDescription>
          </CardHeader>
          <CardContent>
            {overallLoading ? (
              <div className="h-[300px] w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
            ) : (
              <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                <BarChart accessibilityLayer data={monthlyInvoiceData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="invoices" fill="var(--color-invoices)" radius={4} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* New Card for Monthly Stock Transactions Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pergerakan Stok per Bulan</CardTitle>
            <CardDescription>Total stok masuk dan keluar selama 6 bulan terakhir.</CardDescription>
          </CardHeader>
          <CardContent>
            {overallLoading ? (
              <div className="h-[300px] w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
            ) : (
              <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                <BarChart accessibilityLayer data={monthlyStockData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="stock_in" fill="var(--color-stock_in)" radius={4} />
                  <Bar dataKey="stock_out" fill="var(--color-stock_out)" radius={4} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Lihat ringkasan 5 aktivitas penjualan dan stok terbaru Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            {overallLoading ? (
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ) : latestActivities.length > 0 ? (
              <ul className="space-y-2">
                {latestActivities.map((activity) => (
                  <li key={activity.id} className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span>{activity.description}</span>
                    <span className="text-xs text-muted-foreground">{format(parseISO(activity.date), 'dd MMM yyyy HH:mm')}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">Belum ada aktivitas terbaru.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <TechnicianScheduleCalendar />
    </div>
  );
};

export default DashboardOverviewPage;