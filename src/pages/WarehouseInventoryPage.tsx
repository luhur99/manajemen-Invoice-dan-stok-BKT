"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const WarehouseInventoryPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Inventaris Gudang</h1>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Inventaris</CardTitle>
          <CardDescription>Kelola inventaris gudang Anda di sini.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Konten untuk inventaris gudang akan datang di sini.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WarehouseInventoryPage;