-- Create index for public.customers.user_id
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers (user_id);

-- Create index for public.delivery_orders.request_id
CREATE INDEX IF NOT EXISTS idx_delivery_orders_request_id ON public.delivery_orders (request_id);

-- Create index for public.delivery_orders.user_id
CREATE INDEX IF NOT EXISTS idx_delivery_orders_user_id ON public.delivery_orders (user_id);

-- Create index for public.invoice_items.invoice_id
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON public.invoice_items (invoice_id);

-- Create index for public.invoice_items.product_id
CREATE INDEX IF NOT EXISTS idx_invoice_items_product_id ON public.invoice_items (product_id);

-- Create index for public.invoice_items.user_id
CREATE INDEX IF NOT EXISTS idx_invoice_items_user_id ON public.invoice_items (user_id);

-- Create index for public.invoices.user_id
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices (user_id);

-- Create index for public.products.supplier_id
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON public.products (supplier_id);

-- Create index for public.products.user_id
CREATE INDEX IF NOT EXISTS idx_products_user_id ON public.products (user_id);

-- Create index for public.purchase_requests.product_id
CREATE INDEX IF NOT EXISTS idx_purchase_requests_product_id ON public.purchase_requests (product_id);

-- Create index for public.purchase_requests.supplier_id
CREATE INDEX IF NOT EXISTS idx_purchase_requests_supplier_id ON public.purchase_requests (supplier_id);

-- Create index for public.purchase_requests.user_id
CREATE INDEX IF NOT EXISTS idx_purchase_requests_user_id ON public.purchase_requests (user_id);

-- Create index for public.sales_details.user_id
CREATE INDEX IF NOT EXISTS idx_sales_details_user_id ON public.sales_details (user_id);

-- Create index for public.schedules.invoice_id
CREATE INDEX IF NOT EXISTS idx_schedules_invoice_id ON public.schedules (invoice_id);

-- Create index for public.schedules.scheduling_request_id
CREATE INDEX IF NOT EXISTS idx_schedules_scheduling_request_id ON public.schedules (scheduling_request_id);

-- Create index for public.schedules.user_id
CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON public.schedules (user_id);

-- Create index for public.scheduling_requests.customer_id
CREATE INDEX IF NOT EXISTS idx_scheduling_requests_customer_id ON public.scheduling_requests (customer_id);

-- Create index for public.scheduling_requests.invoice_id
CREATE INDEX IF NOT EXISTS idx_scheduling_requests_invoice_id ON public.scheduling_requests (invoice_id);

-- Create index for public.scheduling_requests.user_id
CREATE INDEX IF NOT EXISTS idx_scheduling_requests_user_id ON public.scheduling_requests (user_id);

-- Create index for public.stock_ledger.from_warehouse_category
CREATE INDEX IF NOT EXISTS idx_stock_ledger_from_warehouse_category ON public.stock_ledger (from_warehouse_category);

-- Create index for public.stock_ledger.product_id
CREATE INDEX IF NOT EXISTS idx_stock_ledger_product_id ON public.stock_ledger (product_id);

-- Create index for public.stock_ledger.to_warehouse_category
CREATE INDEX IF NOT EXISTS idx_stock_ledger_to_warehouse_category ON public.stock_ledger (to_warehouse_category);

-- Create index for public.stock_ledger.user_id
CREATE INDEX IF NOT EXISTS idx_stock_ledger_user_id ON public.stock_ledger (user_id);

-- Create index for public.suppliers.user_id
CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON public.suppliers (user_id);

-- Create index for public.technicians.user_id
CREATE INDEX IF NOT EXISTS idx_technicians_user_id ON public.technicians (user_id);

-- Create index for public.warehouse_categories.user_id
CREATE INDEX IF NOT EXISTS idx_warehouse_categories_user_id ON public.warehouse_categories (user_id);

-- Create index for public.warehouse_inventories.user_id
CREATE INDEX IF NOT EXISTS idx_warehouse_inventories_user_id ON public.warehouse_inventories (user_id);