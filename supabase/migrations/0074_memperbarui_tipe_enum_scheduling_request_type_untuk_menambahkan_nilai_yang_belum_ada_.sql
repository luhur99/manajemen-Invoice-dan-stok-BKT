-- Tambahkan 'service_paid' jika belum ada
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'scheduling_request_type' AND e.enumlabel = 'service_paid') THEN
        ALTER TYPE public.scheduling_request_type ADD VALUE 'service_paid';
    END IF;
END
$$;

-- Tambahkan 'service_unbill' jika belum ada
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'scheduling_request_type' AND e.enumlabel = 'service_unbill') THEN
        ALTER TYPE public.scheduling_request_type ADD VALUE 'service_unbill';
    END IF;
END
$$;

-- Nilai 'delivery' sudah ada berdasarkan pesan error sebelumnya, jadi tidak perlu ditambahkan lagi.