"use client";

import { supabase } from '@/integrations/supabase/client';

export type PurchaseRequestStatus = 'pending' | 'approved' | 'rejected' | 'waiting_for_receipt' | 'closed';

export interface PurchaseRequest {
  id: string;
  user_id: string;
  item_name: string;
  item_code: string;
  quantity: number;
  unit_price: number;
  suggested_selling_price: number;
  total_price: number;
  supplier: string | null;
  notes: string | null;
  status: PurchaseRequestStatus;
  created_at: string;
  document_url: string | null;
  received_quantity: number | null;
  returned_quantity: number | null;
  damaged_quantity: number | null;
  target_warehouse_category: 'siap_jual' | 'riset' | 'retur' | null;
  received_notes: string | null;
  received_at: string | null;
  product_id: string | null;
}

/**
 * Mengambil semua permintaan pembelian untuk pengguna tertentu.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Array permintaan pembelian.
 */
export async function fetchPurchaseRequests(userId: string): Promise<PurchaseRequest[]> {
  const { data, error } = await supabase
    .from('purchase_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Menambahkan permintaan pembelian baru.
 * @param purchaseRequest Data permintaan pembelian baru.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Permintaan pembelian yang baru ditambahkan.
 */
export async function addPurchaseRequest(
  purchaseRequest: Omit<PurchaseRequest, 'id' | 'created_at' | 'user_id' | 'status' | 'total_price'>,
  userId: string
): Promise<PurchaseRequest> {
  // Hitung total harga
  const totalPrice = purchaseRequest.quantity * purchaseRequest.unit_price;

  const { data, error } = await supabase
    .from('purchase_requests')
    .insert({
      ...purchaseRequest,
      user_id: userId,
      status: 'pending',
      total_price: totalPrice,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Memperbarui permintaan pembelian.
 * @param id ID permintaan pembelian.
 * @param updates Data yang akan diperbarui.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Permintaan pembelian yang diperbarui.
 */
export async function updatePurchaseRequest(
  id: string,
  updates: Partial<PurchaseRequest>,
  userId: string
): Promise<PurchaseRequest> {
  const { data, error } = await supabase
    .from('purchase_requests')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Menghapus permintaan pembelian.
 * @param id ID permintaan pembelian.
 * @param userId ID pengguna yang diautentikasi.
 */
export async function deletePurchaseRequest(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('purchase_requests')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}