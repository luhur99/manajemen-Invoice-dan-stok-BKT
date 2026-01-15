"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const CustomerManagementPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Pelanggan</h1>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pelanggan</CardTitle>
          <CardDescription>Kelola informasi pelanggan Anda di sini.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Konten untuk manajemen pelanggan akan datang di sini.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerManagementPage;