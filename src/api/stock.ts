"use client";

import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  user_id: string;
  kode_barang: string;
  nama_barang: string;
  satuan: string;
  harga_beli: number;
  harga_jual: number;
  safe_stock_limit: number;
  created_at: string;
}

/**
 * Mengambil semua produk untuk pengguna tertentu.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Array produk.
 */
export async function fetchProducts(userId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Menambahkan produk baru.
 * @param product Data produk baru.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Produk yang baru ditambahkan.
 */
export async function addProduct(
  product: Omit<Product, 'id' | 'created_at' | 'user_id'>,
  userId: string
): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert({ ...product, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
}