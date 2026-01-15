-- Create stock_category_enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE public.stock_category_enum AS ENUM ('siap_jual', 'riset', 'retur');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create stock_items table
CREATE TABLE public.stock_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  kode_barang TEXT NOT NULL UNIQUE,
  nama_barang TEXT NOT NULL,
  satuan TEXT,
  harga_beli NUMERIC NOT NULL DEFAULT 0,
  harga_jual NUMERIC NOT NULL DEFAULT 0,
  stock_awal INTEGER NOT NULL DEFAULT 0,
  stock_masuk INTEGER NOT NULL DEFAULT 0,
  stock_keluar INTEGER NOT NULL DEFAULT 0,
  stock_akhir INTEGER NOT NULL DEFAULT 0,
  safe_stock_limit INTEGER DEFAULT 0,
  warehouse_category public.stock_category_enum DEFAULT 'siap_jual'::public.stock_category_enum,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED)
ALTER TABLE public.stock_items ENABLE ROW LEVEL SECURITY;

-- Policies for stock_items
CREATE POLICY "Users can view their own stock items" ON public.stock_items
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stock items" ON public.stock_items
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stock items" ON public.stock_items
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stock items" ON public.stock_items
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Admin policies for full access (assuming is_user_admin function exists)
CREATE POLICY "Admins can view all stock items" ON public.stock_items
FOR SELECT USING (is_user_admin(auth.uid()));

CREATE POLICY "Admins can insert any stock item" ON public.stock_items
FOR INSERT WITH CHECK (is_user_admin(auth.uid()));

CREATE POLICY "Admins can update any stock item" ON public.stock_items
FOR UPDATE USING (is_user_admin(auth.uid()));

CREATE POLICY "Admins can delete any stock item" ON public.stock_items
FOR DELETE USING (is_user_admin(auth.uid()));