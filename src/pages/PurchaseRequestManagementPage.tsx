"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PurchaseRequestManagementPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Permintaan Pembelian</h1>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Permintaan Pembelian</CardTitle>
          <CardDescription>Kelola permintaan pembelian Anda di sini.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Konten untuk manajemen permintaan pembelian akan datang di sini.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseRequestManagementPage;