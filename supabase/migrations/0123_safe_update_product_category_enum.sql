-- Wrap in transaction to ensure all or nothing execution
BEGIN;

-- 1. Rename existing enum type to avoid conflict
ALTER TYPE public.product_category RENAME TO product_category_old;

-- 2. Create the NEW enum type with the correct values from Frontend
CREATE TYPE public.product_category AS ENUM ('gps_tracker', 'dashcam');

-- 3. Migrate 'scheduling_requests' table
-- First remove default if exists to avoid casting errors
ALTER TABLE public.scheduling_requests ALTER COLUMN product_category DROP DEFAULT;

-- Convert column to new type with explicit mapping
ALTER TABLE public.scheduling_requests
ALTER COLUMN product_category TYPE public.product_category
USING CASE
    WHEN product_category::text = 'jawara_tracker' THEN 'gps_tracker'::public.product_category
    WHEN product_category::text = 'powerdash' THEN 'dashcam'::public.product_category
    -- Handle cases where data might already match or match old 'lainnya'
    WHEN product_category::text = 'gps_tracker' THEN 'gps_tracker'::public.product_category
    WHEN product_category::text = 'dashcam' THEN 'dashcam'::public.product_category
    ELSE NULL
END;

-- 4. Migrate 'schedules' table
ALTER TABLE public.schedules ALTER COLUMN product_category DROP DEFAULT;

ALTER TABLE public.schedules
ALTER COLUMN product_category TYPE public.product_category
USING CASE
    WHEN product_category::text = 'jawara_tracker' THEN 'gps_tracker'::public.product_category
    WHEN product_category::text = 'powerdash' THEN 'dashcam'::public.product_category
    WHEN product_category::text = 'gps_tracker' THEN 'gps_tracker'::public.product_category
    WHEN product_category::text = 'dashcam' THEN 'dashcam'::public.product_category
    ELSE NULL
END;

-- 5. Cleanup: Drop the old enum type
DROP TYPE product_category_old;

COMMIT;