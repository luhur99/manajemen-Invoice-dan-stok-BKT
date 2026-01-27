"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Edit, Trash2, ArrowUpDown, MoreHorizontal, Package, Warehouse, History } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showError, showSuccess } from "@/utils/toast";
import { Product as ProductType, WarehouseInventory, WarehouseCategory } from "@/types/data";
import CreateProductForm from "@/components/CreateProductForm";
import EditProductForm from "@/components/EditProductForm";
import StockMovementForm from "@/components/StockMovementForm"; // Keep this for product-specific movement
import StockTransferForm from "@/components/StockTransferForm"; // This is for general transfer
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";

type ProductWithInventories = ProductType & {
  inventories: WarehouseInventory[];
};

const StockManagementPage = () => {
  const queryClient = useQueryClient();
  const [isCreateProductFormOpen, setIsCreateProductFormOpen] = useState(false);
  const [isEditProductFormOpen, setIsEditProductFormOpen] = useState(false);
  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
  const [isTransferFormOpen, setIsTransferFormOpen] = useState(false); // State for general transfer form
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const { data: products, isLoading, error, refetch } = useQuery<ProductWithInventories[], Error>({
    queryKey: ["productsWithInventories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          inventories:warehouse_inventories(
            id,
            quantity,
            warehouse_category
          )
        `)
        .order("nama_barang", { ascending: true });

      if (error) throw error;

      // Ensure inventories is always an array, even if null from Supabase
      return data.map(product => ({
        ...product,
        inventories: product.inventories || []
      })) as ProductWithInventories[];
    },
  });

  const { data: warehouseCategories, isLoading: loadingCategories } = useQuery<WarehouseCategory[], Error>({
    queryKey: ["warehouseCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warehouse_categories")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const getCategoryDisplayName = (code: string) => {
    const category = warehouseCategories?.find(cat => cat.code === code);
    return category ? category.name : code;
  };

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase.from("products").delete().eq("id", productId);
      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Produk berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["productsWithInventories"] });
    },
    onError: (err: any) => {
      showError(`Gagal menghapus produk: ${err.message}`);
      console.error("Error deleting product:", err);
    },
  });

  const columns: ColumnDef<ProductWithInventories>[] = useMemo(() => [
    {
      accessorKey: "kode_barang",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kode Barang
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="capitalize">{row.getValue("kode_barang")}</div>,
    },
    {
      accessorKey: "nama_barang",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Barang
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="capitalize">{row.getValue("nama_barang")}</div>,
    },
    {
      accessorKey: "satuan",
      header: "Satuan",
      cell: ({ row }) => <div className="capitalize">{row.getValue("satuan")}</div>,
    },
    {
      accessorKey: "harga_beli",
      header: "Harga Beli",
      cell: ({ row }) => (
        <div>Rp {parseFloat(row.getValue("harga_beli")).toLocaleString('id-ID')}</div>
      ),
    },
    {
      accessorKey: "harga_jual",
      header: "Harga Jual",
      cell: ({ row }) => (
        <div>Rp {parseFloat(row.getValue("harga_jual")).toLocaleString('id-ID')}</div>
      ),
    },
    {
      accessorKey: "total_stock",
      header: "Total Stok",
      cell: ({ row }) => {
        const inventories = row.original.inventories || [];
        const total = inventories.reduce((sum, inv) => sum + inv.quantity, 0);
        return <div>{total}</div>;
      },
      enableSorting: true,
      sortingFn: (rowA, rowB, columnId) => {
        const totalA = rowA.original.inventories?.reduce((sum, inv) => sum + inv.quantity, 0) || 0;
        const totalB = rowB.original.inventories?.reduce((sum, inv) => sum + inv.quantity, 0) || 0;
        return totalA - totalB;
      },
    },
    {
      accessorKey: "inventories",
      header: "Stok Per Gudang",
      cell: ({ row }) => {
        const inventories = row.original.inventories || [];
        return (
          <div className="flex flex-col space-y-1">
            {inventories.length > 0 ? (
              inventories.map((inv) => (
                <div key={inv.id} className="text-sm">
                  <span className="font-medium">{getCategoryDisplayName(inv.warehouse_category)}:</span> {inv.quantity}
                </div>
              ))
            ) : (
              <span className="text-gray-500 text-sm">Tidak ada stok</span>
            )}
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;

        return (
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
                  setIsEditProductFormOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Produk
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedProduct(product);
                  setIsMovementFormOpen(true);
                }}
              >
                <Warehouse className="mr-2 h-4 w-4" /> Pindahkan Stok Produk Ini
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" /> Hapus Produk
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini tidak dapat dibatalkan. Ini akan menghapus produk{" "}
                      <span className="font-bold">{product.nama_barang}</span> secara permanen.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteProductMutation.mutate(product.id)}>
                      Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [warehouseCategories]); // Re-memoize if categories change

  const table = useReactTable({
    data: products || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  if (isLoading || loadingCategories) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading products: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Manajemen Stok</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setIsCreateProductFormOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Produk Baru
          </Button>
          <Button onClick={() => setIsTransferFormOpen(true)} variant="outline">
            <Warehouse className="mr-2 h-4 w-4" /> Transfer Stok Antar Gudang
          </Button>
          <Link to="/stock-history">
            <Button variant="outline">
              <History className="mr-2 h-4 w-4" /> Riwayat Stok
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Cari produk..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Tidak ada hasil.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Berikutnya
        </Button>
      </div>

      <CreateProductForm
        isOpen={isCreateProductFormOpen}
        onOpenChange={setIsCreateProductFormOpen}
        onSuccess={refetch}
      />

      {selectedProduct && (
        <EditProductForm
          isOpen={isEditProductFormOpen}
          onOpenChange={setIsEditProductFormOpen}
          onSuccess={refetch}
          product={selectedProduct}
        />
      )}

      {selectedProduct && (
        <StockMovementForm
          isOpen={isMovementFormOpen}
          onOpenChange={setIsMovementFormOpen}
          onSuccess={refetch}
          product={selectedProduct}
        />
      )}

      <StockTransferForm
        isOpen={isTransferFormOpen}
        onOpenChange={setIsTransferFormOpen}
        onSuccess={refetch}
        // product={selectedProduct} // <-- Removed this line
      />
    </div>
  );
};

export default StockManagementPage;