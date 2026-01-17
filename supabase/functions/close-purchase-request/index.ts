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

    const { 
      request_id, 
      received_quantity, 
      returned_quantity, 
      damaged_quantity, 
      target_warehouse_category, 
      received_notes 
    } = await req.json();

    if (!request_id || !received_quantity || !target_warehouse_category) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 1. Fetch current PR details to ensure validity and get product_id
    const { data: prData, error: prError } = await supabaseClient
      .from('purchase_requests')
      .select('status, product_id, item_code, pr_number, document_url')
      .eq('id', request_id)
      .single();

    if (prError) throw prError;
    if (prData.status === 'closed') {
      return new Response(JSON.stringify({ error: 'Purchase request is already closed' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (!prData.document_url) {
      return new Response(JSON.stringify({ error: 'Document (PO/Inv) is missing' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const now = new Date().toISOString();

    // 2. Update Purchase Request Status
    const { error: updatePRError } = await supabaseClient
      .from('purchase_requests')
      .update({
        status: 'closed',
        received_at: now,
        received_quantity,
        returned_quantity: returned_quantity || 0,
        damaged_quantity: damaged_quantity || 0,
        target_warehouse_category,
        received_notes: received_notes || null,
      })
      .eq('id', request_id);

    if (updatePRError) throw updatePRError;

    // 3. Insert Stock Ledger (IN event)
    const ledgerEntry = {
      user_id: user.id,
      product_id: prData.product_id,
      event_type: 'in',
      quantity: received_quantity,
      to_warehouse_category: target_warehouse_category,
      notes: `Received from PR #${prData.pr_number || prData.item_code}. ${received_notes || ''}`,
      event_date: format(new Date(), "yyyy-MM-dd"),
    };

    const { error: ledgerError } = await supabaseClient
      .from('stock_ledger')
      .insert(ledgerEntry);

    // If ledger fails, manual rollback of PR status would be ideal, but with atomic stored procedures this is easier.
    // With Edge Functions, we rely on the order: update PR -> Log Ledger -> Update Inventory.
    if (ledgerError) throw new Error(`Ledger failed: ${ledgerError.message}`);

    // 4. Update Warehouse Inventory
    const { data: currentInv, error: invFetchError } = await supabaseClient
      .from('warehouse_inventories')
      .select('id, quantity')
      .eq('product_id', prData.product_id)
      .eq('warehouse_category', target_warehouse_category)
      .single();

    if (invFetchError && invFetchError.code !== 'PGRST116') throw invFetchError;

    const newQuantity = (currentInv ? currentInv.quantity : 0) + received_quantity;

    const { error: upsertError } = await supabaseClient
      .from('warehouse_inventories')
      .upsert({
        product_id: prData.product_id,
        warehouse_category: target_warehouse_category,
        quantity: newQuantity,
        user_id: user.id,
        updated_at: now
      }, { onConflict: 'product_id, warehouse_category' });

    if (upsertError) throw upsertError;

    return new Response(JSON.stringify({ message: 'Purchase request closed and stock updated' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Close PR error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});