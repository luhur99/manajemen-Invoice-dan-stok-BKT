"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SalesDetailsPage = () => {
  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Detil List Invoice Penjualan</CardTitle>
        <CardDescription>Daftar lengkap invoice penjualan Anda.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">Di sini akan ditampilkan detil list invoice penjualan Anda.</p>
        <p className="text-gray-700 dark:text-gray-300">Fitur untuk input data dan ekspor ke Excel akan ditambahkan pada langkah berikutnya.</p>
      </CardContent>
    </Card>
  );
};

export default SalesDetailsPage;