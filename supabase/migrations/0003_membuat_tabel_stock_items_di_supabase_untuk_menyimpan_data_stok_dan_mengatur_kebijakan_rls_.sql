-- Create stock_items table
CREATE TABLE public.stock_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  no INTEGER NOT NULL,
  kode_barang TEXT NOT NULL UNIQUE,
  nama_barang TEXT NOT NULL,
  satuan TEXT,
  harga_beli NUMERIC NOT NULL,
  harga_jual NUMERIC NOT NULL,
  stock_awal INTEGER DEFAULT 0,
  stock_masuk INTEGER DEFAULT 0,
  stock_keluar INTEGER DEFAULT 0,
  stock_akhir INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.stock_items ENABLE ROW LEVEL SECURITY;

-- Policies for stock_items table
-- Allow all users (anon and authenticated) to read stock items
CREATE POLICY "Allow all users to read stock items" ON public.stock_items
FOR SELECT USING (true);

-- Allow all users (anon and authenticated) to insert new stock items
CREATE POLICY "Allow all users to insert stock items" ON public.stock_items
FOR INSERT WITH CHECK (true);

-- Allow all users (anon and authenticated) to update stock items
CREATE POLICY "Allow all users to update stock items" ON public.stock_items
FOR UPDATE USING (true) WITH CHECK (true);

-- Allow all users (anon and authenticated) to delete stock items
CREATE POLICY "Allow all users to delete stock items" ON public.stock_items
FOR DELETE USING (true);