CREATE POLICY "Users can update their own scheduling requests" ON public.scheduling_requests
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);