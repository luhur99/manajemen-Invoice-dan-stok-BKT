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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { product_id, warehouse_category, new_quantity, notes } = await req.json();

    if (!product_id || !warehouse_category || new_quantity === undefined) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 1. Fetch current quantity to calculate delta for ledger
    const { data: currentInv, error: fetchError } = await supabaseClient
      .from('warehouse_inventories')
      .select('quantity')
      .eq('product_id', product_id)
      .eq('warehouse_category', warehouse_category)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    const oldQuantity = currentInv ? currentInv.quantity : 0;
    const difference = new_quantity - oldQuantity;

    if (difference === 0) {
      return new Response(JSON.stringify({ message: 'No changes detected' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 2. Upsert Inventory with new quantity
    const { error: upsertError } = await supabaseClient
      .from('warehouse_inventories')
      .upsert({
        product_id,
        warehouse_category,
        quantity: new_quantity,
        user_id: user.id,
        updated_at: new Date().toISOString()
      }, { onConflict: 'product_id, warehouse_category' });

    if (upsertError) throw upsertError;

    // 3. Log to Stock Ledger
    // For adjustments, we record the absolute difference
    const ledgerEntry = {
      user_id: user.id,
      product_id,
      event_type: 'adjustment',
      quantity: Math.abs(difference),
      // If diff is negative (stock reduced), it's "from" this category. If positive (stock added), it's "to".
      from_warehouse_category: difference < 0 ? warehouse_category : null,
      to_warehouse_category: difference > 0 ? warehouse_category : null,
      notes: notes || `Manual adjustment from ${oldQuantity} to ${new_quantity}`,
      event_date: format(new Date(), "yyyy-MM-dd"),
    };

    const { error: ledgerError } = await supabaseClient
      .from('stock_ledger')
      .insert(ledgerEntry);

    if (ledgerError) throw ledgerError;

    return new Response(JSON.stringify({ message: 'Stock adjusted successfully', old_stock: oldQuantity, new_stock: new_quantity }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Adjustment error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});