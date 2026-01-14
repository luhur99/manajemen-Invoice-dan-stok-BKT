import { supabase } from '@/integrations/supabase/client';

export type SchedulingRequestStatus = 'pending' | 'approved' | 'rejected';
export type SchedulingRequestType = 'install' | 'service' | 'survey'; // Example types, adjust as needed

export interface SchedulingRequest {
  id: string;
  user_id: string;
  customer_name: string;
  company_name: string | null;
  type: SchedulingRequestType;
  vehicle_units: number | null;
  vehicle_type: string | null;
  vehicle_year: number | null;
  full_address: string;
  landmark: string | null;
  requested_date: string; // YYYY-MM-DD
  requested_time: string | null;
  contact_person: string;
  phone_number: string;
  customer_type: string | null;
  payment_method: string | null;
  status: SchedulingRequestStatus;
  notes: string | null;
  created_at: string;
}

export async function fetchSchedulingRequests(userId: string): Promise<SchedulingRequest[]> {
  const { data, error } = await supabase
    .from('scheduling_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function addSchedulingRequest(
  request: Omit<SchedulingRequest, 'id' | 'user_id' | 'status' | 'created_at'>,
  userId: string
): Promise<SchedulingRequest> {
  const { data, error } = await supabase
    .from('scheduling_requests')
    .insert({ ...request, user_id: userId, status: 'pending' })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateSchedulingRequest(
  id: string,
  updates: Partial<Omit<SchedulingRequest, 'id' | 'user_id' | 'created_at'>>,
  userId: string
): Promise<SchedulingRequest> {
  const { data, error } = await supabase
    .from('scheduling_requests')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId) // Ensure user can only update their own requests
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSchedulingRequest(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('scheduling_requests')
    .delete()
    .eq('id', id)
    .eq('user_id', userId); // Ensure user can only delete their own requests

  if (error) throw new Error(error.message);
}