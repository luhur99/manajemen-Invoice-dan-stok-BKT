"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StockItem, StockTransactionWithItemName, WarehouseInventory } from "@/types/data";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import PaginationControls from "@/components/PaginationControls";
import { format } from "date-fns";
import { Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import ViewNotesDialog from "@/components/ViewNotesDialog";

interface ViewStockItemDetailsDialogProps {
  stockItem: StockItem;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewStockItemDetailsDialog: React.FC<ViewStockItemDetailsDialogProps> = ({
  stockItem,
  isOpen,
  onOpenChange,
}) => {
  const [transactions, setTransactions] = useState<StockTransactionWithItemName[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);
  const [currentInventories, setCurrentInventories] = useState<WarehouseInventory[]>([]);
  const [loadingInventories, setLoadingInventories] = useState(true);

  const [isViewNotesOpen, setIsViewNotesOpen] = useState(false);
  const [notesToView, setNotesToView] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Fewer items per page for a dialog

  const getCategoryDisplay = (category?: 'siap_jual' | 'riset' | 'retur' | 'backup_teknisi' | string) => {
    switch (category) {
      case "siap_jual": return "Siap Jual";
      case "riset": return "Riset";
      case "retur": return "Retur";
      case "backup_teknisi": return "Backup Teknisi";
      default: return String(category || "-");
    }
  };

  const fetchInventories = useCallback(async () => {
    if (!stockItem?.id) return;
    setLoadingInventories(true);
    const { data, error } = await supabase
      .from("warehouse_inventories")
      .select("*")
      .eq("product_id", stockItem.id);

    if (error) {
      showError("Gagal memuat inventaris item.");
      console.error("Error fetching warehouse inventories:", error);
      setCurrentInventories([]);
    } else {
      setCurrentInventories(data as WarehouseInventory[]);
    }
    setLoadingInventories(false);
  }, [stockItem?.id]);

  const fetchStockTransactions = useCallback(async () => {
    if (!stockItem?.id) return;

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
          warehouse_category,
          stock_items (
            nama_barang,
            kode_barang
          )
        `)
        .eq("stock_item_id", stockItem.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const processedData: StockTransactionWithItemName[] = data.map((item: any) => ({
        ...item,
        stock_items: item.stock_items ? [item.stock_items] : null,
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
  }, [stockItem?.id]);

  useEffect(() => {
    if (isOpen) {
      fetchInventories();
      fetchStockTransactions();
    } else {
      setTransactions([]); // Clear transactions when dialog closes
      setTransactionsError(null);
      setCurrentInventories([]);
    }
  }, [isOpen, fetchInventories, fetchStockTransactions]);

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

  if (!stockItem) return null;

  const totalStockAkhir = currentInventories.reduce((sum, inv) => sum + inv.quantity, 0);
  const isLowStock = totalStockAkhir < (stockItem.safe_stock_limit || 10);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Item Stok: {stockItem["NAMA BARANG"]}</DialogTitle>
          <DialogDescription>Informasi lengkap dan riwayat transaksi untuk item stok ini.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Kode Barang:</strong> {stockItem["KODE BARANG"]}</p>
            <p><strong>Nama Barang:</strong> {stockItem["NAMA BARANG"]}</p>
            <p><strong>Satuan:</strong> {stockItem.SATUAN || "-"}</p>
            <p><strong>Batas Stok Aman:</strong> {stockItem.safe_stock_limit || 0}</p>
          </div>
          <div>
            <p><strong>Harga Beli:</strong> {stockItem["HARGA BELI"].toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
            <p><strong>Harga Jual:</strong> {stockItem["HARGA JUAL"].toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
            <p><strong>Total Stok Akhir:</strong> <span className={isLowStock ? "font-bold text-red-600 dark:text-red-400" : ""}>{totalStockAkhir}</span></p>
            <p className="mt-2"><strong>Stok per Kategori:</strong></p>
            {loadingInventories ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : currentInventories.length > 0 ? (
              <ul className="list-disc list-inside ml-4">
                {currentInventories.map(inv => (
                  <li key={inv.warehouse_category}>
                    {getCategoryDisplay(inv.warehouse_category)}: {inv.quantity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ml-4 text-gray-600 dark:text-gray-400">Tidak ada inventaris di kategori manapun.</p>
            )}
          </div>
        </div>

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
                    <TableHead>Kategori Gudang</TableHead> {/* New column */}
                    <TableHead className="text-right">Kuantitas</TableHead>
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
                      <TableCell>{getCategoryDisplay(transaction.warehouse_category)}</TableCell> {/* Display category */}
                      <TableCell className="text-right">{transaction.quantity}</TableCell>
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
          <p className="text-gray-700 dark:text-gray-300">Tidak ada riwayat transaksi untuk item ini.</p>
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