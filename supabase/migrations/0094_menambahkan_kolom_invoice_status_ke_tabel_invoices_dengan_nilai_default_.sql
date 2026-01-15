ALTER TABLE public.invoices
ADD COLUMN invoice_status TEXT NOT NULL DEFAULT 'waiting_document_inv';