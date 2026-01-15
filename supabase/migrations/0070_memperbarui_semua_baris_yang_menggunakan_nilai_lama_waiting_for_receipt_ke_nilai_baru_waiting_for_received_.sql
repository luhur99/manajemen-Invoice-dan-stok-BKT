UPDATE public.purchase_requests
SET status = 'waiting for received'::public.purchase_request_status
WHERE status = 'waiting_for_receipt'::public.purchase_request_status;