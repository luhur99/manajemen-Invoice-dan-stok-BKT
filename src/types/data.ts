export interface StockItem {
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
}

export interface SalesDetailItem {
  NO: number;
  "Kirim/Install": string;
  "No Transaksi": string;
  Invoice: string; // This will now represent the invoice number/text
  "New/Old": string;
  Perusahaan: string;
  Tanggal: string; // Assuming date as string "yyyy-mm-dd"
  Hari: string;
  Jam: string;
  Customer: string;
  "Alamat install": string;
  "No HP": string;
  Type: string;
  "Qty unit": number;
  Stock: number;
  Harga: number;
  WEB: string;
  "Qty Web": number;
  Kartu: string;
  "Qty kartu": number;
  Paket: string;
  Pulsa: number;
  Teknisi: string;
  Payment: string;
  Catatan: string;
  invoice_file_url?: string; // New field for the uploaded invoice file URL
}

export interface ExcelData {
  stock: StockItem[];
  sales: SalesDetailItem[]; // Menggunakan SalesDetailItem
}

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
}