"use client";

import React from 'react';

const StockHistoryPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Stock History</h1>
      <p className="text-lg text-muted-foreground">Lihat riwayat perubahan stok Anda.</p>
      {/* Placeholder for stock history table */}
      <div className="mt-8 bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Riwayat Stok</h2>
        <p>Tabel riwayat stok akan ditampilkan di sini.</p>
      </div>
    </div>
  );
};

export default StockHistoryPage;