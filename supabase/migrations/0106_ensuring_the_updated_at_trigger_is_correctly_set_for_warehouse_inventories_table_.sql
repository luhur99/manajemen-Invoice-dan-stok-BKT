DROP TRIGGER IF EXISTS set_warehouse_inventories_updated_at ON public.warehouse_inventories;

CREATE TRIGGER set_warehouse_inventories_updated_at
BEFORE UPDATE ON public.warehouse_inventories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();