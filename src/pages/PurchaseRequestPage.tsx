"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PurchaseRequest } from "@/types/data";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import AddPurchaseRequestForm from "@/components/AddPurchaseRequestForm";
import PaginationControls from "@/components/PaginationControls";
import { format } from "date-fns";
import { Loader2, CheckCircle, XCircle, Eye, Trash2, PlusCircle } from "lucide-react";
import { useSession } from "@/components/SessionContextProvider";
import ViewNotesDialog from "@/components/ViewNotesDialog";

const PurchaseRequestPage = () => {
  const { session } = useSession();
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [filteredPurchaseRequests, setFilteredPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [isViewNotesOpen, setIsViewNotesOpen] = useState(false);
  const [notesToView, setNotesToView] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchPurchaseRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("purchase_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const requestsWithNo: PurchaseRequest[] = data.map((req, index) => ({
        ...req,
        no: index + 1,
      }));

      setPurchaseRequests(requestsWithNo);
      setFilteredPurchaseRequests(requestsWithNo);
      setCurrentPage(1);
    } catch (err: any) {
      setError(`Gagal memuat pengajuan pembelian: ${err.message}`);
      console.error("Error fetching purchase requests:", err);
      showError("Gagal memuat pengajuan pembelian.");
      setPurchaseRequests([]);
      setFilteredPurchaseRequests([]);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchPurchaseRequests();
  }, [fetchPurchaseRequests]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = purchaseRequests.filter(item =>
      item.item_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.item_code.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.supplier?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.notes?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.status.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredPurchaseRequests(filtered);
    setCurrentPage(1);
  }, [searchTerm, purchaseRequests]);

  const handleApproveRequest = async (request: PurchaseRequest) => {
    if (!window.confirm(`Apakah Anda yakin ingin MENYETUJUI pengajuan pembelian untuk "${request.item_name}"?`)) {
      return;
    }

    try {
      // 1. Update purchase_requests status to 'approved'
      const { error: updateReqError } = await supabase
        .from("purchase_requests")
        .update({ status: "approved" })
        .eq("id", request.id);

      if (updateReqError) {
        throw updateReqError;
      }

      // 2. Check if stock item exists or create new
      const { data: existingStockItem, error: fetchStockError } = await supabase
        .from("stock_items")
        .select("id, stock_masuk, stock_akhir, harga_beli, harga_jual, satuan, warehouse_category")
        .eq("kode_barang", request.item_code)
        .single();

      let stockItemId: string;
      let newStockMasuk: number;
      let newStockAkhir: number;

      if (fetchStockError && fetchStockError.code === 'PGRST116') { // No rows found
        // Create new stock item
        const { data: newStockData, error: createStockError } = await supabase
          .from("stock_items")
          .insert({
            user_id: session?.user?.id,
            kode_barang: request.item_code,
            nama_barang: request.item_name,
            satuan: "PCS", // Default to PCS if not specified in request, or add to form
            harga_beli: request.unit_price,
            harga_jual: request.suggested_selling_price,
            stock_awal: 0, // Initial stock is 0, then add via stock_masuk
            stock_masuk: request.quantity,
            stock_keluar: 0,
            stock_akhir: request.quantity,
            safe_stock_limit: 10, // Default safe stock limit
            warehouse_category: "siap_jual", // Default category for new purchased items
          })
          .select("id, stock_masuk, stock_akhir")
          .single();

        if (createStockError) throw createStockError;
        stockItemId = newStockData.id;
        newStockMasuk = newStockData.stock_masuk;
        newStockAkhir = newStockData.stock_akhir;

      } else if (existingStockItem) {
        // Update existing stock item
        newStockMasuk = existingStockItem.stock_masuk + request.quantity;
        newStockAkhir = existingStockItem.stock_akhir + request.quantity;

        const { error: updateStockError } = await supabase
          .from("stock_items")
          .update({
            stock_masuk: newStockMasuk,
            stock_akhir: newStockAkhir,
            harga_beli: request.unit_price, // Update purchase price
            harga_jual: request.suggested_selling_price, // Update selling price
          })
          .eq("id", existingStockItem.id);

        if (updateStockError) throw updateStockError;
        stockItemId = existingStockItem.id;

      } else {
        throw new Error("Gagal memproses item stok.");
      }

      // 3. Record transaction in stock_transactions
      const { error: transactionError } = await supabase
        .from("stock_transactions")
        .insert({
          user_id: session?.user?.id,
          stock_item_id: stockItemId,
          transaction_type: "in",
          quantity: request.quantity,
          notes: `Stok masuk dari pengajuan pembelian #${request.no} (${request.item_name})`,
          transaction_date: format(new Date(), "yyyy-MM-dd"),
        });

      if (transactionError) {
        throw transactionError;
      }

      showSuccess(`Pengajuan pembelian untuk "${request.item_name}" berhasil disetujui dan stok diperbarui!`);
      fetchPurchaseRequests(); // Refresh the list
    } catch (err: any) {
      showError(`Gagal menyetujui pengajuan: ${err.message}`);
      console.error("Error approving purchase request:", err);
    }
  };

  const handleRejectRequest = async (request: PurchaseRequest) => {
    if (!window.confirm(`Apakah Anda yakin ingin MENOLAK pengajuan pembelian untuk "${request.item_name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("purchase_requests")
        .update({ status: "rejected" })
        .eq("id", request.id);

      if (error) {
        throw error;
      }

      showSuccess(`Pengajuan pembelian untuk "${request.item_name}" berhasil ditolak.`);
      fetchPurchaseRequests(); // Refresh the list
    } catch (err: any) {
      showError(`Gagal menolak pengajuan: ${err.message}`);
      console.error("Error rejecting purchase request:", err);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pengajuan pembelian ini?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("purchase_requests")
        .delete()
        .eq("id", requestId);

      if (error) {
        throw error;
      }

      showSuccess("Pengajuan pembelian berhasil dihapus!");
      fetchPurchaseRequests(); // Refresh the list
    } catch (err: any) {
      showError(`Gagal menghapus pengajuan pembelian: ${err.message}`);
      console.error("Error deleting purchase request:", err);
    }
  };

  const handleViewNotes = (notes: string) => {
    setNotesToView(notes);
    setIsViewNotesOpen(true);
  };

  const totalPages = Math.ceil(filteredPurchaseRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredPurchaseRequests.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Manajemen Pengajuan Pembelian</CardTitle>
          <CardDescription>Memuat daftar pengajuan pembelian...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">Memuat data pengajuan pembelian...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-2xl font-semibold">Manajemen Pengajuan Pembelian</CardTitle>
          <AddPurchaseRequestForm onSuccess={fetchPurchaseRequests} />
        </div>
        <CardDescription>Kelola semua pengajuan pembelian item stok Anda.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
        <div className="flex flex-col md:flex-row gap-4 mb-4 flex-wrap">
          <Input
            type="text"
            placeholder="Cari berdasarkan nama/kode item, pemasok, atau catatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded-md bg-background dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
          </select>
          <Button onClick={() => { setSearchTerm(""); setFilterStatus("all"); }} variant="outline">
            Reset Filter
          </Button>
        </div>

        {filteredPurchaseRequests.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Item</TableHead>
                    <TableHead>Kode Item</TableHead>
                    <TableHead className="text-right">Kuantitas</TableHead>
                    <TableHead className="text-right">Harga Beli/Unit</TableHead>
                    <TableHead className="text-right">Harga Jual Disarankan/Unit</TableHead>
                    <TableHead className="text-right">Total Harga</TableHead>
                    <TableHead>Pemasok</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Catatan</TableHead>
                    <TableHead>Tanggal Pengajuan</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.no}</TableCell>
                      <TableCell>{request.item_name}</TableCell>
                      <TableCell>{request.item_code}</TableCell>
                      <TableCell className="text-right">{request.quantity}</TableCell>
                      <TableCell className="text-right">{request.unit_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                      <TableCell className="text-right">{request.suggested_selling_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                      <TableCell className="text-right">{request.total_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                      <TableCell>{request.supplier || "-"}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {request.notes ? (
                          <Button variant="outline" size="sm" onClick={() => handleViewNotes(request.notes!)} className="h-7 px-2">
                            <Eye className="h-3 w-3 mr-1" /> Lihat
                          </Button>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{format(new Date(request.created_at), "dd-MM-yyyy HH:mm")}</TableCell>
                      <TableCell className="text-center flex items-center justify-center space-x-1">
                        {request.status === "pending" && (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => handleApproveRequest(request)} title="Setujui">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleRejectRequest(request)} title="Tolak">
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        {(request.status === "pending" || session?.user?.user_metadata.role === 'admin') && ( // Allow deletion of pending by user, or any by admin
                          <Button variant="destructive" size="icon" onClick={() => handleDeleteRequest(request.id)} title="Hapus">
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
          <p className="text-gray-700 dark:text-gray-300">Tidak ada pengajuan pembelian yang tersedia atau cocok dengan pencarian Anda.</p>
        )}
      </CardContent>

      <ViewNotesDialog
        notes={notesToView}
        isOpen={isViewNotesOpen}
        onOpenChange={setIsViewNotesOpen}
      />
    </Card>
  );
};

export default PurchaseRequestPage;