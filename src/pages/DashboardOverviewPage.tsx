"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReceiptText, CalendarDays, Package, ShoppingCart, Terminal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import TechnicianScheduleCalendar from "@/components/TechnicianScheduleCalendar";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSession } from "@/components/SessionContextProvider";

// Define a type for combined activities
interface LatestActivity {
  id: string;
  type: 'invoice' | 'schedule' | 'stock_ledger' | 'purchase_request';
  description: string;
  date: string; // ISO date string
}

// Chart configuration (kept for potential future use or other charts, but not used for monthly summaries anymore)
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
  const { session } = useSession();

  // Fetch dashboard data via Edge Function
  const { 
    data, 
    isLoading: isFetchingDashboardData, 
    error: fetchError, 
    refetch: refetchDashboardData 
  } = useQuery({
    queryKey: ["dashboardOverview"],
    queryFn: async ({ signal }) => { // Destructure signal from queryFn context
      try {
        // Pass the signal to the invoke call if supported by supabase-js version
        // As of supabase-js@2.45.0, invoke does not directly accept a signal.
        // The AbortError is likely from React Query's internal cancellation.
        const { data, error } = await supabase.functions.invoke('get-dashboard-overview');
        if (error) {
          throw error;
        }
        if (data && data.error) {
          throw new Error(data.error);
        }
        return data;
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // This is an expected error when the query is cancelled.
          // React Query handles this, but we can explicitly log it if needed.
          console.warn('Dashboard overview fetch aborted:', err.message);
          throw err; // Re-throw so React Query can handle it
        }
        throw err; // Re-throw other errors
      }
    },
    enabled: !!session, // Only fetch when session is available!
    retry: 1, // Limit retries to 1 attempt
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Cache data for 10 minutes
  });

  // Extract data with default values
  const pendingInvoices = data?.pendingInvoices || 0;
  const todaySchedules = data?.todaySchedules || 0;
  const lowStockItems = data?.lowStockItems || 0;
  const pendingPurchaseRequests = data?.pendingPurchaseRequests || 0;
  const latestActivities: LatestActivity[] = data?.latestActivities || [];
  // New data points for monthly summaries
  const totalInvoicesThisMonth = data?.totalInvoicesThisMonth || 0;
  const totalStockInThisMonth = data?.totalStockInThisMonth || 0;
  const totalStockOutThisMonth = data?.totalStockOutThisMonth || 0;

  // Show loading state while checking session
  if (!session) {
     return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Dashboard</CardTitle>
          <CardDescription>Memeriksa sesi...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (isFetchingDashboardData) {
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

  if (fetchError) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Gagal Memuat Dashboard</AlertTitle>
          <AlertDescription>
            {fetchError instanceof Error ? fetchError.message : "Terjadi kesalahan saat memuat data."}
            <div className="mt-2">
              <Button onClick={() => refetchDashboardData()} disabled={isFetchingDashboardData}>
                {isFetchingDashboardData ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Coba Lagi"}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
        {/* Render Calendar anyway so the page isn't empty */}
        <TechnicianScheduleCalendar />
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
            <div className="text-2xl font-bold">{pendingInvoices}</div>
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
            <div className="text-2xl font-bold">{todaySchedules}</div>
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
            <div className="text-2xl font-bold">{lowStockItems}</div>
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
            <div className="text-2xl font-bold">{pendingPurchaseRequests}</div>
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

      {/* New section for monthly summaries */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"> {/* Adjusted grid for 3 cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoice Bulan Ini</CardTitle>
            <ReceiptText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoicesThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Invoice dibuat bulan ini
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok Masuk Bulan Ini</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStockInThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Total kuantitas stok masuk
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok Keluar Bulan Ini</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStockOutThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Total kuantitas stok keluar
            </p>
          </CardContent>
        </Card>
      </div>

      <Card> {/* This card is now a direct child of the main space-y-6 div */}
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
          <CardDescription>Lihat ringkasan 5 aktivitas penjualan dan stok terbaru Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          {latestActivities.length > 0 ? (
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

      <TechnicianScheduleCalendar />
    </div>
  );
};

export default DashboardOverviewPage;