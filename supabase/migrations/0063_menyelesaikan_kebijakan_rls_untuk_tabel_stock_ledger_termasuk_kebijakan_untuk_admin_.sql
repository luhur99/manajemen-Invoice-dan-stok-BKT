-- Drop existing foreign key constraints that reference stock_transactions or stock_movements
-- (No direct FKs from other tables to stock_transactions or stock_movements based on schema context,
-- but it's good practice to check and drop if they existed)

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.stock_transactions CASCADE;
DROP TABLE IF EXISTS public.stock_movements CASCADE;

-- Create new enum type for stock event types
CREATE TYPE public.stock_event_type AS ENUM ('initial', 'in', 'out', 'transfer', 'adjustment');

-- Create the unified stock_ledger table
CREATE TABLE public.stock_ledger (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  event_type public.stock_event_type NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 0), -- Quantity should always be positive
  from_warehouse_category TEXT REFERENCES public.warehouse_categories(code) ON DELETE SET NULL, -- Nullable for 'in', 'initial'
  to_warehouse_category TEXT REFERENCES public.warehouse_categories(code) ON DELETE SET NULL,   -- Nullable for 'out', 'initial'
  notes TEXT,
  event_date DATE DEFAULT NOW(), -- Date of the event (e.g., transaction date, movement date)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED)
ALTER TABLE public.stock_ledger ENABLE ROW LEVEL SECURITY;

-- Policies for stock_ledger
-- Users can only see their own stock ledger entries
CREATE POLICY "Users can view their own stock ledger" ON public.stock_ledger
FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Users can only insert their own stock ledger entries
CREATE POLICY "Users can insert their own stock ledger" ON public.stock_ledger
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can only update their own stock ledger entries (if needed, e.g., correcting notes)
CREATE POLICY "Users can update their own stock ledger" ON public.stock_ledger
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Users can only delete their own stock ledger entries (if needed, e.g., correcting errors)
CREATE POLICY "Users can delete their own stock ledger" ON public.stock_ledger
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Admin policies for stock_ledger
CREATE POLICY "Admins can view all stock ledger entries" ON public.stock_ledger
FOR SELECT TO authenticated USING (is_user_admin(auth.uid()));

CREATE POLICY "Admins can insert any stock ledger entry" ON public.stock_ledger
FOR INSERT TO authenticated WITH CHECK (is_user_admin(auth.uid()));

CREATE POLICY "Admins can update any stock ledger entry" ON public.stock_ledger
FOR UPDATE TO authenticated USING (is_user_admin(auth.uid()));

CREATE POLICY "Admins can delete any stock ledger entry" ON public.stock_ledger
FOR DELETE TO authenticated USING (is_user_admin(auth.uid()));