-- Add new columns to public.invoices table
ALTER TABLE public.invoices
ADD COLUMN type TEXT, -- 'instalasi' or 'kirim barang'
ADD COLUMN customer_type TEXT, -- 'lama' or 'baru'
ADD COLUMN payment_method TEXT,
ADD COLUMN notes TEXT;

-- Add new column to public.invoice_items table
ALTER TABLE public.invoice_items
ADD COLUMN unit_type TEXT;