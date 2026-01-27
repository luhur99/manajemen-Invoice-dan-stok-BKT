// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { format } from 'https://esm.sh/date-fns@2.30.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define enums for clarity within the Edge Function
enum SchedulingRequestType {
  INSTALLATION = "installation",
  SERVICE = "service",
  SERVICE_UNBILL = "service_unbill",
  DELIVERY = "delivery",
}

enum ScheduleType {
  INSTALASI = "instalasi",
  SERVICE = "service",
  KIRIM = "kirim",
}

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
      console.error('approve-scheduling-request: Unauthorized - Missing Authorization header');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      console.error('approve-scheduling-request: User authentication failed:', userError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    console.log(`approve-scheduling-request: User ${user.id} is authenticated.`);

    const { request_id, technician_name } = await req.json();

    if (!request_id || !technician_name) {
      console.error('approve-scheduling-request: Missing required fields: request_id or technician_name');
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 1. Fetch the Request Data
    console.log(`approve-scheduling-request: Fetching scheduling request ${request_id}`);
    const { data: requestData, error: fetchError } = await supabaseClient
      .from('scheduling_requests')
      .select('*')
      .eq('id', request_id)
      .single();

    if (fetchError || !requestData) {
      console.error('approve-scheduling-request: Scheduling request not found or fetch error:', fetchError);
      throw new Error("Scheduling request not found.");
    }

    if (requestData.status === 'approved') {
      console.warn('approve-scheduling-request: Request is already approved:', request_id);
      return new Response(JSON.stringify({ error: 'Request is already approved' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 2. Generate DO Number
    const dateStr = format(new Date(), "yyyyMMdd");
    const doPrefix = `DO-${dateStr}-`;
    
    console.log('approve-scheduling-request: Generating DO number...');
    const { data: maxDo, error: doError } = await supabaseClient
      .from("schedules")
      .select("do_number")
      .like("do_number", `${doPrefix}%`)
      .order("do_number", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (doError) {
      console.error('approve-scheduling-request: Error fetching max DO number:', doError);
      throw doError;
    }

    let sequence = 1;
    if (maxDo && maxDo.do_number) {
      const parts = maxDo.do_number.split('-');
      if (parts.length === 3) {
        const currentSeq = parseInt(parts[2]);
        if (!isNaN(currentSeq)) sequence = currentSeq + 1;
      }
    }
    const doNumber = `${doPrefix}${String(sequence).padStart(4, '0')}`;
    console.log(`approve-scheduling-request: Generated DO number: ${doNumber}`);

    // Determine schedule type based on request type
    let scheduleType: ScheduleType;
    switch (requestData.type) {
      case SchedulingRequestType.DELIVERY:
        scheduleType = ScheduleType.KIRIM;
        break;
      case SchedulingRequestType.SERVICE:
      case SchedulingRequestType.SERVICE_UNBILL:
        scheduleType = ScheduleType.SERVICE;
        break;
      case SchedulingRequestType.INSTALLATION:
      default: // Default to installation if type is unknown or not explicitly handled
        scheduleType = ScheduleType.INSTALASI;
        break;
    }
    console.log(`approve-scheduling-request: Mapped request type '${requestData.type}' to schedule type '${scheduleType}'`);

    // 3. Create Schedule
    const scheduleDataToInsert = {
      user_id: user.id, // Creator of the schedule
      schedule_date: requestData.requested_date,
      schedule_time: requestData.requested_time,
      type: scheduleType, // Use the correctly mapped type
      customer_name: requestData.customer_name,
      address: requestData.full_address,
      technician_name: technician_name,
      invoice_id: requestData.invoice_id,
      status: 'scheduled',
      notes: requestData.notes,
      phone_number: requestData.phone_number,
      scheduling_request_id: request_id,
      do_number: doNumber,
      product_category: requestData.product_category, // Include product_category
      customer_id: requestData.customer_id, // Include customer_id
    };
    console.log('approve-scheduling-request: Inserting schedule data:', scheduleDataToInsert);

    const { error: scheduleError } = await supabaseClient
      .from('schedules')
      .insert(scheduleDataToInsert);

    if (scheduleError) {
      console.error('approve-scheduling-request: Error creating schedule:', scheduleError);
      throw scheduleError;
    }
    console.log('approve-scheduling-request: Schedule created successfully.');

    // 4. Update Request Status
    console.log(`approve-scheduling-request: Updating scheduling request ${request_id} status to 'approved'.`);
    const { error: updateError } = await supabaseClient
      .from('scheduling_requests')
      .update({ 
        status: 'approved', 
        technician_name: technician_name,
        updated_at: new Date().toISOString()
      })
      .eq('id', request_id);

    if (updateError) {
      console.error('approve-scheduling-request: Error updating scheduling request status:', updateError);
      throw updateError;
    }
    console.log('approve-scheduling-request: Scheduling request status updated successfully.');

    return new Response(JSON.stringify({ message: 'Request approved and schedule created', do_number: doNumber }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('approve-scheduling-request: Unhandled error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});