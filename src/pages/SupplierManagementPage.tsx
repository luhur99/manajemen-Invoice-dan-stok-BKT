"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SupplierManagementPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Pemasok</h1>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pemasok</CardTitle>
          <CardDescription>Kelola informasi pemasok Anda di sini.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Konten untuk manajemen pemasok akan datang di sini.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierManagementPage;