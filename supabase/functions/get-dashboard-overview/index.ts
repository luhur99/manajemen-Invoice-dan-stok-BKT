// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { format, parseISO, subMonths, startOfMonth } from 'https://esm.sh/date-fns@2.30.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key for admin operations
    const supabaseAdminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use service role key
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Create a Supabase client with the user's JWT for RLS checks
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userSupabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verify if the requesting user is an admin or staff
    const { data: { user }, error: userError } = await userSupabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid user session' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: profileData, error: profileError } = await userSupabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || (profileData?.role !== 'admin' && profileData?.role !== 'staff')) {
      return new Response(JSON.stringify({ error: 'Forbidden: Only administrators and staff can view dashboard overview' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // --- Fetch Dashboard Data using Service Role Key (bypassing RLS) ---

    // Fetch Pending Invoices
    const { count: invoicesCount, error: invoicesError } = await supabaseAdminClient
      .from("invoices")
      .select("id", { count: "exact" })
      .eq("payment_status", "pending");
    if (invoicesError) throw invoicesError;

    // Fetch Today's Schedules
    const today = format(new Date(), "yyyy-MM-dd");
    const { count: schedulesCount, error: schedulesError } = await supabaseAdminClient
      .from("schedules")
      .select("id", { count: "exact" })
      .eq("schedule_date", today);
    if (schedulesError) throw schedulesError;

    // Fetch Low Stock Items
    const { data: productsData, error: productsError } = await supabaseAdminClient
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
        const totalStock = item.warehouse_inventories?.reduce((sum, inv) => sum + inv.quantity, 0) || 0;
        const limit = item.safe_stock_limit !== undefined && item.safe_stock_limit !== null ? item.safe_stock_limit : 10;
        if (totalStock < limit) {
          lowStockCount++;
        }
      });
    }

    // Fetch Pending Purchase Requests
    const { count: purchaseRequestsCount, error: purchaseRequestsError } = await supabaseAdminClient
      .from("purchase_requests")
      .select("id", { count: "exact" })
      .eq("status", "pending");
    if (purchaseRequestsError) throw purchaseRequestsError;

    // Fetch Latest Activities
    const { data: recentInvoices, error: recentInvoicesError } = await supabaseAdminClient
      .from("invoices")
      .select("id, invoice_number, customer_name, created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    if (recentInvoicesError) throw recentInvoicesError;

    const { data: recentSchedules, error: recentSchedulesError } = await supabaseAdminClient
      .from("schedules")
      .select("id, customer_name, type, schedule_date, created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    if (recentSchedulesError) throw recentSchedulesError;

    const { data: recentStockLedgerData, error: recentStockLedgerError } = await supabaseAdminClient
      .from("stock_ledger")
      .select("id, event_type, quantity, notes, created_at, from_warehouse_category, to_warehouse_category, products(nama_barang)")
      .order("created_at", { ascending: false })
      .limit(5);
    if (recentStockLedgerError) throw recentStockLedgerError;

    const { data: recentPurchaseRequestsData, error: recentPurchaseRequestsError } = await supabaseAdminClient
      .from("purchase_requests")
      .select("id, item_name, quantity, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    if (recentPurchaseRequestsError) throw recentPurchaseRequestsError;

    // Fetch warehouse categories for display names
    const { data: warehouseCategories, error: categoriesError } = await supabaseAdminClient
      .from("warehouse_categories")
      .select("code, name");
    if (categoriesError) throw categoriesError;
    const categoryMap = new Map(warehouseCategories.map(cat => [cat.code, cat.name]));
    const getCategoryDisplayName = (code: string) => categoryMap.get(code) || code;

    const allActivities = [];
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
      if (['initial', 'in'].includes(entry.event_type) && entry.quantity > 0) {
        const toCategory = entry.to_warehouse_category ? ` di ${getCategoryDisplayName(entry.to_warehouse_category)}` : "";
        desc = `Stok masuk ${entry.quantity} unit untuk ${itemName}${toCategory}`;
      } else if (entry.event_type === 'out' && entry.quantity > 0) {
        const fromCategory = entry.from_warehouse_category ? ` dari ${getCategoryDisplayName(entry.from_warehouse_category)}` : "";
        desc = `Stok keluar ${entry.quantity} unit dari ${itemName}${fromCategory}`;
      } else if (entry.event_type === 'transfer') {
        const fromCategory = entry.from_warehouse_category ? getCategoryDisplayName(entry.from_warehouse_category) : "N/A";
        const toCategory = entry.to_warehouse_category ? getCategoryDisplayName(entry.to_warehouse_category) : "N/A";
        desc = `Pindah ${entry.quantity} unit ${itemName} dari ${fromCategory} ke ${toCategory}`;
      } else if (entry.event_type === 'adjustment') {
        const category = (entry.from_warehouse_category || entry.to_warehouse_category) ? ` di ${getCategoryDisplayName(entry.from_warehouse_category || entry.to_warehouse_category || "")}` : "";
        desc = `Penyesuaian stok ${entry.quantity} unit untuk ${itemName}${category}`;
      }
      allActivities.push({
        id: entry.id,
        type: 'stock_ledger',
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
    allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latestActivities = allActivities.slice(0, 5);

    // Fetch data for monthly invoice chart
    const sixMonthsAgo = subMonths(new Date(), 5);
    const startDate = startOfMonth(sixMonthsAgo);

    const { data: allInvoicesForChart, error: chartInvoicesError } = await supabaseAdminClient
      .from("invoices")
      .select("created_at")
      .gte("created_at", format(startDate, "yyyy-MM-dd"));
    if (chartInvoicesError) throw chartInvoicesError;

    const monthlyInvoiceCounts = {};
    for (let i = 0; i < 6; i++) {
      const month = format(subMonths(new Date(), i), "MMM yyyy");
      monthlyInvoiceCounts[month] = 0;
    }
    allInvoicesForChart.forEach(invoice => {
      const month = format(parseISO(invoice.created_at), "MMM yyyy");
      if (monthlyInvoiceCounts[month] !== undefined) {
        monthlyInvoiceCounts[month]++;
      }
    });
    const monthlyInvoiceData = Object.keys(monthlyInvoiceCounts)
      .sort((a, b) => parseISO(`01 ${a}`).getTime() - parseISO(`01 ${b}`).getTime())
      .map(month => ({
        month,
        invoices: monthlyInvoiceCounts[month],
      }));

    // Fetch data for monthly stock ledger chart
    const { data: allStockLedgerForChart, error: chartStockLedgerError } = await supabaseAdminClient
      .from("stock_ledger")
      .select("event_type, quantity, created_at")
      .gte("created_at", format(startDate, "yyyy-MM-dd"));
    if (chartStockLedgerError) throw chartStockLedgerError;

    const monthlyStockAggregates = {};
    for (let i = 0; i < 6; i++) {
      const month = format(subMonths(new Date(), i), "MMM yyyy");
      monthlyStockAggregates[month] = { stock_in: 0, stock_out: 0 };
    }
    allStockLedgerForChart.forEach(entry => {
      const month = format(parseISO(entry.created_at), "MMM yyyy");
      if (monthlyStockAggregates[month]) {
        if (['in', 'initial'].includes(entry.event_type) && entry.quantity > 0) {
          monthlyStockAggregates[month].stock_in += entry.quantity;
        } else if (entry.event_type === 'out' && entry.quantity > 0) {
          monthlyStockAggregates[month].stock_out += entry.quantity;
        } else if (entry.event_type === 'adjustment') {
          monthlyStockAggregates[month].stock_in += entry.quantity; // Simplified: count all adjustments as 'in' for chart
        }
      }
    });
    const monthlyStockData = Object.keys(monthlyStockAggregates)
      .sort((a, b) => parseISO(`01 ${a}`).getTime() - parseISO(`01 ${b}`).getTime())
      .map(month => ({
        month,
        ...monthlyStockAggregates[month],
      }));

    return new Response(JSON.stringify({
      pendingInvoices: invoicesCount,
      todaySchedules: schedulesCount,
      lowStockItems: lowStockCount,
      pendingPurchaseRequests: purchaseRequestsCount,
      latestActivities,
      monthlyInvoiceData,
      monthlyStockData,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-dashboard-overview function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});