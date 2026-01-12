import * as XLSX from "xlsx";
import { ExcelData, SalesItem, StockItem } from "@/types/data";

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
    let salesData: SalesItem[] = [];

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
      salesData = XLSX.utils.sheet_to_json<SalesItem>(salesSheet, {
        header: 1,
        range: 1, // Skip header row if it's already defined in the interface
      }).map((row: any) => ({
        NO: row[0],
        TANGGAL: XLSX.SSF.format("yyyy-mm-dd", row[1]), // Format date from number to string
        "NO INVOICE": row[2],
        "KODE BARANG": row[3],
        "NAMA BARANG": row[4],
        SATUAN: row[5],
        "HARGA JUAL": row[6],
        QTY: row[7],
        "TOTAL HARGA": row[8],
        CUSTOMER: row[9],
      }));
    }

    return { stock: stockData, sales: salesData };
  } catch (error) {
    console.error("Error reading Excel file:", error);
    return { stock: [], sales: [] };
  }
};