"use client";

import { supabase } from '@/integrations/supabase/client';

/**
 * Mengunggah file ke bucket Supabase Storage tertentu.
 * @param bucketName Nama bucket penyimpanan.
 * @param filePath Jalur lengkap file di dalam bucket (misalnya, 'user_id/invoice_id/filename.pdf').
 * @param file File yang akan diunggah.
 * @returns URL publik file yang diunggah.
 */
export async function uploadFile(
  bucketName: string,
  filePath: string,
  file: File
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true, // Mengganti file jika sudah ada
    });

  if (error) {
    throw new Error(`Gagal mengunggah file: ${error.message}`);
  }

  // Dapatkan URL publik file
  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error('Gagal mendapatkan URL publik file yang diunggah.');
  }

  return publicUrlData.publicUrl;
}

/**
 * Menghapus file dari bucket Supabase Storage tertentu.
 * @param bucketName Nama bucket penyimpanan.
 * @param filePath Jalur lengkap file di dalam bucket.
 */
export async function deleteFile(
  bucketName: string,
  filePath: string
): Promise<void> {
  const { error } = await supabase.storage
    .from(bucketName)
    .remove([filePath]);

  if (error) {
    throw new Error(`Gagal menghapus file: ${error.message}`);
  }
}

/**
 * Mendapatkan jalur file dari URL publik Supabase Storage.
 * @param publicUrl URL publik file.
 * @param bucketName Nama bucket penyimpanan.
 * @returns Jalur file di dalam bucket.
 */
export function getFilePathFromPublicUrl(publicUrl: string, bucketName: string): string | null {
  const bucketPath = `/storage/v1/object/public/${bucketName}/`;
  const index = publicUrl.indexOf(bucketPath);
  if (index !== -1) {
    return publicUrl.substring(index + bucketPath.length);
  }
  return null;
}