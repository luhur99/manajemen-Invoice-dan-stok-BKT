"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Selamat Datang!</CardTitle>
          <CardDescription>Ini adalah halaman dashboard utama Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Konten dashboard akan ditampilkan di sini.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;