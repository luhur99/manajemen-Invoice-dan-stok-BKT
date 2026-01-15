-- Create the warehouse_categories table
CREATE TABLE public.warehouse_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE, -- To store the programmatic code like 'siap_jual'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED)
ALTER TABLE public.warehouse_categories ENABLE ROW LEVEL SECURITY;

-- Policies for warehouse_categories
-- Allow authenticated users to view all categories
CREATE POLICY "Authenticated users can view warehouse categories" ON public.warehouse_categories
FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to insert new categories (optional, can be restricted to admins)
CREATE POLICY "Authenticated users can insert their own warehouse categories" ON public.warehouse_categories
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own categories (optional, can be restricted to admins)
CREATE POLICY "Authenticated users can update their own warehouse categories" ON public.warehouse_categories
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Allow authenticated users to delete their own categories (optional, can be restricted to admins)
CREATE POLICY "Authenticated users can delete their own warehouse categories" ON public.warehouse_categories
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Insert initial data from the existing enum values
-- Removed user_id from the insert statement to allow it to be NULL for initial global categories
INSERT INTO public.warehouse_categories (name, code) VALUES
('Siap Jual', 'siap_jual'),
('Riset', 'riset'),
('Retur', 'retur'),
('Backup Teknisi', 'backup_teknisi')
ON CONFLICT (code) DO NOTHING; -- Prevents re-inserting if already exists