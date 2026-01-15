"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SalesDetailsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Detail Penjualan</h1>
      <Card>
        <CardHeader>
          <CardTitle>Laporan Penjualan</CardTitle>
          <CardDescription>Lihat detail penjualan Anda di sini.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Konten untuk detail penjualan akan datang di sini.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDetailsPage;