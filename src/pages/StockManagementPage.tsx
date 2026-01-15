"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, PlusCircle, ArrowUp, ArrowDown, Eye, ArrowRightLeft } from "lucide-react";
import { showError } from "@/utils/toast";
import AddStockTransactionForm from "@/components/AddStockTransactionForm";
import ViewStockItemDetailsDialog from "@/components/ViewStockItemDetailsDialog";
import StockMovementForm from "@/components/StockMovementForm";
import StockAdjustmentForm from "@/components/StockAdjustmentForm"; // Added for stock adjustment
import { Product as ProductType, WarehouseInventory, WarehouseCategory as WarehouseCategoryType, TransactionType } from "@/types/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ProductWithDetails extends ProductType {
  current_stock?: number;
  inventories?: WarehouseInventory[];
}

const StockManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [initialTransactionType, setInitialTransactionType] = useState<TransactionType>(TransactionType.OUT);
  const [selectedProductForTransaction, setSelectedProductForTransaction] = useState<ProductWithDetails | null>(null);

  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [productToView, setProductToView] = useState<ProductWithDetails | null>(null);

  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
  const [productForMovement, setProductForMovement] = useState<ProductWithDetails | null>(null);

  const [isAdjustmentFormOpen, setIsAdjustmentFormOpen] = useState(false); // State for adjustment form
  const [productForAdjustment, setProductForAdjustment] = useState<ProductWithDetails | null>(null); // State for adjustment product

  const { data: warehouseCategories, isLoading: loadingCategories, error: categoriesError } = useQuery<WarehouseCategoryType[], Error>({
    queryKey: ["warehouseCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warehouse_categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        showError("Gagal memuat kategori gudang.");
        throw error;
      }
      return data;
    },
  });

  const getCategoryDisplayName = useCallback((code: string) => {
    const category = warehouseCategories?.find(cat => cat.code === code);
    return category ? category.name : code;
  }, [warehouseCategories]);

  const { data: products, isLoading, error, refetch: fetchProducts } = useQuery<ProductWithDetails[], Error>({
    queryKey: ["productsWithInventories"], // Changed query key to differentiate from product metadata
    queryFn: async () => {
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select(`
          id,
          user_id,
          kode_barang,
          nama_barang,
          satuan,
          harga_beli,
          harga_jual,
          safe_stock_limit,
          created_at,
          supplier_id,
          warehouse_inventories (
            warehouse_category,
            quantity
          )
        `);

      if (productsError) throw productsError;

      return productsData.map(product => {
        const totalStock = product.warehouse_inventories?.reduce((sum: number, inv: { quantity: number }) => sum + inv.quantity, 0) || 0;
        return {
          ...product,
          current_stock: totalStock,
          inventories: product.warehouse_inventories as WarehouseInventory[],
        };
      });
    },
  });

  const handleOpenTransactionForm = (product: ProductWithDetails, type: TransactionType) => {
    setSelectedProductForTransaction(product);
    setInitialTransactionType(type);
    setIsTransactionFormOpen(true);
  };

  const handleViewDetails = (product: ProductWithDetails) => {
    setProductToView(product);
    setIsViewDetailsOpen(true);
  };

  const handleOpenMovementForm = (product: ProductWithDetails) => {
    setProductForMovement(product);
    setIsMovementFormOpen(true);
  };

  const handleOpenAdjustmentForm = (product: ProductWithDetails) => { // Handler for adjustment form
    setProductForAdjustment(product);
    setIsAdjustmentFormOpen(true);
  };

  const filteredProducts = products?.filter((product) =>
    product.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.kode_barang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatInventories = useCallback((inventories?: WarehouseInventory[]) => {
    if (loadingCategories) return "Memuat kategori...";
    if (categoriesError) return "Error memuat kategori";

    const inventoryMap = new Map(inventories?.map(inv => [inv.warehouse_category, inv.quantity]) || []);

    const formatted = warehouseCategories?.map(category => {
      const quantity = inventoryMap.get(category.code) || 0;
      return `${category.name}: ${quantity}`;
    });

    return formatted?.join(', ') || '';
  }, [loadingCategories, categoriesError, warehouseCategories]);

  if (isLoading || loadingCategories) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || categoriesError) {
    return <div className="text-red-500">Error loading products or categories: {error?.message || categoriesError?.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Stok Produk</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Lihat status stok produk Anda di berbagai kategori gudang, lakukan transaksi stok, dan pindahkan stok antar lokasi.
      </p>

      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Cari produk berdasarkan nama atau kode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        {/* Add Stock Item button is now in Product Management Page */}
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode Barang</TableHead>
              <TableHead>Nama Barang</TableHead>
              <TableHead className="min-w-[200px]">Stok per Kategori</TableHead>
              <TableHead>Total Stok</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts?.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.kode_barang}</TableCell>
                <TableCell>{product.nama_barang}</TableCell>
                <TableCell className="whitespace-normal">{formatInventories(product.inventories)}</TableCell>
                <TableCell>{product.current_stock}</TableCell>
                <TableCell className="flex space-x-2 justify-center">
                  <Button variant="ghost" size="icon" onClick={() => handleViewDetails(product)} title="Lihat Detail Stok">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleOpenMovementForm(product)} title="Pindahkan Stok">
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleOpenTransactionForm(product, TransactionType.IN)} title="Stok Masuk">
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleOpenTransactionForm(product, TransactionType.OUT)} title="Stok Keluar">
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleOpenAdjustmentForm(product)} title="Sesuaikan Stok">
                    <PlusCircle className="h-4 w-4" /> {/* Using PlusCircle for adjustment */}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Stock Transaction Form (controlled by parent) */}
      {isTransactionFormOpen && selectedProductForTransaction && products && (
        <AddStockTransactionForm
          products={products}
          initialProductId={selectedProductForTransaction.id}
          initialTransactionType={initialTransactionType}
          isOpen={isTransactionFormOpen}
          onOpenChange={setIsTransactionFormOpen}
          onSuccess={fetchProducts}
        />
      )}

      {/* View Stock Item Details Dialog */}
      {productToView && (
        <ViewStockItemDetailsDialog
          product={productToView}
          isOpen={isViewDetailsOpen}
          onOpenChange={setIsViewDetailsOpen}
        />
      )}

      {/* Stock Movement Form */}
      {isMovementFormOpen && productForMovement && (
        <StockMovementForm
          product={productForMovement}
          isOpen={isMovementFormOpen}
          onOpenChange={setIsMovementFormOpen}
          onSuccess={fetchProducts}
        />
      )}

      {/* Stock Adjustment Form */}
      {isAdjustmentFormOpen && productForAdjustment && (
        <StockAdjustmentForm
          product={productForAdjustment}
          isOpen={isAdjustmentFormOpen}
          onOpenChange={setIsAdjustmentFormOpen}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
};

export default StockManagementPage;