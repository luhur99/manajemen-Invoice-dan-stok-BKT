"use client";

import { supabase } from '@/integrations/supabase/client';

export interface SalesDetail {
  id: string;
  user_id: string;
  no: number;
  kirim_install: string;
  no_transaksi: string;
  invoice_number: string;
  new_old: string | null;
  perusahaan: string | null;
  tanggal: string;
  hari: string | null;
  jam: string | null;
  customer: string;
  alamat_install: string | null;
  no_hp: string | null;
  type: string | null;
  qty_unit: number | null;
  stock: number | null;
  harga: number | null;
  web: string | null;
  qty_web: number | null;
  kartu: string | null;
  qty_kartu: number | null;
  paket: string | null;
  pulsa: number | null;
  teknisi: string | null;
  payment: string | null;
  catatan: string | null;
  created_at: string;
}

/**
 * Mengambil semua detail penjualan untuk pengguna tertentu.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Array detail penjualan.
 */
export async function fetchSalesDetails(userId: string): Promise<SalesDetail[]> {
  const { data, error } = await supabase
    .from('sales_details')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Menambahkan detail penjualan baru.
 * @param salesDetail Data detail penjualan baru.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Detail penjualan yang baru ditambahkan.
 */
export async function addSalesDetail(
  salesDetail: Omit<SalesDetail, 'id' | 'created_at' | 'user_id'>,
  userId: string
): Promise<SalesDetail> {
  const { data, error } = await supabase
    .from('sales_details')
    .insert({
      ...salesDetail,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Memperbarui detail penjualan.
 * @param id ID detail penjualan.
 * @param updates Data yang akan diperbarui.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Detail penjualan yang diperbarui.
 */
export async function updateSalesDetail(
  id: string,
  updates: Partial<SalesDetail>,
  userId: string
): Promise<SalesDetail> {
  const { data, error } = await supabase
    .from('sales_details')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Menghapus detail penjualan.
 * @param id ID detail penjualan.
 * @param userId ID pengguna yang diautentikasi.
 */
export async function deleteSalesDetail(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('sales_details')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}