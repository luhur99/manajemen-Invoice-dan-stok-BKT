-- Migration to add missing values to public.scheduling_request_type and public.scheduling_request_status enums.

-- Add missing values to the enum type 'scheduling_request_type'
ALTER TYPE public.scheduling_request_type ADD VALUE IF NOT EXISTS 'installation';
ALTER TYPE public.scheduling_request_type ADD VALUE IF NOT EXISTS 'maintenance';
ALTER TYPE public.scheduling_request_type ADD VALUE IF NOT EXISTS 'service';
ALTER TYPE public.scheduling_request_type ADD VALUE IF NOT EXISTS 'delivery';

-- Add missing values to the enum type 'scheduling_request_status'
ALTER TYPE public.scheduling_request_status ADD VALUE IF NOT EXISTS 'pending';
ALTER TYPE public.scheduling_request_status ADD VALUE IF NOT EXISTS 'approved';
ALTER TYPE public.scheduling_request_status ADD VALUE IF NOT EXISTS 'rejected';
ALTER TYPE public.scheduling_request_status ADD VALUE IF NOT EXISTS 'completed';
ALTER TYPE public.scheduling_request_status ADD VALUE IF NOT EXISTS 'cancelled';