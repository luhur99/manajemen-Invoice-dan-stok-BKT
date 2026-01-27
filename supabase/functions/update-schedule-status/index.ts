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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('update-schedule-status: Unauthorized - Missing Authorization header');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      console.error('update-schedule-status: User authentication failed:', userError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    console.log(`update-schedule-status: User ${user.id} is authenticated.`);

    // Check user role for authorization
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || !['admin', 'staff'].includes(profile.role)) {
      console.error('update-schedule-status: User is not authorized to update schedules:', user.id, profileError);
      return new Response(JSON.stringify({ error: 'Forbidden: Only Admin or Staff can update schedules.' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    console.log(`update-schedule-status: User ${user.id} with role ${profile.role} is authorized.`);


    const { schedule_id, new_status, notes } = await req.json();

    if (!schedule_id || !new_status) {
      console.error('update-schedule-status: Missing required fields: schedule_id or new_status');
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Fetch current schedule to validate transition
    const { data: currentSchedule, error: fetchError } = await supabaseClient
      .from('schedules')
      .select('status')
      .eq('id', schedule_id)
      .single();

    if (fetchError || !currentSchedule) {
      console.error('update-schedule-status: Schedule not found or fetch error:', fetchError);
      throw new Error("Schedule not found.");
    }

    const oldStatus = currentSchedule.status;

    // Validate status transition
    const isValidTransition = (oldStat: string, newStat: string): boolean => {
      switch (oldStat) {
        case 'scheduled':
        case 'in_progress':
          return ['completed', 'cancelled', 'rescheduled'].includes(newStat);
        case 'rescheduled':
          return ['scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled'].includes(newStat);
        case 'completed':
        case 'cancelled':
          return false; // Final states, no further changes allowed
        default:
          return false;
      }
    };

    if (!isValidTransition(oldStatus, new_status)) {
      console.error(`update-schedule-status: Invalid status transition from ${oldStatus} to ${new_status}`);
      return new Response(JSON.stringify({ error: `Invalid status transition from ${oldStatus} to ${new_status}` }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // For 'cancelled' or 'rescheduled' status, notes are required
    if (['cancelled', 'rescheduled'].includes(new_status) && (!notes || notes.trim() === '')) {
      console.error(`update-schedule-status: Notes are required for status ${new_status}`);
      return new Response(JSON.stringify({ error: `Notes are required for status ${new_status}` }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Update the schedule status
    const updateData: { status: string; notes?: string; updated_at: string } = {
      status: new_status,
      updated_at: new Date().toISOString(),
    };
    if (notes) {
      updateData.notes = notes;
    }

    console.log(`update-schedule-status: Updating schedule ${schedule_id} status from ${oldStatus} to ${new_status}`);
    const { error: updateError } = await supabaseClient
      .from('schedules')
      .update(updateData)
      .eq('id', schedule_id);

    if (updateError) {
      console.error('update-schedule-status: Error updating schedule status:', updateError);
      throw updateError;
    }
    console.log('update-schedule-status: Schedule status updated successfully.');

    return new Response(JSON.stringify({ message: 'Schedule status updated successfully' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('update-schedule-status: Unhandled error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});