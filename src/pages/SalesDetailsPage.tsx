"use client";

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError, showSuccess } from '@/utils/toast';
import { 
  fetchSalesDetails, 
  addSalesDetail, 
  updateSalesDetail, 
  deleteSalesDetail,
  SalesDetail
} from '@/api/salesDetails';
import AddSalesDetailForm from '@/components/AddSalesDetailForm';
import SalesDetailTable from '@/components/SalesDetailTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const SalesDetailsPage: React.FC = () => {
  const { session } = useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState<string>('view');
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const { data: salesDetails, isLoading, error } = useQuery({
    queryKey: ['salesDetails', userId],
    queryFn: () => fetchSalesDetails(userId!),
    enabled: !!userId,
  });

  const addSalesDetailMutation = useMutation({
    mutationFn: (newSalesDetail: Parameters<typeof addSalesDetail>[0]) =>
      addSalesDetail(newSalesDetail, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesDetails', userId] });
      showSuccess('Detail penjualan berhasil ditambahkan!');
      setActiveTab('view');
    },
    onError: (err) => {
      showError(`Gagal menambahkan detail penjualan: ${err.message}`);
    },
  });

  const deleteSalesDetailMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteSalesDetail(id, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesDetails', userId] });
      showSuccess('Detail penjualan berhasil dihapus!');
    },
    onError: (err) => {
      showError(`Gagal menghapus detail penjualan: ${err.message}`);
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleAddSalesDetail = (values: any) => {
    if (!userId) {
      showError('Anda harus login untuk menambahkan detail penjualan.');
      return;
    }

    addSalesDetailMutation.mutate(values);
  };

  const handleDeleteSalesDetail = (id: string) => {
    if (!userId) {
      showError('Anda harus login untuk menghapus detail penjualan.');
      return;
    }

    setDeletingId(id);
    deleteSalesDetailMutation.mutate({ id });
  };

  const handleViewSalesDetail = (salesDetail: SalesDetail) => {
    // Implementasi untuk melihat detail penjualan
    console.log('View sales detail:', salesDetail);
    // Di sini Anda bisa membuka modal atau navigasi ke halaman detail
  };

  const handleEditSalesDetail = (salesDetail: SalesDetail) => {
    // Implementasi untuk mengedit detail penjualan
    console.log('Edit sales detail:', salesDetail);
    // Di sini Anda bisa membuka modal edit atau navigasi ke halaman edit
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Memuat data detail penjualan...</p>
      </div>
    );
  }

  if (error) {
    showError(`Gagal memuat detail penjualan: ${error.message}`);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Detail Penjualan</h1>
      <p className="text-lg text-muted-foreground mb-8">Kelola detail penjualan Anda di sini.</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">Lihat Detail</TabsTrigger>
          <TabsTrigger value="add">Tambah Detail Baru</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Tambah Detail Penjualan Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <AddSalesDetailForm 
                onSubmit={handleAddSalesDetail} 
                isLoading={addSalesDetailMutation.isPending} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view">
          <SalesDetailTable
            salesDetails={salesDetails || []}
            isLoading={isLoading}
            error={error || null}
            onView={handleViewSalesDetail}
            onEdit={handleEditSalesDetail}
            onDelete={handleDeleteSalesDetail}
            deletingId={deletingId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesDetailsPage;