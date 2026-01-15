CREATE OR REPLACE FUNCTION public.handle_scheduling_request_status_validation()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Ensure user_id is not changed by the user
  IF OLD.user_id IS DISTINCT FROM NEW.user_id THEN
    RAISE EXCEPTION 'Cannot change user_id of a scheduling request.';
  END IF;

  -- Only validate status transitions if the status is actually changing
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Prevent changes from final states
    IF OLD.status IN ('rejected', 'completed', 'cancelled') THEN
      RAISE EXCEPTION 'Cannot change status of a % scheduling request once it is in a final state.', OLD.status;
    END IF;

    -- Enforce notes for specific status changes
    IF NEW.status IN ('rescheduled', 'rejected', 'cancelled') AND (NEW.notes IS NULL OR TRIM(NEW.notes) = '') THEN
      RAISE EXCEPTION 'Reason (notes) is required for status change to %.', NEW.status;
    END IF;

    -- Allow transitions from pending
    IF OLD.status = 'pending' THEN
      IF NEW.status NOT IN ('approved', 'rejected', 'rescheduled', 'cancelled', 'in_progress') THEN
        RAISE EXCEPTION 'Invalid status transition from PENDING to %.', NEW.status;
      END IF;
    -- Allow transitions from in_progress or approved
    ELSIF OLD.status IN ('in_progress', 'approved') THEN
      IF NEW.status NOT IN ('completed', 'rescheduled', 'rejected', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid status transition from % to %.', OLD.status, NEW.status;
      END IF;
    -- Allow transitions from rescheduled (e.g., re-open to pending, or directly approve/reject/cancel)
    ELSIF OLD.status = 'rescheduled' THEN
      IF NEW.status NOT IN ('pending', 'approved', 'rejected', 'cancelled', 'in_progress') THEN
        RAISE EXCEPTION 'Invalid status transition from RESCHEDULED to %.', NEW.status;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;