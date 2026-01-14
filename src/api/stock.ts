"use client";

import { supabase } from '@/integrations/supabase/client';

export type WarehouseCategory = 'siap_jual' | 'riset' | 'retur';

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

export interface WarehouseInventory {
  id: string;
  product_id: string;
  warehouse_category: WarehouseCategory;
  quantity: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  user_id: string;
  product_id: string;
  from_category: WarehouseCategory | null;
  to_category: WarehouseCategory;
  quantity: number;
  reason: string | null;
  movement_date: string;
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
 * Mencari produk berdasarkan kode barang atau nama barang untuk pengguna tertentu.
 * @param userId ID pengguna yang diautentikasi.
 * @param code Kode barang yang dicari.
 * @param name Nama barang yang dicari.
 * @returns Produk yang ditemukan atau null.
 */
export async function fetchProductByCodeOrName(userId: string, code?: string, name?: string): Promise<Product | null> {
  console.log("fetchProductByCodeOrName called with:", { userId, code, name }); // Log tambahan
  let query = supabase
    .from('products')
    .select('*')
    .eq('user_id', userId);

  if (code) {
    query = query.eq('kode_barang', code);
  } else if (name) {
    query = query.eq('nama_barang', name);
  } else {
    console.log("fetchProductByCodeOrName: No code or name provided, returning null."); // Log tambahan
    return null;
  }

  const { data, error } = await query.single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
    console.error("Error in fetchProductByCodeOrName:", error); // Log error
    throw error;
  }
  console.log("fetchProductByCodeOrName result:", data); // Log hasil
  return data;
}

/**
 * Menambahkan produk baru dan menginisialisasi stok di gudang 'siap_jual'.
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

  // Inisialisasi stok di gudang 'siap_jual' dengan 0 saat produk baru dibuat
  await supabase.from('warehouse_inventories').insert({
    product_id: data.id,
    warehouse_category: 'siap_jual',
    quantity: 0,
    user_id: userId,
  });

  return data;
}

/**
 * Mengambil inventaris untuk semua produk di semua gudang untuk pengguna tertentu.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Array inventaris gudang.
 */
export async function fetchWarehouseInventories(userId: string): Promise<WarehouseInventory[]> {
  const { data, error } = await supabase
    .from('warehouse_inventories')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

/**
 * Mengambil inventaris untuk produk tertentu di semua gudang untuk pengguna tertentu.
 * @param userId ID pengguna yang diautentikasi.
 * @param productId ID produk.
 * @returns Array inventaris gudang untuk produk tersebut.
 */
export async function fetchProductInventories(userId: string, productId: string): Promise<WarehouseInventory[]> {
  const { data, error } = await supabase
    .from('warehouse_inventories')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) throw error;
  return data;
}

/**
 * Menambahkan atau memperbarui stok di gudang tertentu.
 * @param productId ID produk.
 * @param warehouseCategory Kategori gudang.
 * @param quantity Jumlah yang akan ditambahkan (bisa negatif untuk mengurangi).
 * @param userId ID pengguna yang diautentikasi.
 */
export async function updateWarehouseStock(
  productId: string,
  warehouseCategory: WarehouseCategory,
  quantity: number,
  userId: string
): Promise<void> {
  const { data: existingInventory, error: fetchError } = await supabase
    .from('warehouse_inventories')
    .select('id, quantity')
    .eq('product_id', productId)
    .eq('warehouse_category', warehouseCategory)
    .eq('user_id', userId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found
    throw fetchError;
  }

  if (existingInventory) {
    const newQuantity = existingInventory.quantity + quantity;
    if (newQuantity < 0) {
      throw new Error('Kuantitas stok tidak boleh negatif.');
    }
    const { error } = await supabase
      .from('warehouse_inventories')
      .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
      .eq('id', existingInventory.id);
    if (error) throw error;
  } else {
    if (quantity < 0) {
      throw new Error('Tidak dapat mengurangi stok dari gudang kosong.');
    }
    const { error } = await supabase
      .from('warehouse_inventories')
      .insert({
        product_id: productId,
        warehouse_category: warehouseCategory,
        quantity,
        user_id: userId,
      });
    if (error) throw error;
  }
}

/**
 * Mencatat pergerakan stok antar gudang.
 * @param productId ID produk.
 * @param fromCategory Kategori gudang asal (null jika penerimaan awal).
 * @param toCategory Kategori gudang tujuan.
 * @param quantity Jumlah yang dipindahkan.
 * @param reason Alasan pergerakan.
 * @param userId ID pengguna yang diautentikasi.
 */
export async function recordStockMovement(
  productId: string,
  fromCategory: WarehouseCategory | null,
  toCategory: WarehouseCategory,
  quantity: number,
  reason: string | null,
  userId: string
): Promise<void> {
  // Kurangi stok dari gudang asal jika ada
  if (fromCategory) {
    await updateWarehouseStock(productId, fromCategory, -quantity, userId);
  }

  // Tambahkan stok ke gudang tujuan
  await updateWarehouseStock(productId, toCategory, quantity, userId);

  // Catat pergerakan stok
  const { error } = await supabase.from('stock_movements').insert({
    user_id: userId,
    product_id: productId,
    from_category: fromCategory,
    to_category: toCategory,
    quantity,
    reason,
  });

  if (error) throw error;
}

/**
 * Mengambil riwayat pergerakan stok untuk pengguna tertentu.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Array riwayat pergerakan stok.
 */
export async function fetchStockMovements(userId: string): Promise<StockMovement[]> {
  const { data, error } = await supabase
    .from('stock_movements')
    .select('*, products(nama_barang, kode_barang)') // Join dengan tabel products untuk nama barang
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(movement => ({
    ...movement,
    product_name: movement.products?.nama_barang, // Tambahkan nama_barang ke objek movement
    product_code: movement.products?.kode_barang, // Tambahkan kode_barang ke objek movement
  }));
}