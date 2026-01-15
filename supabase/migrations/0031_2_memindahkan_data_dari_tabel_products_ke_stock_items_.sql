INSERT INTO public.stock_items (
  id,
  user_id,
  kode_barang,
  nama_barang,
  satuan,
  harga_beli,
  harga_jual,
  safe_stock_limit,
  created_at,
  supplier_id -- supplier_id akan diisi NULL karena tidak ada di tabel products
)
SELECT
  id,
  user_id,
  kode_barang,
  nama_barang,
  satuan,
  harga_beli,
  harga_jual,
  safe_stock_limit,
  created_at,
  NULL AS supplier_id
FROM public.products;