INSERT INTO storage.buckets (id, name, public)
VALUES ('purchase_documents', 'purchase_documents', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload documents for their own purchase requests
CREATE POLICY "Allow authenticated uploads for purchase documents" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'purchase_documents' AND auth.uid() = (
    SELECT user_id FROM public.purchase_requests WHERE id = (
      substring(name from 'purchase_documents/([0-9a-fA-F-]+)/.*$')::uuid
    )
  )
);

-- Allow authenticated users to view their own purchase documents
CREATE POLICY "Allow authenticated reads for purchase documents" ON storage.objects
FOR SELECT TO authenticated USING (
  bucket_id = 'purchase_documents' AND auth.uid() = (
    SELECT user_id FROM public.purchase_requests WHERE id = (
      substring(name from 'purchase_documents/([0-9a-fA-F-]+)/.*$')::uuid
    )
  )
);

-- Allow authenticated users to delete their own purchase documents
CREATE POLICY "Allow authenticated deletes for purchase documents" ON storage.objects
FOR DELETE TO authenticated USING (
  bucket_id = 'purchase_documents' AND auth.uid() = (
    SELECT user_id FROM public.purchase_requests WHERE id = (
      substring(name from 'purchase_documents/([0-9a-fA-F-]+)/.*$')::uuid
    )
  )
);