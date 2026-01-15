"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SchedulingRequestManagementPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Permintaan Penjadwalan</h1>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Permintaan Penjadwalan</CardTitle>
          <CardDescription>Kelola permintaan penjadwalan Anda di sini.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Konten untuk manajemen permintaan penjadwalan akan datang di sini.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulingRequestManagementPage;