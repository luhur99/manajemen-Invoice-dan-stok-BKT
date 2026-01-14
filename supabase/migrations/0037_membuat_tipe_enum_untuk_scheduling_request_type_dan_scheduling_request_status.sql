-- Create ENUM type for scheduling request types
DO $$ BEGIN
  CREATE TYPE public.scheduling_request_type AS ENUM ('instalasi', 'service', 'kirim');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create ENUM type for scheduling request status
DO $$ BEGIN
  CREATE TYPE public.scheduling_request_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create ENUM type for delivery order status
DO $$ BEGIN
  CREATE TYPE public.delivery_order_status AS ENUM ('pending', 'in progress', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;