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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use service role key for admin operations
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid user session' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Check if the user has admin or staff role to perform this action
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || (profileData?.role !== 'admin' && profileData?.role !== 'staff')) {
      return new Response(JSON.stringify({ error: 'Forbidden: Only administrators and staff can update invoices and deduct stock' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { invoice_id, updated_invoice_data, items_to_update, items_to_delete, items_to_insert } = await req.json();

    if (!invoice_id || !updated_invoice_data) {
      return new Response(JSON.stringify({ error: 'Missing required fields: invoice_id or updated_invoice_data' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Fetch current invoice details to check for status changes and stock_deducted flag
    const { data: currentInvoice, error: fetchInvoiceError } = await supabaseClient
      .from('invoices')
      .select('payment_status, invoice_status, stock_deducted')
      .eq('id', invoice_id)
      .single();

    if (fetchInvoiceError || !currentInvoice) {
      throw new Error('Invoice not found or error fetching current invoice details.');
    }

    const oldPaymentStatus = currentInvoice.payment_status;
    const oldInvoiceStatus = currentInvoice.invoice_status;
    const oldStockDeducted = currentInvoice.stock_deducted;

    const newPaymentStatus = updated_invoice_data.payment_status;
    const newInvoiceStatus = updated_invoice_data.invoice_status;

    let shouldDeductStock = false;
    let stockDeductedSuccessfully = false;

    // Check if the status transition requires stock deduction
    if (
      newPaymentStatus === 'paid' &&
      newInvoiceStatus === 'completed' &&
      !oldStockDeducted && // Only deduct if stock hasn't been deducted before
      (oldPaymentStatus !== 'paid' || oldInvoiceStatus !== 'completed') // Only deduct if status is actually changing to the target state
    ) {
      shouldDeductStock = true;
    }

    // 1. Update Invoice
    const { error: updateInvoiceError } = await supabaseClient
      .from('invoices')
      .update({
        ...updated_invoice_data,
        stock_deducted: shouldDeductStock ? true : oldStockDeducted, // Set to true if deduction is happening, otherwise keep old value
        updated_at: new Date().toISOString(),
      })
      .eq('id', invoice_id);

    if (updateInvoiceError) {
      throw updateInvoiceError;
    }

    // 2. Handle Invoice Items (delete, update, insert)
    if (items_to_delete && items_to_delete.length > 0) {
      const { error: deleteError } = await supabaseClient
        .from("invoice_items")
        .delete()
        .in("id", items_to_delete.map((item: any) => item.id));
      if (deleteError) throw deleteError;
    }

    if (items_to_update && items_to_update.length > 0) {
      for (const item of items_to_update) {
        const { error: updateItemError } = await supabaseClient
          .from("invoice_items")
          .update({
            product_id: item.product_id,
            item_name: item.item_name,
            item_code: item.item_code,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.subtotal,
            unit_type: item.unit_type,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id);
        if (updateItemError) throw updateItemError;
      }
    }

    if (items_to_insert && items_to_insert.length > 0) {
      const itemsToInsertWithInvoiceId = items_to_insert.map((item: any) => ({
        ...item,
        invoice_id: invoice_id,
        user_id: user.id, // Assign current user as creator
      }));
      const { error: insertItemsError } = await supabaseClient
        .from("invoice_items")
        .insert(itemsToInsertWithInvoiceId);
      if (insertItemsError) throw insertItemsError;
    }

    // 3. Perform Stock Deduction if required
    if (shouldDeductStock) {
      // Fetch all items for this invoice to ensure we deduct correctly
      const { data: invoiceItems, error: fetchItemsError } = await supabaseClient
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', invoice_id);

      if (fetchItemsError) {
        console.error('Error fetching invoice items for stock deduction:', fetchItemsError);
        // Decide whether to throw error or just log and continue without stock deduction
        // For now, we'll throw to indicate a critical failure in the transaction
        throw new Error('Failed to fetch invoice items for stock deduction.');
      }

      for (const item of invoiceItems) {
        const targetWarehouseCategory = 'siap_jual';
        let deductedFromWarehouseCategory = null;

        try {
          const { data: inventoryEntries, error: inventoryError } = await supabaseClient
            .from("warehouse_inventories")
            .select("id, quantity, warehouse_category")
            .eq("product_id", item.product_id)
            .eq("warehouse_category", targetWarehouseCategory)
            .single();

          if (inventoryError && inventoryError.code !== 'PGRST116') {
            console.error(`Error fetching inventory for product ${item.product_id} in ${targetWarehouseCategory}:`, inventoryError);
          } else if (inventoryEntries) {
            const currentInventory = inventoryEntries;
            if (currentInventory.quantity >= item.quantity) {
              const newQuantity = currentInventory.quantity - item.quantity;

              const { error: updateInventoryError } = await supabaseClient
                .from("warehouse_inventories")
                .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
                .eq("id", currentInventory.id);

              if (updateInventoryError) {
                console.error(`Error updating inventory for product ${item.product_id} in ${targetWarehouseCategory}:`, updateInventoryError);
              } else {
                deductedFromWarehouseCategory = currentInventory.warehouse_category;
                stockDeductedSuccessfully = true;
              }
            } else {
              console.warn(`Insufficient stock for product ${item.product_id} in warehouse category ${targetWarehouseCategory}. Requested: ${item.quantity}, Available: ${currentInventory.quantity}. Stock not fully deducted.`);
            }
          } else {
            console.warn(`No inventory entry found for product ${item.product_id} in ${targetWarehouseCategory}. Stock not deducted.`);
          }

          const { error: ledgerError } = await supabaseClient
            .from("stock_ledger")
            .insert({
              user_id: user.id,
              product_id: item.product_id,
              event_type: 'out', // Lowercase 'out'
              quantity: item.quantity,
              notes: `Invoice ${updated_invoice_data.invoice_number} - Item sold (via update)`,
              from_warehouse_category: deductedFromWarehouseCategory,
              event_date: format(new Date(), "yyyy-MM-dd"),
            });

          if (ledgerError) {
            console.error(`Error inserting stock ledger entry for product ${item.product_id}:`, ledgerError);
          }
        } catch (stockUpdateError) {
          console.error(`Unexpected error during stock update for item ${item.item_name}:`, stockUpdateError);
        }
      }
    }

    return new Response(JSON.stringify({ message: 'Invoice updated successfully', stock_deducted: shouldDeductStock }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Update Invoice Edge Function Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});