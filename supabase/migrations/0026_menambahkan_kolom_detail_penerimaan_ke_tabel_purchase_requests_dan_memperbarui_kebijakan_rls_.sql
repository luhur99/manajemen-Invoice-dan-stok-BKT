ALTER TABLE public.purchase_requests
ADD COLUMN received_quantity INTEGER DEFAULT 0,
ADD COLUMN returned_quantity INTEGER DEFAULT 0,
ADD COLUMN damaged_quantity INTEGER DEFAULT 0,
ADD COLUMN target_warehouse_category stock_category_enum,
ADD COLUMN received_notes TEXT,
ADD COLUMN received_at TIMESTAMP WITH TIME ZONE;

-- Drop existing update policy for users to replace it with a more flexible one
DROP POLICY IF EXISTS "Users can update their own pending purchase requests" ON public.purchase_requests;

-- Create a new policy that allows users to update their own requests if not yet closed/rejected
CREATE POLICY "Users can update their own purchase requests" ON public.purchase_requests
FOR UPDATE TO authenticated
USING (auth.uid() = user_id AND status IN ('pending', 'waiting_for_receipt'));