-- Create stock_transactions table
CREATE TABLE public.stock_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stock_item_id UUID REFERENCES public.stock_items(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL, -- 'initial', 'in', 'out'
  quantity INTEGER NOT NULL,
  notes TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.stock_transactions ENABLE ROW LEVEL SECURITY;

-- Create secure policies for each operation
CREATE POLICY "stock_transactions_select_policy" ON public.stock_transactions
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "stock_transactions_insert_policy" ON public.stock_transactions
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "stock_transactions_update_policy" ON public.stock_transactions
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "stock_transactions_delete_policy" ON public.stock_transactions
FOR DELETE TO authenticated USING (auth.uid() = user_id);