-- Enable RLS (REQUIRED)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for each operation needed
CREATE POLICY "Users can view their own products" ON public.products
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products" ON public.products
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" ON public.products
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" ON public.products
FOR DELETE TO authenticated USING (auth.uid() = user_id);