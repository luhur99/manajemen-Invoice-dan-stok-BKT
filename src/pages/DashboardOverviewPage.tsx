"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReceiptText, CalendarDays, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { format, parseISO, subMonths, startOfMonth, endOfMonth } from "date-fns";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { StockItem } from "@/types/data"; // Import StockItem type
import TechnicianScheduleCalendar from "@/components/TechnicianScheduleCalendar"; // Import the new component

// Define a type for combined activities
interface LatestActivity {
  id: string;
  type: 'invoice' | 'schedule' | 'stock_transaction';
  description: string;
  date: string; // ISO date string
}

// Define interface for stock transaction data with joined stock_items
interface StockTransactionWithItem {
  id: string;
  transaction_type: string;
  quantity: number;
  notes: string | null;
  created_at: string;
  stock_items: { nama_barang: string }[] | null; // Changed to array of objects or null
}

// Chart configuration
const chartConfig = {
  invoices: {
    label: "Invoices",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

// Define a specific interface for the data fetched for low stock check
interface LowStockCheckItem {
  stock_akhir: number;
  safe_stock_limit: number | null;
}

const DashboardOverviewPage = () => {
  const [pendingInvoices, setPendingInvoices] = useState(0);
  const [todaySchedules, setTodaySchedules] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [latestActivities, setLatestActivities] = useState<LatestActivity[]>([]);
  const [monthlyInvoiceData, setMonthlyInvoiceData] = useState<{ month: string; invoices: number }[]>([]);
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

        // Fetch Low Stock Items (using safe_stock_limit)
        const { data: stockItemsData, error: stockError } = await supabase
          .from("stock_items")
          .select("stock_akhir, safe_stock_limit");

        if (stockError) throw stockError;

        let lowStockCount = 0;
        if (stockItemsData) {
          // Use the specific interface for the fetched data
          stockItemsData.forEach((item: LowStockCheckItem) => {
            const limit = item.safe_stock_limit !== undefined && item.safe_stock_limit !== null ? item.safe_stock_limit : 10; // Default to 10 if limit not set
            if (item.stock_akhir < limit) { // Accessing correct property name
              lowStockCount++;
            }
          });
        }
        setLowStockItems(lowStockCount);

        // Fetch Latest Activities
        const { data: recentInvoices, error: recentInvoicesError } = await supabase
          .from("invoices")
          .select("id, invoice_number, customer_name, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        if (recentInvoicesError) throw recentInvoicesError;

        const { data: recentSchedules, error: recentSchedulesError } = await supabase
          .from("schedules")
          .select("id, customer_name, type, schedule_date, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        if (recentSchedulesError) throw recentSchedulesError;

        const { data: recentStockTransactionsData, error: recentStockTransactionsError } = await supabase
          .from("stock_transactions")
          .select("id, transaction_type, quantity, notes, created_at, stock_items(nama_barang)")
          .order("created_at", { ascending: false })
          .limit(5);

        if (recentStockTransactionsError) throw recentStockTransactionsError;

        // Cast the data to the defined interface
        const recentStockTransactions: StockTransactionWithItem[] = recentStockTransactionsData as StockTransactionWithItem[];

        const allActivities: LatestActivity[] = [];

        recentInvoices.forEach(inv => {
          allActivities.push({
            id: inv.id,
            type: 'invoice',
            description: `Invoice baru #${inv.invoice_number} untuk ${inv.customer_name}`,
            date: inv.created_at,
          });
        });

        recentSchedules.forEach(sch => {
          allActivities.push({
            id: sch.id,
            type: 'schedule',
            description: `Jadwal ${sch.type} untuk ${sch.customer_name} pada ${format(parseISO(sch.schedule_date), 'dd-MM-yyyy')}`,
            date: sch.created_at,
          });
        });

        recentStockTransactions.forEach(trans => {
          // Access the first element of the stock_items array
          const itemName = trans.stock_items?.[0]?.nama_barang || "Item Tidak Dikenal";
          let desc = "";
          if (trans.transaction_type === 'initial') {
            desc = `Stok awal ${trans.quantity} unit untuk ${itemName}`;
          } else if (trans.transaction_type === 'in') {
            desc = `Stok masuk ${trans.quantity} unit untuk ${itemName}`;
          } else if (trans.transaction_type === 'out') {
            desc = `Stok keluar ${trans.quantity} unit dari ${itemName}`;
          }
          allActivities.push({
            id: trans.id,
            type: 'stock_transaction',
            description: desc,
            date: trans.created_at,
          });
        });

        // Sort all activities by date and take the latest 5
        allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setLatestActivities(allActivities.slice(0, 5));

        // Fetch data for monthly invoice chart
        const sixMonthsAgo = subMonths(new Date(), 5); // Start 5 months ago to include current month = 6 months total
        const startDate = startOfMonth(sixMonthsAgo);

        const { data: allInvoicesForChart, error: chartInvoicesError } = await supabase
          .from("invoices")
          .select("created_at")
          .gte("created_at", format(startDate, "yyyy-MM-dd"));

        if (chartInvoicesError) throw chartInvoicesError;

        const monthlyCounts: { [key: string]: number } = {};
        for (let i = 0; i < 6; i++) {
          const month = format(subMonths(new Date(), i), "MMM yyyy");
          monthlyCounts[month] = 0;
        }

        allInvoicesForChart.forEach(invoice => {
          const month = format(parseISO(invoice.created_at), "MMM yyyy");
          if (monthlyCounts[month] !== undefined) {
            monthlyCounts[month]++;
          }
        });

        const sortedMonthlyData = Object.keys(monthlyCounts)
          .sort((a, b) => parseISO(`01 ${a}`).getTime() - parseISO(`01 ${b}`).getTime())
          .map(month => ({
            month,
            invoices: monthlyCounts[month],
          }));
        
        setMonthlyInvoiceData(sortedMonthlyData);

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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Dibuat per Bulan</CardTitle>
            <CardDescription>Jumlah invoice yang dibuat selama 6 bulan terakhir.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
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

        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Lihat ringkasan 5 aktivitas penjualan dan stok terbaru Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
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

      {/* New Technician Schedule Calendar */}
      <TechnicianScheduleCalendar />
    </div>
  );
};

export default DashboardOverviewPage;