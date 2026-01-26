"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle, Edit, Trash2, Search, Loader2, Eye } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";
import { Product, WarehouseInventory, WarehouseCategory as WarehouseCategoryType } from "@/types/data";
import AddStockItemForm from "@/components/AddStockItemForm";
import EditStockItemForm from "@/components/EditStockItemForm";
import ViewStockItemDetailsDialog from "@/components/ViewStockItemDetailsDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/use-debounce";

const ProductManagementPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch product metadata (without inventories for the main table)
  const { data: products, isLoading, error, refetch } = useQuery<Product[], Error>({
    queryKey: ["productsMetadata", debouncedSearchTerm],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(`
          id,
          user_id,
          created_at,
          kode_barang,
          nama_barang,
          satuan,
          harga_beli,
          harga_jual,
          safe_stock_limit,
          supplier_id,
          updated_at
        `)
        .order("nama_barang", { ascending: true });

      if (debouncedSearchTerm) {
        query = query.or(
          `kode_barang.ilike.%${debouncedSearchTerm}%,nama_barang.ilike.%${debouncedSearchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        showError("Gagal memuat data produk.");
        throw error;
      }

      return data as Product[];
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Produk berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["productsMetadata"] });
      queryClient.invalidateQueries({ queryKey: ["productsWithInventories"] }); // Invalidate stock management view
    },
    onError: (err) => {
      showError(`Gagal menghapus produk: ${err.message}`);
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini? Ini juga akan menghapus semua inventaris terkait.")) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsViewDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Gagal memuat data: {error?.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Produk</h1>

      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Cari kode atau nama barang..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setIsAddFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Produk Baru
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Kode Barang</TableHead>
              <TableHead>Nama Barang</TableHead>
              <TableHead>Satuan</TableHead>
              <TableHead className="text-right">Harga Beli</TableHead>
              <TableHead className="text-right">Harga Jual</TableHead>
              <TableHead className="text-right">Batas Stok Aman</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Tidak ada produk ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              products?.map((product, index) => {
                return (
                  <TableRow key={product.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{product.kode_barang}</TableCell>
                    <TableCell>{product.nama_barang}</TableCell>
                    <TableCell>{product.satuan || "-"}</TableCell>
                    <TableCell className="text-right">Rp {product.harga_beli.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right">Rp {product.harga_jual.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right">{product.safe_stock_limit || 0}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(product)}>
                            <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(product)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Produk
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus Produk
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AddStockItemForm
        isOpen={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        onSuccess={refetch}
      />

      {selectedProduct && (
        <EditStockItemForm
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSuccess={refetch}
          initialData={selectedProduct}
        />
      )}

      {selectedProduct && (
        <ViewStockItemDetailsDialog
          isOpen={isViewDetailsOpen}
          onOpenChange={setIsViewDetailsOpen}
          product={selectedProduct}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteProductMutation.isPending} onOpenChange={() => deleteProductMutation.reset()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Menghapus Produk...</DialogTitle>
            <DialogDescription>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sedang menghapus produk. Mohon tunggu.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagementPage;