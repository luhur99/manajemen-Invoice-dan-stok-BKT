import { supabase } from '@/integrations/supabase/client';

export type ScheduleStatus = 'scheduled' | 'completed' | 'cancelled';
export type ScheduleType = 'install' | 'service' | 'survey'; // Assuming same types as scheduling requests

export interface Schedule {
  id: string;
  user_id: string;
  schedule_date: string; // YYYY-MM-DD format
  schedule_time?: string;
  type: ScheduleType;
  customer_name: string;
  address?: string;
  technician_name?: string;
  invoice_id?: string;
  status: ScheduleStatus;
  notes?: string;
  created_at: string;
  phone_number?: string;
  courier_service?: string;
  document_url?: string;
  scheduling_request_id?: string;
}

export async function fetchSchedules(userId: string): Promise<Schedule[]> {
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('user_id', userId)
    .order('schedule_date', { ascending: false })
    .order('schedule_time', { ascending: false });

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