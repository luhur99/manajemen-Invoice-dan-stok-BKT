import { StockItem, SalesItem } from "@/types/data";

export const generateDummyStockData = (count: number = 10): StockItem[] => {
  const dummyData: StockItem[] = [];
  for (let i = 1; i <= count; i++) {
    dummyData.push({
      NO: i,
      "KODE BARANG": `KB-${String(i).padStart(3, '0')}`,
      "NAMA BARANG": `Produk Dummy ${i}`,
      SATUAN: i % 2 === 0 ? "PCS" : "BOX",
      "HARGA BELI": Math.floor(Math.random() * 50000) + 10000,
      "HARGA JUAL": Math.floor(Math.random() * 75000) + 20000,
      "STOCK AWAL": Math.floor(Math.random() * 100) + 50,
      "STOCK MASUK": Math.floor(Math.random() * 30),
      "STOCK KELUAR": Math.floor(Math.random() * 20),
      "STOCK AKHIR": (Math.floor(Math.random() * 100) + 50) + (Math.floor(Math.random() * 30)) - (Math.floor(Math.random() * 20)), // Simplified calculation
    });
  }
  return dummyData;
};

export const generateDummySalesData = (count: number = 10): SalesItem[] => {
  const dummyData: SalesItem[] = [];
  const customers = ["Customer A", "Customer B", "Customer C", "Customer D"];
  const productCodes = ["KB-001", "KB-002", "KB-003", "KB-004", "KB-005"];
  const productNames = ["Produk Dummy 1", "Produk Dummy 2", "Produk Dummy 3", "Produk Dummy 4", "Produk Dummy 5"];
  const units = ["PCS", "BOX"];

  for (let i = 1; i <= count; i++) {
    const qty = Math.floor(Math.random() * 10) + 1;
    const hargaJual = Math.floor(Math.random() * 75000) + 20000;
    dummyData.push({
      NO: i,
      TANGGAL: `2024-0${Math.floor(Math.random() * 9) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      "NO INVOICE": `INV-${String(i).padStart(4, '0')}`,
      "KODE BARANG": productCodes[Math.floor(Math.random() * productCodes.length)],
      "NAMA BARANG": productNames[Math.floor(Math.random() * productNames.length)],
      SATUAN: units[Math.floor(Math.random() * units.length)],
      "HARGA JUAL": hargaJual,
      QTY: qty,
      "TOTAL HARGA": hargaJual * qty,
      CUSTOMER: customers[Math.floor(Math.random() * customers.length)],
    });
  }
  return dummyData;
};