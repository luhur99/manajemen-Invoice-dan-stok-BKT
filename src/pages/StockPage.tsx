"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, PlusCircle, Edit, Trash2, ArrowUp, ArrowDown, Eye } from "lucide-react"; // Added Eye icon
import { showSuccess, showError } from "@/utils/toast";
import AddStockItemForm from "@/components/AddStockItemForm";
import AddStockTransactionForm from "@/components/AddStockTransactionForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import ViewStockItemDetailsDialog from "@/components/ViewStockItemDetailsDialog"; // Import the details dialog
import { Product as ProductType, WarehouseInventory } from "@/types/data"; // Use alias for Product interface

// Extend ProductType to include aggregated stock and inventories for display
interface ProductWithDetails extends ProductType {
  current_stock?: number; // Aggregated total stock
  inventories?: WarehouseInventory[]; // Detailed inventories per category
}

const getCategoryDisplay = (category?: 'siap_jual' | 'riset' | 'retur' | 'backup_teknisi') => {
  switch (category) {
    case "siap_jual": return "Siap Jual";
    case "riset": return "Riset";
    case "retur": return "Retur";
    case "backup_teknisi": return "Backup Teknisi";
    default: return "-";
  }
};

const StockPage = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<ProductWithDetails | null>(null);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = React.useState(false);
  const [initialTransactionType, setInitialTransactionType] = React.useState<"outbound" | "initial">("outbound");

  const [isViewDetailsOpen, setIsViewDetailsOpen] = React.useState(false); // State for View Details dialog
  const [productToView, setProductToView] = React.useState<ProductWithDetails | null>(null); // State for product to view

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

  const handleOpenTransactionForm = (product: ProductWithDetails, type: "outbound" | "initial") => {
    setSelectedProduct(product);
    setInitialTransactionType(type);
    setIsTransactionFormOpen(true);
  };

  const handleViewDetails = (product: ProductWithDetails) => {
    setProductToView(product);
    setIsViewDetailsOpen(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const { id, user_id, created_at, current_stock, inventories, ...updateData } = selectedProduct; // Exclude non-updatable fields

    try {
      const { error } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      showSuccess("Produk berhasil diperbarui!");
      setIsEditModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      showError(`Gagal memperbarui produk: ${err.message}`);
      console.error("Error updating product:", err);
    }
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
    if (!inventories || inventories.length === 0) return "Tidak ada stok";
    return inventories.map(inv => `${getCategoryDisplay(inv.warehouse_category)}: ${inv.quantity}`).join(', ');
  };

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
              <TableHead>Stok per Kategori</TableHead> {/* New column */}
              <TableHead>Total Stok</TableHead> {/* Renamed from Stok Saat Ini */}
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
                <TableCell className="max-w-[250px] truncate">{formatInventories(product.inventories)}</TableCell> {/* Display inventories */}
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
                  <Button variant="outline" size="sm" onClick={() => handleOpenTransactionForm(product, "outbound")} title="Stok Keluar">
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleOpenTransactionForm(product, "initial")} title="Stok Awal">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Produk</DialogTitle>
            <DialogDescription>
              Ubah detail produk di sini. Klik simpan saat Anda selesai.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateProduct} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="kode_barang" className="text-right">
                Kode Barang
              </Label>
              <Input
                id="kode_barang"
                value={selectedProduct?.kode_barang || ""}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct!, kode_barang: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nama_barang" className="text-right">
                Nama Barang
              </Label>
              <Input
                id="nama_barang"
                value={selectedProduct?.nama_barang || ""}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct!, nama_barang: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="satuan" className="text-right">
                Satuan
              </Label>
              <Input
                id="satuan"
                value={selectedProduct?.satuan || ""}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct!, satuan: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="harga_beli" className="text-right">
                Harga Beli
              </Label>
              <Input
                id="harga_beli"
                type="number"
                value={selectedProduct?.harga_beli || 0}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct!, harga_beli: parseFloat(e.target.value) })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="harga_jual" className="text-right">
                Harga Jual
              </Label>
              <Input
                id="harga_jual"
                type="number"
                value={selectedProduct?.harga_jual || 0}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct!, harga_jual: parseFloat(e.target.value) })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="safe_stock_limit" className="text-right">
                Batas Stok Aman
              </Label>
              <Input
                id="safe_stock_limit"
                type="number"
                value={selectedProduct?.safe_stock_limit || 0}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct!, safe_stock_limit: parseInt(e.target.value) })
                }
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button type="submit">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
    </div>
  );
};

export default StockPage;