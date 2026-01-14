import { supabase } from '@/integrations/supabase/client';

export type ScheduleStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Schedule {
  id: string;
  user_id: string;
  schedule_date: string; // YYYY-MM-DD
  schedule_time: string | null;
  type: string;
  customer_name: string;
  address: string | null;
  technician_name: string | null;
  invoice_id: string | null;
  status: ScheduleStatus;
  notes: string | null;
  created_at: string;
  phone_number: string | null;
  courier_service: string | null;
  document_url: string | null;
  scheduling_request_id: string | null;
}

export async function fetchSchedules(userId: string): Promise<Schedule[]> {
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('user_id', userId)
    .order('schedule_date', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSchedule(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('schedules')
    .delete()
    .eq('id', id)
    .eq('user_id', userId); // Ensure user can only delete their own schedules

  if (error) throw new Error(error.message);
}