-- Create stock_movements table
CREATE TABLE public.stock_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stock_item_id UUID REFERENCES public.stock_items(id) ON DELETE CASCADE NOT NULL,
  from_category public.stock_category_enum NOT NULL,
  to_category public.stock_category_enum NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  reason TEXT,
  movement_date DATE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED)
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

-- Policies for stock_movements
-- Users can only see their own stock movements
CREATE POLICY "Users can view their own stock movements" ON public.stock_movements
FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Users can only insert their own stock movements
CREATE POLICY "Users can insert their own stock movements" ON public.stock_movements
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can only update their own stock movements (if needed, e.g., correcting reason)
CREATE POLICY "Users can update their own stock movements" ON public.stock_movements
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Users can only delete their own stock movements (if needed, e.g., correcting an error)
CREATE POLICY "Users can delete their own stock movements" ON public.stock_movements
FOR DELETE TO authenticated USING (auth.uid() = user_id);