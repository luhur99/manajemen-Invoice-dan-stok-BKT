// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use service role for atomic operations
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Verify user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { product_id, event_type, quantity, warehouse_category, notes, event_date } = await req.json();

    if (!product_id || !event_type || !quantity || !warehouse_category || !event_date) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 1. Fetch current inventory
    const { data: currentInventory, error: fetchError } = await supabaseClient
      .from('warehouse_inventories')
      .select('id, quantity')
      .eq('product_id', product_id)
      .eq('warehouse_category', warehouse_category)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: Row not found
      throw fetchError;
    }

    let newQuantity = currentInventory ? currentInventory.quantity : 0;

    // 2. Calculate new quantity and validate
    if (event_type === 'out') {
      if (newQuantity < quantity) {
        return new Response(JSON.stringify({ error: `Insufficient stock. Available: ${newQuantity}, Requested: ${quantity}` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      newQuantity -= quantity;
    } else {
      // 'in' or 'initial'
      newQuantity += quantity;
    }

    // 3. Upsert Inventory
    const { error: upsertError } = await supabaseClient
      .from('warehouse_inventories')
      .upsert({
        product_id,
        warehouse_category,
        quantity: newQuantity,
        user_id: user.id,
        updated_at: new Date().toISOString()
      }, { onConflict: 'product_id, warehouse_category' });

    if (upsertError) throw upsertError;

    // 4. Insert Stock Ledger
    const ledgerEntry = {
      user_id: user.id,
      product_id,
      event_type,
      quantity,
      notes,
      event_date,
      // If OUT, current category is 'from'. If IN/INITIAL, current category is 'to'.
      from_warehouse_category: event_type === 'out' ? warehouse_category : null,
      to_warehouse_category: event_type === 'out' ? null : warehouse_category,
    };

    const { error: ledgerError } = await supabaseClient
      .from('stock_ledger')
      .insert(ledgerEntry);

    if (ledgerError) throw ledgerError;

    return new Response(JSON.stringify({ message: 'Transaction successful', new_stock: newQuantity }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Transaction error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});