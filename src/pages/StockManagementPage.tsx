"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Edit, Trash2, PlusCircle, Search, Loader2, Eye, PackagePlus, PackageMinus, Repeat2 } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";
import AddStockItemForm from "@/components/AddStockItemForm";
import EditStockItemForm from "@/components/EditStockItemForm";
import ViewStockItemDetailsDialog from "@/components/ViewStockItemDetailsDialog";
import AddStockTransactionForm from "@/components/AddStockTransactionForm";
import StockAdjustmentForm from "@/components/StockAdjustmentForm";
import { Product as ProductType, WarehouseInventory, WarehouseCategoryEnum, StockEventType } from "@/types/data"; // Fixed imports
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getCategoryDisplayName = (code: WarehouseCategoryEnum) => {
  switch (code) {
    case WarehouseCategoryEnum.GUDANG_UTAMA: return "Gudang Utama";
    case WarehouseCategoryEnum.GUDANG_TRANSIT: return "Gudang Transit";
    case WarehouseCategoryEnum.GUDANG_TEKNISI: return "Gudang Teknisi";
    case WarehouseCategoryEnum.GUDANG_RETUR: return "Gudang Retur";
    default: return code;
  }
};

const StockManagementPage = () => {
  const queryClient = useQueryClient();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: products, isLoading, error } = useQuery<ProductType[], Error>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          warehouse_inventories (
            warehouse_category,
            quantity
          )
        `)
        .order("nama_barang", { ascending: true });
      if (error) {
        showError("Gagal memuat item stok.");
        throw error;
      }
      return data.map(item => ({
        ...item,
        inventories: item.warehouse_inventories as WarehouseInventory[],
      }));
    },
  });

  const { data: warehouseCategories, isLoading: loadingWarehouseCategories } = useQuery<WarehouseCategoryEnum[], Error>({
    queryKey: ["warehouseCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warehouse_categories")
        .select("code")
        .order("name", { ascending: true });
      if (error) {
        showError("Gagal memuat kategori gudang.");
        throw error;
      }
      return data.map(item => item.code as WarehouseCategoryEnum);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Item stok berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["stockHistory"] });
      queryClient.invalidateQueries({ queryKey: ["stockMovements"] });
    },
    onError: (err) => {
      showError(`Gagal menghapus item stok: ${err.message}`);
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus item stok ini?")) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleEdit = (product: ProductType) => {
    setSelectedProduct(product);
    setIsEditFormOpen(true);
  };

  const handleViewDetails = (product: ProductType) => {
    setSelectedProduct(product);
    setIsViewDetailsOpen(true);
  };

  const handleAddTransaction = (product: ProductType) => {
    setSelectedProduct(product);
    setIsAddTransactionOpen(true);
  };

  const handleAdjustment = (product: ProductType) => {
    setSelectedProduct(product);
    setIsAdjustmentOpen(true);
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.nama_barang.toLowerCase().includes(searchLower) ||
        product.kode_barang.toLowerCase().includes(searchLower) ||
        product.satuan?.toLowerCase().includes(searchLower)
      );
    });
  }, [products, searchTerm]);

  if (isLoading || loadingWarehouseCategories) {
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
          Gagal memuat item stok: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Stok</h1>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-sm">
          <Input
            type="text"
            placeholder="Cari item stok..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
        <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Item Stok
            </Button>
          </DialogTrigger>
          <AddStockItemForm
            isOpen={isAddFormOpen}
            onOpenChange={setIsAddFormOpen}
            onSuccess={() => setIsAddFormOpen(false)}
          />
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Kode Barang</TableHead>
              <TableHead>Nama Barang</TableHead>
              <TableHead>Satuan</TableHead>
              <TableHead>Harga Beli</TableHead>
              <TableHead>Harga Jual</TableHead>
              <TableHead>Stok Aman</TableHead>
              <TableHead>Total Stok</TableHead>
              <TableHead>Stok per Gudang</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  Tidak ada item stok ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product, index) => {
                const totalStock = product.inventories?.reduce((sum, inv) => sum + inv.quantity, 0) || 0;
                const stockPerWarehouse = warehouseCategories?.map(category => {
                  const quantity = product.inventories?.find(inv => inv.warehouse_category === category)?.quantity || 0;
                  return `${getCategoryDisplayName(category as WarehouseCategoryEnum)}: ${quantity}`; // Fixed casting
                }).join(", ") || "-";

                return (
                  <TableRow key={product.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{product.kode_barang}</TableCell>
                    <TableCell>{product.nama_barang}</TableCell>
                    <TableCell>{product.satuan || "-"}</TableCell>
                    <TableCell>Rp {product.harga_beli.toLocaleString('id-ID')}</TableCell>
                    <TableCell>Rp {product.harga_jual.toLocaleString('id-ID')}</TableCell>
                    <TableCell>{product.safe_stock_limit || 0}</TableCell>
                    <TableCell className={totalStock < (product.safe_stock_limit || 0) ? "text-red-500 font-semibold" : ""}>
                      {totalStock}
                    </TableCell>
                    <TableCell>{stockPerWarehouse}</TableCell>
                    <TableCell className="text-right">
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
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddTransaction(product)}>
                            <PackagePlus className="mr-2 h-4 w-4" /> Tambah/Kurangi Stok
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAdjustment(product)}>
                            <Repeat2 className="mr-2 h-4 w-4" /> Penyesuaian Stok
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
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

      {selectedProduct && (
        <>
          <EditStockItemForm
            isOpen={isEditFormOpen}
            onOpenChange={setIsEditFormOpen}
            onSuccess={() => setIsEditFormOpen(false)}
            initialData={selectedProduct}
          />
          <ViewStockItemDetailsDialog
            isOpen={isViewDetailsOpen}
            onOpenChange={setIsViewDetailsOpen}
            product={selectedProduct}
          />
          <AddStockTransactionForm
            isOpen={isAddTransactionOpen}
            onOpenChange={setIsAddTransactionOpen}
            onSuccess={() => setIsAddTransactionOpen(false)}
            product={selectedProduct}
          />
          <StockAdjustmentForm
            isOpen={isAdjustmentOpen}
            onOpenChange={setIsAdjustmentOpen}
            onSuccess={() => setIsAdjustmentOpen(false)}
            product={selectedProduct}
          />
        </>
      )}
    </div>
  );
};

export default StockManagementPage;