CREATE OR REPLACE FUNCTION public.handle_approved_scheduling_request_to_schedule()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_do_number TEXT;
  v_current_date TEXT := TO_CHAR(NOW(), 'YYMMDD'); -- Changed to YYMMDD
  v_sequence_num INT;
BEGIN
  IF OLD.status = 'pending' AND NEW.status = 'approved' THEN
    -- Generate DO number
    SELECT COALESCE(MAX(SUBSTRING(do_number FROM 9)::INT), 0) + 1 -- Adjusted substring index for new format
    INTO v_sequence_num
    FROM public.schedules
    WHERE do_number LIKE 'DO' || v_current_date || '%'; -- Removed hyphens from LIKE pattern

    v_do_number := 'DO' || v_current_date || LPAD(v_sequence_num::TEXT, 4, '0'); -- Removed hyphens from concatenation

    INSERT INTO public.schedules (
      user_id,
      schedule_date,
      schedule_time,
      type,
      customer_name,
      address,
      notes,
      phone_number,
      status,
      scheduling_request_id,
      technician_name, -- Include technician name from the request
      do_number -- Include generated DO number
    ) VALUES (
      NEW.user_id,
      NEW.requested_date,
      NEW.requested_time,
      NEW.type::text,
      NEW.customer_name,
      NEW.full_address,
      NEW.notes,
      NEW.phone_number,
      'scheduled', -- Status awal di tabel schedules adalah 'scheduled'
      NEW.id,
      NEW.technician_name, -- Use the new technician_name column
      v_do_number
    );
  END IF;
  RETURN NEW;
END;
$$;