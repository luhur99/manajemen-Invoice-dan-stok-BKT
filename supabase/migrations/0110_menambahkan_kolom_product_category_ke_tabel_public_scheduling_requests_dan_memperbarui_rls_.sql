-- Tambahkan kolom product_category ke tabel scheduling_requests
ALTER TABLE public.scheduling_requests
ADD COLUMN product_category public.schedule_product_category;

-- Perbarui kebijakan RLS untuk menyertakan kolom baru (jika diperlukan)
-- Asumsi kebijakan RLS yang ada sudah menangani akses berdasarkan user_id.
-- Jika tidak, Anda mungkin perlu menambahkan kebijakan SELECT/INSERT/UPDATE/DELETE baru.

-- Contoh: Jika ada kebijakan yang hanya mengizinkan pengguna melihat data mereka sendiri,
-- maka kolom baru ini akan secara otomatis tercakup.
-- Jika Anda memiliki kebijakan yang lebih kompleks, pastikan untuk meninjaunya.

-- Contoh kebijakan SELECT untuk pengguna terautentikasi (jika belum ada atau perlu diperbarui):
-- CREATE POLICY "Users can view their own scheduling requests" ON public.scheduling_requests
-- FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Contoh kebijakan INSERT untuk pengguna terautentikasi (jika belum ada atau perlu diperbarui):
-- CREATE POLICY "Users can create their own scheduling requests" ON public.scheduling_requests
-- FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Contoh kebijakan UPDATE untuk pengguna terautentikasi (jika belum ada atau perlu diperbarui):
-- CREATE POLICY "Users can update their own scheduling requests" ON public.scheduling_requests
-- FOR UPDATE TO authenticated USING (auth.uid() = user_id);