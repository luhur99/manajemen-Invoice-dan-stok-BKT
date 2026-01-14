"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";

interface ExportDataButtonProps<T> {
  fetchDataFunction: () => Promise<T[] | null>; // Function to fetch data
  fileName: string; // Name of the file to download (e.g., "sales_details.csv")
  headers: { key: keyof T; label: string }[]; // Headers for CSV, mapping data keys to display labels
}

const ExportDataButton = <T extends object>({
  fetchDataFunction,
  fileName,
  headers,
}: ExportDataButtonProps<T>) => {
  const [loading, setLoading] = useState(false);

  const convertToCsv = (data: T[]): string => {
    if (data.length === 0) return "";

    const csvRows = [];
    // Add headers
    csvRows.push(headers.map(h => `"${h.label.replace(/"/g, '""')}"`).join(','));

    // Add data rows
    for (const row of data) {
      const values = headers.map(h => {
        const value = row[h.key];
        let stringValue: string;

        if (value === null || value === undefined) {
          stringValue = "";
        } else if (typeof value === 'object' && value !== null) {
          // Handle nested objects or arrays by stringifying them
          stringValue = JSON.stringify(value);
        } else {
          stringValue = String(value);
        }
        // Escape double quotes and wrap in quotes
        return `"${stringValue.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const data = await fetchDataFunction();
      if (!data || data.length === 0) {
        showError("Tidak ada data untuk diekspor.");
        return;
      }

      const csv = convertToCsv(data);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", fileName);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showSuccess("Data berhasil diekspor!");
      } else {
        showError("Browser Anda tidak mendukung pengunduhan file.");
      }
    } catch (error: any) {
      showError(`Gagal mengekspor data: ${error.message}`);
      console.error("Error exporting data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={loading} className="flex items-center gap-2">
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      Ekspor CSV
    </Button>
  );
};

export default ExportDataButton;