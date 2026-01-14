"use client";

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError, showSuccess } from '@/utils/toast';
import { 
  fetchInvoices, 
  addInvoice, 
  updateInvoice, 
  deleteInvoice,
  fetchInvoiceItems,
  Invoice,
  InvoiceItem
} from '@/api/invoices';
import AddInvoiceForm from '@/components/AddInvoiceForm';
import InvoiceTable from '@/components/InvoiceTable';
import InvoiceDetailDialog from '@/components/InvoiceDetailDialog'; // Import the new dialog component
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const InvoiceManagementPage: React.FC = () => {
  const { session } = useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState<string>('view');
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [editingInvoice, setEditingInvoice] = React.useState<(Invoice & { items: InvoiceItem[] }) | null>(null);
  const [viewingInvoice, setViewingInvoice] = React.useState<(Invoice & { items: InvoiceItem[] }) | null>(null); // State for viewing invoice

  const { data: invoices, isLoading, error } = useQuery({
    queryKey: ['invoices', userId],
    queryFn: () => fetchInvoices(userId!),
    enabled: !!userId,
  });

  const addInvoiceMutation = useMutation({
    mutationFn: (newInvoice: Parameters<typeof addInvoice>[0] & { items: Parameters<typeof addInvoice>[1] }) =>
      addInvoice(newInvoice, newInvoice.items, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', userId] });
      showSuccess('Faktur berhasil ditambahkan!');
      setActiveTab('view');
    },
    onError: (err) => {
      showError(`Gagal menambahkan faktur: ${err.message}`);
    },
  });

  const updateInvoiceMutation = useMutation({
    mutationFn: ({ id, updates, items }: { id: string; updates: Partial<Invoice>; items: InvoiceItem[] }) =>
      updateInvoice(id, updates, userId!)
        .then(async (updatedInvoice) => {
          const existingItems = await fetchInvoiceItems(id, userId!);
          const existingItemIds = new Set(existingItems.map(item => item.id));
          const newItemIds = new Set(items.map(item => item.id).filter(Boolean));

          const itemsToDelete = existingItems.filter(item => !newItemIds.has(item.id));
          for (const item of itemsToDelete) {
            await supabase.from('invoice_items').delete().eq('id', item.id);
          }

          for (const item of items) {
            if (item.id && existingItemIds.has(item.id)) {
              await supabase.from('invoice_items').update({
                item_name: item.item_name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                subtotal: item.quantity * item.unit_price,
                unit_type: item.unit_type,
              }).eq('id', item.id);
            } else {
              await supabase.from('invoice_items').insert({
                invoice_id: id,
                user_id: userId!,
                item_name: item.item_name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                subtotal: item.quantity * item.unit_price,
                unit_type: item.unit_type,
              });
            }
          }
          return updatedInvoice;
        }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', userId] });
      showSuccess('Faktur berhasil diperbarui!');
      setEditingInvoice(null);
      setActiveTab('view');
    },
    onError: (err) => {
      showError(`Gagal memperbarui faktur: ${err.message}`);
    },
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteInvoice(id, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', userId] });
      showSuccess('Faktur berhasil dihapus!');
    },
    onError: (err) => {
      showError(`Gagal menghapus faktur: ${err.message}`);
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleAddOrUpdateInvoice = (values: any) => {
    if (!userId) {
      showError('Anda harus login untuk menambahkan/memperbarui faktur.');
      return;
    }

    const totalAmount = values.items.reduce((sum: number, item: any) => {
      return sum + (item.quantity * item.unit_price);
    }, 0);

    const invoiceData = {
      ...values,
      invoice_date: values.invoice_date.toISOString().split('T')[0],
      due_date: values.due_date ? values.due_date.toISOString().split('T')[0] : null,
      total_amount: totalAmount,
      payment_status: editingInvoice?.payment_status || 'pending' as const,
    };

    if (editingInvoice) {
      updateInvoiceMutation.mutate({ id: editingInvoice.id, updates: invoiceData, items: values.items });
    } else {
      addInvoiceMutation.mutate(invoiceData);
    }
  };

  const handleDeleteInvoice = (id: string) => {
    if (!userId) {
      showError('Anda harus login untuk menghapus faktur.');
      return;
    }

    setDeletingId(id);
    deleteInvoiceMutation.mutate({ id });
  };

  const handleViewInvoice = async (invoice: Invoice) => {
    if (!userId) {
      showError('Anda harus login untuk melihat detail faktur.');
      return;
    }
    try {
      const items = await fetchInvoiceItems(invoice.id, userId);
      setViewingInvoice({ ...invoice, items });
    } catch (err: any) {
      showError(`Gagal memuat item faktur: ${err.message}`);
    }
  };

  const handleEditInvoice = async (invoice: Invoice) => {
    if (!userId) {
      showError('Anda harus login untuk mengedit faktur.');
      return;
    }
    try {
      const items = await fetchInvoiceItems(invoice.id, userId);
      setEditingInvoice({ ...invoice, items });
      setActiveTab('add');
    } catch (err: any) {
      showError(`Gagal memuat item faktur: ${err.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingInvoice(null);
    setActiveTab('view');
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    if (invoice.document_url) {
      window.open(invoice.document_url, '_blank');
    } else {
      showError('Dokumen faktur tidak tersedia.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Memuat data faktur...</p>
      </div>
    );
  }

  if (error) {
    showError(`Gagal memuat faktur: ${error.message}`);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Faktur</h1>
      <p className="text-lg text-muted-foreground mb-8">Kelola faktur Anda di sini.</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">Lihat Faktur</TabsTrigger>
          <TabsTrigger value="add">{editingInvoice ? 'Edit Faktur' : 'Tambah Faktur Baru'}</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>{editingInvoice ? 'Edit Faktur' : 'Tambah Faktur Baru'}</CardTitle>
            </CardHeader>
            <CardContent>
              <AddInvoiceForm 
                onSubmit={handleAddOrUpdateInvoice} 
                isLoading={addInvoiceMutation.isPending || updateInvoiceMutation.isPending} 
                existingInvoice={editingInvoice}
                onCancelEdit={handleCancelEdit}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view">
          <InvoiceTable
            invoices={invoices || []}
            isLoading={isLoading}
            error={error || null}
            onView={handleViewInvoice}
            onEdit={handleEditInvoice}
            onDelete={handleDeleteInvoice}
            onDownload={handleDownloadInvoice}
            deletingId={deletingId}
          />
        </TabsContent>
      </Tabs>

      <InvoiceDetailDialog
        invoice={viewingInvoice}
        onOpenChange={(open) => !open && setViewingInvoice(null)}
      />
    </div>
  );
};

export default InvoiceManagementPage;