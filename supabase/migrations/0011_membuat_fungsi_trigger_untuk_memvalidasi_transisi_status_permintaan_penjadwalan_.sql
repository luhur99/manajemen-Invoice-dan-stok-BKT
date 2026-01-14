CREATE OR REPLACE FUNCTION public.handle_scheduling_request_status_validation()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Ensure user_id is not changed by the user
  IF OLD.user_id IS DISTINCT FROM NEW.user_id THEN
    RAISE EXCEPTION 'Cannot change user_id of a scheduling request.';
  END IF;

  -- Only validate status transitions if the status is actually changing
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    IF OLD.status = 'pending' THEN
      IF NEW.status NOT IN ('approved', 'rejected') THEN
        RAISE EXCEPTION 'Invalid status transition from PENDING to %.', NEW.status;
      END IF;
    ELSIF OLD.status = 'approved' THEN
      IF NEW.status NOT IN ('completed', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid status transition from APPROVED to %.', NEW.status;
      END IF;
    ELSIF OLD.status IN ('rejected', 'completed', 'cancelled') THEN
      -- No status changes allowed once rejected, completed, or cancelled
      RAISE EXCEPTION 'Cannot change status of a % scheduling request.', OLD.status;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger the function on scheduling_requests update
DROP TRIGGER IF EXISTS on_scheduling_request_update_validate_status ON public.scheduling_requests;
CREATE TRIGGER on_scheduling_request_update_validate_status
  BEFORE UPDATE ON public.scheduling_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_scheduling_request_status_validation();