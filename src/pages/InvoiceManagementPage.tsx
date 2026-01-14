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
  Invoice
} from '@/api/invoices';
import AddInvoiceForm from '@/components/AddInvoiceForm';
import InvoiceTable from '@/components/InvoiceTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const InvoiceManagementPage: React.FC = () => {
  const { session } = useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState<string>('view');
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

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

  const handleAddInvoice = (values: any) => {
    if (!userId) {
      showError('Anda harus login untuk menambahkan faktur.');
      return;
    }

    // Hitung total amount dari items
    const totalAmount = values.items.reduce((sum: number, item: any) => {
      return sum + (item.quantity * item.unit_price);
    }, 0);

    const invoiceData = {
      ...values,
      total_amount: totalAmount,
      payment_status: 'pending' as const,
    };

    addInvoiceMutation.mutate(invoiceData);
  };

  const handleDeleteInvoice = (id: string) => {
    if (!userId) {
      showError('Anda harus login untuk menghapus faktur.');
      return;
    }

    setDeletingId(id);
    deleteInvoiceMutation.mutate({ id });
  };

  const handleViewInvoice = (invoice: Invoice) => {
    // Implementasi untuk melihat detail faktur
    console.log('View invoice:', invoice);
    // Di sini Anda bisa membuka modal atau navigasi ke halaman detail
  };

  const handleEditInvoice = (invoice: Invoice) => {
    // Implementasi untuk mengedit faktur
    console.log('Edit invoice:', invoice);
    // Di sini Anda bisa membuka modal edit atau navigasi ke halaman edit
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // Implementasi untuk mengunduh faktur
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
          <TabsTrigger value="add">Tambah Faktur Baru</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Tambah Faktur Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <AddInvoiceForm 
                onSubmit={handleAddInvoice} 
                isLoading={addInvoiceMutation.isPending} 
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
    </div>
  );
};

export default InvoiceManagementPage;