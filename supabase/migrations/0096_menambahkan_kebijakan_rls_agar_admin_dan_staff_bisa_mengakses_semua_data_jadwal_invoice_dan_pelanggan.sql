-- Kebijakan untuk Schedules (Jadwal)
CREATE POLICY "Admins and Staff can view all schedules" ON public.schedules FOR SELECT USING (is_user_admin(auth.uid()));
CREATE POLICY "Admins and Staff can insert schedules" ON public.schedules FOR INSERT WITH CHECK (is_user_admin(auth.uid()));
CREATE POLICY "Admins and Staff can update all schedules" ON public.schedules FOR UPDATE USING (is_user_admin(auth.uid()));
CREATE POLICY "Admins and Staff can delete all schedules" ON public.schedules FOR DELETE USING (is_user_admin(auth.uid()));

-- Kebijakan untuk Invoices (Invoice)
CREATE POLICY "Admins and Staff can view all invoices" ON public.invoices FOR SELECT USING (is_user_admin(auth.uid()));
CREATE POLICY "Admins and Staff can insert invoices" ON public.invoices FOR INSERT WITH CHECK (is_user_admin(auth.uid()));
CREATE POLICY "Admins and Staff can update all invoices" ON public.invoices FOR UPDATE USING (is_user_admin(auth.uid()));
CREATE POLICY "Admins and Staff can delete all invoices" ON public.invoices FOR DELETE USING (is_user_admin(auth.uid()));

-- Kebijakan untuk Invoice Items (Item Invoice)
CREATE POLICY "Admins and Staff can view all invoice items" ON public.invoice_items FOR SELECT USING (is_user_admin(auth.uid()));
CREATE POLICY "Admins and Staff can insert invoice items" ON public.invoice_items FOR INSERT WITH CHECK (is_user_admin(auth.uid()));
CREATE POLICY "Admins and Staff can update all invoice items" ON public.invoice_items FOR UPDATE USING (is_user_admin(auth.uid()));
CREATE POLICY "Admins and Staff can delete all invoice items" ON public.invoice_items FOR DELETE USING (is_user_admin(auth.uid()));

-- Kebijakan untuk Customers (Pelanggan)
CREATE POLICY "Admins and Staff can view all customers" ON public.customers FOR SELECT USING (is_user_admin(auth.uid()));
CREATE POLICY "Admins and Staff can insert customers" ON public.customers FOR INSERT WITH CHECK (is_user_admin(auth.uid()));
CREATE POLICY "Admins and Staff can update all customers" ON public.customers FOR UPDATE USING (is_user_admin(auth.uid()));
CREATE POLICY "Admins and Staff can delete all customers" ON public.customers FOR DELETE USING (is_user_admin(auth.uid()));