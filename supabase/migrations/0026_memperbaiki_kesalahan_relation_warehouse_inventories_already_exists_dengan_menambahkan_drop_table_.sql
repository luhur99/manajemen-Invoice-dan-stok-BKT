-- Pastikan tipe enum stock_category_enum ada
DO $$ BEGIN
  CREATE TYPE public.stock_category_enum AS ENUM ('siap_jual', 'riset', 'retur');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Pastikan tipe enum transaction_type_enum ada
DO $$ BEGIN
  CREATE TYPE public.transaction_type_enum AS ENUM ('initial', 'in', 'out', 'return', 'damage_loss', 'adjustment');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Hapus tabel stock_transactions dan stock_movements yang ada karena perubahan foreign key
DROP TABLE IF EXISTS public.stock_transactions CASCADE;
DROP TABLE IF EXISTS public.stock_movements CASCADE;
-- Hapus tabel warehouse_inventories jika sudah ada
DROP TABLE IF EXISTS public.warehouse_inventories CASCADE;

-- Modifikasi tabel stock_items: Hapus kolom stok yang tidak lagi relevan
ALTER TABLE public.stock_items
DROP COLUMN IF EXISTS stock_awal,
DROP COLUMN IF EXISTS stock_masuk,
DROP COLUMN IF EXISTS stock_keluar,
DROP COLUMN IF EXISTS stock_akhir,
DROP COLUMN IF EXISTS warehouse_category;

-- Buat tabel warehouse_inventories untuk melacak stok per kategori
CREATE TABLE public.warehouse_inventories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.stock_items(id) ON DELETE CASCADE,
  warehouse_category public.stock_category_enum NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (product_id, warehouse_category) -- Memastikan hanya ada satu entri per produk dan kategori
);

-- Aktifkan RLS untuk warehouse_inventories
ALTER TABLE public.warehouse_inventories ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS untuk warehouse_inventories
CREATE POLICY "Users can view their own warehouse inventories" ON public.warehouse_inventories
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own warehouse inventories" ON public.warehouse_inventories
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own warehouse inventories" ON public.warehouse_inventories
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own warehouse inventories" ON public.warehouse_inventories
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Buat ulang tabel stock_transactions dengan kolom warehouse_category
CREATE TABLE public.stock_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stock_item_id UUID REFERENCES public.stock_items(id) ON DELETE CASCADE,
  transaction_type public.transaction_type_enum NOT NULL,
  quantity INTEGER NOT NULL,
  notes TEXT,
  transaction_date DATE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  warehouse_category public.stock_category_enum -- Kolom baru
);

-- Aktifkan RLS untuk stock_transactions
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

-- Buat ulang tabel stock_movements
CREATE TABLE public.stock_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stock_item_id UUID NOT NULL REFERENCES public.stock_items(id) ON DELETE CASCADE,
  from_category public.stock_category_enum NOT NULL,
  to_category public.stock_category_enum NOT NULL,
  quantity INTEGER NOT NULL,
  reason TEXT,
  movement_date DATE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktifkan RLS untuk stock_movements
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