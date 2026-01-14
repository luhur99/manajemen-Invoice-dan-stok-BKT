"use client";

import { supabase } from '@/integrations/supabase/client';
import { deleteFile, getFilePathFromPublicUrl } from '@/api/supabase/storage'; // Import storage utilities

export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  user_id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string | null;
  customer_name: string;
  company_name: string | null;
  total_amount: number;
  payment_status: PaymentStatus;
  created_at: string;
  type: string | null;
  customer_type: string | null;
  payment_method: string | null;
  notes: string | null;
  document_url: string | null;
  courier_service: string | null;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  user_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
  unit_type: string | null;
  product_id: string | null;
}

/**
 * Mengambil semua faktur untuk pengguna tertentu.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Array faktur.
 */
export async function fetchInvoices(userId: string): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Menambahkan faktur baru beserta item-itemnya.
 * @param invoiceData Data faktur baru.
 * @param itemsData Array data item faktur.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Faktur yang baru ditambahkan.
 */
export async function addInvoice(
  invoiceData: Omit<Invoice, 'id' | 'created_at' | 'user_id'>,
  itemsData: Omit<InvoiceItem, 'id' | 'invoice_id' | 'created_at' | 'user_id'>[],
  userId: string
): Promise<Invoice> {
  // Mulai transaksi
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      ...invoiceData,
      user_id: userId,
    })
    .select()
    .single();

  if (invoiceError) throw invoiceError;

  // Tambahkan item-item faktur
  if (itemsData.length > 0) {
    const itemsWithInvoiceId = itemsData.map(item => ({
      ...item,
      invoice_id: invoice.id,
      user_id: userId,
    }));

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(itemsWithInvoiceId);

    if (itemsError) throw itemsError;
  }

  return invoice;
}

/**
 * Memperbarui faktur.
 * @param id ID faktur.
 * @param updates Data yang akan diperbarui.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Faktur yang diperbarui.
 */
export async function updateInvoice(
  id: string,
  updates: Partial<Invoice>,
  userId: string
): Promise<Invoice> {
  const { data, error } = await supabase
    .from('invoices')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Menghapus faktur beserta item-itemnya.
 * @param id ID faktur.
 * @param userId ID pengguna yang diautentikasi.
 */
export async function deleteInvoice(id: string, userId: string): Promise<void> {
  // Ambil faktur untuk mendapatkan document_url sebelum dihapus
  const { data: invoiceToDelete, error: fetchError } = await supabase
    .from('invoices')
    .select('document_url')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  // Hapus item-item faktur terlebih dahulu
  const { error: itemsError } = await supabase
    .from('invoice_items')
    .delete()
    .eq('invoice_id', id);

  if (itemsError) throw itemsError;

  // Hapus faktur
  const { error: invoiceError } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (invoiceError) throw invoiceError;

  // Hapus dokumen terkait dari storage jika ada
  if (invoiceToDelete?.document_url) {
    const filePath = getFilePathFromPublicUrl(invoiceToDelete.document_url, 'invoice-documents');
    if (filePath) {
      await deleteFile('invoice-documents', filePath);
    }
  }
}

/**
 * Mengambil item-item faktur untuk faktur tertentu.
 * @param invoiceId ID faktur.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Array item faktur.
 */
export async function fetchInvoiceItems(invoiceId: string, userId: string): Promise<InvoiceItem[]> {
  const { data, error } = await supabase
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', invoiceId)
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Menambahkan item faktur baru.
 * @param itemData Data item faktur baru.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Item faktur yang baru ditambahkan.
 */
export async function addInvoiceItem(
  itemData: Omit<InvoiceItem, 'id' | 'created_at' | 'user_id'>,
  userId: string
): Promise<InvoiceItem> {
  const { data, error } = await supabase
    .from('invoice_items')
    .insert({
      ...itemData,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Memperbarui item faktur.
 * @param id ID item faktur.
 * @param updates Data yang akan diperbarui.
 * @param userId ID pengguna yang diautentikasi.
 * @returns Item faktur yang diperbarui.
 */
export async function updateInvoiceItem(
  id: string,
  updates: Partial<InvoiceItem>,
  userId: string
): Promise<InvoiceItem> {
  const { data, error } = await supabase
    .from('invoice_items')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Menghapus item faktur.
 * @param id ID item faktur.
 * @param userId ID pengguna yang diautentikasi.
 */
export async function deleteInvoiceItem(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('invoice_items')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}