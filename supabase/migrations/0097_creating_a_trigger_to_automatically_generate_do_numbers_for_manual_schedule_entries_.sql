CREATE OR REPLACE FUNCTION public.generate_do_number()
RETURNS TRIGGER AS $$
DECLARE
  v_date_str TEXT;
  v_sequence INT;
  v_do_number TEXT;
BEGIN
  -- Only generate if not provided
  IF NEW.do_number IS NULL THEN
    v_date_str := to_char(COALESCE(NEW.schedule_date, NOW()), 'YYYYMMDD');
    
    -- Find max sequence for this date
    SELECT COALESCE(MAX(CAST(SUBSTRING(do_number FROM 12) AS INT)), 0) + 1
    INTO v_sequence
    FROM public.schedules
    WHERE do_number LIKE 'DO-' || v_date_str || '-%';

    v_do_number := 'DO-' || v_date_str || '-' || LPAD(v_sequence::TEXT, 4, '0');
    NEW.do_number := v_do_number;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_do_number_before_insert ON public.schedules;
CREATE TRIGGER set_do_number_before_insert
BEFORE INSERT ON public.schedules
FOR EACH ROW
EXECUTE FUNCTION public.generate_do_number();