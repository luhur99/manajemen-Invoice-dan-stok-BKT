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
  SchedulingRequest,
  SchedulingRequestStatus // Import SchedulingRequestStatus
} from '@/api/schedulingRequests';
import AddSchedulingRequestForm from '@/components/AddSchedulingRequestForm';
import SchedulingRequestTable from '@/components/SchedulingRequestTable';
import SchedulingRequestDetailDialog from '@/components/SchedulingRequestDetailDialog'; // Import the new dialog component
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const SchedulingRequestPage: React.FC = () => {
  const { session, isLoading: isSessionLoading } = useSession(); // Gunakan isSessionLoading
  const userId = session?.user?.id;
  // const isAdmin = !isSessionLoading && session?.user?.user_metadata?.role === 'admin'; // Tidak lagi diperlukan
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState<string>('view');
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [editingRequest, setEditingRequest] = React.useState<SchedulingRequest | null>(null); // State for editing request
  const [viewingRequest, setViewingRequest] = React.useState<SchedulingRequest | null>(null); // State for viewing request

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

  const updateSchedulingRequestMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<SchedulingRequest> }) =>
      updateSchedulingRequest(id, updates, userId!),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['schedulingRequests', userId] });
      // Invalidate schedules query if the request was approved
      if (data.status === 'approved') {
        queryClient.invalidateQueries({ queryKey: ['schedules', userId] });
      }
      showSuccess(`Permintaan penjadwalan berhasil diperbarui menjadi ${data.status}!`);
      setEditingRequest(null);
      setViewingRequest(null); // Close dialog after update
      setActiveTab('view');
    },
    onError: (err) => {
      showError(`Gagal memperbarui permintaan penjadang: ${err.message}`);
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

  const handleAddOrUpdateSchedulingRequest = (values: any) => {
    if (!userId) {
      showError('Anda harus login untuk menambahkan/memperbarui permintaan penjadwalan.');
      return;
    }

    const requestData = {
      ...values,
      requested_date: values.requested_date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
    };

    if (editingRequest) {
      updateSchedulingRequestMutation.mutate({ id: editingRequest.id, updates: requestData });
    } else {
      addSchedulingRequestMutation.mutate(requestData);
    }
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
    setViewingRequest(request);
  };

  const handleEditSchedulingRequest = (request: SchedulingRequest) => {
    setEditingRequest(request);
    setActiveTab('add'); // Switch to the add/edit tab
  };

  const handleCancelEdit = () => {
    setEditingRequest(null);
    setActiveTab('view');
  };

  const handleApproveRequest = (id: string) => {
    if (!userId) {
      showError('Anda harus login untuk menyetujui permintaan penjadwalan.');
      return;
    }
    updateSchedulingRequestMutation.mutate({ id, updates: { status: 'approved' as SchedulingRequestStatus } });
  };

  const handleRejectRequest = (id: string) => {
    if (!userId) {
      showError('Anda harus login untuk menolak permintaan penjadwalan.');
      return;
    }
    updateSchedulingRequestMutation.mutate({ id, updates: { status: 'rejected' as SchedulingRequestStatus } });
  };

  const isApprovingOrRejecting = updateSchedulingRequestMutation.isPending;

  if (isLoading || isSessionLoading) { // Tambahkan isSessionLoading ke kondisi loading keseluruhan
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
          <TabsTrigger value="add">{editingRequest ? 'Edit Permintaan' : 'Tambah Permintaan Baru'}</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>{editingRequest ? 'Edit Permintaan Penjadwalan' : 'Tambah Permintaan Penjadwalan Baru'}</CardTitle>
            </CardHeader>
            <CardContent>
              <AddSchedulingRequestForm 
                onSubmit={handleAddOrUpdateSchedulingRequest} 
                isLoading={addSchedulingRequestMutation.isPending || updateSchedulingRequestMutation.isPending} 
                existingRequest={editingRequest}
                onCancelEdit={handleCancelEdit}
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
            // isAdmin={isAdmin} // Prop ini dihapus
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
            isApprovingOrRejecting={isApprovingOrRejecting}
          />
        </TabsContent>
      </Tabs>

      <SchedulingRequestDetailDialog
        request={viewingRequest}
        onOpenChange={(open) => !open && setViewingRequest(null)}
      />
    </div>
  );
};

export default SchedulingRequestPage;