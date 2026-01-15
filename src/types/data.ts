// src/types/data.ts

// Replaced enum with interface for dynamic categories
export interface WarehouseCategory {
  id: string;
  user_id?: string;
  name: string;
  code: string; // e.g., "siap_jual"
  created_at: string;
  updated_at?: string;
}

// New enum for unified stock event types
export enum StockEventType {
  INITIAL = "initial",
  IN = "in",
    OUT = "out",
  TRANSFER = "transfer",
  ADJUSTMENT = "adjustment",
}

export enum SchedulingRequestType {
  INSTALLATION = "installation",
  SERVICE_PAID = "service_paid",
  SERVICE_UNBILL = "service_unbill",
  DELIVERY = "delivery",
  MAINTENANCE = "maintenance",
  SURVEY = "survey",
}

export enum SchedulingRequestStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress", // New status
  RESCHEDULED = "rescheduled", // New status
  REJECTED = "rejected",
  CANCELLED = "cancelled", // New status
  APPROVED = "approved",
  COMPLETED = "completed",
}

export enum DeliveryOrderStatus {
  PENDING = "pending",
  IN_TRANSIT = "in_transit",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum PurchaseRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  WAITING_FOR_RECEIVED = "waiting for received",
  CLOSED = "closed",
}

// New enums for Invoice and Schedule
export enum InvoicePaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  OVERDUE = "overdue",
}

export enum InvoiceType {
  INSTALASI = "instalasi",
  KIRIM_BARANG = "kirim barang",
}

// Renamed to CustomerTypeEnum to avoid conflict with CustomerType interface
export enum CustomerTypeEnum {
  B2C = "B2C",
  B2B = "B2B",
}

export enum ScheduleType {
  INSTALASI = "instalasi",
  KIRIM = "kirim",
}

export enum ScheduleStatus {
  SCHEDULED = "scheduled",
  IN_PROGRESS = "in progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface Product {
  id: string;
  user_id: string;
  kode_barang: string;
  nama_barang: string;
  satuan?: string;
  harga_beli: number;
  harga_jual: number;
  safe_stock_limit?: number;
  created_at: string;
  supplier_id?: string;
  inventories?: WarehouseInventory[];
}

export interface WarehouseInventory {
  id: string;
  product_id: string;
  warehouse_category: string;
  quantity: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// New interface for the unified stock_ledger table
export interface StockLedger {
  id: string;
  user_id: string;
  product_id: string;
  event_type: StockEventType;
  quantity: number;
  from_warehouse_category?: string;
  to_warehouse_category?: string;
  notes?: string;
  event_date: string;
  created_at: string;
}

// New interface for StockLedger with product name for display
export interface StockLedgerWithProduct extends StockLedger {
  product_name: string;
  product_code: string;
}

export interface Supplier {
  id: string;
  user_id?: string;
  name: string;
  contact_person?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// New interface for Supplier with 'no' property
export interface SupplierWithDetails extends Supplier {
  no?: number;
}

export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone_number?: string;
  updated_at?: string;
  role: string;
}

export interface PurchaseRequest {
  id: string;
  user_id?: string;
  pr_number?: string;
  item_name: string;
  item_code: string;
  quantity: number;
  unit_price: number;
  suggested_selling_price: number;
  total_price: number;
  notes?: string;
  status: PurchaseRequestStatus;
  created_at: string;
  updated_at?: string;
  document_url?: string;
  received_quantity?: number;
  returned_quantity?: number;
  damaged_quantity?: number;
  target_warehouse_category?: string;
  received_notes?: string;
  received_at?: string;
  product_id?: string;
  supplier_id?: string;
  satuan?: string;
}

// New interface for PurchaseRequest with supplier name and 'no'
export interface PurchaseRequestWithDetails extends PurchaseRequest {
  supplier_name?: string;
  no?: number;
}

export interface SchedulingRequest {
  id: string;
  user_id?: string;
  sr_number?: string;
  customer_id?: string | null;
  customer_name: string;
  company_name?: string;
  type: SchedulingRequestType;
  // Removed vehicle_units, vehicle_type, vehicle_year
  vehicle_details?: string; // New field for combined vehicle details
  full_address: string;
  landmark?: string;
  requested_date: string;
  requested_time?: string;
  contact_person: string;
  phone_number: string;
  customer_type?: CustomerTypeEnum;
  payment_method?: string;
  status: SchedulingRequestStatus;
  notes?: string;
  created_at: string;
  updated_at?: string;
  invoice_id?: string;
  technician_name?: string; // New field for technician name
}

// New interface for SchedulingRequest with 'no' for display
export interface SchedulingRequestWithDetails extends SchedulingRequest {
  no?: number;
  invoice_number?: string;
  customer_name_from_customers?: string;
  company_name_from_customers?: string;
  phone_number_from_customers?: string;
  customer_type_from_customers?: CustomerTypeEnum;
}

export interface Schedule {
  id: string;
  user_id?: string;
  schedule_date: string;
  schedule_time?: string;
  type: ScheduleType;
  customer_name: string;
  address?: string;
  technician_name?: string;
  invoice_id?: string;
  status: ScheduleStatus;
  notes?: string;
  created_at: string;
  phone_number?: string;
  courier_service?: string;
  document_url?: string;
  scheduling_request_id?: string; // New field
  do_number?: string; // New field
}

// New interface for Schedule with invoice number and 'no'
export interface ScheduleWithDetails extends Schedule {
  invoice_number?: string;
  no?: number;
  sr_number?: string; // Added sr_number here
}

export interface Invoice {
  id: string;
  user_id?: string;
  invoice_number: string;
  invoice_date: string;
  due_date?: string;
  customer_name: string;
  company_name?: string;
  total_amount: number;
  payment_status: InvoicePaymentStatus;
  created_at: string;
  type?: InvoiceType;
  customer_type?: CustomerTypeEnum;
  payment_method?: string;
  notes?: string;
  document_url?: string;
  courier_service?: string;
}

// New interface for Invoice with item names summary and 'no'
export interface InvoiceWithDetails extends Invoice {
  item_names_summary?: string;
  no?: number;
  schedule_status_display?: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id?: string;
  user_id?: string;
  item_name: string;
  item_code?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
  unit_type?: string;
  product_id?: string;
}

export interface DeliveryOrder {
  id: string;
  request_id?: string;
  user_id?: string;
  do_number: string;
  items_json?: any;
  delivery_date: string;
  delivery_time?: string;
  status: DeliveryOrderStatus;
  notes?: string;
  created_at: string;
}

export interface SalesInvoice {
  id: string;
  no_transaksi: string;
  invoice_file_url?: string;
  created_at: string;
}

export interface SalesDetail {
  id: string;
  user_id?: string;
  no: number;
  kirim_install: string;
  no_transaksi: string;
  invoice_number: string;
  new_old?: string;
  perusahaan?: string;
  tanggal: string;
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
  created_at: string;
}

// New interface for Customer
export interface Customer {
  id: string;
  user_id?: string;
  customer_name: string;
  company_name?: string;
  address?: string;
  phone_number?: string;
  customer_type: CustomerTypeEnum;
  created_at: string;
  updated_at?: string;
}

// New interface for Customer with 'no' for display
export interface CustomerWithDetails extends Customer {
  no?: number;
}