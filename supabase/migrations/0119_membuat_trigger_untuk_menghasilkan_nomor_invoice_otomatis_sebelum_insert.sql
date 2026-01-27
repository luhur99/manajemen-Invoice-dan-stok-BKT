DROP TRIGGER IF EXISTS set_invoice_number_before_insert ON public.invoices;
CREATE TRIGGER set_invoice_number_before_insert
BEFORE INSERT ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.generate_invoice_number();