-- Add updated_at column to scheduling_requests table
ALTER TABLE public.scheduling_requests
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create a trigger to automatically update the updated_at column on changes
CREATE TRIGGER set_scheduling_requests_updated_at
BEFORE UPDATE ON public.scheduling_requests
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();