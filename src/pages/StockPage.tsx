"use client";
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError, showSuccess } from '@/utils/toast';
import AddProductForm from '@/components/AddProductForm';
import ProductTable from '@/components/ProductTable';
import { fetchProducts, addProduct, fetchWarehouseInventories, recordStockMovement, WarehouseCategory, Product } from '@/api/stock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

const StockPage: React.FC = () => {
  const { session } = useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = React.useState<string>('add');
  
  const { data: products, isLoading: isLoadingProducts, error: errorProducts } = useQuery({
    queryKey: ['products', userId],
    queryFn: () => fetchProducts(userId!),
    enabled: !!userId,
  });

  const { data: inventories, isLoading: isLoadingInventories, error: errorInventories } = useQuery({
    queryKey: ['warehouseInventories', userId],
    queryFn: () => fetchWarehouseInventories(userId!),
    enabled: !!userId,
  });

  const addProductMutation = useMutation({
    mutationFn: ({ newProductData, initialStock, initialStockWarehouse }: { newProductData: Omit<Product, 'id' | 'created_at' | 'user_id'>; initialStock: number; initialStockWarehouse: WarehouseCategory }) =>
      addProduct(newProductData, initialStock, initialStockWarehouse, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', userId] });
      queryClient.invalidateQueries({ queryKey: ['warehouseInventories', userId] });
      showSuccess('Produk berhasil ditambahkan!');
      setActiveTab('view');
    },
    onError: (err) => {
      showError(`Gagal menambahkan produk: ${err.message}`);
    },
  });

  const recordStockMovementMutation = useMutation({
    mutationFn: ({ productId, fromCategory, toCategory, quantity, reason }: { productId: string; fromCategory: WarehouseCategory | null; toCategory: WarehouseCategory; quantity: number; reason: string; }) =>
      recordStockMovement(productId, fromCategory, toCategory, quantity, reason, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouseInventories', userId] });
      queryClient.invalidateQueries({ queryKey: ['stockMovements', userId] });
      showSuccess('Pergerakan stok berhasil dicatat!');
      setActiveTab('view');
    },
    onError: (err) => {
      showError(`Gagal mencatat pergerakan stok: ${err.message}`);
    },
  });

  const handleAddProduct = (values: any) => { // Gunakan 'any' untuk sementara karena tipe Zod berbeda
    if (!userId) {
      showError('Anda harus login untuk menambahkan produk.');
      return;
    }

    const { initial_stock, initial_stock_warehouse, ...productData } = values;

    addProductMutation.mutate({
      newProductData: productData,
      initialStock: initial_stock,
      initialStockWarehouse: initial_stock_warehouse,
    });
  };

  const [selectedProductForMovement, setSelectedProductForMovement] = React.useState<string>('');
  const [fromWarehouse, setFromWarehouse] = React.useState<WarehouseCategory | ''>('');
  const [toWarehouse, setToWarehouse] = React.useState<WarehouseCategory | ''>('');
  const [movementQuantity, setMovementQuantity] = React.useState<number>(0);
  const [movementReason, setMovementReason] = React.useState<string>('');

  const handleStockMovement = () => {
    if (!userId) {
      showError('Anda harus login untuk mencatat pergerakan stok.');
      return;
    }
    if (!selectedProductForMovement || !toWarehouse || movementQuantity <= 0) {
      showError('Harap lengkapi semua bidang yang diperlukan untuk pergerakan stok.');
      return;
    }
    if (fromWarehouse === toWarehouse) {
      showError('Gudang asal dan tujuan tidak boleh sama.');
      return;
    }

    recordStockMovementMutation.mutate({
      productId: selectedProductForMovement,
      fromCategory: fromWarehouse === '' ? null : fromWarehouse as WarehouseCategory,
      toCategory: toWarehouse as WarehouseCategory,
      quantity: movementQuantity,
      reason: movementReason,
    });

    setSelectedProductForMovement('');
    setFromWarehouse('');
    setToWarehouse('');
    setMovementQuantity(0);
    setMovementReason('');
  };

  const productsWithInventories = React.useMemo(() => {
    if (!products || !inventories) return [];
    return products.map(product => ({
      ...product,
      inventories: inventories.filter(inv => inv.product_id === product.id)
    }));
  }, [products, inventories]);

  const isLoadingAny = isLoadingProducts || isLoadingInventories;

  if (isLoadingAny) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Memuat data stok...</p>
      </div>
    );
  }

  if (errorProducts) showError(`Gagal memuat produk: ${errorProducts.message}`);
  if (errorInventories) showError(`Gagal memuat inventaris gudang: ${errorInventories.message}`);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Stok</h1>
      <p className="text-lg text-muted-foreground mb-8">Kelola inventaris stok produk Anda di sini.</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="view">Lihat Stok</TabsTrigger>
          <TabsTrigger value="add">Tambah Produk Baru</TabsTrigger>
          <TabsTrigger value="move">Pindahkan Stok</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Tambah Produk Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <AddProductForm onSubmit={handleAddProduct} isLoading={addProductMutation.isPending} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Produk & Inventaris Gudang</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductTable products={productsWithInventories} isLoading={isLoadingAny} error={errorProducts || errorInventories} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="move">
          <Card>
            <CardHeader>
              <CardTitle>Pindahkan Stok Antar Gudang</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-select">Produk</Label>
                    <Select
                      value={selectedProductForMovement}
                      onValueChange={setSelectedProductForMovement}
                      disabled={recordStockMovementMutation.isPending || !products || products.length === 0}
                    >
                      <SelectTrigger id="product-select">
                        <SelectValue placeholder="Pilih Produk" />
                      </SelectTrigger>
                      <SelectContent>
                        {products?.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.nama_barang} ({product.kode_barang})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="from-warehouse-select">Dari Gudang (Opsional, untuk penerimaan awal biarkan kosong)</Label>
                    <Select
                      value={fromWarehouse}
                      onValueChange={(value) => setFromWarehouse(value as WarehouseCategory | '')}
                      disabled={recordStockMovementMutation.isPending}
                    >
                      <SelectTrigger id="from-warehouse-select">
                        <SelectValue placeholder="Pilih Gudang Asal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="siap_jual">Siap Jual</SelectItem>
                        <SelectItem value="riset">Riset</SelectItem>
                        <SelectItem value="retur">Retur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to-warehouse-select">Ke Gudang</Label>
                    <Select
                      value={toWarehouse}
                      onValueChange={(value) => setToWarehouse(value as WarehouseCategory | '')}
                      disabled={recordStockMovementMutation.isPending}
                    >
                      <SelectTrigger id="to-warehouse-select">
                        <SelectValue placeholder="Pilih Gudang Tujuan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="siap_jual">Siap Jual</SelectItem>
                        <SelectItem value="riset">Riset</SelectItem>
                        <SelectItem value="retur">Retur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity-input">Kuantitas</Label>
                    <Input
                      id="quantity-input"
                      type="number"
                      min="1"
                      value={movementQuantity}
                      onChange={(e) => setMovementQuantity(parseInt(e.target.value) || 0)}
                      disabled={recordStockMovementMutation.isPending}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason-textarea">Alasan (Opsional)</Label>
                  <Textarea
                    id="reason-textarea"
                    placeholder="Misalnya: Transfer antar gudang, penerimaan barang baru, dll."
                    value={movementReason}
                    onChange={(e) => setMovementReason(e.target.value)}
                    disabled={recordStockMovementMutation.isPending}
                  />
                </div>

                <Button
                  onClick={handleStockMovement}
                  disabled={recordStockMovementMutation.isPending || !selectedProductForMovement || !toWarehouse || movementQuantity <= 0 || fromWarehouse === toWarehouse}
                >
                  {recordStockMovementMutation.isPending ? 'Memindahkan...' : 'Pindahkan Stok'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StockPage;