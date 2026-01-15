-- Create CustomerType enum
CREATE TYPE public.customer_type_enum AS ENUM ('B2C', 'B2B');

-- Create customers table
CREATE TABLE public.customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  company_name TEXT,
  address TEXT,
  phone_number TEXT,
  customer_type public.customer_type_enum NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Policies for customers table
CREATE POLICY "Users can view their own customers" ON public.customers
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own customers" ON public.customers
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customers" ON public.customers
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own customers" ON public.customers
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Optional: Admin can view all customers (if an admin role exists and is_user_admin function is available)
-- If you have an 'is_user_admin' function, uncomment and use this:
-- CREATE POLICY "Admins can view all customers" ON public.customers
-- FOR SELECT TO authenticated USING (is_user_admin(auth.uid()));

-- Trigger to update 'updated_at' timestamp
CREATE TRIGGER set_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();