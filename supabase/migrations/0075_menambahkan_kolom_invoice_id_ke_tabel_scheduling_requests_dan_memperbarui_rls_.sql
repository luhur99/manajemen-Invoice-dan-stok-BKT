ALTER TABLE public.scheduling_requests
ADD COLUMN invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL;

-- Add RLS policies for the new invoice_id column
CREATE POLICY "Allow authenticated users to view invoice_id in scheduling_requests" ON public.scheduling_requests
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to update invoice_id in scheduling_requests" ON public.scheduling_requests
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to insert invoice_id in scheduling_requests" ON public.scheduling_requests
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);