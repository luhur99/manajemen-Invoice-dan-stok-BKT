"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const DeliveryOrderManagementPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Pesanan Pengiriman</h1>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pesanan Pengiriman</CardTitle>
          <CardDescription>Kelola pesanan pengiriman Anda di sini.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Konten untuk manajemen pesanan pengiriman akan datang di sini.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryOrderManagementPage;