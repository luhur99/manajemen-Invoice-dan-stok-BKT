ALTER TABLE public.scheduling_requests
DROP COLUMN IF EXISTS vehicle_units,
DROP COLUMN IF EXISTS vehicle_type,
DROP COLUMN IF EXISTS vehicle_year;

ALTER TABLE public.scheduling_requests
ADD COLUMN vehicle_details TEXT;