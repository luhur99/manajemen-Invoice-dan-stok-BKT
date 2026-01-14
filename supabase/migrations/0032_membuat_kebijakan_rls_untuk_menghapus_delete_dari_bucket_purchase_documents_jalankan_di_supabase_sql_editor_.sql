CREATE POLICY "allow_authenticated_deletes_own_purchase_documents"
    ON storage.objects FOR DELETE TO authenticated USING (
      bucket_id = 'purchase_documents' AND (owner = (SELECT auth.uid()))
    );