-- Add customer_id column to scheduling_requests
ALTER TABLE public.scheduling_requests
ADD COLUMN customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;

-- Update RLS policies for scheduling_requests to include customer_id
-- Existing policies should automatically apply to new columns for SELECT/UPDATE/INSERT if they use 'true' or 'auth.uid() = user_id'
-- If specific policies are needed for customer_id, they would be added here.
-- For now, the existing user-specific policies are sufficient.

-- Drop redundant columns from scheduling_requests
ALTER TABLE public.scheduling_requests
DROP COLUMN customer_name,
DROP COLUMN company_name,
DROP COLUMN phone_number,
DROP COLUMN customer_type;