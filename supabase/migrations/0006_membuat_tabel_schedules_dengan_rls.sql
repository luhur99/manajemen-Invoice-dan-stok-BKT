-- Create schedules table
CREATE TABLE public.schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  schedule_date DATE NOT NULL,
  schedule_time TEXT,
  type TEXT NOT NULL, -- e.g., 'instalasi', 'kirim'
  customer_name TEXT NOT NULL,
  address TEXT,
  technician_name TEXT,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL, -- Can be null if not directly linked to an invoice
  status TEXT NOT NULL DEFAULT 'scheduled', -- e.g., 'scheduled', 'in progress', 'completed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED)
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Policies for schedules table
CREATE POLICY "Users can view their own schedules" ON public.schedules 
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own schedules" ON public.schedules 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedules" ON public.schedules 
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schedules" ON public.schedules 
FOR DELETE TO authenticated USING (auth.uid() = user_id);