export interface Product {
  id?: string; // UUID from Supabase
  user_id?: string; // User ID for RLS
  kode_barang: string; // Corrected: use actual database column name
  nama_barang: string; // Corrected: use actual database column name
  satuan: string;
  harga_beli: number;
  harga_jual: number;
  safe_stock_limit?: number; // Batas stok aman
  created_at?: string;
}

export interface WarehouseInventory {
  id: string;
  product_id: string;
  warehouse_category: 'siap_jual' | 'riset' | 'retur';
  quantity: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  // Joined product details for display
  products?: {
    kode_barang?: string; // Corrected
    nama_barang?: string; // Corrected
    satuan?: string;
    harga_beli?: number;
    harga_jual?: number;
    safe_stock_limit?: number;
  } | null;
}

export interface StockTransaction {
  id: string;
  user_id: string;
  product_id: string;
  transaction_type: 'initial' | 'in' | 'out' | 'return' | 'damage_loss' | 'adjustment';
  quantity: number;
  notes?: string;
  transaction_date: string; // ISO date string
  created_at: string;
  warehouse_category?: 'siap_jual' | 'riset' | 'retur'; // New: Kategori gudang yang terpengaruh
}

// New interface for Stock Transaction with Product Name for display
export interface StockTransactionWithItemName extends StockTransaction {
  products: {
    nama_barang: string; // Corrected
    kode_barang: string; // Corrected
    safe_stock_limit?: number;
  } | null;
}

// New interface for Stock Movement
export interface StockMovement {
  id: string;
  user_id: string;
  product_id: string;
  from_category: 'siap_jual' | 'riset' | 'retur';
  to_category: 'siap_jual' | 'riset' | 'retur';
  quantity: number;
  reason?: string;
  movement_date: string; // YYYY-MM-DD
  created_at: string;
}

// New interface for Stock Movement with Product Name for display
export interface StockMovementWithItemName extends StockMovement {
  products: {
    nama_barang: string; // Corrected
    kode_barang: string; // Corrected
  } | null;
}

// New interface for Product combined with its warehouse inventories for display
export interface ProductWithInventory extends Product {
  total_stock_akhir: number;
  warehouse_inventories: WarehouseInventory[];
}

export interface SalesDetailItem {
  id?: string; // UUID from Supabase
  user_id?: string; // User ID for RLS
  no: number;
  kirim_install: string;
  no_transaksi: string;
  invoice_number: string;
  new_old?: string;
  perusahaan?: string;
  tanggal: string; // Assuming date as string "yyyy-mm-dd"
  hari?: string;
  jam?: string;
  customer: string;
  alamat_install?: string;
  no_hp?: string;
  type?: string;
  qty_unit?: number;
  stock?: number;
  harga?: number;
  web?: string;
  qty_web?: number;
  kartu?: string;
  qty_kartu?: number;
  paket?: string;
  pulsa?: number;
  teknisi?: string;
  payment?: string;
  catatan?: string;
  invoice_file_url?: string; // This will still be fetched from sales_invoices table
  created_at?: string;
}

// New interfaces for Invoice Management
export interface InvoiceItem {
  id?: string; // Optional for new items
  invoice_id?: string; // Optional for new items
  user_id?: string; // Optional for new items, will be set by backend
  product_id?: string; // New: Link to products table
  item_name: string;
  item_code?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  unit_type?: string;
  created_at?: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  invoice_number: string;
  invoice_date: string; // YYYY-MM-DD
  due_date?: string; // YYYY-MM-DD
  customer_name: string;
  company_name?: string;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'overdue';
  type?: 'instalasi' | 'kirim barang';
  customer_type?: 'lama' | 'baru';
  payment_method?: string;
  notes?: string;
  created_at: string;
  items?: InvoiceItem[]; // For displaying joined items
  item_names_summary?: string; // Summary of item names for table display
  document_url?: string; // URL for the uploaded invoice document
  no?: number; // Sequential number for display
  courier_service?: string;
}

export interface Schedule {
  id: string;
  user_id: string;
  schedule_date: string; // YYYY-MM-DD
  schedule_time?: string;
  type: 'instalasi' | 'kirim';
  customer_name: string;
  address?: string;
  technician_name?: string;
  invoice_id?: string; // UUID of related invoice
  invoice_number?: string; // Invoice number from related invoice
  status: 'scheduled' | 'in progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  phone_number?: string;
  courier_service?: string;
  document_url?: string;
  no?: number; // Sequential number for display
}

export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone_number?: string;
  updated_at?: string;
  role?: string;
}

// New interface for PurchaseRequest
export interface PurchaseRequest {
  id: string;
  user_id: string;
  product_id: string; // Changed to be REQUIRED
  item_name: string;
  item_code: string;
  quantity: number;
  unit_price: number; // This will be the purchase price (harga_beli)
  suggested_selling_price: number; // This will be the suggested selling price (harga_jual)
  total_price: number;
  supplier?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected' | 'waiting_for_receipt' | 'closed';
  created_at: string;
  no?: number; // For display purposes
  document_url?: string; // URL for the uploaded purchase document
  received_quantity?: number;
  returned_quantity?: number;
  damaged_quantity?: number;
  target_warehouse_category?: 'siap_jual' | 'riset' | 'retur';
  received_notes?: string;
  received_at?: string;
}