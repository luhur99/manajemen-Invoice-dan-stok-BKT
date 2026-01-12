"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReceiptText, CalendarDays, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { format } from "date-fns";

const DashboardOverviewPage = () => {
  const [pendingInvoices, setPendingInvoices] = useState(0);
  const [todaySchedules, setTodaySchedules] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Pending Invoices
        const { count: invoicesCount, error: invoicesError } = await supabase
          .from("invoices")
          .select("id", { count: "exact" })
          .eq("payment_status", "pending");

        if (invoicesError) throw invoicesError;
        setPendingInvoices(invoicesCount || 0);

        // Fetch Today's Schedules
        const today = format(new Date(), "yyyy-MM-dd");
        const { count: schedulesCount, error: schedulesError } = await supabase
          .from("schedules")
          .select("id", { count: "exact" })
          .eq("schedule_date", today);

        if (schedulesError) throw schedulesError;
        setTodaySchedules(schedulesCount || 0);

        // Fetch Low Stock Items (e.g., stock_akhir < 10)
        const { count: stockCount, error: stockError } = await supabase
          .from("stock_items")
          .select("id", { count: "exact" })
          .lt("stock_akhir", 10); // Assuming 'low stock' means less than 10 items

        if (stockError) throw stockError;
        setLowStockItems(stockCount || 0);

      } catch (error: any) {
        showError(`Gagal memuat data dashboard: ${error.message}`);
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard Budi Karya Teknologi</h1>
      <p className="text-gray-600 dark:text-gray-300">Selamat datang di aplikasi manajemen penjualan dan stok Anda. Berikut adalah ringkasan aktivitas terbaru.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoice Pending</CardTitle>
            <ReceiptText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
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
            {loading ? (
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
            {loading ? (
              <div className="h-6 w-12 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{lowStockItems}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {lowStockItems > 0 ? `${lowStockItems} item stok rendah` : "Semua stok aman"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
          <CardDescription>Lihat ringkasan aktivitas penjualan dan stok Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">Belum ada aktivitas terbaru.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverviewPage;