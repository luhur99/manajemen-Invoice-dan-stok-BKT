CREATE POLICY "allow_authenticated_uploads_purchase_documents"
    ON storage.objects FOR INSERT TO authenticated WITH CHECK (
      bucket_id = 'purchase_documents' AND (owner = (SELECT auth.uid()))
    );