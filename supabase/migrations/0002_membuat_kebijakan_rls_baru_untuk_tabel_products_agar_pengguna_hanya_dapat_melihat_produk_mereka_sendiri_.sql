CREATE POLICY "Users can view their own products" ON public.products
FOR SELECT TO authenticated USING (auth.uid() = user_id);