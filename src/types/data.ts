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

export interface SalesItem {
  NO: number;
  TANGGAL: string; // Or Date if parsed
  "NO INVOICE": string;
  "KODE BARANG": string;
  "NAMA BARANG": string;
  SATUAN: string;
  "HARGA JUAL": number;
  QTY: number;
  "TOTAL HARGA": number;
  CUSTOMER: string;
}

export interface ExcelData {
  stock: StockItem[];
  sales: SalesItem[];
}