-- Create the 'documents' storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Policies for the 'documents' bucket
-- Note: RLS on storage.objects is enabled by default in Supabase, so no ALTER TABLE is needed.

-- Allow authenticated users to insert files into the 'documents' bucket
DROP POLICY IF EXISTS "Allow authenticated uploads to documents bucket" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to documents bucket"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'documents');

-- Allow authenticated users to update files in the 'documents' bucket
DROP POLICY IF EXISTS "Allow authenticated updates to documents bucket" ON storage.objects;
CREATE POLICY "Allow authenticated updates to documents bucket"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'documents');

-- Allow authenticated users to view files in the 'documents' bucket
DROP POLICY IF EXISTS "Allow authenticated reads from documents bucket" ON storage.objects;
CREATE POLICY "Allow authenticated reads from documents bucket"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'documents');