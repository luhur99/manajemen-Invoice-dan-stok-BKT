ALTER TABLE public.schedules
ADD COLUMN document_url TEXT;

-- Update RLS policies to allow authenticated users to update this new column
CREATE POLICY "Users can update their own schedules document url" ON public.schedules
FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);