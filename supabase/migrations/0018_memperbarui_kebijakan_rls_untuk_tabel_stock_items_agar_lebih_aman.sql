-- Hapus kebijakan INSERT yang kurang aman
DROP POLICY IF EXISTS "Allow all users to insert stock items" ON public.stock_items;
DROP POLICY IF EXISTS "stock_items_insert_policy" ON public.stock_items;

-- Buat kebijakan INSERT baru yang hanya mengizinkan pengguna terautentikasi untuk memasukkan data mereka sendiri
CREATE POLICY "Users can only insert their own stock items" ON public.stock_items
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Hapus kebijakan DELETE yang kurang aman
DROP POLICY IF EXISTS "Allow all users to delete stock items" ON public.stock_items;
DROP POLICY IF EXISTS "stock_items_delete_policy" ON public.stock_items;

-- Buat kebijakan DELETE baru yang hanya mengizinkan pengguna terautentikasi untuk menghapus data mereka sendiri
CREATE POLICY "Users can only delete their own stock items" ON public.stock_items
FOR DELETE TO authenticated USING (auth.uid() = user_id);