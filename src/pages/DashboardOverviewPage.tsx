"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useSession } from '@/components/SessionContextProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
        <Card>
          <CardHeader>
            <CardTitle>Total Jadwal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">120</p>
            <p className="text-muted-foreground text-sm">Jadwal yang telah diselesaikan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permintaan Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">15</p>
            <p className="text-muted-foreground text-sm">Permintaan penjadwalan baru</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pendapatan Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Rp 50.000.000</p>
            <p className="text-muted-foreground text-sm">Target: Rp 75.000.000</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;