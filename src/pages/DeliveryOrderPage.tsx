"use client";

import React from 'react';

const DeliveryOrderPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Delivery Orders</h1>
      <p className="text-lg text-muted-foreground">Kelola pesanan pengiriman Anda di sini.</p>
      {/* Placeholder for delivery order list/table */}
      <div className="mt-8 bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Daftar Pesanan Pengiriman</h2>
        <p>Tabel pesanan pengiriman akan ditampilkan di sini.</p>
      </div>
    </div>
  );
};

export default DeliveryOrderPage;