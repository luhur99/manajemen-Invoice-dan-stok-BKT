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
  Invoice: string;
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
}

export interface ExcelData {
  stock: StockItem[];
  sales: SalesDetailItem[]; // Menggunakan SalesDetailItem
}