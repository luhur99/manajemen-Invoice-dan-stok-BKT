-- Buat bucket penyimpanan untuk dokumen jadwal
INSERT INTO storage.buckets (id, name, public)
VALUES ('schedule_documents', 'schedule_documents', TRUE) -- Setel ke TRUE jika akses publik diinginkan, jika tidak FALSE
ON CONFLICT (id) DO NOTHING; -- Hanya sisipkan jika belum ada

-- Kebijakan RLS untuk mengizinkan pengguna terautentikasi mengunggah dokumen jadwal mereka sendiri
CREATE POLICY "Allow authenticated uploads to schedule_documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'schedule_documents' AND
  auth.uid() = (SELECT user_id FROM public.schedules WHERE id = (path_tokens[2]::uuid))
);

-- Kebijakan RLS untuk mengizinkan pengguna terautentikasi melihat dokumen jadwal mereka sendiri
CREATE POLICY "Allow authenticated reads of own schedule_documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'schedule_documents' AND
  auth.uid() = (SELECT user_id FROM public.schedules WHERE id = (path_tokens[2]::uuid))
);

-- Kebijakan RLS untuk mengizinkan pengguna terautentikasi menghapus dokumen jadwal mereka sendiri
CREATE POLICY "Allow authenticated deletes of own schedule_documents"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'schedule_documents' AND
  auth.uid() = (SELECT user_id FROM public.schedules WHERE id = (path_tokens[2]::uuid))
);

-- Kebijakan RLS untuk mengizinkan pengguna terautentikasi memperbarui dokumen jadwal mereka sendiri
CREATE POLICY "Allow authenticated updates of own schedule_documents"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'schedule_documents' AND
  auth.uid() = (SELECT user_id FROM public.schedules WHERE id = (path_tokens[2]::uuid))
);