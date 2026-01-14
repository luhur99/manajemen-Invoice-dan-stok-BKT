"use client";

import React from 'react';

const PurchaseRequestPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Purchase Requests</h1>
      <p className="text-lg text-muted-foreground">Kelola permintaan pembelian Anda di sini.</p>
      {/* Placeholder for purchase request list/table */}
      <div className="mt-8 bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Daftar Permintaan Pembelian</h2>
        <p>Tabel permintaan pembelian akan ditampilkan di sini.</p>
      </div>
    </div>
  );
};

export default PurchaseRequestPage;