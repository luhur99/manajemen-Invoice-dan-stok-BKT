-- Pastikan tipe enum stock_category_enum ada
DO $$ BEGIN
  CREATE TYPE public.stock_category_enum AS ENUM ('siap_jual', 'riset', 'retur');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Hapus tabel stock_movements yang ada untuk membuat ulang dengan skema yang benar
DROP TABLE IF EXISTS public.stock_movements CASCADE;

-- Buat tabel stock_movements
CREATE TABLE public.stock_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stock_item_id UUID NOT NULL REFERENCES public.stock_items(id) ON DELETE CASCADE, -- Kolom dan foreign key yang diperbaiki
  from_category public.stock_category_enum NOT NULL,
  to_category public.stock_category_enum NOT NULL,
  quantity INTEGER NOT NULL,
  reason TEXT,
  movement_date DATE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktifkan RLS (WAJIB)
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS untuk stock_movements
CREATE POLICY "Users can view their own stock movements" ON public.stock_movements
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stock movements" ON public.stock_movements
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stock movements" ON public.stock_movements
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stock movements" ON public.stock_movements
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Kebijakan Admin untuk akses penuh (asumsi fungsi is_user_admin ada)
CREATE POLICY "Admins can view all stock movements" ON public.stock_movements
FOR SELECT USING (is_user_admin(auth.uid()));

CREATE POLICY "Admins can insert any stock movement" ON public.stock_movements
FOR INSERT WITH CHECK (is_user_admin(auth.uid()));

CREATE POLICY "Admins can update any stock movement" ON public.stock_movements
FOR UPDATE USING (is_user_admin(auth.uid()));

CREATE POLICY "Admins can delete any stock movement" ON public.stock_movements
FOR DELETE USING (is_user_admin(auth.uid()));