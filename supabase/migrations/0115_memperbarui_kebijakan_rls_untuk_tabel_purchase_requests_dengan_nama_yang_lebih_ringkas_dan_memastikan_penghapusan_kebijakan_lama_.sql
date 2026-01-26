-- Drop the old policy by its exact name if it exists
DROP POLICY IF EXISTS "Allow authenticated users to update their own or admin/staff to update all purchase requests" ON public.purchase_requests;

-- Create a new policy that allows authenticated users to update their own requests
-- OR admin/staff users (using is_user_admin function) to update any request.
CREATE POLICY "pr_update_own_or_admin_staff"
ON public.purchase_requests
FOR UPDATE TO authenticated
USING (auth.uid() = user_id OR public.is_user_admin(auth.uid()))
WITH CHECK (auth.uid() = user_id OR public.is_user_admin(auth.uid()));