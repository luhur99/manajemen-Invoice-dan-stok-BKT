"use client";

import React from 'react';

const ScheduleManagementPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Schedule Management</h1>
      <p className="text-lg text-muted-foreground">Kelola semua jadwal Anda di sini.</p>
      {/* Placeholder for schedule list/calendar */}
      <div className="mt-8 bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Daftar Jadwal</h2>
        <p>Tabel jadwal akan ditampilkan di sini.</p>
      </div>
    </div>
  );
};

export default ScheduleManagementPage;