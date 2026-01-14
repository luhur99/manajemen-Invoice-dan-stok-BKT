"use client";

import { supabase } from '@/integrations/supabase/client';

export type ScheduleStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Schedule {
  id: string;
  user_id: string;
  schedule_date: string;
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
}

/**
 * Mengambil semua jadwal untuk pengguna tertentu.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Array jadwal.
 */
export async function fetchSchedules(userId: string): Promise<Schedule[]> {
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('user_id', userId)
    .order('schedule_date', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Menambahkan jadwal baru.
 * @param schedule Data jadwal baru.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Jadwal yang baru ditambahkan.
 */
export async function addSchedule(
  schedule: Omit<Schedule, 'id' | 'created_at' | 'user_id'>,
  userId: string
): Promise<Schedule> {
  const { data, error } = await supabase
    .from('schedules')
    .insert({
      ...schedule,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Memperbarui jadwal.
 * @param id ID jadwal.
 * @param updates Data yang akan diperbarui.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Jadwal yang diperbarui.
 */
export async function updateSchedule(
  id: string,
  updates: Partial<Schedule>,
  userId: string
): Promise<Schedule> {
  const { data, error } = await supabase
    .from('schedules')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Menghapus jadwal.
 * @param id ID jadwal.
 * @param userId ID pengguna yang diautentikasi.
 */
export async function deleteSchedule(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('schedules')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}