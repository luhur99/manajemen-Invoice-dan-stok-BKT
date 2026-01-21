ALTER TABLE public.schedules
ADD COLUMN product_category TEXT;

-- Optional: If you want to enforce the enum type in the database
-- First, create the enum type if it doesn't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'schedule_product_category') THEN
        CREATE TYPE public.schedule_product_category AS ENUM ('gps_tracker', 'dashcam');
    END IF;
END $$;

-- Then, alter the column to use the enum type
ALTER TABLE public.schedules
ALTER COLUMN product_category TYPE public.schedule_product_category USING product_category::public.schedule_product_category;

-- Update RLS policies for 'schedules' table to allow authenticated users to insert/update 'product_category'
-- Assuming existing policies allow authenticated users to insert/update their own schedules.
-- If not, you might need to adjust your specific policies.

-- Example: If you have a policy like "Users can insert their own schedules"
-- CREATE POLICY "Users can insert their own schedules" ON public.schedules
-- FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
-- This policy should already cover the new column as long as it's part of the insert.

-- Example: If you have a policy like "Users can update their own schedules"
-- CREATE POLICY "Users can update their own schedules" ON public.schedules
-- FOR UPDATE TO authenticated USING (auth.uid() = user_id);
-- This policy should already cover the new column as long as it's part of the update.

-- If you have more restrictive policies, you might need to explicitly add product_category.
-- For example, if you had a SELECT policy that only selected specific columns, you'd need to add product_category.
-- However, since the existing policies are generally permissive for authenticated users on their own data,
-- and for admins/staff on all data, the new column should be covered.