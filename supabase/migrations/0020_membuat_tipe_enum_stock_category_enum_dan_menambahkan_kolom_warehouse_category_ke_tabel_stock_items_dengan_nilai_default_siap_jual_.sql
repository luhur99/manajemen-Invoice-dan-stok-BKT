-- Create the ENUM type if it doesn't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stock_category_enum') THEN
        CREATE TYPE public.stock_category_enum AS ENUM ('siap_jual', 'riset', 'retur');
    END IF;
END $$;

-- Add the new column 'warehouse_category' to 'stock_items' table
ALTER TABLE public.stock_items
ADD COLUMN warehouse_category public.stock_category_enum DEFAULT 'siap_jual' NOT NULL;