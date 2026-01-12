"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const InvoiceManagementPage = () => {
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Manajemen Invoice</CardTitle>
        <CardDescription>Kelola semua invoice penjualan Anda di sini.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">Daftar invoice akan ditampilkan di sini.</p>
        {/* Placeholder for Invoice List and Add Invoice Form */}
      </CardContent>
    </Card>
  );
};

export default InvoiceManagementPage;