"use client";

import React from 'react';

const StockMovementHistoryPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Stock Movement History</h1>
      <p className="text-lg text-muted-foreground">Lihat riwayat pergerakan stok antar gudang.</p>
      {/* Placeholder for stock movement history table */}
      <div className="mt-8 bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Riwayat Pergerakan Stok</h2>
        <p>Tabel riwayat pergerakan stok akan ditampilkan di sini.</p>
      </div>
    </div>
  );
};

export default StockMovementHistoryPage;