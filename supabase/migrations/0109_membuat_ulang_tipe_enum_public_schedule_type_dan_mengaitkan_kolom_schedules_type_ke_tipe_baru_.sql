-- 1. Buat tipe enum 'schedule_type' yang baru dengan nilai-nilai yang diperbarui
--    Jika tipe ini sudah ada (misalnya dari upaya sebelumnya yang gagal), perintah ini akan gagal.
--    Anda mungkin perlu menambahkan 'DROP TYPE IF EXISTS public.schedule_type;' jika Anda yakin ingin menimpa.
--    Namun, karena error sebelumnya 'type "public.schedule_type" does not exist', kita asumsikan ini akan berhasil.
CREATE TYPE public.schedule_type AS ENUM ('instalasi', 'service_bill', 'service_unbill', 'kirim');

-- 2. Ubah kolom 'type' di tabel 'schedules' untuk menggunakan tipe enum yang baru
--    Kami menggunakan `USING type::text::public.schedule_type` untuk mengonversi data yang ada
--    (yang mungkin diperlakukan sebagai teks jika tipe enum lama hilang) ke tipe enum yang baru.
ALTER TABLE public.schedules ALTER COLUMN type TYPE public.schedule_type USING type::text::public.schedule_type;