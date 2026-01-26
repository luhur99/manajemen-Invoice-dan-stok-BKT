CREATE OR REPLACE FUNCTION public.start_transaction()
RETURNS void AS $$
BEGIN
  SET LOCAL transaction_isolation = 'serializable';
  -- Removed the problematic 'BEGIN;' statement
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.commit_transaction()
RETURNS void AS $$
BEGIN
  COMMIT;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.rollback_transaction()
RETURNS void AS $$
BEGIN
  ROLLBACK;
END;
$$ LANGUAGE plpgsql;