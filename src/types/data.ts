import { User } from '@supabase/supabase-js'; // Import User type from Supabase

export enum SchedulingRequestType {
  INSTALLATION = "installation",
  SERVICE = "service",
  SERVICE_UNBILL = "service_unbill",
  DELIVERY = "delivery",
}

export enum SchedulingRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  RESCHEDULED = "rescheduled",
  CANCELLED = "cancelled",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export enum ScheduleProductCategory {
  GPS_TRACKER = "gps_tracker",
  CCTV = "cctv",
  LAINNYA = "lainnya",
}

export interface SchedulingRequest {
  id: string;
  user_id: string | null;
  type: SchedulingRequestType;
  full_address: string;
  landmark: string | null;
  requested_date: string; // ISO date string
  requested_time: string | null;
  contact_person: string;
  payment_method: string | null;
  status: SchedulingRequestStatus;
  notes: string | null;
  created_at: string; // ISO date string
  sr_number: string | null;
  invoice_id: string | null;
  customer_id: string | null;
  vehicle_details: string | null;
  company_name: string | null;
  customer_name: string | null;
  phone_number: string | null;
  updated_at: string; // ISO date string
  technician_name: string | null;
  product_category: ScheduleProductCategory | null;
  customer_type: CustomerTypeEnum | null; // Added customer_type
}

// New interface for SchedulingRequest with joined customer and invoice details
export interface SchedulingRequestWithDetails extends SchedulingRequest {
  customers: Pick<Customer, 'customer_name' | 'company_name' | 'phone_number' | 'address' | 'customer_type'> | null;
  invoices: Pick<Invoice, 'invoice_number'> | null; // Added for invoice_number
}

export enum PurchaseRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  WAITING_FOR_RECEIVED = "waiting for received",
  CLOSED = "closed",
}

export enum WarehouseCategoryEnum {
  GUDANG_UTAMA = "gudang_utama",
  GUDANG_TRANSIT = "gudang_transit",
  GUDANG_TEKNISI = "gudang_teknisi",
  GUDANG_RETUR = "gudang_retur",
  SIAP_JUAL = "siap_jual", // Added 'siap_jual'
}

export enum EventTypeEnum {
  IN = "in",
  OUT = "out",
  TRANSFER = "transfer",
  ADJUSTMENT = "adjustment",
  INITIAL = "initial",
}

// Alias EventTypeEnum to StockEventType for consistency
export { EventTypeEnum as StockEventType };

export enum InvoicePaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  PARTIAL = "partial",
  OVERDUE = "overdue",
  CANCELLED = "cancelled",
}

export enum InvoiceType {
  INSTALASI = "instalasi",
  SERVICE = "service",
  KIRIM_BARANG = "kirim_barang",
}

export enum CustomerTypeEnum {
  PERORANGAN = "perorangan",
  PERUSAHAAN = "perusahaan",
  B2C = "b2c", // Added B2C
}

export enum InvoiceDocumentStatus {
  WAITING_DOCUMENT_INV = "waiting_document_inv",
  DOCUMENT_INV_SENT = "document_inv_sent",
  DOCUMENT_INV_RECEIVED = "document_inv_received",
  COMPLETED = "completed", // Added COMPLETED
}

export enum TechnicianType { // Added TechnicianType enum
  INTERNAL = "internal",
  EXTERNAL = "external",
}

export enum ScheduleType { // Added ScheduleType enum
  INSTALASI = "instalasi",
  SERVICE = "service",
  KIRIM = "kirim",
}

export enum ScheduleStatus { // Added ScheduleStatus enum
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  RESCHEDULED = "rescheduled",
}

export interface Product {
  id: string;
  user_id: string | null;
  kode_barang: string;
  nama_barang: string;
  satuan: string | null;
  harga_beli: number;
  harga_jual: number;
  safe_stock_limit: number | null;
  created_at: string;
  supplier_id: string | null;
  inventories?: WarehouseInventory[]; // Joined data from warehouse_inventories
}

export interface Supplier {
  id: string;
  user_id: string | null;
  name: string;
  contact_person: string | null;
  phone_number: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// New interface for Supplier with joined details (if any)
export interface SupplierWithDetails extends Supplier {
  // Add any joined fields if needed
}

export interface WarehouseCategory {
  id: string;
  user_id: string | null;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface WarehouseInventory {
  id: string;
  product_id: string;
  warehouse_category: WarehouseCategoryEnum;
  quantity: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface StockLedger {
  id: string;
  user_id: string | null;
  product_id: string | null;
  event_type: EventTypeEnum;
  quantity: number;
  from_warehouse_category: WarehouseCategoryEnum | null;
  to_warehouse_category: WarehouseCategoryEnum | null;
  notes: string | null;
  event_date: string | null; // ISO date string
  created_at: string;
  updated_at: string;
  products?: Pick<Product, 'nama_barang'>; // Joined data
}

// New interface for StockLedger with joined product details
export interface StockLedgerWithProduct extends StockLedger {
  products: Pick<Product, 'nama_barang' | 'kode_barang'> | null; // Added kode_barang
}

export interface PurchaseRequest {
  id: string;
  user_id: string | null;
  item_name: string;
  item_code: string;
  quantity: number;
  unit_price: number;
  suggested_selling_price: number;
  total_price: number;
  notes: string | null;
  status: PurchaseRequestStatus;
  created_at: string;
  document_url: string | null;
  received_quantity: number | null;
  returned_quantity: number | null;
  damaged_quantity: number | null;
  target_warehouse_category: WarehouseCategoryEnum | null;
  received_notes: string | null;
  received_at: string | null;
  product_id: string | null;
  supplier_id: string | null;
  satuan: string | null;
  pr_number: string | null;
  updated_at: string;
}

// New interface for PurchaseRequest with joined details
export interface PurchaseRequestWithDetails extends PurchaseRequest {
  products: Pick<Product, 'nama_barang' | 'kode_barang' | 'satuan'> | null;
  suppliers: Pick<Supplier, 'name'> | null; // Added name for supplier_name
}

export interface Customer {
  id: string;
  user_id: string | null;
  customer_name: string;
  company_name: string | null;
  address: string | null;
  phone_number: string | null;
  customer_type: CustomerTypeEnum;
  created_at: string;
  updated_at: string;
}

// New interface for Customer with joined details (if any)
export interface CustomerWithDetails extends Customer {
  // Add any joined fields if needed
}

export interface Technician {
  id: string;
  user_id: string | null;
  name: string;
  phone_number: string | null;
  type: TechnicianType; // Use TechnicianType enum
  address: string | null;
  city: string | null;
  province: string | null;
  created_at: string;
  updated_at: string;
}

// New interface for Technician with joined details (if any)
export interface TechnicianWithDetails extends Technician {
  // Add any joined fields if needed
}

export interface InvoiceItem {
  id?: string; // Made optional for new items
  invoice_id: string | null;
  user_id: string | null;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at?: string; // Made optional for new items
  unit_type: string | null;
  product_id: string | null; // Changed from selected_product_id
  item_code: string | null;
  updated_at?: string; // Made optional for new items
}

export interface Invoice {
  id: string;
  user_id: string | null;
  invoice_number: string;
  invoice_date: string;
  due_date: string | null;
  customer_name: string;
  company_name: string | null;
  total_amount: number;
  payment_status: InvoicePaymentStatus;
  created_at: string;
  type: InvoiceType | null;
  customer_type: CustomerTypeEnum | null;
  payment_method: string | null;
  notes: string | null;
  document_url: string | null;
  courier_service: string | null;
  invoice_status: InvoiceDocumentStatus;
  updated_at: string;
}

// New interface for Invoice with joined items
export interface InvoiceWithDetails extends Invoice {
  invoice_items: InvoiceItem[];
}

export interface Schedule {
  id: string;
  user_id: string | null;
  schedule_date: string; // ISO date string
  schedule_time: string | null;
  type: ScheduleType; // Use ScheduleType enum
  customer_name: string;
  address: string | null;
  technician_name: string | null;
  invoice_id: string | null;
  status: ScheduleStatus; // Use ScheduleStatus enum
  notes: string | null;
  created_at: string; // ISO date string
  phone_number: string | null;
  courier_service: string | null;
  document_url: string | null;
  scheduling_request_id: string | null;
  do_number: string | null;
  updated_at: string; // ISO date string
  product_category: ScheduleProductCategory | null;
  customer_id: string | null; // Added customer_id
}

// Extend Schedule to include related customer and invoice details
export interface ScheduleWithDetails extends Schedule {
  customers: Pick<Customer, 'customer_name' | 'company_name' | 'phone_number' | 'address' | 'customer_type'> | null;
  invoices: Pick<Invoice, 'invoice_number'> | null;
  sr_number: string | null; // Added sr_number to ScheduleWithDetails
  payment_method: string | null; // Added payment_method to ScheduleWithDetails
}

export interface SalesDetail {
  id: string;
  user_id: string | null;
  no: number;
  kirim_install: string;
  no_transaksi: string;
  invoice_number: string;
  new_old: string | null;
  perusahaan: string | null;
  tanggal: string; // ISO date string
  hari: string | null;
  jam: string | null;
  customer: string;
  alamat_install: string | null;
  no_hp: string | null;
  type: string | null;
  qty_unit: number | null;
  stock: number | null;
  harga: number | null;
  web: string | null;
  qty_web: number | null;
  kartu: string | null;
  qty_kartu: number | null;
  paket: string | null;
  pulsa: number | null;
  teknisi: string | null;
  payment: string | null;
  catatan: string | null;
  created_at: string;
  updated_at: string;
}

export interface SalesInvoice {
  id: string;
  no_transaksi: string;
  invoice_file_url: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  updated_at: string;
  role: 'user' | 'admin' | 'staff';
}

// New interface for Supabase User with joined Profile details
export interface UserWithProfile extends User {
  profiles: Pick<Profile, 'role' | 'first_name' | 'last_name' | 'phone_number'> | null; // Added phone_number
}