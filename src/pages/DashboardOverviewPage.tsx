"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReceiptText, CalendarDays, Package, ShoppingCart } from "lucide-react";
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
import { Product, WarehouseCategory as WarehouseCategoryType, StockEventType } from "@/types/data"; // Updated imports
import TechnicianScheduleCalendar from "@/components/TechnicianScheduleCalendar";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"; // Import useQuery

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
  const [loading, setLoading] = useState(true);

  const { data: warehouseCategories, isLoading: loadingCategories, error: categoriesError } = useQuery<WarehouseCategoryType[], Error>({
    queryKey: ["warehouseCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warehouse_categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        showError("Gagal memuat kategori gudang.");
        throw error;
      }
      return data;
    },
  });

  const getCategoryDisplayName = (code: string) => {
    const category = warehouseCategories?.find(cat => cat.code === code);
    return category ? category.name : code;
  };

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

        // Fetch Low Stock Items (using safe_stock_limit and aggregated warehouse_inventories)
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select(`
            id,
            safe_stock_limit,
            warehouse_inventories (
              quantity
            )
          `);

        if (productsError) throw productsError;

        let lowStockCount = 0;
        if (productsData) {
          productsData.forEach((item) => {
            const totalStock = item.warehouse_inventories?.reduce((sum: number, inv: { quantity: number }) => sum + inv.quantity, 0) || 0;
            const limit = item.safe_stock_limit !== undefined && item.safe_stock_limit !== null ? item.safe_stock_limit : 10;
            if (totalStock < limit) {
              lowStockCount++;
            }
          });
        }
        setLowStockItems(lowStockCount);

        // Fetch Pending Purchase Requests
        const { count: purchaseRequestsCount, error: purchaseRequestsError } = await supabase
          .from("purchase_requests")
          .select("id", { count: "exact" })
          .eq("status", "pending");

        if (purchaseRequestsError) throw purchaseRequestsError;
        setPendingPurchaseRequests(purchaseRequestsCount || 0);

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

        const { data: recentStockLedgerData, error: recentStockLedgerError } = await supabase
          .from("stock_ledger") // Changed table name
          .select("id, event_type, quantity, notes, created_at, from_warehouse_category, to_warehouse_category, products(nama_barang)") // Updated fields
          .order("created_at", { ascending: false })
          .limit(5);

        if (recentStockLedgerError) throw recentStockLedgerError;

        const { data: recentPurchaseRequestsData, error: recentPurchaseRequestsError } = await supabase
          .from("purchase_requests")
          .select("id, item_name, quantity, status, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        if (recentPurchaseRequestsError) throw recentPurchaseRequestsError;

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

        recentStockLedgerData.forEach(entry => {
          const itemName = entry.products?.[0]?.nama_barang || "Item Tidak Dikenal";
          let desc = "";
          if (entry.event_type === StockEventType.INITIAL) {
            const toCategory = entry.to_warehouse_category ? ` di ${getCategoryDisplayName(entry.to_warehouse_category)}` : "";
            desc = `Stok awal ${entry.quantity} unit untuk ${itemName}${toCategory}`;
          } else if (entry.event_type === StockEventType.IN) {
            const toCategory = entry.to_warehouse_category ? ` di ${getCategoryDisplayName(entry.to_warehouse_category)}` : "";
            desc = `Stok masuk ${entry.quantity} unit untuk ${itemName}${toCategory}`;
          } else if (entry.event_type === StockEventType.OUT) {
            const fromCategory = entry.from_warehouse_category ? ` dari ${getCategoryDisplayName(entry.from_warehouse_category)}` : "";
            desc = `Stok keluar ${entry.quantity} unit dari ${itemName}${fromCategory}`;
          } else if (entry.event_type === StockEventType.TRANSFER) {
            const fromCategory = entry.from_warehouse_category ? getCategoryDisplayName(entry.from_warehouse_category) : "N/A";
            const toCategory = entry.to_warehouse_category ? getCategoryDisplayName(entry.to_warehouse_category) : "N/A";
            desc = `Pindah ${entry.quantity} unit ${itemName} dari ${fromCategory} ke ${toCategory}`;
          } else if (entry.event_type === StockEventType.ADJUSTMENT) {
            const category = (entry.from_warehouse_category || entry.to_warehouse_category) ? ` di ${getCategoryDisplayName(entry.from_warehouse_category || entry.to_warehouse_category || "")}` : "";
            desc = `Penyesuaian stok ${entry.quantity} unit untuk ${itemName}${category}`;
          }
          allActivities.push({
            id: entry.id,
            type: 'stock_ledger', // Updated type
            description: desc,
            date: entry.created_at,
          });
        });

        recentPurchaseRequestsData.forEach(req => {
          allActivities.push({
            id: req.id,
            type: 'purchase_request',
            description: `Pengajuan pembelian ${req.quantity} unit ${req.item_name} (${req.status})`,
            date: req.created_at,
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

        const sortedMonthlyInvoiceData = Object.keys(monthlyCounts)
          .sort((a, b) => parseISO(`01 ${a}`).getTime() - parseISO(`01 ${b}`).getTime())
          .map(month => ({
            month,
            invoices: monthlyCounts[month],
          }));
        
        setMonthlyInvoiceData(sortedMonthlyInvoiceData);

        // Fetch data for monthly stock ledger chart
        const { data: allStockLedgerForChart, error: chartStockLedgerError } = await supabase
          .from("stock_ledger") // Changed table name
          .select("event_type, quantity, created_at")
          .gte("created_at", format(startDate, "yyyy-MM-dd"));

        if (chartStockLedgerError) throw chartStockLedgerError;

        const monthlyStockAggregates: { [key: string]: { stock_in: number; stock_out: number } } = {};
        for (let i = 0; i < 6; i++) {
          const month = format(subMonths(new Date(), i), "MMM yyyy");
          monthlyStockAggregates[month] = { stock_in: 0, stock_out: 0 };
        }

        allStockLedgerForChart.forEach(entry => {
          const month = format(parseISO(entry.created_at), "MMM yyyy");
          if (monthlyStockAggregates[month]) {
            if ([StockEventType.IN, StockEventType.INITIAL, StockEventType.ADJUSTMENT].includes(entry.event_type) && entry.quantity > 0) { // IN, INITIAL, and positive ADJUSTMENT are 'in'
              monthlyStockAggregates[month].stock_in += entry.quantity;
            } else if ([StockEventType.OUT, StockEventType.ADJUSTMENT].includes(entry.event_type) && entry.quantity > 0) { // OUT and negative ADJUSTMENT are 'out'
              monthlyStockAggregates[month].stock_out += entry.quantity;
            } else if (entry.event_type === StockEventType.TRANSFER) {
              // For transfers, count as both in and out for the respective categories, but for overall chart, it's neutral
              // For simplicity in this overview chart, we might not count transfers as net in/out
              // If we want to show gross movement, we could add to both. For now, let's keep it simple.
            }
          }
        });

        const sortedMonthlyStockData = Object.keys(monthlyStockAggregates)
          .sort((a, b) => parseISO(`01 ${a}`).getTime() - parseISO(`01 ${b}`).getTime())
          .map(month => ({
            month,
            ...monthlyStockAggregates[month],
          }));
        
        setMonthlyStockData(sortedMonthlyStockData);

      } catch (error: any) {
        showError(`Gagal memuat data dashboard: ${error.message}`);
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getCategoryDisplayName, categoriesError]); // Added categoriesError to dependencies

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
            {loading ? (
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

        {/* New Card for Monthly Stock Transactions Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pergerakan Stok per Bulan</CardTitle>
            <CardDescription>Total stok masuk dan keluar selama 6 bulan terakhir.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
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

      <TechnicianScheduleCalendar />
    </div>
  );
};

export default DashboardOverviewPage;