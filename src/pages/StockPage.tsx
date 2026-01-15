"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Product, WarehouseInventory } from "@/types/data"; // Changed from StockItem
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import AddStockItemForm from "@/components/AddStockItemForm";
import EditStockItemForm from "@/components/EditStockItemForm";
import AddStockTransactionForm from "@/components/AddStockTransactionForm";
import StockMovementForm from "@/components/StockMovementForm";
import StockAdjustmentForm from "@/components/StockAdjustmentForm";
import ViewStockItemDetailsDialog from "@/components/ViewStockItemDetailsDialog";
import PaginationControls from "@/components/PaginationControls";
import ExportDataButton from "@/components/ExportDataButton";
import { Loader2, Edit, Trash2, PlusCircle, Settings, ArrowRightLeft, AlertCircle, SlidersHorizontal, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";

// Define a flattened type for export
interface FlattenedProductForExport { // Changed from FlattenedStockItemForExport
  "KODE BARANG": string;
  "NAMA BARANG": string;
  SATUAN: string;
  "HARGA BELI": number;
  "HARGA JUAL": number;
  "STOK SIAP JUAL": number;
  "STOK RISET": number;
  "STOK RETUR": number;
  "STOK BACKUP TEKNISI": number; // New category for export
  "TOTAL STOK AKHIR": number;
  "BATAS AMAN": number;
  "CREATED AT": string;
}

const StockPage = () => {
  const [productsData, setProductsData] = useState<Product[]>([]); // Changed from stockData
  const [filteredProductsData, setFilteredProductsData] = useState<Product[]>([]); // Changed from filteredStockData
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Changed from selectedStockItem

  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"in" | "out" | "return" | "damage_loss" | undefined>(undefined);

  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
  const [isAdjustmentFormOpen, setIsAdjustmentFormOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [productToView, setProductToView] = useState<Product | null>(null); // Changed from stockItemToView

  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getCategoryDisplay = (category?: 'siap_jual' | 'riset' | 'retur' | 'backup_teknisi') => {
    switch (category) {
      case "siap_jual": return "Siap Jual";
      case "riset": return "Riset";
      case "retur": return "Retur";
      case "backup_teknisi": return "Backup Teknisi";
      default: return "-";
    }
  };

  const fetchProductsData = useCallback(async () => { // Changed from fetchStockData
    setLoading(true);
    setError(null);
    try {
      const { data: products, error: productsError } = await supabase // Changed from stockItems
        .from("products") // Changed from stock_items
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
          warehouse_inventories (
            warehouse_category,
            quantity
          )
        `)
        .order("nama_barang", { ascending: true });

      if (productsError) {
        throw productsError;
      }

      const processedProducts: Product[] = products.map(item => { // Changed from processedStock
        const inventories = item.warehouse_inventories || [];
        return {
          id: item.id,
          user_id: item.user_id,
          "KODE BARANG": item.kode_barang,
          "NAMA BARANG": item.nama_barang,
          SATUAN: item.satuan || "",
          "HARGA BELI": item.harga_beli,
          "HARGA JUAL": item.harga_jual,
          safe_stock_limit: item.safe_stock_limit,
          created_at: item.created_at,
          inventories: inventories as WarehouseInventory[],
        };
      });

      setProductsData(processedProducts); // Changed from setStockData
      setFilteredProductsData(processedProducts); // Changed from setFilteredStockData
      setCurrentPage(1);
    } catch (err: any) {
      setError(`Gagal memuat data produk dari database: ${err.message}`); // Changed message
      console.error("Error fetching products data:", err); // Changed message
      showError("Gagal memuat data produk."); // Changed message
      setProductsData([]); // Changed from setStockData
      setFilteredProductsData([]); // Changed from setFilteredStockData
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllProductsDataForExport = useCallback(async () => { // Changed from fetchAllStockDataForExport
    try {
      const { data: products, error: productsError } = await supabase // Changed from stockItems
        .from("products") // Changed from stock_items
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
          warehouse_inventories (
            warehouse_category,
            quantity
          )
        `)
        .order("nama_barang", { ascending: true });

      if (productsError) {
        throw productsError;
      }

      // Flatten the data for CSV export
      const flattenedData: FlattenedProductForExport[] = products.map(item => { // Changed from FlattenedStockItemForExport
        const inventories = item.warehouse_inventories || [];
        const stockByCategory: { [key: string]: number } = {};
        inventories.forEach((inv: any) => {
          stockByCategory[inv.warehouse_category] = inv.quantity;
        });

        return {
          "KODE BARANG": item.kode_barang,
          "NAMA BARANG": item.nama_barang,
          SATUAN: item.satuan || "",
          "HARGA BELI": item.harga_beli,
          "HARGA JUAL": item.harga_jual,
          "STOK SIAP JUAL": stockByCategory.siap_jual || 0,
          "STOK RISET": stockByCategory.riset || 0,
          "STOK RETUR": stockByCategory.retur || 0,
          "STOK BACKUP TEKNISI": stockByCategory.backup_teknisi || 0, // Include new category
          "TOTAL STOK AKHIR": inventories.reduce((sum: number, inv: any) => sum + inv.quantity, 0),
          "BATAS AMAN": item.safe_stock_limit || 0,
          "CREATED AT": item.created_at,
        };
      });
      return flattenedData;
    } catch (err: any) {
      console.error("Error fetching all products data for export:", err); // Changed message
      showError("Gagal memuat semua data produk untuk ekspor."); // Changed message
      return null;
    }
  }, []);

  const productHeaders: { key: keyof FlattenedProductForExport; label: string }[] = [ // Changed from stockItemHeaders
    { key: "KODE BARANG", label: "Kode Barang" },
    { key: "NAMA BARANG", label: "Nama Barang" },
    { key: "SATUAN", label: "Satuan" },
    { key: "HARGA BELI", label: "Harga Beli" },
    { key: "HARGA JUAL", label: "Harga Jual" },
    { key: "STOK SIAP JUAL", label: "Stok Siap Jual" },
    { key: "STOK RISET", label: "Stok Riset" },
    { key: "STOK RETUR", label: "Stok Retur" },
    { key: "STOK BACKUP TEKNISI", label: "Stok Backup Teknisi" }, // New header
    { key: "TOTAL STOK AKHIR", label: "Total Stok Akhir" },
    { key: "BATAS AMAN", label: "Batas Aman" },
    { key: "CREATED AT", label: "Created At" },
  ];

  useEffect(() => {
    fetchProductsData(); // Changed from fetchStockData
  }, [fetchProductsData]); // Changed from fetchStockData

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    let filtered = productsData.filter(item => // Changed from stockData
      item["KODE BARANG"].toLowerCase().includes(lowerCaseSearchTerm) ||
      item["NAMA BARANG"].toLowerCase().includes(lowerCaseSearchTerm) ||
      item.SATUAN.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.inventories?.some(inv => getCategoryDisplay(inv.warehouse_category).toLowerCase().includes(lowerCaseSearchTerm))
    );

    if (showLowStockOnly) {
      filtered = filtered.filter(item => {
        const totalStock = item.inventories?.reduce((sum, inv) => sum + inv.quantity, 0) || 0;
        const limit = item.safe_stock_limit !== undefined && item.safe_stock_limit !== null ? item.safe_stock_limit : 10;
        return totalStock < limit;
      });
    }

    setFilteredProductsData(filtered); // Changed from setFilteredStockData
    setCurrentPage(1);
  }, [searchTerm, productsData, showLowStockOnly]); // Changed from stockData

  const handleDeleteProduct = async (productId: string) => { // Changed from handleDeleteStockItem
    if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini? Ini akan menghapus semua data inventaris dan transaksi terkait.")) { // Changed message
      return;
    }

    try {
      // Supabase RLS with CASCADE should handle deleting related warehouse_inventories, stock_transactions, stock_movements
      const { error } = await supabase
        .from("products") // Changed from stock_items
        .delete()
        .eq("id", productId); // Changed from stockItemId

      if (error) {
        throw error;
      }

      showSuccess("Produk berhasil dihapus!"); // Changed message
      fetchProductsData(); // Changed from fetchStockData
    } catch (err: any) {
      showError(`Gagal menghapus produk: ${err.message}`); // Changed message
      console.error("Error deleting product:", err); // Changed message
    }
  };

  const handleEditClick = (item: Product) => { // Changed from StockItem
    setSelectedProduct(item); // Changed from setSelectedStockItem
    setIsEditFormOpen(true);
  };

  const handleOpenTransactionForm = (item: Product) => { // Changed from StockItem
    setSelectedProduct(item); // Changed from setSelectedStockItem
    setTransactionType(undefined);
    setIsTransactionFormOpen(true);
  };

  const handleOpenMovementForm = (item: Product) => { // Changed from StockItem
    setSelectedProduct(item); // Changed from setSelectedStockItem
    setIsMovementFormOpen(true);
  };

  const handleOpenAdjustmentForm = (item: Product) => { // Changed from StockItem
    setSelectedProduct(item); // Changed from setSelectedStockItem
    setIsAdjustmentFormOpen(true);
  };

  const handleViewDetailsClick = (item: Product) => { // Changed from StockItem
    setProductToView(item); // Changed from setStockItemToView
    setIsViewDetailsOpen(true);
  };

  const totalPages = Math.ceil(filteredProductsData.length / itemsPerPage); // Changed from filteredStockData
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredProductsData.slice(startIndex, endIndex); // Changed from filteredStockData

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-2xl font-semibold">Data Produk</CardTitle> {/* Changed title */}
          <div className="flex gap-2">
            <AddStockItemForm onSuccess={fetchProductsData} /> {/* Still using AddStockItemForm, but it will now handle Product type */}
            <ExportDataButton
              fetchDataFunction={fetchAllProductsDataForExport} // Changed from fetchAllStockDataForExport
              fileName="products.csv" // Changed from stock_items.csv
              headers={productHeaders} // Changed from stockItemHeaders
            />
            <Toggle
              pressed={showLowStockOnly}
              onPressedChange={setShowLowStockOnly}
              aria-label="Toggle low stock filter"
              className="flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              Stok Rendah
            </Toggle>
          </div>
        </div>
        <CardDescription>Informasi mengenai produk yang tersedia.</CardDescription> {/* Changed description */}
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
        <Input
          type="text"
          placeholder="Cari berdasarkan kode, nama produk, satuan, atau kategori gudang..." // Changed message
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        {filteredProductsData.length > 0 ? ( // Changed from filteredStockData
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode Barang</TableHead>
                    <TableHead>Nama Barang</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead className="text-right">Harga Beli</TableHead>
                    <TableHead className="text-right">Harga Jual</TableHead>
                    <TableHead className="text-right">Stok per Kategori</TableHead>
                    <TableHead className="text-right">Total Stok Akhir</TableHead>
                    <TableHead className="text-right">Batas Aman</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((item) => {
                    const totalStock = item.inventories?.reduce((sum, inv) => sum + inv.quantity, 0) || 0;
                    const isLowStock = totalStock < (item.safe_stock_limit || 10);
                    return (
                      <TableRow key={item.id} className={isLowStock ? "bg-red-50 dark:bg-red-950" : ""}>
                        <TableCell>{item["KODE BARANG"]}</TableCell>
                        <TableCell>{item["NAMA BARANG"]}</TableCell>
                        <TableCell>{item.SATUAN}</TableCell>
                        <TableCell className="text-right">{item["HARGA BELI"].toLocaleString('id-ID')}</TableCell>
                        <TableCell className="text-right">{item["HARGA JUAL"].toLocaleString('id-ID')}</TableCell>
                        <TableCell className="text-right">
                          {item.inventories && item.inventories.length > 0 ? (
                            <div className="flex flex-col items-end">
                              {item.inventories.map(inv => (
                                <span key={inv.warehouse_category} className="text-xs">
                                  {getCategoryDisplay(inv.warehouse_category)}: {inv.quantity}
                                </span>
                              ))}
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={isLowStock ? "font-bold text-red-600 dark:text-red-400" : ""}>
                            {totalStock}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{item.safe_stock_limit}</TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="flex items-center gap-1">
                                <Settings className="h-4 w-4" /> Atur Produk
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetailsClick(item)}>
                                <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditClick(item)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Produk Metadata
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenTransactionForm(item)}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Tambah/Kurangi Stok
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenMovementForm(item)}>
                                <ArrowRightLeft className="mr-2 h-4 w-4" /> Pindahkan Stok Antar Kategori
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenAdjustmentForm(item)}>
                                <SlidersHorizontal className="mr-2 h-4 w-4" /> Penyesuaian Stok
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteProduct(item.id!)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /> Hapus Produk
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">Tidak ada data produk yang tersedia atau cocok dengan pencarian Anda.</p>
        )}
      </CardContent>

      {selectedProduct && (
        <EditStockItemForm // Still using EditStockItemForm, but it will now handle Product type
          product={selectedProduct}
          isOpen={isEditFormOpen}
          onOpenChange={setIsEditFormOpen}
          onSuccess={fetchProductsData}
        />
      )}

      {selectedProduct && isTransactionFormOpen && (
        <AddStockTransactionForm // Still using AddStockTransactionForm, but it will now handle Product type
          product={selectedProduct}
          isOpen={isTransactionFormOpen}
          onOpenChange={setIsTransactionFormOpen}
          onSuccess={fetchProductsData}
          initialTransactionType={transactionType}
        />
      )}

      {selectedProduct && isMovementFormOpen && (
        <StockMovementForm // Still using StockMovementForm, but it will now handle Product type
          product={selectedProduct}
          isOpen={isMovementFormOpen}
          onOpenChange={setIsMovementFormOpen}
          onSuccess={fetchProductsData}
        />
      )}

      {selectedProduct && isAdjustmentFormOpen && (
        <StockAdjustmentForm // Still using StockAdjustmentForm, but it will now handle Product type
          product={selectedProduct}
          isOpen={isAdjustmentFormOpen}
          onOpenChange={setIsAdjustmentFormOpen}
          onSuccess={fetchProductsData}
        />
      )}

      {productToView && (
        <ViewStockItemDetailsDialog // Still using ViewStockItemDetailsDialog, but it will now handle Product type
          product={productToView}
          isOpen={isViewDetailsOpen}
          onOpenChange={setIsViewDetailsOpen}
        />
      )}
    </Card>
  );
};

export default StockPage;