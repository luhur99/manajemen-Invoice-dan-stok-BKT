-- Drop the previous function if it exists
DROP FUNCTION IF EXISTS public.check_purchase_request_new_status(public.purchase_request_status, uuid);

-- Create a BEFORE UPDATE trigger function for purchase_requests to validate status transitions
CREATE OR REPLACE FUNCTION public.handle_purchase_request_status_validation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Ensure user_id is not changed by the user
  IF OLD.user_id IS DISTINCT FROM NEW.user_id THEN
    RAISE EXCEPTION 'Cannot change user_id of a purchase request.';
  END IF;

  -- Validate status transitions
  IF OLD.status = 'pending' THEN
    IF NEW.status NOT IN ('approved', 'rejected', 'waiting_for_receipt') THEN
      RAISE EXCEPTION 'Invalid status transition from PENDING to %.', NEW.status;
    END IF;
  ELSIF OLD.status = 'approved' THEN
    IF NEW.status NOT IN ('waiting_for_receipt', 'rejected') THEN
      RAISE EXCEPTION 'Invalid status transition from APPROVED to %.', NEW.status;
    END IF;
  ELSIF OLD.status = 'waiting_for_receipt' THEN
    IF NEW.status NOT IN ('closed', 'rejected') THEN
      RAISE EXCEPTION 'Invalid status transition from WAITING_FOR_RECEIPT to %.', NEW.status;
    END IF;
  ELSIF OLD.status IN ('rejected', 'closed') THEN
    -- No status changes allowed once rejected or closed
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      RAISE EXCEPTION 'Cannot change status of a % purchase request.', OLD.status;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS on_purchase_request_update_validate_status ON public.purchase_requests;

-- Create the trigger
CREATE TRIGGER on_purchase_request_update_validate_status
BEFORE UPDATE ON public.purchase_requests
FOR EACH ROW EXECUTE FUNCTION public.handle_purchase_request_status_validation();

-- Drop the existing policy for purchase_requests update
DROP POLICY IF EXISTS "Users can update their own purchase requests" ON public.purchase_requests;

-- Create a new, simplified policy for purchase_requests update (status validation handled by trigger)
CREATE POLICY "Users can update their own purchase requests" ON public.purchase_requests
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id); -- Ensures user_id cannot be changed to another user's ID

-- Drop the existing policy for stock_items update
DROP POLICY IF EXISTS "Users can update their own stock items" ON public.stock_items;

-- Create a new policy for stock_items update to restrict to owner
CREATE POLICY "Users can update their own stock items" ON public.stock_items
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);