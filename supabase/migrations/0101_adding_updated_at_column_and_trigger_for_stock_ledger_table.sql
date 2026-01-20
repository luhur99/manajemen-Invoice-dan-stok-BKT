ALTER TABLE public.stock_ledger ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE TRIGGER set_stock_ledger_updated_at
BEFORE UPDATE ON public.stock_ledger
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();