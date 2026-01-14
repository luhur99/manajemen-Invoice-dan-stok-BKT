ALTER TYPE purchase_request_status ADD VALUE 'waiting_for_receipt' AFTER 'pending';
ALTER TYPE purchase_request_status ADD VALUE 'closed' AFTER 'rejected';