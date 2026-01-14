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
import SalesDetailDetailDialog from '@/components/SalesDetailDetailDialog'; // Import the new dialog component
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const SalesDetailsPage: React.FC = () => {
  const { session } = useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState<string>('view');
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [editingSalesDetail, setEditingSalesDetail] = React.useState<SalesDetail | null>(null); // State for editing sales detail
  const [viewingSalesDetail, setViewingSalesDetail] = React.useState<SalesDetail | null>(null); // State for viewing sales detail

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

  const updateSalesDetailMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<SalesDetail> }) =>
      updateSalesDetail(id, updates, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesDetails', userId] });
      showSuccess('Detail penjualan berhasil diperbarui!');
      setEditingSalesDetail(null);
      setActiveTab('view');
    },
    onError: (err) => {
      showError(`Gagal memperbarui detail penjualan: ${err.message}`);
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

  const handleAddOrUpdateSalesDetail = (values: any) => {
    if (!userId) {
      showError('Anda harus login untuk menambahkan/memperbarui detail penjualan.');
      return;
    }

    const salesDetailData = {
      ...values,
      tanggal: values.tanggal.toISOString().split('T')[0], // Format date to YYYY-MM-DD
    };

    if (editingSalesDetail) {
      updateSalesDetailMutation.mutate({ id: editingSalesDetail.id, updates: salesDetailData });
    } else {
      addSalesDetailMutation.mutate(salesDetailData);
    }
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
    setViewingSalesDetail(salesDetail);
  };

  const handleEditSalesDetail = (salesDetail: SalesDetail) => {
    setEditingSalesDetail(salesDetail);
    setActiveTab('add'); // Switch to the add/edit tab
  };

  const handleCancelEdit = () => {
    setEditingSalesDetail(null);
    setActiveTab('view');
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
          <TabsTrigger value="add">{editingSalesDetail ? 'Edit Detail' : 'Tambah Detail Baru'}</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>{editingSalesDetail ? 'Edit Detail Penjualan' : 'Tambah Detail Penjualan Baru'}</CardTitle>
            </CardHeader>
            <CardContent>
              <AddSalesDetailForm 
                onSubmit={handleAddOrUpdateSalesDetail} 
                isLoading={addSalesDetailMutation.isPending || updateSalesDetailMutation.isPending} 
                existingSalesDetail={editingSalesDetail}
                onCancelEdit={handleCancelEdit}
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

      <SalesDetailDetailDialog
        salesDetail={viewingSalesDetail}
        onOpenChange={(open) => !open && setViewingSalesDetail(null)}
      />
    </div>
  );
};

export default SalesDetailsPage;