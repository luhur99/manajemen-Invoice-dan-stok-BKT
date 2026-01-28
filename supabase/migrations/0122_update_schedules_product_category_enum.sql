-- Update the 'product_category' column in 'schedules' table
-- to use the new enum type and cast existing data.
-- This step is crucial for data migration.
ALTER TABLE public.schedules
ALTER COLUMN product_category TYPE public.product_category
USING CASE
    -- Map old values from 'jawara_tracker' to 'gps_tracker'
    WHEN product_category::text = 'jawara_tracker' THEN 'gps_tracker'::public.product_category
    -- Map old values from 'powerdash' to 'dashcam'
    WHEN product_category::text = 'powerdash' THEN 'dashcam'::public.product_category
    -- Map old values from 'lainnya' to NULL, or a new default if applicable
    WHEN product_category::text = 'lainnya' THEN NULL
    -- If there are any other existing values that don't match the new enum,
    -- they will also be set to NULL. Ensure this is the desired behavior.
    ELSE NULL
END;