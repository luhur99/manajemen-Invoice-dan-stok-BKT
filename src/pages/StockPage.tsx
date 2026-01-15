"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StockItem, WarehouseInventory } from "@/types/data"; // Import WarehouseInventory
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
interface FlattenedStockItemForExport {
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
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [filteredStockData, setFilteredStockData] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState<StockItem | null>(null);

  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"in" | "out" | "return" | "damage_loss" | undefined>(undefined);

  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
  const [isAdjustmentFormOpen, setIsAdjustmentFormOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [stockItemToView, setStockItemToView] = useState<StockItem | null>(null);

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

  const fetchStockData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: stockItems, error: stockItemsError } = await supabase
        .from("stock_items")
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

      if (stockItemsError) {
        throw stockItemsError;
      }

      const processedStock: StockItem[] = stockItems.map(item => {
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

      setStockData(processedStock);
      setFilteredStockData(processedStock);
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
      const { data: stockItems, error: stockItemsError } = await supabase
        .from("stock_items")
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

      if (stockItemsError) {
        throw stockItemsError;
      }

      // Flatten the data for CSV export
      const flattenedData: FlattenedStockItemForExport[] = stockItems.map(item => {
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
      console.error("Error fetching all stock data for export:", err);
      showError("Gagal memuat semua data stok untuk ekspor.");
      return null;
    }
  }, []);

  const stockItemHeaders: { key: keyof FlattenedStockItemForExport; label: string }[] = [
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
    fetchStockData();
  }, [fetchStockData]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    let filtered = stockData.filter(item =>
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

    setFilteredStockData(filtered);
    setCurrentPage(1);
  }, [searchTerm, stockData, showLowStockOnly]);

  const handleDeleteStockItem = async (stockItemId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus item stok ini? Ini akan menghapus semua data inventaris dan transaksi terkait.")) {
      return;
    }

    try {
      // Supabase RLS with CASCADE should handle deleting related warehouse_inventories, stock_transactions, stock_movements
      const { error } = await supabase
        .from("stock_items")
        .delete()
        .eq("id", stockItemId);

      if (error) {
        throw error;
      }

      showSuccess("Item stok berhasil dihapus!");
      fetchStockData();
    } catch (err: any) {
      showError(`Gagal menghapus item stok: ${err.message}`);
      console.error("Error deleting stock item:", err);
    }
  };

  const handleEditClick = (item: StockItem) => {
    setSelectedStockItem(item);
    setIsEditFormOpen(true);
  };

  const handleOpenTransactionForm = (item: StockItem) => {
    setSelectedStockItem(item);
    setTransactionType(undefined);
    setIsTransactionFormOpen(true);
  };

  const handleOpenMovementForm = (item: StockItem) => {
    setSelectedStockItem(item);
    setIsMovementFormOpen(true);
  };

  const handleOpenAdjustmentForm = (item: StockItem) => {
    setSelectedStockItem(item);
    setIsAdjustmentFormOpen(true);
  };

  const handleViewDetailsClick = (item: StockItem) => {
    setStockItemToView(item);
    setIsViewDetailsOpen(true);
  };

  const totalPages = Math.ceil(filteredStockData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredStockData.slice(startIndex, endIndex);

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
                    <TableHead className="text-right">Stok per Kategori</TableHead> {/* Updated header */}
                    <TableHead className="text-right">Total Stok Akhir</TableHead> {/* New header */}
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
                                <Settings className="h-4 w-4" /> Atur Barang
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetailsClick(item)}>
                                <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditClick(item)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Item Metadata
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenTransactionForm(item)}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Tambah/Kurangi Stok
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenMovementForm(item)}> {/* Re-added for movement */}
                                <ArrowRightLeft className="mr-2 h-4 w-4" /> Pindahkan Stok Antar Kategori
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenAdjustmentForm(item)}>
                                <SlidersHorizontal className="mr-2 h-4 w-4" /> Penyesuaian Stok
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteStockItem(item.id!)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /> Hapus Item
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
          <p className="text-gray-700 dark:text-gray-300">Tidak ada data stok yang tersedia atau cocok dengan pencarian Anda.</p>
        )}
      </CardContent>

      {selectedStockItem && (
        <EditStockItemForm
          stockItem={selectedStockItem}
          isOpen={isEditFormOpen}
          onOpenChange={setIsEditFormOpen}
          onSuccess={fetchStockData}
        />
      )}

      {selectedStockItem && isTransactionFormOpen && (
        <AddStockTransactionForm
          stockItem={selectedStockItem}
          isOpen={isTransactionFormOpen}
          onOpenChange={setIsTransactionFormOpen}
          onSuccess={fetchStockData}
          initialTransactionType={transactionType}
        />
      )}

      {selectedStockItem && isMovementFormOpen && (
        <StockMovementForm
          stockItem={selectedStockItem}
          isOpen={isMovementFormOpen}
          onOpenChange={setIsMovementFormOpen}
          onSuccess={fetchStockData}
        />
      )}

      {selectedStockItem && isAdjustmentFormOpen && (
        <StockAdjustmentForm
          stockItem={selectedStockItem}
          isOpen={isAdjustmentFormOpen}
          onOpenChange={setIsAdjustmentFormOpen}
          onSuccess={fetchStockData}
        />
      )}

      {stockItemToView && (
        <ViewStockItemDetailsDialog
          stockItem={stockItemToView}
          isOpen={isViewDetailsOpen}
          onOpenChange={setIsViewDetailsOpen}
        />
      )}
    </Card>
  );
};

export default StockPage;