export interface StockItem {
  id?: string; // New: UUID from Supabase, made optional for initial data loading
  user_id?: string; // New: User ID for RLS, made optional for initial data loading
  NO: number;
  "KODE BARANG": string;
  "NAMA BARANG": string;
  SATUAN: string;
  "HARGA BELI": number;
  "HARGA JUAL": number;
  "STOCK AWAL": number;
  "STOCK MASUK": number;
  "STOCK KELUAR": number;
  "STOCK AKHIR": number;
  safe_stock_limit?: number; // New: Batas stok aman
  warehouse_category?: 'siap_jual' | 'riset' | 'retur'; // New: Kategori gudang stok
  created_at?: string; // Add created_at for consistency
}

export interface StockTransaction {
  id: string;
  user_id: string;
  stock_item_id: string;
  transaction_type: 'initial' | 'in' | 'out' | 'return' | 'damage_loss' | 'adjustment'; // Updated transaction types
  quantity: number;
  notes?: string;
  transaction_date: string; // ISO date string
  created_at: string;
}

// New interface for Stock Transaction with Item Name for display
export interface StockTransactionWithItemName extends StockTransaction {
  stock_items: {
    nama_barang: string;
    kode_barang: string;
    warehouse_category?: 'siap_jual' | 'riset' | 'retur'; // Added warehouse_category here
  }[] | null; // Diperbaiki: sekarang array objek atau null
}

// New interface for Stock Movement
export interface StockMovement {
  id: string;
  user_id: string;
  stock_item_id: string;
  from_category: 'siap_jual' | 'riset' | 'retur';
  to_category: 'siap_jual' | 'riset' | 'retur';
  quantity: number;
  reason?: string;
  movement_date: string; // YYYY-MM-DD
  created_at: string;
}

// New interface for Stock Movement with Item Name for display
export interface StockMovementWithItemName extends StockMovement {
  stock_items: {
    nama_barang: string;
    kode_barang: string;
  }[] | null; // Diperbarui: sekarang array objek atau null
}

export interface SalesDetailItem {
  id?: string; // New: UUID from Supabase
  user_id?: string; // New: User ID for RLS
  no: number;
  kirim_install: string; // Changed from "Kirim/Install"
  no_transaksi: string; // Changed from "No Transaksi"
  invoice_number: string; // Changed from "Invoice"
  new_old?: string; // Changed from "New/Old"
  perusahaan?: string; // Changed from "Perusahaan"
  tanggal: string; // Assuming date as string "yyyy-mm-dd"
  hari?: string; // Changed from "Hari"
  jam?: string; // Changed from "Jam"
  customer: string; // Changed from "Customer"
  alamat_install?: string; // Changed from "Alamat install"
  no_hp?: string; // Changed from "No HP"
  type?: string; // Changed from "Type"
  qty_unit?: number; // Changed from "Qty unit"
  stock?: number; // Changed from "Stock"
  harga?: number; // Changed from "Harga"
  web?: string; // Changed from "WEB"
  qty_web?: number; // Changed from "Qty Web"
  kartu?: string; // Changed from "Kartu"
  qty_kartu?: number; // Changed from "Qty kartu"
  paket?: string; // Changed from "Paket"
  pulsa?: number; // Changed from "Pulsa"
  teknisi?: string; // Changed from "Teknisi"
  payment?: string; // Changed from "Payment"
  catatan?: string; // Changed from "Catatan"
  invoice_file_url?: string; // This will still be fetched from sales_invoices table
  created_at?: string;
}

// New interfaces for Invoice Management
export interface InvoiceItem {
  id?: string; // Optional for new items
  invoice_id?: string; // Optional for new items
  user_id?: string; // Optional for new items, will be set by backend
  item_name: string;
  item_code?: string; // New field for item code
  quantity: number;
  unit_price: number;
  subtotal: number;
  unit_type?: string; // New field for unit type
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
  type?: 'instalasi' | 'kirim barang'; // New field
  customer_type?: 'lama' | 'baru'; // New field
  payment_method?: string; // New field
  notes?: string; // New field
  created_at: string;
  items?: InvoiceItem[]; // For displaying joined items
  item_names_summary?: string; // New: Summary of item names for table display
  document_url?: string; // New: URL for the uploaded invoice document
  no?: number; // New: Sequential number for display
  courier_service?: string; // New: Jasa Kurir field
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
  invoice_number?: string; // New: Invoice number from related invoice
  status: 'scheduled' | 'in progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  phone_number?: string; // New field for phone number
  courier_service?: string; // New field for courier service
  document_url?: string; // New field for delivery/installation document
  no?: number; // New: Sequential number for display
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
  item_name: string;
  item_code: string;
  quantity: number;
  unit_price: number; // This will be the purchase price (harga_beli)
  suggested_selling_price: number; // This will be the suggested selling price (harga_jual)
  total_price: number;
  supplier?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  no?: number; // For display purposes
  document_url?: string; // New: URL for the uploaded purchase document
}