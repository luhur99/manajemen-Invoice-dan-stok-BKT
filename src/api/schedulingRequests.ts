"use client";

import { supabase } from '@/integrations/supabase/client';

export type SchedulingRequestStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
export type SchedulingRequestType = 'installation' | 'maintenance' | 'service' | 'delivery';

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
  requested_date: string;
  requested_time: string | null;
  contact_person: string;
  phone_number: string;
  customer_type: string | null;
  payment_method: string | null;
  status: SchedulingRequestStatus;
  notes: string | null;
  created_at: string;
}

/**
 * Mengambil semua permintaan penjadwalan untuk pengguna tertentu.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Array permintaan penjadwalan.
 */
export async function fetchSchedulingRequests(userId: string): Promise<SchedulingRequest[]> {
  const { data, error } = await supabase
    .from('scheduling_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Menambahkan permintaan penjadwalan baru.
 * @param requestData Data permintaan penjadwalan baru.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Permintaan penjadwalan yang baru ditambahkan.
 */
export async function addSchedulingRequest(
  requestData: Omit<SchedulingRequest, 'id' | 'created_at' | 'user_id' | 'status'>,
  userId: string
): Promise<SchedulingRequest> {
  const { data, error } = await supabase
    .from('scheduling_requests')
    .insert({
      ...requestData,
      user_id: userId,
      status: 'pending', // Status awal selalu 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Memperbarui permintaan penjadwalan.
 * @param id ID permintaan penjadwalan.
 * @param updates Data yang akan diperbarui.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Permintaan penjadwalan yang diperbarui.
 */
export async function updateSchedulingRequest(
  id: string,
  updates: Partial<SchedulingRequest>,
  userId: string
): Promise<SchedulingRequest> {
  const { data, error } = await supabase
    .from('scheduling_requests')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Menghapus permintaan penjadwalan.
 * @param id ID permintaan penjadwalan.
 * @param userId ID pengguna yang diautentikasi.
 */
export async function deleteSchedulingRequest(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('scheduling_requests')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}