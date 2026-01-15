"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const WarehouseCategoryManagementPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Kategori Gudang</h1>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Kategori Gudang</CardTitle>
          <CardDescription>Kelola kategori gudang Anda di sini.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Konten untuk manajemen kategori gudang akan datang di sini.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WarehouseCategoryManagementPage;