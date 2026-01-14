-- Create sales_details table
CREATE TABLE public.sales_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  no INTEGER NOT NULL,
  kirim_install TEXT NOT NULL,
  no_transaksi TEXT NOT NULL UNIQUE, -- Assuming No Transaksi is unique
  invoice_number TEXT NOT NULL, -- Renamed from 'Invoice' to avoid keyword conflict
  new_old TEXT,
  perusahaan TEXT,
  tanggal DATE NOT NULL,
  hari TEXT,
  jam TEXT,
  customer TEXT NOT NULL,
  alamat_install TEXT,
  no_hp TEXT,
  type TEXT,
  qty_unit INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  harga NUMERIC DEFAULT 0,
  web TEXT,
  qty_web INTEGER DEFAULT 0,
  kartu TEXT,
  qty_kartu INTEGER DEFAULT 0,
  paket TEXT,
  pulsa NUMERIC DEFAULT 0,
  teknisi TEXT,
  payment TEXT,
  catatan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.sales_details ENABLE ROW LEVEL SECURITY;

-- Create secure policies for each operation
CREATE POLICY "sales_details_select_policy" ON public.sales_details
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "sales_details_insert_policy" ON public.sales_details
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sales_details_update_policy" ON public.sales_details
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "sales_details_delete_policy" ON public.sales_details
FOR DELETE TO authenticated USING (auth.uid() = user_id);