-- Add updated_at column to schedules table if it doesn't exist
ALTER TABLE public.schedules
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create a trigger to update 'updated_at' timestamp on schedules table
-- Ensure the function set_updated_at_timestamp exists (it should from previous migrations)
CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists to avoid duplicates or conflicts
DROP TRIGGER IF EXISTS set_schedules_updated_at ON public.schedules;

-- Create the trigger
CREATE TRIGGER set_schedules_updated_at
BEFORE UPDATE ON public.schedules
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();