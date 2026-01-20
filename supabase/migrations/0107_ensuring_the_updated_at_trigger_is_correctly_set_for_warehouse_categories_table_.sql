DROP TRIGGER IF EXISTS set_warehouse_categories_updated_at ON public.warehouse_categories;

CREATE TRIGGER set_warehouse_categories_updated_at
BEFORE UPDATE ON public.warehouse_categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();