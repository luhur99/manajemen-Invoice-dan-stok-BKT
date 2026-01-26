// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { format, parseISO, startOfMonth, endOfMonth } from 'https://esm.sh/date-fns@2.30.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify user - this must be sequential
    const { data: { user }, error: userError } = await supabaseAdminClient.auth.getUser(token);

    if (userError || !user) {
      console.error('User authentication failed:', userError);
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid user token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check user role - this must be sequential after auth
    const { data: profileData, error: profileError } = await supabaseAdminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || (profileData?.role !== 'admin' && profileData?.role !== 'staff')) {
      console.error('User role check failed:', profileError || `Role: ${profileData?.role}`);
      return new Response(JSON.stringify({ error: 'Forbidden: Only administrators and staff can view dashboard overview' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare date constants
    const now = new Date();
    const today = format(now, "yyyy-MM-dd");
    const startOfCurrentMonth = format(startOfMonth(now), "yyyy-MM-dd");
    const endOfCurrentMonth = format(endOfMonth(now), "yyyy-MM-dd");

    // --- PARALLELIZED QUERIES: Run all 12 independent queries at once ---
    console.log('Fetching all dashboard data in parallel...');
    const startTime = Date.now();

    const [
      pendingInvoicesResult,
      todaySchedulesResult,
      allProductsResult,
      allInventoriesResult,
      pendingPurchaseRequestsResult,
      recentInvoicesResult,
      recentSchedulesResult,
      recentStockLedgerResult,
      recentPurchaseRequestsResult,
      warehouseCategoriesResult,
      currentMonthInvoicesResult,
      currentMonthStockLedgerResult,
    ] = await Promise.all([
      // 1. Pending Invoices Count
      supabaseAdminClient
        .from("invoices")
        .select("id", { count: "exact", head: true })
        .eq("payment_status", "pending"),

      // 2. Today's Schedules Count
      supabaseAdminClient
        .from("schedules")
        .select("id", { count: "exact", head: true })
        .eq("schedule_date", today),

      // 3. All Products (for low stock calculation)
      supabaseAdminClient
        .from("products")
        .select("id, safe_stock_limit"),

      // 4. All Warehouse Inventories (for low stock calculation)
      supabaseAdminClient
        .from("warehouse_inventories")
        .select("product_id, quantity"),

      // 5. Pending Purchase Requests Count
      supabaseAdminClient
        .from("purchase_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),

      // 6. Recent Invoices (for activities)
      supabaseAdminClient
        .from("invoices")
        .select("id, invoice_number, customer_name, created_at")
        .order("created_at", { ascending: false })
        .limit(5),

      // 7. Recent Schedules (for activities)
      supabaseAdminClient
        .from("schedules")
        .select("id, customer_name, type, schedule_date, created_at")
        .order("created_at", { ascending: false })
        .limit(5),

      // 8. Recent Stock Ledger (for activities)
      supabaseAdminClient
        .from("stock_ledger")
        .select("id, event_type, quantity, notes, created_at, from_warehouse_category, to_warehouse_category, products(nama_barang)")
        .order("created_at", { ascending: false })
        .limit(5),

      // 9. Recent Purchase Requests (for activities)
      supabaseAdminClient
        .from("purchase_requests")
        .select("id, item_name, quantity, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5),

      // 10. Warehouse Categories (for display names)
      supabaseAdminClient
        .from("warehouse_categories")
        .select("code, name"),

      // 11. Current Month Invoices Count
      supabaseAdminClient
        .from("invoices")
        .select("id", { count: "exact", head: true })
        .gte("created_at", startOfCurrentMonth)
        .lte("created_at", endOfCurrentMonth),

      // 12. Current Month Stock Ledger
      supabaseAdminClient
        .from("stock_ledger")
        .select("event_type, quantity, from_warehouse_category, to_warehouse_category")
        .gte("created_at", startOfCurrentMonth)
        .lte("created_at", endOfCurrentMonth),
    ]);

    console.log(`All queries completed in ${Date.now() - startTime}ms`);

    // Check for errors in any of the parallel queries
    if (pendingInvoicesResult.error) throw pendingInvoicesResult.error;
    if (todaySchedulesResult.error) throw todaySchedulesResult.error;
    if (allProductsResult.error) throw allProductsResult.error;
    if (allInventoriesResult.error) throw allInventoriesResult.error;
    if (pendingPurchaseRequestsResult.error) throw pendingPurchaseRequestsResult.error;
    if (recentInvoicesResult.error) throw recentInvoicesResult.error;
    if (recentSchedulesResult.error) throw recentSchedulesResult.error;
    if (recentStockLedgerResult.error) throw recentStockLedgerResult.error;
    if (recentPurchaseRequestsResult.error) throw recentPurchaseRequestsResult.error;
    if (warehouseCategoriesResult.error) throw warehouseCategoriesResult.error;
    if (currentMonthInvoicesResult.error) throw currentMonthInvoicesResult.error;
    if (currentMonthStockLedgerResult.error) throw currentMonthStockLedgerResult.error;

    // Extract data from results
    const invoicesCount = pendingInvoicesResult.count;
    const schedulesCount = todaySchedulesResult.count;
    const allProducts = allProductsResult.data;
    const allInventories = allInventoriesResult.data;
    const purchaseRequestsCount = pendingPurchaseRequestsResult.count;
    const recentInvoices = recentInvoicesResult.data || [];
    const recentSchedules = recentSchedulesResult.data || [];
    const recentStockLedgerData = recentStockLedgerResult.data || [];
    const recentPurchaseRequestsData = recentPurchaseRequestsResult.data || [];
    const warehouseCategories = warehouseCategoriesResult.data || [];
    const totalInvoicesThisMonth = currentMonthInvoicesResult.count;
    const currentMonthStockLedger = currentMonthStockLedgerResult.data || [];

    // Calculate low stock count
    const productStockMap = new Map<string, number>();
    if (allInventories) {
      allInventories.forEach(inv => {
        productStockMap.set(inv.product_id, (productStockMap.get(inv.product_id) || 0) + inv.quantity);
      });
    }

    let lowStockCount = 0;
    if (allProducts) {
      allProducts.forEach((product) => {
        const totalStock = productStockMap.get(product.id) || 0;
        const limit = product.safe_stock_limit !== undefined && product.safe_stock_limit !== null ? product.safe_stock_limit : 10;
        if (totalStock < limit) {
          lowStockCount++;
        }
      });
    }

    // Build category display name map
    const categoryMap = new Map(warehouseCategories.map(cat => [cat.code, cat.name]));
    const getCategoryDisplayName = (code: string) => categoryMap.get(code) || code;

    // Process all activities
    const allActivities: Array<{id: string, type: string, description: string, date: string}> = [];

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
      if (['in', 'initial'].includes(entry.event_type) && entry.quantity > 0) {
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
      if (desc) {
        allActivities.push({
          id: entry.id,
          type: 'stock_ledger',
          description: desc,
          date: entry.created_at,
        });
      }
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

    // Calculate stock in/out for current month
    let totalStockInThisMonth = 0;
    let totalStockOutThisMonth = 0;
    currentMonthStockLedger.forEach(entry => {
      if (['in', 'initial'].includes(entry.event_type) && entry.quantity > 0) {
        totalStockInThisMonth += entry.quantity;
      } else if (entry.event_type === 'out' && entry.quantity > 0) {
        totalStockOutThisMonth += entry.quantity;
      } else if (entry.event_type === 'adjustment') {
        if (entry.to_warehouse_category && !entry.from_warehouse_category) {
          totalStockInThisMonth += entry.quantity;
        } else if (entry.from_warehouse_category && !entry.to_warehouse_category) {
          totalStockOutThisMonth += entry.quantity;
        } else {
          totalStockInThisMonth += entry.quantity;
        }
      }
    });

    console.log(`Total processing time: ${Date.now() - startTime}ms`);

    return new Response(JSON.stringify({
      pendingInvoices: invoicesCount,
      todaySchedules: schedulesCount,
      lowStockItems: lowStockCount,
      pendingPurchaseRequests: purchaseRequestsCount,
      latestActivities,
      totalInvoicesThisMonth,
      totalStockInThisMonth,
      totalStockOutThisMonth,
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
