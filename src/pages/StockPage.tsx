"use client";

import React from 'react';

const StockPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Stock Management</h1>
      <p className="text-lg text-muted-foreground">Kelola inventaris stok Anda di sini.</p>
      {/* Placeholder for stock list/table */}
      <div className="mt-8 bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Daftar Stok Barang</h2>
        <p>Tabel stok barang akan ditampilkan di sini.</p>
      </div>
    </div>
  );
};

export default StockPage;