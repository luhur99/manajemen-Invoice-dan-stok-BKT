-- Create the 'documents' storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Policies for the 'documents' bucket
-- Allow authenticated users to insert files into the 'documents' bucket
CREATE POLICY "Allow authenticated uploads to documents bucket"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'documents');

-- Allow authenticated users to update files in the 'documents' bucket
CREATE POLICY "Allow authenticated updates to documents bucket"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'documents');

-- Allow authenticated users to view files in the 'documents' bucket
CREATE POLICY "Allow authenticated reads from documents bucket"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'documents');