"use client";

import { supabase } from '@/integrations/supabase/client';

/**
 * Mengambil jumlah total faktur untuk pengguna tertentu.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Jumlah total faktur.
 */
export async function fetchTotalInvoices(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) throw error;
  return count || 0;
}

/**
 * Mengambil jumlah jadwal dengan status 'scheduled' untuk pengguna tertentu.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Jumlah jadwal tertunda.
 */
export async function fetchPendingSchedules(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('schedules')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'scheduled'); // Asumsi 'scheduled' adalah status tertunda

  if (error) throw error;
  return count || 0;
}

/**
 * Mengambil total kuantitas semua item stok di gudang untuk pengguna tertentu.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Total kuantitas item stok.
 */
export async function fetchTotalStockItems(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('warehouse_inventories')
    .select('quantity')
    .eq('user_id', userId);

  if (error) throw error;
  return data.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Mengambil jumlah permintaan pembelian dengan status 'pending' untuk pengguna tertentu.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Jumlah permintaan pembelian tertunda.
 */
export async function fetchPendingPurchaseRequests(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('purchase_requests')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'pending');

  if (error) throw error;
  return count || 0;
}

/**
 * Mengambil jumlah pesanan pengiriman dengan status 'pending' untuk pengguna tertentu.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Jumlah pesanan pengiriman tertunda.
 */
export async function fetchPendingDeliveryOrders(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('delivery_orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'pending');

  if (error) throw error;
  return count || 0;
}