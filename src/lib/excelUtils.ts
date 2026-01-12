import * as XLSX from "xlsx";
import { ExcelData, SalesDetailItem, StockItem } from "@/types/data";

export const readExcelFile = async (filePath: string): Promise<ExcelData> => {
  try {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    const stockSheetName = "STOCK";
    const salesSheetName = "SALES";

    const stockSheet = workbook.Sheets[stockSheetName];
    const salesSheet = workbook.Sheets[salesSheetName];

    let stockData: StockItem[] = [];
    let salesData: SalesDetailItem[] = [];

    if (stockSheet) {
      stockData = XLSX.utils.sheet_to_json<StockItem>(stockSheet, {
        header: 1,
        range: 1, // Skip header row if it's already defined in the interface
      }).map((row: any) => ({
        NO: row[0],
        "KODE BARANG": row[1],
        "NAMA BARANG": row[2],
        SATUAN: row[3],
        "HARGA BELI": row[4],
        "HARGA JUAL": row[5],
        "STOCK AWAL": row[6],
        "STOCK MASUK": row[7],
        "STOCK KELUAR": row[8],
        "STOCK AKHIR": row[9],
      }));
    }

    if (salesSheet) {
      // Read sales data assuming the first row contains headers matching SalesDetailItem keys
      const rawSalesData = XLSX.utils.sheet_to_json<any>(salesSheet);
      salesData = rawSalesData.map((row: any) => ({
        NO: row["No"],
        "Kirim/Install": row["Kirim/Install"],
        "No Transaksi": row["No Transaksi"],
        Invoice: row["Invoice"],
        "New/Old": row["New/Old"],
        Perusahaan: row["Perusahaan"],
        Tanggal: row["Tanggal"] ? XLSX.SSF.format("yyyy-mm-dd", row["Tanggal"]) : "", // Format date
        Hari: row["Hari"],
        Jam: row["Jam"],
        Customer: row["Customer"],
        "Alamat install": row["Alamat install"],
        "No HP": row["No HP"],
        Type: row["Type"],
        "Qty unit": row["Qty unit"],
        Stock: row["Stock"],
        Harga: row["Harga"],
        WEB: row["WEB"],
        "Qty Web": row["Qty Web"],
        Kartu: row["Kartu"],
        "Qty kartu": row["Qty kartu"],
        Paket: row["Paket"],
        Pulsa: row["Pulsa"],
        Teknisi: row["Teknisi"],
        Payment: row["Payment"],
        Catatan: row["Catatan"],
      }));
    }

    return { stock: stockData, sales: salesData };
  } catch (error) {
    console.error("Error reading Excel file:", error);
    return { stock: [], sales: [] };
  }
};