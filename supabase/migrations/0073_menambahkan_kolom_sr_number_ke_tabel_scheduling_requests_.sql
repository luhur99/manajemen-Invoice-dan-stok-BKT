ALTER TABLE public.scheduling_requests
ADD COLUMN sr_number TEXT UNIQUE;

-- Add RLS policies for the new sr_number column
CREATE POLICY "Allow authenticated users to view sr_number" ON public.scheduling_requests
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to update sr_number" ON public.scheduling_requests
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to insert sr_number" ON public.scheduling_requests
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);