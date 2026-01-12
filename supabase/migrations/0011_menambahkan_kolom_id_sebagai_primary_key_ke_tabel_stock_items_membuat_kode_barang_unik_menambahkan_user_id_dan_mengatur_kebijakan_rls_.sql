-- Add 'id' column if it doesn't exist and set as primary key
ALTER TABLE public.stock_items
ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

-- Ensure 'kode_barang' is unique
ALTER TABLE public.stock_items
ADD CONSTRAINT unique_kode_barang UNIQUE (kode_barang);

-- Update existing rows to ensure 'id' is populated if it was added
UPDATE public.stock_items
SET id = gen_random_uuid()
WHERE id IS NULL;

-- Add user_id column to stock_items
ALTER TABLE public.stock_items
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing rows to set user_id (if needed, for migration purposes)
-- This assumes a single user or a way to determine the owner for existing data.
-- For a new app, this won't be necessary as inserts will include user_id.
-- For existing data, you might need a more specific update query or manual intervention.
-- For now, we'll assume new inserts will handle it.

-- Enable RLS on stock_items (if not already enabled)
ALTER TABLE public.stock_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for stock_items
CREATE POLICY "stock_items_select_policy" ON public.stock_items
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "stock_items_insert_policy" ON public.stock_items
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "stock_items_update_policy" ON public.stock_items
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "stock_items_delete_policy" ON public.stock_items
FOR DELETE TO authenticated USING (auth.uid() = user_id);