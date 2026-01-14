-- Create delivery_orders table
CREATE TABLE public.delivery_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.scheduling_requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  do_number TEXT UNIQUE NOT NULL,
  items_json JSONB, -- Stores array of { item_name, quantity, unit_price, subtotal }
  delivery_date DATE NOT NULL,
  delivery_time TEXT,
  status public.delivery_order_status DEFAULT 'pending' NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED)
ALTER TABLE public.delivery_orders ENABLE ROW LEVEL SECURITY;

-- Policies for delivery_orders
CREATE POLICY "Users can view their own delivery orders" ON public.delivery_orders
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own delivery orders" ON public.delivery_orders
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own delivery orders" ON public.delivery_orders
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own delivery orders" ON public.delivery_orders
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Admin policies (if an admin role is defined)
CREATE POLICY "Admins can view all delivery orders" ON public.delivery_orders
FOR SELECT TO authenticated USING (is_user_admin(auth.uid()));

CREATE POLICY "Admins can update any delivery order" ON public.delivery_orders
FOR UPDATE TO authenticated USING (is_user_admin(auth.uid()));

CREATE POLICY "Admins can delete any delivery order" ON public.delivery_orders
FOR DELETE TO authenticated USING (is_user_admin(auth.uid()));