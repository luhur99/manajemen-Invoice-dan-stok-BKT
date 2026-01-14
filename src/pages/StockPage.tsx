"use client";

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError, showSuccess } from '@/utils/toast';
import ProductForm from '@/components/ProductForm';
import ProductTable from '@/components/ProductTable';
import { fetchProducts, addProduct } from '@/api/stock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StockPage: React.FC = () => {
  const { session } = useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', userId],
    queryFn: () => fetchProducts(userId!),
    enabled: !!userId,
  });

  const addProductMutation = useMutation({
    mutationFn: (newProductData: Parameters<typeof addProduct>[0]) => addProduct(newProductData, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', userId] });
      showSuccess('Produk berhasil ditambahkan!');
    },
    onError: (err) => {
      showError(`Gagal menambahkan produk: ${err.message}`);
    },
  });

  const handleAddProduct = (values: Parameters<typeof addProduct>[0]) => {
    if (!userId) {
      showError('Anda harus login untuk menambahkan produk.');
      return;
    }
    addProductMutation.mutate(values);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Stok</h1>
      <p className="text-lg text-muted-foreground mb-8">Kelola inventaris stok produk Anda di sini.</p>

      <Tabs defaultValue="view" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">Lihat Stok</TabsTrigger>
          <TabsTrigger value="add">Tambah Produk Baru</TabsTrigger>
        </TabsList>
        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductTable products={products || []} isLoading={isLoading} error={error} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Tambah Produk Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductForm onSubmit={handleAddProduct} isLoading={addProductMutation.isPending} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StockPage;