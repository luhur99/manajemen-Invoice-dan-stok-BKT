-- Drop existing policy that only allows users to update their own requests
DROP POLICY IF EXISTS "Users can update their own purchase requests" ON public.purchase_requests;

-- Create a new policy that allows authenticated users to update their own requests
-- OR admin/staff users (using is_user_admin function) to update any request.
CREATE POLICY "Allow authenticated users to update their own or admin/staff to update all purchase requests"
ON public.purchase_requests
FOR UPDATE TO authenticated
USING (auth.uid() = user_id OR public.is_user_admin(auth.uid()))
WITH CHECK (auth.uid() = user_id OR public.is_user_admin(auth.uid()));