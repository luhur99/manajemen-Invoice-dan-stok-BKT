"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell,<dyad-problem-report summary="1 problems">
<problem file="src/pages/StockPage.tsx" line="272" column="11" code="2322">Type '&quot;initial&quot; | &quot;out&quot;' is not assignable to type 'TransactionType'.
  Type '&quot;initial&quot;' is not assignable to type 'TransactionType'.</problem>
</dyad-problem-report><think>**Addressing Type Mismatch**

I'm currently focused on a TypeScript compile-time error within `src/pages/StockPage.tsx`. The core issue is a type mismatch: a union type, specifically "initial" or "out", is not assignable to the `TransactionType` type. "initial" in the union is what's causing the problem. I'm exploring the expected type and pinpointing the exact location of the discrepancy for a fix.


**Rectifying the Type Error**

I've determined the root cause: the `initialTransactionType` state variable in `StockPage.tsx` is incorrectly typed. It's a union but `AddStockTransactionForm` needs a `TransactionType` enum. The immediate fix is changing the type declaration to the enum. I also need to ensure all state updates use the correct enum members for full resolution.


</think>Baik, saya akan memperbaiki kesalahan kompilasi TypeScript ini di `src/pages/StockPage.tsx`. Masalahnya adalah ketidaksesuaian tipe antara state `initialTransactionType` dan prop yang diharapkan oleh komponen `AddStockTransactionForm`.

Saya akan mengubah tipe state `initialTransactionType` agar sesuai dengan `TransactionType` enum.

<dyad-write path="src/pages/StockPage.tsx" description="Memperbaiki ketidaksesuaian tipe TransactionType pada state initialTransactionType.">
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, PlusCircle, Edit, Trash2, ArrowUp, ArrowDown, Eye, ArrowRightLeft } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import AddStockItemForm from "@/components/AddStockItemForm";
import AddStockTransactionForm from "@/components/AddStockTransactionForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import ViewStockItemDetailsDialog from "@/components/ViewStockItemDetailsDialog";
import StockMovementForm from "@/components/StockMovementForm";
import { Product as ProductType, WarehouseInventory, WarehouseCategory as WarehouseCategoryType, TransactionType } from "@/types/data"; // Import TransactionType
import EditStockItemForm from "@/components/EditStockItemForm"; // Import EditStockItemForm

interface ProductWithDetails extends ProductType {
  current_stock?: number;
  inventories?: WarehouseInventory[];
}

const StockPage = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<ProductWithDetails | null>(null);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = React.useState(false);
  const [initialTransactionType, setInitialTransactionType] = React.useState<TransactionType>(TransactionType.OUT); // Changed type to TransactionType

  const [isViewDetailsOpen, setIsViewDetailsOpen] = React.useState(false);
  const [productToView, setProductToView] = React.useState<ProductWithDetails | null>(null);

  const [isMovementFormOpen, setIsMovementFormOpen] = React.useState(false);
  const [productForMovement, setProductForMovement] = React.useState<ProductWithDetails | null>(null);

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

  const getCategoryDisplayName = (code: string) => {
    const category = warehouseCategories?.find(cat => cat.code === code);
    return category ? category.name : code;
  };

  const { data: products, isLoading, error, refetch: fetchProducts } = useQuery<ProductWithDetails[], Error>({
    queryKey: ["products"],
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

  const handleEditClick = (product: ProductWithDetails) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (product: ProductWithDetails) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleOpenTransactionForm = (product: ProductWithDetails, type: TransactionType) => { // Changed type to TransactionType
    setSelectedProduct(product);
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

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", selectedProduct.id);

      if (error) throw error;

      showSuccess("Produk berhasil dihapus!");
      setIsDeleteModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      showError(`Gagal menghapus produk: ${err.message}`);
      console.error("Error deleting product:", err);
    }
  };

  const filteredProducts = products?.filter((product) =>
    product.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.kode_barang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatInventories = (inventories?: WarehouseInventory[]) => {
    if (loadingCategories) return "Memuat kategori...";
    if (categoriesError) return "Error memuat kategori";

    const inventoryMap = new Map(inventories?.map(inv => [inv.warehouse_category, inv.quantity]) || []);

    const formatted = warehouseCategories?.map(category => {
      const quantity = inventoryMap.get(category.code) || 0;
      return `${category.name}: ${quantity}`;
    });

    return formatted?.join(', ') || '';
  };

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
      <h1 className="text-3xl font-bold mb-6">Data Produk</h1>

      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Cari produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <AddStockItemForm onSuccess={fetchProducts} />
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode Barang</TableHead>
              <TableHead>Nama Barang</TableHead>
              <TableHead>Satuan</TableHead>
              <TableHead>Harga Beli</TableHead>
              <TableHead>Harga Jual</TableHead>
              <TableHead className="min-w-[200px]">Stok per Kategori</TableHead>
              <TableHead>Total Stok</TableHead>
              <TableHead>Batas Stok Aman</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts?.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.kode_barang}</TableCell>
                <TableCell>{product.nama_barang}</TableCell>
                <TableCell>{product.satuan || '-'}</TableCell>
                <TableCell>Rp {product.harga_beli.toLocaleString('id-ID')}</TableCell>
                <TableCell>Rp {product.harga_jual.toLocaleString('id-ID')}</TableCell>
                <TableCell className="whitespace-normal">{formatInventories(product.inventories)}</TableCell>
                <TableCell>{product.current_stock}</TableCell>
                <TableCell>{product.safe_stock_limit}</TableCell>
                <TableCell className="flex space-x-2 justify-center">
                  <Button variant="ghost" size="icon" onClick={() => handleViewDetails(product)} title="Lihat Detail">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(product)} title="Edit Produk">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(product)} title="Hapus Produk">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleOpenMovementForm(product)} title="Pindahkan Stok">
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleOpenTransactionForm(product, TransactionType.OUT)} title="Stok Keluar">
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleOpenTransactionForm(product, TransactionType.INITIAL)} title="Stok Awal">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Product Modal */}
      {selectedProduct && (
        <EditStockItemForm
          product={selectedProduct}
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSuccess={fetchProducts}
        />
      )}

      {/* Delete Product Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Produk</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus produk "{selectedProduct?.nama_barang}"? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Stock Transaction Form (controlled by parent) */}
      {isTransactionFormOpen && selectedProduct && products && (
        <AddStockTransactionForm
          products={products}
          initialProductId={selectedProduct.id}
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
    </div>
  );
};

export default StockPage;