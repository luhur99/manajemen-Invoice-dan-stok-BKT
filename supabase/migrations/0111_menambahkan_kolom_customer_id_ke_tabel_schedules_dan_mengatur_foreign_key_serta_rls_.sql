-- Add customer_id to schedules table
ALTER TABLE public.schedules
ADD COLUMN customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;

-- Update RLS policies for schedules to include customer_id
-- Existing policies should be reviewed and updated if they implicitly relied on customer_name for user-specific access.
-- For now, assuming existing policies are broad enough or user_id based.
-- If specific customer-based RLS is needed, new policies would be required.

-- Example: If you had a policy like "Users can only see their own schedules"
-- CREATE POLICY "Users can view their own schedules" ON public.schedules
-- FOR SELECT TO authenticated USING (auth.uid() = user_id);
-- This policy remains valid as it uses user_id.

-- If you need to ensure a user can only see schedules related to customers they own (if customers also have user_id)
-- This would require a more complex policy or a join in the RLS.
-- For simplicity, we'll assume existing RLS on schedules is sufficient or will be updated separately if needed.