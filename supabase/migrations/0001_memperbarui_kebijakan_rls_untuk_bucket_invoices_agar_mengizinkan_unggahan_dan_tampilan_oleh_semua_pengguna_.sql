-- Hapus kebijakan INSERT dan SELECT yang mungkin ada untuk bucket 'invoices' jika menyebabkan konflik.
-- Anda bisa melakukannya secara manual di Supabase Console atau dengan perintah DROP POLICY.

-- Contoh:
-- DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow authenticated read access" ON storage.objects;

-- Kebijakan baru: Izinkan semua pengguna (anonim dan terautentikasi) untuk mengunggah file ke bucket 'invoices'.
-- PERINGATAN: Ini membuat bucket Anda dapat diunggah oleh siapa saja. Pertimbangkan untuk menambahkan autentikasi nanti.
CREATE POLICY "Allow all users to upload invoices" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'invoices');

-- Kebijakan baru: Izinkan semua pengguna (anonim dan terautentikasi) untuk melihat file di bucket 'invoices'.
CREATE POLICY "Allow all users to view invoices" ON storage.objects FOR SELECT USING (bucket_id = 'invoices');

-- Kebijakan DELETE tetap memerlukan pengguna terautentikasi untuk menghapus file mereka sendiri.
-- Jika Anda ingin pengguna anonim dapat menghapus, kebijakan ini perlu disesuaikan lebih lanjut.
-- Untuk saat ini, jika Anda belum memiliki autentikasi, fungsi hapus mungkin tidak akan berfungsi.
CREATE POLICY "Allow authenticated users to delete their own invoices" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'invoices' AND auth.uid() = owner);