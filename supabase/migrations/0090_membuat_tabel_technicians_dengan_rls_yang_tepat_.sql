-- Create ENUM type for technician type
DO $$ BEGIN
  CREATE TYPE public.technician_type AS ENUM ('internal', 'external');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create technicians table
CREATE TABLE public.technicians (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone_number TEXT,
  type public.technician_type NOT NULL DEFAULT 'internal',
  address TEXT,
  city TEXT,
  province TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;

-- Create policies for each operation
-- Authenticated users can view all technicians
CREATE POLICY "Authenticated users can view technicians" ON public.technicians
FOR SELECT TO authenticated USING (true);

-- Admins can insert new technicians
CREATE POLICY "Admins can insert technicians" ON public.technicians
FOR INSERT TO authenticated WITH CHECK (is_user_admin(auth.uid()));

-- Admins can update any technician
CREATE POLICY "Admins can update any technician" ON public.technicians
FOR UPDATE TO authenticated USING (is_user_admin(auth.uid()));

-- Admins can delete any technician
CREATE POLICY "Admins can delete any technician" ON public.technicians
FOR DELETE TO authenticated USING (is_user_admin(auth.uid()));

-- Create a trigger to update 'updated_at' timestamp
CREATE TRIGGER set_technicians_updated_at
BEFORE UPDATE ON public.technicians
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();