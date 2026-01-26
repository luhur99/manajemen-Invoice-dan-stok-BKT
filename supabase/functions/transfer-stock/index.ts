/// <reference lib="deno.ns" />
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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const { product_id, from_warehouse_category, to_warehouse_category, quantity, notes } = await req.json();

    if (!product_id || !from_warehouse_category || !to_warehouse_category || !quantity || quantity <= 0) {
      return new Response(JSON.stringify({ error: 'Missing or invalid required fields.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    if (from_warehouse_category === to_warehouse_category) {
      return new Response(JSON.stringify({ error: 'Source and destination warehouses cannot be the same.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Start a transaction
    const { error: transactionError } = await supabaseClient.rpc('start_transaction');
    if (transactionError) throw transactionError;

    try {
      // 1. Check available stock in the source warehouse
      const { data: fromInventory, error: fromInventoryError } = await supabaseClient
        .from('warehouse_inventories')
        .select('quantity')
        .eq('product_id', product_id)
        .eq('warehouse_category', from_warehouse_category)
        .single();

      if (fromInventoryError && fromInventoryError.code !== 'PGRST116') { // PGRST116 means no rows found
        throw fromInventoryError;
      }

      const currentFromQuantity = fromInventory?.quantity || 0;
      if (currentFromQuantity < quantity) {
        throw new Error(`Insufficient stock (${currentFromQuantity}) in source warehouse (${from_warehouse_category}) for transfer of ${quantity}.`);
      }

      // 2. Decrease stock in the source warehouse
      const { error: updateFromError } = await supabaseClient
        .from('warehouse_inventories')
        .upsert(
          {
            product_id: product_id,
            warehouse_category: from_warehouse_category,
            quantity: currentFromQuantity - quantity,
            user_id: user.id,
          },
          { onConflict: 'product_id, warehouse_category' }
        );
      if (updateFromError) throw updateFromError;

      // 3. Increase stock in the destination warehouse
      const { data: toInventory, error: toInventoryError } = await supabaseClient
        .from('warehouse_inventories')
        .select('quantity')
        .eq('product_id', product_id)
        .eq('warehouse_category', to_warehouse_category)
        .single();

      if (toInventoryError && toInventoryError.code !== 'PGRST116') {
        throw toInventoryError;
      }

      const currentToQuantity = toInventory?.quantity || 0;
      const { error: updateToError } = await supabaseClient
        .from('warehouse_inventories')
        .upsert(
          {
            product_id: product_id,
            warehouse_category: to_warehouse_category,
            quantity: currentToQuantity + quantity,
            user_id: user.id,
          },
          { onConflict: 'product_id, warehouse_category' }
        );
      if (updateToError) throw updateToError;

      // 4. Record the transaction in stock_ledger
      const { error: ledgerError } = await supabaseClient
        .from('stock_ledger')
        .insert({
          user_id: user.id,
          product_id: product_id,
          event_type: 'transfer',
          quantity: quantity,
          from_warehouse_category: from_warehouse_category,
          to_warehouse_category: to_warehouse_category,
          notes: notes || `Transfer from ${from_warehouse_category} to ${to_warehouse_category}`,
          event_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        });
      if (ledgerError) throw ledgerError;

      // Commit transaction
      const { error: commitError } = await supabaseClient.rpc('commit_transaction');
      if (commitError) throw commitError;

      return new Response(JSON.stringify({ message: 'Stock transferred successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });

    } catch (innerError: any) {
      // Rollback transaction on any error
      await supabaseClient.rpc('rollback_transaction');
      console.error('Transaction failed, rolled back:', innerError.message);
      return new Response(JSON.stringify({ error: innerError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

  } catch (outerError: any) {
    console.error('Error in transfer-stock function:', outerError.message);
    return new Response(JSON.stringify({ error: outerError.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});