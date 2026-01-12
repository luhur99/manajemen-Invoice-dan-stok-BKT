"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ScheduleManagementPage = () => {
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Manajemen Jadwal</CardTitle>
        <CardDescription>Kelola jadwal instalasi dan pengiriman barang.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">Daftar jadwal akan ditampilkan di sini.</p>
        {/* Placeholder for Schedule List and Add Schedule Form */}
      </CardContent>
    </Card>
  );
};

export default ScheduleManagementPage;