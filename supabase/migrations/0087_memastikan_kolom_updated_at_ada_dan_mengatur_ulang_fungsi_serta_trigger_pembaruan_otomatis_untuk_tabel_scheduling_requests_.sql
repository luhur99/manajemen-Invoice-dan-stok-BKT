-- Pastikan kolom updated_at ada di tabel scheduling_requests
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'scheduling_requests' AND column_name = 'updated_at') THEN
        ALTER TABLE public.scheduling_requests ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END
$$;

-- Buat ulang (atau perbarui) fungsi untuk mengatur timestamp updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Hapus trigger lama jika ada, lalu buat ulang trigger untuk scheduling_requests
DROP TRIGGER IF EXISTS set_scheduling_requests_updated_at ON public.scheduling_requests;
CREATE TRIGGER set_scheduling_requests_updated_at
BEFORE UPDATE ON public.scheduling_requests
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();