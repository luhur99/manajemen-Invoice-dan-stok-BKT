"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const StockPage = () => {
  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Data Stok Barang</CardTitle>
        <CardDescription>Informasi mengenai stok barang yang tersedia.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">Di sini akan ditampilkan data stok barang Anda.</p>
        <p className="text-gray-700 dark:text-gray-300">Fitur untuk input data dan ekspor ke Excel akan ditambahkan pada langkah berikutnya.</p>
      </CardContent>
    </Card>
  );
};

export default StockPage;