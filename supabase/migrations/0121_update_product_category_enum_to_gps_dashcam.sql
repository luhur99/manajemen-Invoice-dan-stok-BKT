-- Rename the current enum type to avoid conflicts
ALTER TYPE public.product_category RENAME TO public.product_category_v2_old;

-- Create the new enum type with desired values
CREATE TYPE public.product_category AS ENUM ('gps_tracker', 'dashcam');

-- Update the 'product_category' column in 'scheduling_requests' table
-- to use the new enum type and cast existing data.
-- Map old values to new values.
ALTER TABLE public.scheduling_requests
ALTER COLUMN product_category TYPE public.product_category
USING CASE
    WHEN product_category::text = 'jawara_tracker' THEN 'gps_tracker'::public.product_category
    WHEN product_category::text = 'powerdash' THEN 'dashcam'::public.product_category
    -- If there are other old values like 'lainnya', you need to decide how to map them.
    -- For now, 'lainnya' will result in NULL if not explicitly mapped.
    ELSE NULL
END;

-- Drop the old enum type after successful migration
DROP TYPE public.product_category_v2_old;