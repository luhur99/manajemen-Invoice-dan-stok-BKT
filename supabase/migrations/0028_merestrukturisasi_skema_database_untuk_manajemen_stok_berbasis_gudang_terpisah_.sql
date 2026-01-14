-- 1. Rename stock_items to products
ALTER TABLE public.stock_items RENAME TO products;

-- 2. Modify products table (formerly stock_items)
-- Drop existing RLS policies on stock_items first, as table name changed
DROP POLICY IF EXISTS "Allow all users to read stock items" ON public.products;
DROP POLICY IF EXISTS "Users can update their own stock items" ON public.products;
DROP POLICY IF EXISTS "Users can only insert their own stock items" ON public.products;
DROP POLICY IF EXISTS "Users can only delete their own stock items" ON public.products;
DROP POLICY IF EXISTS "stock_items_select_policy" ON public.products;
DROP POLICY IF EXISTS "stock_items_update_policy" ON public.products;

-- Drop columns that will be moved to warehouse_inventories or are no longer needed
ALTER TABLE public.products
DROP COLUMN IF EXISTS no,
DROP COLUMN IF EXISTS stock_awal,
DROP COLUMN IF EXISTS stock_masuk,
DROP COLUMN IF EXISTS stock_keluar,
DROP COLUMN IF EXISTS stock_akhir,
DROP COLUMN IF EXISTS warehouse_category;

-- Re-enable RLS on the renamed table (products)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies for products (master list of items)
CREATE POLICY "Public read access to products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Users can insert their own products" ON public.products FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own products" ON public.products FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own products" ON public.products FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 3. Create warehouse_inventories table
CREATE TABLE public.warehouse_inventories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  warehouse_category public.stock_category_enum NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (product_id, warehouse_category) -- A product can only have one entry per category
);

ALTER TABLE public.warehouse_inventories ENABLE ROW LEVEL SECURITY;

-- RLS policies for warehouse_inventories
CREATE POLICY "Users can view their own warehouse inventories" ON public.warehouse_inventories FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert into their own warehouse inventories" ON public.warehouse_inventories FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own warehouse inventories" ON public.warehouse_inventories FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete from their own warehouse inventories" ON public.warehouse_inventories FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 4. Update stock_transactions table
-- Drop existing foreign key constraint to stock_items
ALTER TABLE public.stock_transactions
DROP CONSTRAINT IF EXISTS stock_transactions_stock_item_id_fkey;

-- Rename stock_item_id to product_id
ALTER TABLE public.stock_transactions RENAME COLUMN stock_item_id TO product_id;

-- Add new foreign key constraint to products
ALTER TABLE public.stock_transactions
ADD CONSTRAINT stock_transactions_product_id_fkey
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

-- Add warehouse_category column to stock_transactions
ALTER TABLE public.stock_transactions
ADD COLUMN IF NOT EXISTS warehouse_category public.stock_category_enum;

-- Update RLS policies for stock_transactions
DROP POLICY IF EXISTS "stock_transactions_select_policy" ON public.stock_transactions;
DROP POLICY IF EXISTS "stock_transactions_insert_policy" ON public.stock_transactions;
DROP POLICY IF EXISTS "stock_transactions_update_policy" ON public.stock_transactions;
DROP POLICY IF EXISTS "stock_transactions_delete_policy" ON public.stock_transactions;

CREATE POLICY "Users can view their own stock transactions" ON public.stock_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own stock transactions" ON public.stock_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own stock transactions" ON public.stock_transactions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own stock transactions" ON public.stock_transactions FOR DELETE TO authenticated USING (auth.uid() = user_id);


-- 5. Update stock_movements table
-- Drop existing foreign key constraint to stock_items
ALTER TABLE public.stock_movements
DROP CONSTRAINT IF EXISTS stock_movements_stock_item_id_fkey;

-- Rename stock_item_id to product_id
ALTER TABLE public.stock_movements RENAME COLUMN stock_item_id TO product_id;

-- Add new foreign key constraint to products
ALTER TABLE public.stock_movements
ADD CONSTRAINT stock_movements_product_id_fkey
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

-- Update RLS policies for stock_movements
DROP POLICY IF EXISTS "Users can view their own stock movements" ON public.stock_movements;
DROP POLICY IF EXISTS "Users can insert their own stock movements" ON public.stock_movements;
DROP POLICY IF EXISTS "Users can update their own stock movements" ON public.stock_movements;
DROP POLICY IF EXISTS "Users can delete their own stock movements" ON public.stock_movements;

CREATE POLICY "Users can view their own stock movements" ON public.stock_movements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own stock movements" ON public.stock_movements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own stock movements" ON public.stock_movements FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own stock movements" ON public.stock_movements FOR DELETE TO authenticated USING (auth.uid() = user_id);


-- 6. Update invoice_items table
-- Add product_id column
ALTER TABLE public.invoice_items
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id) ON DELETE SET NULL; -- Use SET NULL if product is deleted

-- Update RLS policies for invoice_items
DROP POLICY IF EXISTS "Users can view their own invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can insert their own invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can update their own invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can delete their own invoice items" ON public.invoice_items;

CREATE POLICY "Users can view their own invoice items" ON public.invoice_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own invoice items" ON public.invoice_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own invoice items" ON public.invoice_items FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own invoice items" ON public.invoice_items FOR DELETE TO authenticated USING (auth.uid() = user_id);


-- 7. Update purchase_requests table
-- Add product_id column
ALTER TABLE public.purchase_requests
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id) ON DELETE SET NULL; -- Use SET NULL if product is deleted

-- Update RLS policies for purchase_requests (already done in previous step, but ensure consistency)
-- The existing policies are fine as they use auth.uid() = user_id.
-- The trigger handle_purchase_request_status_validation is also fine.