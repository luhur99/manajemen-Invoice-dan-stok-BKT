"use client";

import { supabase } from '@/integrations/supabase/client';

export type DeliveryOrderStatus = 'pending' | 'scheduled' | 'in_transit' | 'delivered' | 'cancelled';

export interface DeliveryOrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_type: string;
}

export interface DeliveryOrder {
  id: string;
  request_id: string | null; // Bisa merujuk ke scheduling_request atau purchase_request
  user_id: string;
  do_number: string;
  items_json: DeliveryOrderItem[]; // Menggunakan JSONB untuk menyimpan daftar item
  delivery_date: string;
  delivery_time: string | null;
  status: DeliveryOrderStatus;
  notes: string | null;
  created_at: string;
}

/**
 * Mengambil semua pesanan pengiriman untuk pengguna tertentu.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Array pesanan pengiriman.
 */
export async function fetchDeliveryOrders(userId: string): Promise<DeliveryOrder[]> {
  const { data, error } = await supabase
    .from('delivery_orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Menambahkan pesanan pengiriman baru.
 * @param orderData Data pesanan pengiriman baru.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Pesanan pengiriman yang baru ditambahkan.
 */
export async function addDeliveryOrder(
  orderData: Omit<DeliveryOrder, 'id' | 'created_at' | 'user_id' | 'status'>,
  userId: string
): Promise<DeliveryOrder> {
  const { data, error } = await supabase
    .from('delivery_orders')
    .insert({
      ...orderData,
      user_id: userId,
      status: 'pending', // Status awal selalu 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Memperbarui pesanan pengiriman.
 * @param id ID pesanan pengiriman.
 * @param updates Data yang akan diperbarui.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Pesanan pengiriman yang diperbarui.
 */
export async function updateDeliveryOrder(
  id: string,
  updates: Partial<DeliveryOrder>,
  userId: string
): Promise<DeliveryOrder> {
  const { data, error } = await supabase
    .from('delivery_orders')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Menghapus pesanan pengiriman.
 * @param id ID pesanan pengiriman.
 * @param userId ID pengguna yang diautentikasi.
 */
export async function deleteDeliveryOrder(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('delivery_orders')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}