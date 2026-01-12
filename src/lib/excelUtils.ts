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
        no: row["No"],
        kirim_install: row["Kirim/Install"],
        no_transaksi: row["No Transaksi"],
        invoice_number: row["Invoice"],
        new_old: row["New/Old"],
        perusahaan: row["Perusahaan"],
        tanggal: row["Tanggal"] ? XLSX.SSF.format("yyyy-mm-dd", row["Tanggal"]) : "", // Format date
        hari: row["Hari"],
        jam: row["Jam"],
        customer: row["Customer"],
        alamat_install: row["Alamat install"],
        no_hp: row["No HP"],
        type: row["Type"],
        qty_unit: row["Qty unit"],
        stock: row["Stock"],
        harga: row["Harga"],
        web: row["WEB"],
        qty_web: row["Qty Web"],
        kartu: row["Kartu"],
        qty_kartu: row["Qty kartu"],
        paket: row["Paket"],
        pulsa: row["Pulsa"],
        teknisi: row["Teknisi"],
        payment: row["Payment"],
        catatan: row["Catatan"],
      }));
    }

    return { stock: stockData, sales: salesData };
  } catch (error) {
    console.error("Error reading Excel file:", error);
    return { stock: [], sales: [] };
  }
};