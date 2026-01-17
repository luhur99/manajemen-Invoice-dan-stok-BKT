// @ts-nocheck
/// <reference lib="deno.ns" />
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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { product_id, from_category, to_category, quantity, reason } = await req.json();

    if (!product_id || !from_category || !to_category || !quantity) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user ID from the authenticated session
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = user.id;

    // 1. Update 'from' warehouse_inventories
    const { data: fromInventory, error: fromFetchError } = await supabaseClient
      .from('warehouse_inventories')
      .select('id, quantity')
      .eq('product_id', product_id)
      .eq('warehouse_category', from_category)
      .single();

    if (fromFetchError || !fromInventory) {
      return new Response(JSON.stringify({ error: 'Source inventory not found or insufficient stock' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (fromInventory.quantity < quantity) {
      return new Response(JSON.stringify({ error: 'Insufficient stock in source category' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { error: fromUpdateError } = await supabaseClient
      .from('warehouse_inventories')
      .update({ quantity: fromInventory.quantity - quantity, updated_at: new Date().toISOString() })
      .eq('id', fromInventory.id);

    if (fromUpdateError) {
      throw fromUpdateError;
    }

    // 2. Update or insert 'to' warehouse_inventories
    const { data: toInventory, error: toFetchError } = await supabaseClient
      .from('warehouse_inventories')
      .select('id, quantity')
      .eq('product_id', product_id)
      .eq('warehouse_category', to_category)
      .single();

    if (toFetchError && toFetchError.code !== 'PGRST116') { // PGRST116 means no rows found
      throw toFetchError;
    }

    if (toInventory) {
      const { error: toUpdateError } = await supabaseClient
        .from('warehouse_inventories')
        .update({ quantity: toInventory.quantity + quantity, updated_at: new Date().toISOString() })
        .eq('id', toInventory.id);
      if (toUpdateError) {
        throw toUpdateError;
      }
    } else {
      const { error: toInsertError } = await supabaseClient
        .from('warehouse_inventories')
        .insert({
          user_id: userId,
          product_id: product_id,
          warehouse_category: to_category,
          quantity: quantity,
        });
      if (toInsertError) {
        throw toInsertError;
      }
    }

    // 3. Insert into stock_ledger for the transfer event
    const { error: ledgerError } = await supabaseClient
      .from('stock_ledger')
      .insert({
        user_id: userId,
        product_id: product_id,
        event_type: 'transfer', // Use the new event type
        quantity: quantity,
        from_warehouse_category: from_category,
        to_warehouse_category: to_category,
        notes: reason, // Use reason as notes
        event_date: format(new Date(), "yyyy-MM-dd"),
      });

    if (ledgerError) {
      throw ledgerError;
    }

    return new Response(JSON.stringify({ message: 'Stock moved successfully' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in move-stock function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});