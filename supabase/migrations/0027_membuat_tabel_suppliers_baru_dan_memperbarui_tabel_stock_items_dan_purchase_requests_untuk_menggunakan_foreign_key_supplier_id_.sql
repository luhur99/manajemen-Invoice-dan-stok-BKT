-- Membuat tabel suppliers
CREATE TABLE public.suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL UNIQUE,
  contact_person TEXT,
  phone_number TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktifkan RLS untuk suppliers
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS untuk suppliers
CREATE POLICY "Authenticated users can view all suppliers" ON public.suppliers
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert suppliers" ON public.suppliers
FOR INSERT TO authenticated WITH CHECK (is_user_admin(auth.uid()));

CREATE POLICY "Admins can update suppliers" ON public.suppliers
FOR UPDATE TO authenticated USING (is_user_admin(auth.uid()));

CREATE POLICY "Admins can delete suppliers" ON public.suppliers
FOR DELETE TO authenticated USING (is_user_admin(auth.uid()));

-- Menambahkan kolom supplier_id ke tabel stock_items
ALTER TABLE public.stock_items
ADD COLUMN supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL;

-- Menghapus kolom supplier (TEXT) dari tabel purchase_requests
ALTER TABLE public.purchase_requests
DROP COLUMN IF EXISTS supplier;

-- Menambahkan kolom supplier_id ke tabel purchase_requests
ALTER TABLE public.purchase_requests
ADD COLUMN supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL;