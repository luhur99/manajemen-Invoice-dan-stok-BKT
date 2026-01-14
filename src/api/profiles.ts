"use client";

import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  role: string;
  updated_at: string | null;
}

/**
 * Mengambil profil pengguna berdasarkan ID.
 * @param userId ID pengguna.
 * @returns Objek profil pengguna atau null jika tidak ditemukan.
 */
export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
    throw error;
  }
  return data;
}

/**
 * Memperbarui profil pengguna.
 * @param userId ID pengguna.
 * @param updates Data yang akan diperbarui.
 * @returns Profil pengguna yang diperbarui.
 */
export async function updateProfile(
  userId: string,
  updates: Partial<Omit<Profile, 'id' | 'role' | 'created_at'>>
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}