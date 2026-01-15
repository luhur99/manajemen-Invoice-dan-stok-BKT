ALTER TABLE public.stock_movements
ALTER COLUMN to_category TYPE public.warehouse_category_enum USING to_category::public.warehouse_category_enum;