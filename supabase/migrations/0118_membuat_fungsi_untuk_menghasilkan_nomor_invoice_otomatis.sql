CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
DECLARE
  v_date_str TEXT;
  v_sequence INT;
  v_invoice_number TEXT;
BEGIN
  -- Only generate if not provided or is empty
  IF NEW.invoice_number IS NULL OR TRIM(NEW.invoice_number) = '' THEN
    v_date_str := to_char(COALESCE(NEW.invoice_date, NOW()), 'YYYYMMDD');
    
    -- Find max sequence for this date
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 12) AS INT)), 0) + 1
    INTO v_sequence
    FROM public.invoices
    WHERE invoice_number LIKE 'INV-' || v_date_str || '-%';

    v_invoice_number := 'INV-' || v_date_str || '-' || LPAD(v_sequence::TEXT, 4, '0');
    NEW.invoice_number := v_invoice_number;
  END IF;
  RETURN NEW;
END;
$$;