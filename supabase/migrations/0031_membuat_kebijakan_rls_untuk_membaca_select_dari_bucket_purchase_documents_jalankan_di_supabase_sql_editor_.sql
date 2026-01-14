CREATE POLICY "allow_authenticated_reads_own_purchase_documents"
    ON storage.objects FOR SELECT TO authenticated USING (
      bucket_id = 'purchase_documents' AND (owner = (SELECT auth.uid()))
    );