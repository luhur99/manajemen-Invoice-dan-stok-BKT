-- Create sales_invoices table
CREATE TABLE public.sales_invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  no_transaksi TEXT NOT NULL UNIQUE, -- Unique identifier from Excel sales data
  invoice_file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.sales_invoices ENABLE ROW LEVEL SECURITY;

-- Policies for sales_invoices table
-- Allow all users (anon and authenticated) to read sales invoice URLs
CREATE POLICY "Allow all users to read sales invoices" ON public.sales_invoices
FOR SELECT USING (true);

-- Allow all users (anon and authenticated) to insert new sales invoice URLs
CREATE POLICY "Allow all users to insert sales invoices" ON public.sales_invoices
FOR INSERT WITH CHECK (true);

-- Allow all users (anon and authenticated) to update sales invoice URLs
CREATE POLICY "Allow all users to update sales invoices" ON public.sales_invoices
FOR UPDATE USING (true) WITH CHECK (true);

-- Allow all users (anon and authenticated) to delete sales invoice URLs
CREATE POLICY "Allow all users to delete sales invoices" ON public.sales_invoices
FOR DELETE USING (true);