-- Buat tipe enum transaction_type_enum jika belum ada
DO $$ BEGIN
  CREATE TYPE public.transaction_type_enum AS ENUM ('initial', 'in', 'out', 'return', 'damage_loss', 'adjustment');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Hapus tabel stock_transactions yang ada untuk membuat ulang dengan skema yang benar
DROP TABLE IF EXISTS public.stock_transactions CASCADE;

-- Buat tabel stock_transactions
CREATE TABLE public.stock_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stock_item_id UUID REFERENCES public.stock_items(id) ON DELETE CASCADE, -- Kolom dan foreign key yang diperbaiki
  transaction_type public.transaction_type_enum NOT NULL,
  quantity INTEGER NOT NULL,
  notes TEXT,
  transaction_date DATE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktifkan RLS (WAJIB)
ALTER TABLE public.stock_transactions ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS untuk stock_transactions
CREATE POLICY "Users can view their own stock transactions" ON public.stock_transactions
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stock transactions" ON public.stock_transactions
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stock transactions" ON public.stock_transactions
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stock transactions" ON public.stock_transactions
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Kebijakan Admin untuk akses penuh (asumsi fungsi is_user_admin ada)
CREATE POLICY "Admins can view all stock transactions" ON public.stock_transactions
FOR SELECT USING (is_user_admin(auth.uid()));

CREATE POLICY "Admins can insert any stock transaction" ON public.stock_transactions
FOR INSERT WITH CHECK (is_user_admin(auth.uid()));

CREATE POLICY "Admins can update any stock transaction" ON public.stock_transactions
FOR UPDATE USING (is_user_admin(auth.uid()));

CREATE POLICY "Admins can delete any stock transaction" ON public.stock_transactions
FOR DELETE USING (is_user_admin(auth.uid()));