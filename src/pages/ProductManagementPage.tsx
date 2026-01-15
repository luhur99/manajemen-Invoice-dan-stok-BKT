"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ProductManagementPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Produk</h1>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
          <CardDescription>Kelola informasi produk Anda di sini.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Konten untuk manajemen produk akan datang di sini.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManagementPage;