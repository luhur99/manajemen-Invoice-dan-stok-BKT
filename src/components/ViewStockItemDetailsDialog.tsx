"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product, WarehouseInventory, StockTransactionWithItemName } from "@/types/data"; // Changed from StockItem
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import PaginationControls from "@/components/PaginationControls";
import { format } from "date-fns";
import { Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import ViewNotesDialog from "@/components/ViewNotesDialog";

interface ViewStockItemDetailsDialogProps {
  product: Product; // Changed from stockItem: StockItem
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewStockItemDetailsDialog: React.FC<ViewStockItemDetailsDialogProps> = ({
  product, // Changed from stockItem
  isOpen,
  onOpenChange,
}) => {
  const [inventories, setInventories] = useState<WarehouseInventory[]>([]);
  const [transactions, setTransactions] = useState<StockTransactionWithItemName[]>([]);
  const [loadingInventories, setLoadingInventories] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [inventoriesError, setInventoriesError] = useState<string | null>(null);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);

  const [isViewNotesOpen, setIsViewNotesOpen] = useState(false);
  const [notesToView, setNotesToView] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Fewer items per page for a dialog

  const fetchWarehouseInventories = useCallback(async () => {
    if (!product?.id) return;

    setLoadingInventories(true);
    setInventoriesError(null);
    try {
      const { data, error } = await supabase
        .from("warehouse_inventories")
        .select("*")
        .eq("product_id", product.id)
        .order("warehouse_category", { ascending: true });

      if (error) {
        throw error;
      }
      setInventories(data as WarehouseInventory[]);
    } catch (err: any) {
      setInventoriesError(`Gagal memuat inventaris gudang: ${err.message}`);
      console.error("Error fetching warehouse inventories:", err);
      setInventories([]);
    } finally {
      setLoadingInventories(false);
    }
  }, [product?.id]);

  const fetchStockTransactions = useCallback(async () => {
    if (!product?.id) return;

    setLoadingTransactions(true);
    setTransactionsError(null);
    try {
      const { data, error } = await supabase
        .from("stock_transactions")
        .select(`
          id,
          transaction_type,
          quantity,
          notes,
          transaction_date,
          created_at,
          products (
            "NAMA BARANG",
            "KODE BARANG",
            safe_stock_limit
          ),
          warehouse_category
        `)
        .eq("product_id", product.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const processedData: StockTransactionWithItemName[] = data.map((item: any) => ({
        ...item,
        products: item.products || null, // Ensure it's a single object or null
      }));

      setTransactions(processedData);
      setCurrentPage(1); // Reset to first page on new data fetch
    } catch (err: any) {
      setTransactionsError(`Gagal memuat riwayat transaksi: ${err.message}`);
      console.error("Error fetching stock item transactions:", err);
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  }, [product?.id]);

  useEffect(() => {
    if (isOpen) {
      fetchWarehouseInventories();
      fetchStockTransactions();
    } else {
      setInventories([]);
      setInventoriesError(null);
      setTransactions([]); // Clear transactions when dialog closes
      setTransactionsError(null);
    }
  }, [isOpen, fetchWarehouseInventories, fetchStockTransactions]);

  const getTransactionTypeDisplay = (type: string) => {
    switch (type) {
      case "initial": return "Stok Awal";
      case "in": return "Stok Masuk";
      case "out": return "Stok Keluar";
      case "return": return "Retur Barang";
      case "damage_loss": return "Rusak/Hilang";
      case "adjustment": return "Penyesuaian Stok";
      default: return type;
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "in":
      case "initial":
      case "return":
        return "bg-green-100 text-green-800";
      case "out":
      case "damage_loss":
        return "bg-red-100 text-red-800";
      case "adjustment":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryDisplay = (category?: 'siap_jual' | 'riset' | 'retur') => {
    switch (category) {
      case "siap_jual": return "Siap Jual";
      case "riset": return "Riset";
      case "retur": return "Retur";
      default: return "-";
    }
  };

  const handleViewNotes = (notes: string) => {
    setNotesToView(notes);
    setIsViewNotesOpen(true);
  };

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = transactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Produk: {product["NAMA BARANG"]}</DialogTitle>
          <DialogDescription>Informasi lengkap dan riwayat transaksi untuk produk ini.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Kode Barang:</strong> {product["KODE BARANG"]}</p>
            <p><strong>Nama Barang:</strong> {product["NAMA BARANG"]}</p>
            <p><strong>Satuan:</strong> {product.SATUAN || "-"}</p>
            <p><strong>Batas Stok Aman:</strong> {product.safe_stock_limit || 0}</p>
          </div>
          <div>
            <p><strong>Harga Beli:</strong> {product["HARGA BELI"].toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
            <p><strong>Harga Jual:</strong> {product["HARGA JUAL"].toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">Inventaris Gudang</h3>
        {loadingInventories ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : inventoriesError ? (
          <p className="text-red-500 dark:text-red-400">{inventoriesError}</p>
        ) : inventories.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Kategori Gudang</TableHead>
                  <TableHead className="text-right">Kuantitas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventories.map((inventory) => (
                  <TableRow key={inventory.id}>
                    <TableCell>{getCategoryDisplay(inventory.warehouse_category)}</TableCell>
                    <TableCell className="text-right">
                      <span className={inventory.quantity < (product.safe_stock_limit || 10) ? "font-bold text-red-600 dark:text-red-400" : ""}>
                        {inventory.quantity}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400">Tidak ada inventaris gudang untuk produk ini.</p>
        )}

        <h3 className="text-lg font-semibold mt-6 mb-2">Riwayat Transaksi Stok</h3>
        {loadingTransactions ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : transactionsError ? (
          <p className="text-red-500 dark:text-red-400">{transactionsError}</p>
        ) : transactions.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal Transaksi</TableHead>
                    <TableHead>Waktu Dibuat</TableHead>
                    <TableHead>Tipe Transaksi</TableHead>
                    <TableHead className="text-right">Kuantitas</TableHead>
                    <TableHead>Kategori Gudang</TableHead>
                    <TableHead>Catatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{format(new Date(transaction.transaction_date), "dd-MM-yyyy")}</TableCell>
                      <TableCell>{format(new Date(transaction.created_at), "dd-MM-yyyy HH:mm")}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.transaction_type)}`}>
                          {getTransactionTypeDisplay(transaction.transaction_type)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{transaction.quantity}</TableCell>
                      <TableCell>{getCategoryDisplay(transaction.warehouse_category)}</TableCell>
                      <TableCell>
                        {transaction.notes ? (
                          <Button variant="outline" size="sm" onClick={() => handleViewNotes(transaction.notes!)} className="h-7 px-2">
                            <Eye className="h-3 w-3 mr-1" /> Lihat
                          </Button>
                        ) : (
                          "-"
                        )}
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
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">Tidak ada riwayat transaksi untuk produk ini.</p>
        )}
      </DialogContent>

      <ViewNotesDialog
        notes={notesToView}
        isOpen={isViewNotesOpen}
        onOpenChange={setIsViewNotesOpen}
      />
    </Dialog>
  );
};

export default ViewStockItemDetailsDialog;