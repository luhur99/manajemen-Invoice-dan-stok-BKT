-- Ini adalah instruksi untuk Anda. Anda perlu membuat bucket ini secara manual di Supabase Console.
-- Navigasi ke Storage -> New bucket. Beri nama 'invoices'.
-- Pastikan kebijakan akses (policies) diatur dengan benar.
-- Contoh kebijakan RLS untuk bucket 'invoices' (jika Anda ingin hanya pengguna terautentikasi yang dapat mengunggah):

-- Enable RLS on the 'invoices' bucket (this is done automatically when creating a new bucket)

-- Policy for authenticated users to upload files
CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'invoices');

-- Policy for authenticated users to view their own files (adjust as needed)
CREATE POLICY "Allow authenticated read access" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'invoices' AND auth.uid() = owner);

-- Policy for authenticated users to delete their own files (adjust as needed)
CREATE POLICY "Allow authenticated delete access" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'invoices' AND auth.uid() = owner);