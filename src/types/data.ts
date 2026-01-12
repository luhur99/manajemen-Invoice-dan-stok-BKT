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
  created_at?: string; // Add created_at for consistency
}

export interface StockTransaction {
  id: string;
  user_id: string;
  stock_item_id: string;
  transaction_type: 'initial' | 'in' | 'out';
  quantity: number;
  notes?: string;
  transaction_date: string; // ISO date string
  created_at: string;
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

// ExcelData interface is no longer needed.

// New interfaces for Invoice Management
export interface InvoiceItem {
  id?: string; // Optional for new items
  invoice_id?: string; // Optional for new items
  user_id?: string; // Optional for new items, will be set by backend
  item_name: string;
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
  status: 'scheduled' | 'in progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  phone_number?: string; // New field for phone number
  courier_service?: string; // New field for courier service
  document_url?: string; // New field for delivery/installation document
}

export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone_number?: string;
  updated_at?: string;
  role: 'user' | 'admin';
}