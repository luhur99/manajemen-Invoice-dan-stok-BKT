"use client";

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError, showSuccess } from '@/utils/toast';
import { 
  fetchDeliveryOrders, 
  addDeliveryOrder, 
  updateDeliveryOrder, 
  deleteDeliveryOrder,
  DeliveryOrder
} from '@/api/deliveryOrders';
import AddDeliveryOrderForm from '@/components/AddDeliveryOrderForm';
import DeliveryOrderTable from '@/components/DeliveryOrderTable';
import DeliveryOrderDetailDialog from '@/components/DeliveryOrderDetailDialog'; // Import the new dialog component
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const DeliveryOrderPage: React.FC = () => {
  const { session } = useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState<string>('view');
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [editingOrder, setEditingOrder] = React.useState<DeliveryOrder | null>(null); // State for editing order
  const [viewingOrder, setViewingOrder] = React.useState<DeliveryOrder | null>(null); // State for viewing order

  const { data: deliveryOrders, isLoading, error } = useQuery({
    queryKey: ['deliveryOrders', userId],
    queryFn: () => fetchDeliveryOrders(userId!),
    enabled: !!userId,
  });

  const addDeliveryOrderMutation = useMutation({
    mutationFn: (newOrder: Parameters<typeof addDeliveryOrder>[0]) =>
      addDeliveryOrder(newOrder, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryOrders', userId] });
      showSuccess('Pesanan pengiriman berhasil ditambahkan!');
      setActiveTab('view');
    },
    onError: (err) => {
      showError(`Gagal menambahkan pesanan pengiriman: ${err.message}`);
    },
  });

  const updateDeliveryOrderMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<DeliveryOrder> }) =>
      updateDeliveryOrder(id, updates, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryOrders', userId] });
      showSuccess('Pesanan pengiriman berhasil diperbarui!');
      setEditingOrder(null);
      setActiveTab('view');
    },
    onError: (err) => {
      showError(`Gagal memperbarui pesanan pengiriman: ${err.message}`);
    },
  });

  const deleteDeliveryOrderMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteDeliveryOrder(id, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryOrders', userId] });
      showSuccess('Pesanan pengiriman berhasil dihapus!');
    },
    onError: (err) => {
      showError(`Gagal menghapus pesanan pengiriman: ${err.message}`);
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleAddOrUpdateDeliveryOrder = (values: any) => {
    if (!userId) {
      showError('Anda harus login untuk menambahkan/memperbarui pesanan pengiriman.');
      return;
    }

    const orderData = {
      ...values,
      delivery_date: values.delivery_date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
    };

    if (editingOrder) {
      updateDeliveryOrderMutation.mutate({ id: editingOrder.id, updates: orderData });
    } else {
      addDeliveryOrderMutation.mutate(orderData);
    }
  };

  const handleDeleteDeliveryOrder = (id: string) => {
    if (!userId) {
      showError('Anda harus login untuk menghapus pesanan pengiriman.');
      return;
    }

    setDeletingId(id);
    deleteDeliveryOrderMutation.mutate({ id });
  };

  const handleViewDeliveryOrder = (order: DeliveryOrder) => {
    setViewingOrder(order);
  };

  const handleEditDeliveryOrder = (order: DeliveryOrder) => {
    setEditingOrder(order);
    setActiveTab('add'); // Switch to the add/edit tab
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
    setActiveTab('view');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Memuat data pesanan pengiriman...</p>
      </div>
    );
  }

  if (error) {
    showError(`Gagal memuat pesanan pengiriman: ${error.message}`);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Pesanan Pengiriman</h1>
      <p className="text-lg text-muted-foreground mb-8">Kelola pesanan pengiriman Anda di sini.</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">Lihat Pesanan</TabsTrigger>
          <TabsTrigger value="add">{editingOrder ? 'Edit Pesanan' : 'Buat Pesanan Baru'}</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>{editingOrder ? 'Edit Pesanan Pengiriman' : 'Buat Pesanan Pengiriman Baru'}</CardTitle>
            </CardHeader>
            <CardContent>
              <AddDeliveryOrderForm 
                onSubmit={handleAddOrUpdateDeliveryOrder} 
                isLoading={addDeliveryOrderMutation.isPending || updateDeliveryOrderMutation.isPending} 
                existingOrder={editingOrder}
                onCancelEdit={handleCancelEdit}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view">
          <DeliveryOrderTable
            deliveryOrders={deliveryOrders || []}
            isLoading={isLoading}
            error={error || null}
            onView={handleViewDeliveryOrder}
            onEdit={handleEditDeliveryOrder}
            onDelete={handleDeleteDeliveryOrder}
            deletingId={deletingId}
          />
        </TabsContent>
      </Tabs>

      <DeliveryOrderDetailDialog
        order={viewingOrder}
        onOpenChange={(open) => !open && setViewingOrder(null)}
      />
    </div>
  );
};

export default DeliveryOrderPage;