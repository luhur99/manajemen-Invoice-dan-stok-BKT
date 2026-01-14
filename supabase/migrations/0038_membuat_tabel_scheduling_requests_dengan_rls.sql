-- Create scheduling_requests table
CREATE TABLE public.scheduling_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  company_name TEXT,
  type public.scheduling_request_type NOT NULL,
  vehicle_units INTEGER,
  vehicle_type TEXT,
  vehicle_year INTEGER,
  full_address TEXT NOT NULL,
  landmark TEXT,
  requested_date DATE NOT NULL,
  requested_time TEXT,
  contact_person TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  customer_type TEXT, -- Can be ENUM 'lama', 'baru' if needed later
  payment_method TEXT,
  status public.scheduling_request_status DEFAULT 'pending' NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED)
ALTER TABLE public.scheduling_requests ENABLE ROW LEVEL SECURITY;

-- Policies for scheduling_requests
CREATE POLICY "Users can view their own scheduling requests" ON public.scheduling_requests
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scheduling requests" ON public.scheduling_requests
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending scheduling requests" ON public.scheduling_requests
FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (status = 'pending');

CREATE POLICY "Users can delete their own pending scheduling requests" ON public.scheduling_requests
FOR DELETE TO authenticated USING ((auth.uid() = user_id) AND (status = 'pending'));

-- Admin policies (if an admin role is defined)
CREATE POLICY "Admins can view all scheduling requests" ON public.scheduling_requests
FOR SELECT TO authenticated USING (is_user_admin(auth.uid()));

CREATE POLICY "Admins can update any scheduling request" ON public.scheduling_requests
FOR UPDATE TO authenticated USING (is_user_admin(auth.uid()));

CREATE POLICY "Admins can delete any scheduling request" ON public.scheduling_requests
FOR DELETE TO authenticated USING (is_user_admin(auth.uid()));