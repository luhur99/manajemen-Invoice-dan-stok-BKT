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
      no: i,
      kirim_install: i % 2 === 0 ? "Kirim" : "Install",
      no_transaksi: `TRX-${String(i).padStart(4, '0')}`,
      invoice_number: `INV-${String(i).padStart(4, '0')}`,
      new_old: i % 3 === 0 ? "New" : "Old",
      perusahaan: companies[Math.floor(Math.random() * companies.length)],
      tanggal: `2024-0${Math.floor(Math.random() * 9) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      hari: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"][Math.floor(Math.random() * 5)],
      jam: `${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:00`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      alamat_install: `Jl. Dummy No. ${i}, Kota Contoh`,
      no_hp: `0812${String(Math.floor(Math.random() * 99999999)).padStart(8, '0')}`,
      type: types[Math.floor(Math.random() * types.length)],
      qty_unit: qtyUnit,
      stock: Math.floor(Math.random() * 50) + 10,
      harga: harga,
      web: webOptions[Math.floor(Math.random() * webOptions.length)],
      qty_web: qtyWeb,
      kartu: cardOptions[Math.floor(Math.random() * cardOptions.length)],
      qty_kartu: qtyKartu,
      paket: `Paket ${Math.floor(Math.random() * 3) + 1}`,
      pulsa: pulsa,
      teknisi: technicians[Math.floor(Math.random() * technicians.length)],
      payment: payments[Math.floor(Math.random() * payments.length)],
      catatan: `Catatan untuk transaksi ${i}`,
      invoice_file_url: undefined, // Add this new field, initially undefined
    });
  }
  return dummyData;
};