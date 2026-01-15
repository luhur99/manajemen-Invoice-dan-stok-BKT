ALTER TABLE public.scheduling_requests
ADD COLUMN phone_number TEXT;

-- Update existing RLS policies to include the new column if they use SELECT * or similar.
-- Since existing policies are based on auth.uid() = user_id, they should automatically cover new columns.
-- No explicit RLS policy update is needed for this specific column addition, as it's covered by table-level RLS.