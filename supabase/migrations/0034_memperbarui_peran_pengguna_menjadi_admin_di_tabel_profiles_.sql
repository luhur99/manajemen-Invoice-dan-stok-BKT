UPDATE public.profiles
SET role = 'admin'
WHERE id = auth.uid(); -- Ganti auth.uid() dengan ID pengguna Anda jika perlu