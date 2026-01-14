-- Create the ENUM type for purchase request status if it doesn't exist
DO $$ BEGIN
  CREATE TYPE public.purchase_request_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create purchase_requests table
CREATE TABLE public.purchase_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  item_code TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC NOT NULL CHECK (unit_price >= 0),
  suggested_selling_price NUMERIC NOT NULL CHECK (suggested_selling_price >= 0),
  total_price NUMERIC NOT NULL CHECK (total_price >= 0),
  supplier TEXT,
  notes TEXT,
  status purchase_request_status DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED)
ALTER TABLE public.purchase_requests ENABLE ROW LEVEL SECURITY;

-- Policies for purchase_requests
-- Authenticated users can view their own purchase requests
CREATE POLICY "Users can view their own purchase requests" ON public.purchase_requests
FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Authenticated users can create purchase requests for themselves
CREATE POLICY "Users can create their own purchase requests" ON public.purchase_requests
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their own pending purchase requests
CREATE POLICY "Users can update their own pending purchase requests" ON public.purchase_requests
FOR UPDATE TO authenticated USING (auth.uid() = user_id AND status = 'pending');

-- Authenticated users can delete their own pending purchase requests
CREATE POLICY "Users can delete their own pending purchase requests" ON public.purchase_requests
FOR DELETE TO authenticated USING (auth.uid() = user_id AND status = 'pending');

-- Admin users can view all purchase requests
CREATE POLICY "Admins can view all purchase requests" ON public.purchase_requests
FOR SELECT USING (is_user_admin(auth.uid()));

-- Admin users can update any purchase request (e.g., change status)
CREATE POLICY "Admins can update any purchase request" ON public.purchase_requests
FOR UPDATE USING (is_user_admin(auth.uid()));

-- Admin users can delete any purchase request
CREATE POLICY "Admins can delete any purchase request" ON public.purchase_requests
FOR DELETE USING (is_user_admin(auth.uid()));