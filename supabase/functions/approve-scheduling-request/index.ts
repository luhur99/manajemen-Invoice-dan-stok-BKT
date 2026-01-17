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

    const { request_id, technician_name } = await req.json();

    if (!request_id || !technician_name) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 1. Fetch the Request Data
    const { data: requestData, error: fetchError } = await supabaseClient
      .from('scheduling_requests')
      .select('*')
      .eq('id', request_id)
      .single();

    if (fetchError || !requestData) {
      throw new Error("Scheduling request not found.");
    }

    if (requestData.status === 'approved') {
      return new Response(JSON.stringify({ error: 'Request is already approved' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 2. Generate DO Number
    const dateStr = format(new Date(), "yyyyMMdd");
    const doPrefix = `DO-${dateStr}-`;
    
    const { data: maxDo, error: doError } = await supabaseClient
      .from("schedules")
      .select("do_number")
      .like("do_number", `${doPrefix}%`)
      .order("do_number", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (doError) throw doError;

    let sequence = 1;
    if (maxDo && maxDo.do_number) {
      const parts = maxDo.do_number.split('-');
      if (parts.length === 3) {
        const currentSeq = parseInt(parts[2]);
        if (!isNaN(currentSeq)) sequence = currentSeq + 1;
      }
    }
    const doNumber = `${doPrefix}${String(sequence).padStart(4, '0')}`;

    // 3. Create Schedule
    const { error: scheduleError } = await supabaseClient
      .from('schedules')
      .insert({
        user_id: user.id, // Creator of the schedule
        schedule_date: requestData.requested_date,
        schedule_time: requestData.requested_time,
        type: requestData.type === 'delivery' ? 'kirim' : 'instalasi', // Map types loosely or strict
        customer_name: requestData.customer_name,
        address: requestData.full_address,
        technician_name: technician_name,
        invoice_id: requestData.invoice_id,
        status: 'scheduled',
        notes: requestData.notes,
        phone_number: requestData.phone_number,
        scheduling_request_id: request_id,
        do_number: doNumber
      });

    if (scheduleError) throw scheduleError;

    // 4. Update Request Status
    const { error: updateError } = await supabaseClient
      .from('scheduling_requests')
      .update({ 
        status: 'approved', 
        technician_name: technician_name,
        updated_at: new Date().toISOString()
      })
      .eq('id', request_id);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ message: 'Request approved and schedule created', do_number: doNumber }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Approval error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});