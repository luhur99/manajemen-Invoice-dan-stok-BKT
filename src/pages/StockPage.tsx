"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, PlusCircle, Edit, Trash2, Eye } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import AddStockItemForm from "@/components/AddStockItemForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import EditStockItemForm from "@/components/EditStockItemForm";
import ViewStockItemDetailsDialog from "@/components/ViewStockItemDetailsDialog"; // Keep this for comprehensive product details
import { Product as ProductType } from "@/types/data"; // Only import ProductType, no WarehouseInventory needed here

interface ProductWithDetails extends ProductType {
  // No need for current_stock or inventories here, as they are for stock management
}

const StockPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for AddStockItemForm
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithDetails | null>(null);

  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [productToView, setProductToView] = useState<ProductWithDetails | null>(null);

  // Fetch only product metadata
  const { data: products, isLoading, error, refetch: fetchProducts } = useQuery<ProductWithDetails[], Error>({
    queryKey: ["productsMetadata"], // Changed query key to differentiate
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
          supplier_id
        `)
        .order("nama_barang", { ascending: true });

      if (productsError) throw productsError;
      return productsData;
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

  const handleViewDetails = (product: ProductWithDetails) => {
    setProductToView(product);
    setIsViewDetailsOpen(true);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading products: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Produk</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Kelola metadata produk Anda seperti kode, nama, harga, dan batas stok aman.
      </p>

      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Cari produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <AddStockItemForm
          isOpen={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onSuccess={fetchProducts}
        />
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Product Modal */}
      {/* This is now handled by the AddStockItemForm's internal DialogTrigger */}

      {/* Edit Product Modal */}
      {selectedProduct && (
        <EditStockItemForm
          product={selectedProduct}
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
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
    </div>
  );
};

export default StockPage;