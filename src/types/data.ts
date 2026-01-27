export enum ScheduleType {
  KIRIM = "kirim",
  INSTALASI = "instalasi",
  SERVICE = "service",
}

export enum SchedulingRequestType { // Defined based on usage
  DELIVERY = "delivery", // Changed from KIRIM to match common usage
  INSTALLATION = "installation", // Changed from INSTALASI
  SERVICE_UNBILL = "service_unbill",
  SERVICE_BILL = "service_bill",
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

export enum PurchaseRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  WAITING_FOR_RECEIVED = "waiting for received",
  CLOSED = "closed",
}

export enum DeliveryOrderStatus {
  PENDING = "pending",
  SCHEDULED = "scheduled",
  IN_TRANSIT = "in_transit",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum InvoicePaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  PARTIALLY_PAID = "partially_paid",
  OVERDUE = "overdue",
  CANCELLED = "cancelled",
}

export enum InvoiceType {
  KIRIM_BARANG = "kirim_barang",
  INSTALASI = "instalasi",
  SERVICE = "service",
}

export enum CustomerTypeEnum {
  INDIVIDUAL = "individual",
  COMPANY = "company",
}

export enum InvoiceDocumentStatus {
  WAITING_DOCUMENT_INV = "waiting_document_inv",
  DOCUMENT_SENT = "document_sent",
  DOCUMENT_RECEIVED = "document_received",
  COMPLETED = "completed",
}

export enum TechnicianType {
  INTERNAL = "internal",
  EXTERNAL = "external",
}

export enum ProductCategory {
  GPS = "GPS",
  CCTV = "CCTV",
  LAINNYA = "Lainnya",
}

export enum StockEventType {
  IN = "IN",
  OUT = "OUT",
  TRANSFER = "TRANSFER",
  ADJUSTMENT = "ADJUSTMENT",
  INITIAL = "INITIAL",
}

export enum ScheduleStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  RESCHEDULED = "rescheduled",
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
}

export enum WarehouseCategoryEnum { // Defined for explicit usage in StockHistoryPage
  GUDANG_UTAMA = "gudang_utama",
  GUDANG_TRANSIT = "gudang_transit",
  GUDANG_TEKNISI = "gudang_teknisi",
  GUDANG_RETUR = "gudang_retur",
  SIAP_JUAL = "siap_jual",
}

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  role: string;
  updated_at: string | null;
};

export type Product = {
  id: string;
  user_id: string | null;
  kode_barang: string;
  nama_barang: string;
  satuan: string | null;
  harga_beli: number;
  harga_jual: number;
  safe_stock_limit: number | null;
  supplier_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  inventories?: WarehouseInventory[]; // Added inventories
};

export type WarehouseCategory = {
  id: string;
  user_id: string | null;
  name: string;
  code: string;
  created_at: string | null;
  updated_at: string | null;
};

export type WarehouseInventory = {
  id: string;
  product_id: string;
  warehouse_category: string; // Assuming this is a string for simplicity, could be enum or foreign key
  quantity: number;
  user_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  products?: Product; // Joined product data
  warehouse_categories?: WarehouseCategory; // Joined category data
};

export type StockLedger = {
  id: string;
  user_id: string | null;
  product_id: string | null;
  event_type: StockEventType;
  quantity: number;
  from_warehouse_category: string | null;
  to_warehouse_category: string | null;
  notes: string | null;
  event_date: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type StockLedgerWithProduct = StockLedger & {
  products?: Product; // Joined product data
};

export type Customer = {
  id: string;
  user_id: string | null;
  customer_name: string;
  company_name: string | null;
  address: string | null;
  phone_number: string | null;
  customer_type: CustomerTypeEnum;
  created_at: string | null;
  updated_at: string | null;
};

export type CustomerWithDetails = Customer & {
  profiles?: Profile; // Assuming customer might have a related profile
};

export type Supplier = {
  id: string;
  user_id: string | null;
  name: string;
  contact_person: string | null;
  phone_number: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type Technician = {
  id: string;
  user_id: string | null;
  name: string;
  phone_number: string | null;
  type: TechnicianType;
  address: string | null;
  city: string | null;
  province: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type TechnicianWithDetails = Technician & {
  profiles?: Profile; // Assuming technician might have a related profile
};

export type SchedulingRequest = {
  id: string;
  user_id: string | null;
  type: SchedulingRequestType; // Changed to SchedulingRequestType
  full_address: string;
  landmark: string | null;
  requested_date: string;
  requested_time: string | null;
  contact_person: string;
  payment_method: string | null;
  status: SchedulingRequestStatus;
  notes: string | null;
  created_at: string | null;
  sr_number: string | null;
  invoice_id: string | null;
  customer_id: string | null;
  vehicle_details: string | null;
  company_name: string | null;
  customer_name: string | null;
  phone_number: string | null;
  updated_at: string | null;
  technician_name: string | null;
  product_category: ProductCategory | null;
  customer_type: CustomerTypeEnum | null; // Added customer_type
};

export type SchedulingRequestWithDetails = SchedulingRequest & {
  customers?: Customer;
  invoices?: Invoice;
};

export type Schedule = {
  id: string;
  user_id: string | null;
  schedule_date: string;
  schedule_time: string | null;
  type: ScheduleType;
  customer_name: string;
  address: string | null;
  technician_name: string | null;
  invoice_id: string | null;
  status: ScheduleStatus; // Changed to ScheduleStatus enum
  notes: string | null;
  created_at: string | null;
  phone_number: string | null;
  courier_service: string | null;
  document_url: string | null;
  scheduling_request_id: string | null;
  do_number: string | null;
  updated_at: string | null;
  product_category: ProductCategory | null;
  customer_id: string | null;
  sr_number: string | null; // Added sr_number
  invoices?: Invoice; // Added invoices for joined data
  company_name: string | null; // Added company_name
};

export type ScheduleWithDetails = Schedule & {
  customers?: { company_name: string | null; customer_type: CustomerTypeEnum | null } | null;
};

export type InvoiceItem = {
  id: string;
  invoice_id: string | null;
  user_id: string | null;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string | null;
  unit_type: string | null;
  product_id: string | null;
  item_code: string | null;
  updated_at: string | null;
  products?: Product; // Joined product data
};

export type Invoice = {
  id: string;
  user_id: string | null;
  invoice_number: string;
  invoice_date: string;
  due_date: string | null;
  customer_name: string;
  company_name: string | null;
  total_amount: number;
  payment_status: InvoicePaymentStatus;
  type: InvoiceType | null;
  customer_type: CustomerTypeEnum | null;
  payment_method: string | null;
  notes: string | null;
  document_url: string | null;
  courier_service: string | null;
  invoice_status: InvoiceDocumentStatus;
  created_at: string | null;
  updated_at: string | null;
  do_number: string | null;
};

export type InvoiceWithDetails = Invoice & {
  invoice_items?: InvoiceItem[]; // Joined invoice items
};

export type PurchaseRequest = {
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
  created_at: string | null;
  document_url: string | null;
  received_quantity: number | null;
  returned_quantity: number | null;
  damaged_quantity: number | null;
  target_warehouse_category: string | null;
  received_notes: string | null;
  received_at: string | null;
  product_id: string | null;
  supplier_id: string | null;
  satuan: string | null;
  pr_number: string | null;
  updated_at: string | null;
};

export type PurchaseRequestWithDetails = PurchaseRequest & {
  products?: Product; // Joined product data
  suppliers?: Supplier; // Joined supplier data
};

export type DeliveryOrder = {
  id: string;
  request_id: string | null; // This could be scheduling_request_id or invoice_id
  user_id: string | null;
  do_number: string;
  items_json: any | null; // JSONB type, can be more specific if schema is known
  delivery_date: string;
  delivery_time: string | null;
  status: DeliveryOrderStatus;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type SalesInvoice = {
  id: string;
  no_transaksi: string;
  invoice_file_url: string | null;
  created_at: string | null;
};

export type SalesDetail = {
  id: string;
  user_id: string | null;
  no: number;
  kirim_install: string;
  no_transaksi: string;
  invoice_number: string;
  new_old: string | null;
  perusahaan: string | null;
  tanggal: string;
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
  created_at: string | null;
  updated_at: string | null;
};

export type UserWithProfile = {
  id: string;
  email: string;
  created_at: string | null;
  last_sign_in_at: string | null;
  profiles: Profile | null; // Nested profile object
};