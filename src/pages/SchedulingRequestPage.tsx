"use client";

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError, showSuccess } from '@/utils/toast';
import { 
  fetchSchedulingRequests, 
  addSchedulingRequest, 
  updateSchedulingRequest, 
  deleteSchedulingRequest,
  SchedulingRequest
} from '@/api/schedulingRequests';
import AddSchedulingRequestForm from '@/components/AddSchedulingRequestForm';
import SchedulingRequestTable from '@/components/SchedulingRequestTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const SchedulingRequestPage: React.FC = () => {
  const { session } = useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState<string>('view');
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const { data: schedulingRequests, isLoading, error } = useQuery({
    queryKey: ['schedulingRequests', userId],
    queryFn: () => fetchSchedulingRequests(userId!),
    enabled: !!userId,
  });

  const addSchedulingRequestMutation = useMutation({
    mutationFn: (newRequest: Parameters<typeof addSchedulingRequest>[0]) =>
      addSchedulingRequest(newRequest, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedulingRequests', userId] });
      showSuccess('Permintaan penjadwalan berhasil ditambahkan!');
      setActiveTab('view');
    },
    onError: (err) => {
      showError(`Gagal menambahkan permintaan penjadwalan: ${err.message}`);
    },
  });

  const deleteSchedulingRequestMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteSchedulingRequest(id, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedulingRequests', userId] });
      showSuccess('Permintaan penjadwalan berhasil dihapus!');
    },
    onError: (err) => {
      showError(`Gagal menghapus permintaan penjadwalan: ${err.message}`);
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleAddSchedulingRequest = (values: any) => {
    if (!userId) {
      showError('Anda harus login untuk menambahkan permintaan penjadwalan.');
      return;
    }

    addSchedulingRequestMutation.mutate({
      ...values,
      requested_date: values.requested_date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
    });
  };

  const handleDeleteSchedulingRequest = (id: string) => {
    if (!userId) {
      showError('Anda harus login untuk menghapus permintaan penjadwalan.');
      return;
    }

    setDeletingId(id);
    deleteSchedulingRequestMutation.mutate({ id });
  };

  const handleViewSchedulingRequest = (request: SchedulingRequest) => {
    // Implementasi untuk melihat detail permintaan penjadwalan
    console.log('View scheduling request:', request);
    // Di sini Anda bisa membuka modal atau navigasi ke halaman detail
  };

  const handleEditSchedulingRequest = (request: SchedulingRequest) => {
    // Implementasi untuk mengedit permintaan penjadwalan
    console.log('Edit scheduling request:', request);
    // Di sini Anda bisa membuka modal edit atau navigasi ke halaman edit
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Memuat data permintaan penjadwalan...</p>
      </div>
    );
  }

  if (error) {
    showError(`Gagal memuat permintaan penjadwalan: ${error.message}`);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Permintaan Penjadwalan</h1>
      <p className="text-lg text-muted-foreground mb-8">Kelola permintaan penjadwalan Anda di sini.</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">Lihat Permintaan</TabsTrigger>
          <TabsTrigger value="add">Tambah Permintaan Baru</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Tambah Permintaan Penjadwalan Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <AddSchedulingRequestForm 
                onSubmit={handleAddSchedulingRequest} 
                isLoading={addSchedulingRequestMutation.isPending} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view">
          <SchedulingRequestTable
            schedulingRequests={schedulingRequests || []}
            isLoading={isLoading}
            error={error || null}
            onView={handleViewSchedulingRequest}
            onEdit={handleEditSchedulingRequest}
            onDelete={handleDeleteSchedulingRequest}
            deletingId={deletingId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchedulingRequestPage;