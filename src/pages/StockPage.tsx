"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Product, WarehouseInventory, ProductWithInventory } from "@/types/data"; // Import ProductWithInventory
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import AddStockItemForm from "@/components/AddStockItemForm";
import EditProductForm from "@/components/EditStockItemForm"; // Changed import name
import AddStockTransactionForm from "@/components/AddStockTransactionForm";
import StockMovementForm from "@/components/StockMovementForm";
import StockAdjustmentForm from "@/components/StockAdjustmentForm";
import ViewStockItemDetailsDialog from "@/components/ViewStockItemDetailsDialog"; // Import new component
import PaginationControls from "@/components/PaginationControls";
import ExportDataButton from "@/components/ExportDataButton";
import { Loader2, Edit, Trash2, PlusCircle, Settings, ArrowRightLeft, AlertCircle, SlidersHorizontal, Eye } from "lucide-react"; // Import Eye icon
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";

// Define a flattened type for export
interface FlattenedStockItemForExport {
  kode_barang: string; // Corrected
  nama_barang: string; // Corrected
  satuan: string;
  harga_beli: number;
  harga_jual: number;
  "KATEGORI GUDANG": string;
  "KUANTITAS": number;
  "BATAS AMAN": number;
  "CREATED AT": string;
}

const StockPage = () => {
  const [stockData, setStockData] = useState<ProductWithInventory[]>([]);
  const [filteredStockData, setFilteredStockData] = useState<ProductWithInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Changed from selectedStockItem

  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"in" | "out" | "return" | "damage_loss" | undefined>(undefined);

  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
  const [isAdjustmentFormOpen, setIsAdjustmentFormOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false); // New state for View Details dialog
  const [productToView, setProductToView] = useState<Product | null>(null); // New state for item to view

  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchStockData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
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
          warehouse_inventories (
            id,
            warehouse_category,
            quantity
          )
        `)
        .order("nama_barang", { ascending: true });

      if (productsError) {
        throw productsError;
      }

      const fetchedStock: ProductWithInventory[] = productsData.map((product: any) => {
        const totalStockAkhir = product.warehouse_inventories.reduce((sum: number, inv: WarehouseInventory) => sum + inv.quantity, 0);
        return {
          id: product.id,
          user_id: product.user_id,
          kode_barang: product.kode_barang, // Corrected access
          nama_barang: product.nama_barang, // Corrected access
          satuan: product.satuan || "",
          harga_beli: product.harga_beli,
          harga_jual: product.harga_jual,
          safe_stock_limit: product.safe_stock_limit,
          created_at: product.created_at,
          total_stock_akhir: totalStockAkhir,
          warehouse_inventories: product.warehouse_inventories,
        };
      });

      setStockData(fetchedStock);
      setFilteredStockData(fetchedStock);
      setCurrentPage(1);
    } catch (err: any) {
      setError(`Gagal memuat data stok dari database: ${err.message}`);
      console.error("Error fetching stock data:", err);
      showError("Gagal memuat data stok.");
      setStockData([]);
      setFilteredStockData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllStockDataForExport = useCallback(async () => {
    try {
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
      const flattenedData: FlattenedStockItemForExport[] = productsData.flatMap((product: any) => {
        if (product.warehouse_inventories.length === 0) {
          return [{
            kode_barang: product.kode_barang, // Corrected
            nama_barang: product.nama_barang, // Corrected
            satuan: product.satuan || "",
            harga_beli: product.harga_beli,
            harga_jual: product.harga_jual,
            "KATEGORI GUDANG": "Tidak Ada",
            "KUANTITAS": 0,
            "BATAS AMAN": product.safe_stock_limit || 0,
            "CREATED AT": product.created_at,
          }];
        }
        return product.warehouse_inventories.map((inventory: any) => ({
          kode_barang: product.kode_barang, // Corrected
          nama_barang: product.nama_barang, // Corrected
          satuan: product.satuan || "",
          harga_beli: product.harga_beli,
          harga_jual: product.harga_jual,
          "KATEGORI GUDANG": getCategoryDisplay(inventory.warehouse_category),
          "KUANTITAS": inventory.quantity,
          "BATAS AMAN": product.safe_stock_limit || 0,
          "CREATED AT": product.created_at,
        }));
      });
      return flattenedData;
    } catch (err: any) {
      console.error("Error fetching all stock data for export:", err);
      showError("Gagal memuat semua data stok untuk ekspor.");
      return null;
    }
  }, []);

  const stockItemHeaders: { key: keyof FlattenedStockItemForExport; label: string }[] = [ // Explicitly typed headers
    { key: "kode_barang", label: "Kode Barang" }, // Corrected
    { key: "nama_barang", label: "Nama Barang" }, // Corrected
    { key: "satuan", label: "Satuan" },
    { key: "harga_beli", label: "Harga Beli" },
    { key: "harga_jual", label: "Harga Jual" },
    { key: "KATEGORI GUDANG", label: "Kategori Gudang" },
    { key: "KUANTITAS", label: "Kuantitas" },
    { key: "BATAS AMAN", label: "Batas Aman" },
    { key: "CREATED AT", label: "Created At" },
  ];

  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    let filtered = stockData.filter(item =>
      item.kode_barang.toLowerCase().includes(lowerCaseSearchTerm) || // Corrected access
      item.nama_barang.toLowerCase().includes(lowerCaseSearchTerm) || // Corrected access
      item.satuan.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.warehouse_inventories.some(inv => inv.warehouse_category.toLowerCase().includes(lowerCaseSearchTerm))
    );

    if (showLowStockOnly) {
      filtered = filtered.filter(item => {
        const limit = item.safe_stock_limit !== undefined && item.safe_stock_limit !== null ? item.safe_stock_limit : 10;
        // Check if any inventory category for this product is below the safe stock limit
        return item.warehouse_inventories.some(inv => inv.quantity < limit);
      });
    }

    setFilteredStockData(filtered);
    setCurrentPage(1);
  }, [searchTerm, stockData, showLowStockOnly]);

  const handleDeleteStockItem = async (productId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini? Ini akan menghapus semua entri inventaris dan riwayat transaksi terkait.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) {
        throw error;
      }

      showSuccess("Produk berhasil dihapus!");
      fetchStockData();
    } catch (err: any) {
      showError(`Gagal menghapus produk: ${err.message}`);
      console.error("Error deleting product:", err);
    }
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditFormOpen(true);
  };

  const handleOpenTransactionForm = (product: Product) => {
    setSelectedProduct(product);
    setTransactionType(undefined);
    setIsTransactionFormOpen(true);
  };

  const handleOpenMovementForm = (product: Product) => {
    setSelectedProduct(product);
    setIsMovementFormOpen(true);
  };

  const handleOpenAdjustmentForm = (product: Product) => {
    setSelectedProduct(product);
    setIsAdjustmentFormOpen(true);
  };

  const handleViewDetailsClick = (product: Product) => { // New handler
    setProductToView(product);
    setIsViewDetailsOpen(true);
  };

  const totalPages = Math.ceil(filteredStockData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredStockData.slice(startIndex, endIndex);

  const getCategoryDisplay = (category: 'siap_jual' | 'riset' | 'retur') => {
    switch (category) {
      case "siap_jual": return "Siap Jual";
      case "riset": return "Riset";
      case "retur": return "Retur";
      default: return category;
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-2xl font-semibold">Data Stok Barang</CardTitle>
          <div className="flex gap-2">
            <AddStockItemForm onSuccess={fetchStockData} />
            <ExportDataButton
              fetchDataFunction={fetchAllStockDataForExport}
              fileName="stock_items.csv"
              headers={stockItemHeaders}
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
        <CardDescription>Informasi mengenai stok barang yang tersedia.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
        <Input
          type="text"
          placeholder="Cari berdasarkan kode, nama barang, satuan, atau kategori gudang..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        {filteredStockData.length > 0 ? (
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
                    <TableHead className="text-right">Total Stok</TableHead>
                    <TableHead className="text-right">Batas Aman</TableHead>
                    <TableHead>Kategori Gudang</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((item) => (
                    <TableRow key={item.id} className={item.total_stock_akhir < (item.safe_stock_limit || 10) ? "bg-red-50 dark:bg-red-950" : ""}>
                      <TableCell>{item.kode_barang}</TableCell> {/* Corrected access */}
                      <TableCell>{item.nama_barang}</TableCell> {/* Corrected access */}
                      <TableCell>{item.satuan}</TableCell>
                      <TableCell className="text-right">{item.harga_beli.toLocaleString('id-ID')}</TableCell> {/* Corrected access */}
                      <TableCell className="text-right">{item.harga_jual.toLocaleString('id-ID')}</TableCell> {/* Corrected access */}
                      <TableCell className="text-right">
                        <span className={item.total_stock_akhir < (item.safe_stock_limit || 10) ? "font-bold text-red-600 dark:text-red-400" : ""}>
                          {item.total_stock_akhir}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{item.safe_stock_limit}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.warehouse_inventories.length > 0 ? (
                            item.warehouse_inventories.map(inv => (
                              <span key={inv.id} className={`px-2 py-1 rounded-full text-xs font-medium ${
                                inv.warehouse_category === 'siap_jual' ? 'bg-blue-100 text-blue-800' :
                                inv.warehouse_category === 'riset' ? 'bg-yellow-100 text-yellow-800' :
                                inv.warehouse_category === 'retur' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {getCategoryDisplay(inv.warehouse_category)} ({inv.quantity})
                              </span>
                            ))
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Tidak Ada Stok
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center flex items-center justify-center space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetailsClick(item)} title="Lihat Detail">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenMovementForm(item)} title="Pindah Stok">
                          <ArrowRightLeft className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" title="Opsi Lain">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditClick(item)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit Produk
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenTransactionForm(item)}>
                              <Settings className="mr-2 h-4 w-4" /> Atur Stok (Masuk/Keluar)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenAdjustmentForm(item)}>
                              <SlidersHorizontal className="mr-2 h-4 w-4" /> Penyesuaian Stok
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteStockItem(item.id!)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" /> Hapus Produk
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
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
          <p className="text-gray-700 dark:text-gray-300">Tidak ada data stok yang tersedia atau cocok dengan pencarian Anda.</p>
        )}
      </CardContent>

      {selectedProduct && (
        <EditProductForm
          product={selectedProduct}
          isOpen={isEditFormOpen}
          onOpenChange={setIsEditFormOpen}
          onSuccess={fetchStockData}
        />
      )}

      {selectedProduct && isTransactionFormOpen && (
        <AddStockTransactionForm
          product={selectedProduct}
          isOpen={isTransactionFormOpen}
          onOpenChange={setIsTransactionFormOpen}
          onSuccess={fetchStockData}
          initialTransactionType={transactionType}
        />
      )}

      {selectedProduct && isMovementFormOpen && (
        <StockMovementForm
          product={selectedProduct}
          isOpen={isMovementFormOpen}
          onOpenChange={setIsMovementFormOpen}
          onSuccess={fetchStockData}
        />
      )}

      {selectedProduct && isAdjustmentFormOpen && (
        <StockAdjustmentForm
          product={selectedProduct}
          isOpen={isAdjustmentFormOpen}
          onOpenChange={setIsAdjustmentFormOpen}
          onSuccess={fetchStockData}
        />
      )}

      {productToView && ( // Render new dialog
        <ViewStockItemDetailsDialog
          product={productToView}
          isOpen={isViewDetailsOpen}
          onOpenChange={setIsViewDetailsOpen}
        />
      )}
    </Card>
  );
};

export default StockPage;