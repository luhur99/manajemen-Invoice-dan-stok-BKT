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
      invoice_date, 
      due_date, 
      customer_name, 
      company_name, 
      total_amount, 
      payment_status, 
      type, 
      customer_type, 
      payment_method, 
      notes, 
      courier_service,
      invoice_status,
      do_number, // Added do_number
      items 
    } = await req.json();

    if (!invoice_date || !customer_name || !items || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Missing required fields: invoice_date, customer_name, or items' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Retry logic for generating unique invoice number
    let invoiceData = null;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts && !invoiceData) {
      attempts++;
      
      // 1. Generate Invoice Number
      const dateObj = new Date(invoice_date);
      const dateStr = format(dateObj, "yyMMdd");
      const prefix = `INV${dateStr}`;

      // Get current max sequence
      const { data: maxResult, error: maxError } = await supabaseClient
        .from("invoices")
        .select("invoice_number")
        .like("invoice_number", `${prefix}%`)
        .order("invoice_number", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (maxError) throw maxError;

      let sequence = 1;
      if (maxResult) {
        const currentSequence = parseInt(maxResult.invoice_number.substring(8), 10);
        if (!isNaN(currentSequence)) {
          sequence = currentSequence + 1;
        }
      }
      
      const invoiceNumber = `${prefix}${String(sequence).padStart(4, '0')}`;

      // 2. Try to insert Invoice
      const { data: insertedInvoice, error: insertError } = await supabaseClient
        .from("invoices")
        .insert({
          user_id: user.id,
          invoice_number: invoiceNumber,
          invoice_date,
          due_date,
          customer_name,
          company_name,
          total_amount,
          payment_status,
          type,
          customer_type,
          payment_method,
          notes,
          courier_service,
          invoice_status,
          do_number, // Insert do_number here
        })
        .select()
        .single();

      if (insertError) {
        // If unique constraint violation on invoice_number, retry loop
        if (insertError.code === '23505' && insertError.message.includes('invoice_number')) {
          console.log(`Duplicate invoice number ${invoiceNumber}, retrying...`);
          continue;
        }
        throw insertError;
      }

      invoiceData = insertedInvoice;
    }

    if (!invoiceData) {
      throw new Error("Failed to generate unique invoice number after multiple attempts.");
    }

    // 3. Insert Invoice Items
    const invoiceItems = items.map((item: any) => ({
      invoice_id: invoiceData.id,
      user_id: user.id,
      product_id: item.product_id,
      item_name: item.item_name,
      item_code: item.item_code,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal,
      unit_type: item.unit_type,
    }));

    const { error: itemsError } = await supabaseClient
      .from("invoice_items")
      .insert(invoiceItems);

    if (itemsError) {
      // Cleanup invoice if items fail (manual rollback since no multi-table transactions in HTTP API)
      await supabaseClient.from("invoices").delete().eq("id", invoiceData.id);
      throw itemsError;
    }

    // 4. Conditional Stock Update and Ledger Entry if invoice_status is 'completed' and payment_status is 'paid'
    if (invoice_status === 'completed' && payment_status === 'paid') {
      for (const item of items) {
        let deductedFromWarehouseCategory = null;
        try {
          // Deduct from warehouse_inventories
          const { data: inventoryEntries, error: inventoryError } = await supabaseClient
            .from("warehouse_inventories")
            .select("id, quantity, warehouse_category")
            .eq("product_id", item.product_id)
            .limit(1); // Taking the first one found for simplicity

          if (inventoryError) {
            console.error(`Error fetching inventory for product ${item.product_id}:`, inventoryError);
          } else if (inventoryEntries && inventoryEntries.length > 0) {
            const currentInventory = inventoryEntries[0];
            if (currentInventory.quantity >= item.quantity) { // Only deduct if sufficient stock
              const newQuantity = currentInventory.quantity - item.quantity;

              const { error: updateInventoryError } = await supabaseClient
                .from("warehouse_inventories")
                .update({ quantity: newQuantity })
                .eq("id", currentInventory.id);

              if (updateInventoryError) {
                console.error(`Error updating inventory for product ${item.product_id}:`, updateInventoryError);
              } else {
                console.log(`Deducted ${item.quantity} from inventory for product ${item.product_id}. New quantity: ${newQuantity}`);
                deductedFromWarehouseCategory = currentInventory.warehouse_category;
              }
            } else {
              console.warn(`Insufficient stock for product ${item.product_id} in warehouse category ${currentInventory.warehouse_category}. Requested: ${item.quantity}, Available: ${currentInventory.quantity}. Stock not fully deducted.`);
            }
          } else {
            console.warn(`No inventory entry found for product ${item.product_id}. Stock not deducted.`);
          }

          // Insert into stock_ledger
          const { error: ledgerError } = await supabaseClient
            .from("stock_ledger")
            .insert({
              user_id: user.id,
              product_id: item.product_id,
              event_type: 'OUT', // Assuming 'OUT' for sales
              quantity: item.quantity,
              notes: `Invoice ${invoiceData.invoice_number} - Item sold`,
              from_warehouse_category: deductedFromWarehouseCategory, // Use the category from which stock was deducted
              event_date: format(new Date(), "yyyy-MM-dd"), // Current date
            });

          if (ledgerError) {
            console.error(`Error inserting stock ledger entry for product ${item.product_id}:`, ledgerError);
          } else {
            console.log(`Stock ledger entry added for product ${item.product_id}.`);
          }

        } catch (stockUpdateError) {
          console.error(`Unexpected error during stock update for item ${item.item_name}:`, stockUpdateError);
        }
      }
    }

    return new Response(JSON.stringify({ message: 'Invoice created successfully', invoice: invoiceData }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Create Invoice Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});