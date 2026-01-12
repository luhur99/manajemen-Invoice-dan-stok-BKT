import { StockItem, SalesDetailItem } from "@/types/data";

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

export const generateDummySalesData = (count: number = 10): SalesDetailItem[] => {
  const dummyData: SalesDetailItem[] = [];
  const customers = ["Customer A", "Customer B", "Customer C", "Customer D"];
  const companies = ["PT ABC", "CV Jaya", "UD Makmur"];
  const types = ["Type X", "Type Y", "Type Z"];
  const technicians = ["Budi", "Andi", "Citra"];
  const payments = ["Cash", "Transfer"];
  const webOptions = ["Ya", "Tidak"];
  const cardOptions = ["Ada", "Tidak"];

  for (let i = 1; i <= count; i++) {
    const qtyUnit = Math.floor(Math.random() * 10) + 1;
    const harga = Math.floor(Math.random() * 100000) + 50000;
    const qtyWeb = Math.floor(Math.random() * 5);
    const qtyKartu = Math.floor(Math.random() * 5);
    const pulsa = Math.floor(Math.random() * 50000) + 10000;

    dummyData.push({
      NO: i,
      "Kirim/Install": i % 2 === 0 ? "Kirim" : "Install",
      "No Transaksi": `TRX-${String(i).padStart(4, '0')}`,
      Invoice: `INV-${String(i).padStart(4, '0')}`,
      "New/Old": i % 3 === 0 ? "New" : "Old",
      Perusahaan: companies[Math.floor(Math.random() * companies.length)],
      Tanggal: `2024-0${Math.floor(Math.random() * 9) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      Hari: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"][Math.floor(Math.random() * 5)],
      Jam: `${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:00`,
      Customer: customers[Math.floor(Math.random() * customers.length)],
      "Alamat install": `Jl. Dummy No. ${i}, Kota Contoh`,
      "No HP": `0812${String(Math.floor(Math.random() * 99999999)).padStart(8, '0')}`,
      Type: types[Math.floor(Math.random() * types.length)],
      "Qty unit": qtyUnit,
      Stock: Math.floor(Math.random() * 50) + 10,
      Harga: harga,
      WEB: webOptions[Math.floor(Math.random() * webOptions.length)],
      "Qty Web": qtyWeb,
      Kartu: cardOptions[Math.floor(Math.random() * cardOptions.length)],
      "Qty kartu": qtyKartu,
      Paket: `Paket ${Math.floor(Math.random() * 3) + 1}`,
      Pulsa: pulsa,
      Teknisi: technicians[Math.floor(Math.random() * technicians.length)],
      Payment: payments[Math.floor(Math.random() * payments.length)],
      Catatan: `Catatan untuk transaksi ${i}`,
    });
  }
  return dummyData;
};