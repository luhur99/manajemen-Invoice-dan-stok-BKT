"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useSession } from '@/components/SessionContextProvider';

const DashboardOverviewPage: React.FC = () => {
  const { isLoading: isSessionLoading } = useSession();

  if (isSessionLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Selamat datang di dashboard Anda! Fitur-fitur akan segera hadir di sini.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for dashboard cards */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Penjualan</h2>
          <p className="text-3xl font-bold text-primary">Rp 0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Jadwal Mendatang</h2>
          <p className="text-3xl font-bold text-primary">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Permintaan Tertunda</h2>
          <p className="text-3xl font-bold text-primary">0</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;