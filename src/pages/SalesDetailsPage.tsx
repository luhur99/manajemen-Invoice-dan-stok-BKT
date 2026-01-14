"use client";

import React from 'react';

const SalesDetailsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Sales Details</h1>
      <p className="text-lg text-muted-foreground">Lihat detail penjualan Anda di sini.</p>
      {/* Placeholder for sales details report/table */}
      <div className="mt-8 bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Laporan Detail Penjualan</h2>
        <p>Data detail penjualan akan ditampilkan di sini.</p>
      </div>
    </div>
  );
};

export default SalesDetailsPage;