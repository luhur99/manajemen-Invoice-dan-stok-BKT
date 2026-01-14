"use client";

import React from 'react';

const InvoiceManagementPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Invoice Management</h1>
      <p className="text-lg text-muted-foreground">Kelola semua faktur Anda di sini.</p>
      {/* Placeholder for invoice list/table */}
      <div className="mt-8 bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Daftar Faktur</h2>
        <p>Tabel faktur akan ditampilkan di sini.</p>
      </div>
    </div>
  );
};

export default InvoiceManagementPage;