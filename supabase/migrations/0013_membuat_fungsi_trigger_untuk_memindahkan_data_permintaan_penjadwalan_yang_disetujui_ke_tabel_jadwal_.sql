CREATE OR REPLACE FUNCTION public.handle_approved_scheduling_request_to_schedule()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF OLD.status = 'pending' AND NEW.status = 'approved' THEN
    INSERT INTO public.schedules (
      user_id,
      schedule_date,
      schedule_time,
      type,
      customer_name,
      address,
      notes,
      phone_number,
      status, -- Status awal di tabel schedules adalah 'scheduled'
      scheduling_request_id
    ) VALUES (
      NEW.user_id,
      NEW.requested_date,
      NEW.requested_time,
      NEW.type::text, -- Casting type to text
      NEW.customer_name,
      NEW.full_address,
      NEW.notes,
      NEW.phone_number,
      'scheduled',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger the function AFTER an update on scheduling_requests
DROP TRIGGER IF EXISTS on_scheduling_request_approved_to_schedule ON public.scheduling_requests;
CREATE TRIGGER on_scheduling_request_approved_to_schedule
  AFTER UPDATE ON public.scheduling_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_approved_scheduling_request_to_schedule();