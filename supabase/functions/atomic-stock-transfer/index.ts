// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { format } from 'https://esm.sh/date-fns@2.30.0';

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

    // Create a Supabase client with the user's JWT for RLS checks on profiles
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
      return new Response(JSON.stringify({ error: 'Forbidden: Only administrators and staff can transfer stock' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { product_id, from_category, to_category, quantity, notes } = await req.json();

    if (!product_id || !from_category || !to_category || !quantity || quantity <= 0) {
      return new Response(JSON.stringify({ error: 'Missing or invalid required fields: product_id, from_category, to_category, quantity (must be > 0)' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (from_category === to_category) {
      return new Response(JSON.stringify({ error: 'Source and destination warehouse categories cannot be the same.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // --- Perform stock transfer using supabaseAdminClient (bypassing RLS) ---

    // 1. Check available stock in the source warehouse
    const { data: fromInventory, error: fromInventoryError } = await supabaseAdminClient
      .from('warehouse_inventories')
      .select('id, quantity')
      .eq('product_id', product_id)
      .eq('warehouse_category', from_category)
      .single();

    if (fromInventoryError && fromInventoryError.code !== 'PGRST116') { // PGRST116 means no rows found
      throw fromInventoryError;
    }

    const currentFromQuantity = fromInventory?.quantity || 0;
    if (currentFromQuantity < quantity) {
      throw new Error(`Insufficient stock (${currentFromQuantity}) in source warehouse (${from_category}) for transfer of ${quantity}.`);
    }

    // 2. Decrease stock in the source warehouse
    const { error: updateFromError } = await supabaseAdminClient
      .from('warehouse_inventories')
      .upsert(
        {
          product_id: product_id,
          warehouse_category: from_category,
          quantity: currentFromQuantity - quantity,
          user_id: user.id, // Keep the user_id of the person performing the action
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'product_id, warehouse_category' }
      );
    if (updateFromError) throw updateFromError;

    // 3. Increase stock in the destination warehouse
    const { data: toInventory, error: toInventoryError } = await supabaseAdminClient
      .from('warehouse_inventories')
      .select('id, quantity')
      .eq('product_id', product_id)
      .eq('warehouse_category', to_category)
      .single();

    if (toInventoryError && toInventoryError.code !== 'PGRST116') {
      throw toInventoryError;
    }

    const currentToQuantity = toInventory?.quantity || 0;
    const { error: updateToError } = await supabaseAdminClient
      .from('warehouse_inventories')
      .upsert(
        {
          product_id: product_id,
          warehouse_category: to_category,
          quantity: currentToQuantity + quantity,
          user_id: user.id, // Keep the user_id of the person performing the action
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'product_id, warehouse_category' }
      );
    if (updateToError) throw updateToError;

    // 4. Record the transaction in stock_ledger
    const { error: ledgerError } = await supabaseAdminClient
      .from('stock_ledger')
      .insert({
        user_id: user.id,
        product_id: product_id,
        event_type: 'transfer',
        quantity: quantity,
        from_warehouse_category: from_category,
        to_warehouse_category: to_category,
        notes: notes || `Transfer from ${from_category} to ${to_category}`,
        event_date: format(new Date(), "yyyy-MM-dd"), // YYYY-MM-DD
      });
    if (ledgerError) throw ledgerError;

    return new Response(JSON.stringify({ message: 'Stock transferred successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Error in atomic-stock-transfer function:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});