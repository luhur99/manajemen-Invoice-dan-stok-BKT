"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const StockLedgerPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Buku Besar Stok</h1>
      <Card>
        <CardHeader>
          <CardTitle>Catatan Stok</CardTitle>
          <CardDescription>Lihat semua transaksi stok Anda di sini.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Konten untuk buku besar stok akan datang di sini.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockLedgerPage;