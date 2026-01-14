"use client";

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError, showSuccess } from '@/utils/toast';
import { 
  fetchPurchaseRequests, 
  addPurchaseRequest, 
  updatePurchaseRequest, 
  deletePurchaseRequest,
  PurchaseRequest
} from '@/api/purchaseRequests';
import AddPurchaseRequestForm from '@/components/AddPurchaseRequestForm';
import PurchaseRequestTable from '@/components/PurchaseRequestTable';
import PurchaseRequestDetailDialog from '@/components/PurchaseRequestDetailDialog'; // Import the new dialog component
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const PurchaseRequestPage: React.FC = () => {
  const { session } = useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState<string>('view');
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [editingRequest, setEditingRequest] = React.useState<PurchaseRequest | null>(null); // State for editing request
  const [viewingRequest, setViewingRequest] = React.useState<PurchaseRequest | null>(null); // State for viewing request

  const { data: purchaseRequests, isLoading, error } = useQuery({
    queryKey: ['purchaseRequests', userId],
    queryFn: () => fetchPurchaseRequests(userId!),
    enabled: !!userId,
  });

  const addPurchaseRequestMutation = useMutation({
    mutationFn: (newPurchaseRequest: Parameters<typeof addPurchaseRequest>[0]) =>
      addPurchaseRequest(newPurchaseRequest, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseRequests', userId] });
      showSuccess('Permintaan pembelian berhasil ditambahkan!');
      setActiveTab('view');
    },
    onError: (err) => {
      showError(`Gagal menambahkan permintaan pembelian: ${err.message}`);
    },
  });

  const updatePurchaseRequestMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<PurchaseRequest> }) =>
      updatePurchaseRequest(id, updates, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseRequests', userId] });
      showSuccess('Permintaan pembelian berhasil diperbarui!');
      setEditingRequest(null);
      setActiveTab('view');
    },
    onError: (err) => {
      showError(`Gagal memperbarui permintaan pembelian: ${err.message}`);
    },
  });

  const deletePurchaseRequestMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deletePurchaseRequest(id, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseRequests', userId] });
      showSuccess('Permintaan pembelian berhasil dihapus!');
    },
    onError: (err) => {
      showError(`Gagal menghapus permintaan pembelian: ${err.message}`);
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleAddOrUpdatePurchaseRequest = (values: any) => {
    if (!userId) {
      showError('Anda harus login untuk menambahkan/memperbarui permintaan pembelian.');
      return;
    }

    if (editingRequest) {
      updatePurchaseRequestMutation.mutate({ id: editingRequest.id, updates: values });
    } else {
      addPurchaseRequestMutation.mutate(values);
    }
  };

  const handleDeletePurchaseRequest = (id: string) => {
    if (!userId) {
      showError('Anda harus login untuk menghapus permintaan pembelian.');
      return;
    }

    setDeletingId(id);
    deletePurchaseRequestMutation.mutate({ id });
  };

  const handleViewPurchaseRequest = (request: PurchaseRequest) => {
    setViewingRequest(request);
  };

  const handleEditPurchaseRequest = (request: PurchaseRequest) => {
    setEditingRequest(request);
    setActiveTab('add'); // Switch to the add/edit tab
  };

  const handleCancelEdit = () => {
    setEditingRequest(null);
    setActiveTab('view');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Memuat data permintaan pembelian...</p>
      </div>
    );
  }

  if (error) {
    showError(`Gagal memuat permintaan pembelian: ${error.message}`);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Permintaan Pembelian</h1>
      <p className="text-lg text-muted-foreground mb-8">Kelola permintaan pembelian Anda di sini.</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">Lihat Permintaan</TabsTrigger>
          <TabsTrigger value="add">{editingRequest ? 'Edit Permintaan' : 'Tambah Permintaan Baru'}</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>{editingRequest ? 'Edit Permintaan Pembelian' : 'Tambah Permintaan Pembelian Baru'}</CardTitle>
            </CardHeader>
            <CardContent>
              <AddPurchaseRequestForm 
                onSubmit={handleAddOrUpdatePurchaseRequest} 
                isLoading={addPurchaseRequestMutation.isPending || updatePurchaseRequestMutation.isPending} 
                existingRequest={editingRequest}
                onCancelEdit={handleCancelEdit}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view">
          <PurchaseRequestTable
            purchaseRequests={purchaseRequests || []}
            isLoading={isLoading}
            error={error || null}
            onView={handleViewPurchaseRequest}
            onEdit={handleEditPurchaseRequest}
            onDelete={handleDeletePurchaseRequest}
            deletingId={deletingId}
          />
        </TabsContent>
      </Tabs>

      <PurchaseRequestDetailDialog
        request={viewingRequest}
        onOpenChange={(open) => !open && setViewingRequest(null)}
      />
    </div>
  );
};

export default PurchaseRequestPage;