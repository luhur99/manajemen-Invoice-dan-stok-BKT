CREATE OR REPLACE FUNCTION public.handle_purchase_request_status_validation()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Ensure user_id is not changed by the user
  IF OLD.user_id IS DISTINCT FROM NEW.user_id THEN
    RAISE EXCEPTION 'Cannot change user_id of a purchase request.';
  END IF;

  -- Only validate status transitions if the status is actually changing
  IF OLD.status IS DISTINCT FROM NEW.status THEN
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
      RAISE EXCEPTION 'Cannot change status of a % purchase request.', OLD.status;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;