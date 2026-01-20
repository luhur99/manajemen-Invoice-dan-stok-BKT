ALTER TABLE public.sales_details ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE TRIGGER set_sales_details_updated_at
BEFORE UPDATE ON public.sales_details
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();