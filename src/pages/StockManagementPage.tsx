import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Loader2, PlusCircle, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react";
import { useDebounce } from "react-use";
import { AddProductForm } from "@/components/products/AddProductForm";
import { EditProductForm } from "@/components/products/EditProductForm";
import { ViewProductDetailsDialog } from "@/components/products/ViewProductDetailsDialog";
import PaginationControls from "@/components/PaginationControls"; // Corrected import
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const ITEMS_PER_PAGE = 10;

const StockManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false);
  const [isViewProductDetailsDialogOpen, setIsViewProductDetailsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
    setCurrentPage(1);
  }, 500, [searchTerm]);

  const queryClient = useQueryClient();

  const { data: productsData, isLoading, isError, error } = useQuery({
    queryKey: ["products", debouncedSearchTerm, currentPage],
    queryFn: async () => {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from("products")
        .select(
          `
          id,
          kode_barang,
          nama_barang,
          satuan,
          harga_beli,
          harga_jual,
          safe_stock_limit,
          created_at,
          updated_at,
          supplier_id,
          suppliers (name),
          warehouse_inventories (warehouse_category, quantity)
        `,
          { count: "exact" }
        );

      if (debouncedSearchTerm) {
        query = query.or(
          `kode_barang.ilike.%${debouncedSearchTerm}%,nama_barang.ilike.%${debouncedSearchTerm}%`
        );
      }

      const { data, error, count } = await query.range(start, end);

      if (error) throw error;
      return { data, count };
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] }); // Corrected invalidateQueries call
      toast.success("Produk berhasil dihapus.");
    },
    onError: (error) => {
      toast.error(`Gagal menghapus produk: ${error.message}`);
    },
  });

  const handleDeleteProduct = (id) => {
    deleteProductMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  const products = productsData?.data || [];
  const totalCount = productsData?.count || 0;
  const pageCount = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Log data to console for debugging
  console.log("Fetched products data:", products);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Manajemen Stok</CardTitle>
        <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Tambah Produk</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Tambah Produk Baru</DialogTitle>
            </DialogHeader>
            <AddProductForm onSuccess={() => setIsAddProductDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode Barang</TableHead>
                <TableHead>Nama Barang</TableHead>
                <TableHead>Satuan</TableHead>
                <TableHead>Harga Beli</TableHead>
                <TableHead>Harga Jual</TableHead>
                <TableHead>Stok Aman</TableHead>
                <TableHead>Stok per Gudang</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Tidak ada produk ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => {
                  const stockPerWarehouse = product.warehouse_inventories
                    ?.map((inv) => `${inv.warehouse_category}: ${inv.quantity}`)
                    .join(", ");

                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.kode_barang}</TableCell>
                      <TableCell>{product.nama_barang}</TableCell>
                      <TableCell>{product.satuan}</TableCell>
                      <TableCell>{product.harga_beli}</TableCell>
                      <TableCell>{product.harga_jual}</TableCell>
                      <TableCell>{product.safe_stock_limit}</TableCell>
                      <TableCell className="max-w-[250px] whitespace-normal">{stockPerWarehouse}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Buka menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsViewProductDetailsDialogOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" /> Lihat
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsEditProductDialogOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tindakan ini tidak dapat dibatalkan. Ini akan menghapus produk secara permanen.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
        <PaginationControls
          currentPage={currentPage}
          pageCount={pageCount}
          onPageChange={setCurrentPage}
        />

        {/* Edit Product Dialog */}
        <Dialog open={isEditProductDialogOpen} onOpenChange={setIsEditProductDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Produk</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <EditProductForm
                product={selectedProduct}
                onSuccess={() => setIsEditProductDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* View Product Details Dialog */}
        <Dialog open={isViewProductDetailsDialogOpen} onOpenChange={setIsViewProductDetailsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Detail Produk</DialogTitle>
            </DialogHeader>
            {selectedProduct && <ViewProductDetailsDialog product={selectedProduct} />}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default StockManagementPage;