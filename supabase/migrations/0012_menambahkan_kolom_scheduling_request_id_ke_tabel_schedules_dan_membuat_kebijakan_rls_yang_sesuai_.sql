ALTER TABLE public.schedules
ADD COLUMN scheduling_request_id UUID REFERENCES public.scheduling_requests(id) ON DELETE SET NULL;

-- Kebijakan RLS untuk kolom baru (jika diperlukan, biasanya mengikuti kebijakan tabel induk)
-- Karena schedules sudah memiliki RLS berdasarkan user_id, ini akan otomatis tercakup.
-- Namun, jika ada kebutuhan spesifik untuk kolom ini, bisa ditambahkan di sini.
-- Untuk saat ini, tidak ada perubahan RLS tambahan yang diperlukan karena sudah ada kebijakan 'Users can view their own schedules'
-- yang akan mencakup kolom baru ini selama user_id cocok.