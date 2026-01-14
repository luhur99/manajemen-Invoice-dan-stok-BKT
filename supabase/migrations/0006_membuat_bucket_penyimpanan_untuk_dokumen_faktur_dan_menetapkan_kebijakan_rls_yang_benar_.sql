-- Buat bucket penyimpanan untuk dokumen faktur
INSERT INTO storage.buckets (id, name, public)
VALUES ('invoice-documents', 'invoice-documents', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Kebijakan untuk mengizinkan pengguna terautentikasi mengunggah dokumen faktur mereka sendiri
CREATE POLICY "Allow authenticated users to upload their own invoice documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'invoice-documents' AND auth.uid() = (storage.foldername(name))[1]::uuid);

-- Kebijakan untuk mengizinkan pengguna terautentikasi melihat dokumen faktur mereka sendiri
CREATE POLICY "Allow authenticated users to view their own invoice documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'invoice-documents' AND auth.uid() = (storage.foldername(name))[1]::uuid);

-- Kebijakan untuk mengizinkan pengguna terautentikasi memperbarui dokumen faktur mereka sendiri
CREATE POLICY "Allow authenticated users to update their own invoice documents"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'invoice-documents' AND auth.uid() = (storage.foldername(name))[1]::uuid);

-- Kebijakan untuk mengizinkan pengguna terautentikasi menghapus dokumen faktur mereka sendiri
CREATE POLICY "Allow authenticated users to delete their own invoice documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'invoice-documents' AND auth.uid() = (storage.foldername(name))[1]::uuid);