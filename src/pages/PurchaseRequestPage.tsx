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
import ReceivePurchaseRequestForm from "@/components/ReceivePurchaseRequestForm"; // Import new component
import PaginationControls from "@/components/PaginationControls";
import { format } from "date-fns";
import { Loader2, CheckCircle, XCircle, Eye, Trash2, PlusCircle, PackageCheck, Clock } from "lucide-react"; // Import new icons
import { useSession } from "@/components/SessionContextProvider";
import ViewNotesDialog from "@/components/ViewNotesDialog";
import PurchaseRequestDocumentUpload from "@/components/PurchaseRequestDocumentUpload";

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

  const [isReceiveFormOpen, setIsReceiveFormOpen] = useState(false); // State for Receive form
  const [selectedRequestForReceipt, setSelectedRequestForReceipt] = useState<PurchaseRequest | null>(null); // State for selected request

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
      item.status.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.received_notes?.toLowerCase().includes(lowerCaseSearchTerm) // Include new notes in search
    );
    setFilteredPurchaseRequests(filtered);
    setCurrentPage(1);
  }, [searchTerm, purchaseRequests]);

  const handleApproveRequest = async (request: PurchaseRequest) => {
    if (!window.confirm(`Apakah Anda yakin ingin MENYETUJUI pengajuan pembelian untuk "${request.item_name}"? Status akan berubah menjadi 'Menunggu Barang Diterima'.`)) {
      return;
    }

    try {
      // Only update status to 'waiting_for_receipt', no stock changes yet
      const { error: updateReqError } = await supabase
        .from("purchase_requests")
        .update({ status: "waiting_for_receipt" })
        .eq("id", request.id);

      if (updateReqError) {
        throw updateReqError;
      }

      showSuccess(`Pengajuan pembelian untuk "${request.item_name}" berhasil disetujui. Menunggu penerimaan barang.`);
      fetchPurchaseRequests(); // Refresh the list
    } catch (err: any) {
      showError(`Gagal menyetujui pengajuan: ${err.message}`);
      console.error("Error approving purchase request:", err);
    }
  };

  const handleReceiveItemsClick = (request: PurchaseRequest) => {
    setSelectedRequestForReceipt(request);
    setIsReceiveFormOpen(true);
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

  const handleDocumentUploadSuccess = async (purchaseRequestId: string, fileUrl: string) => {
    const { error } = await supabase
      .from("purchase_requests")
      .update({ document_url: fileUrl })
      .eq("id", purchaseRequestId);

    if (error) {
      console.error("Error updating purchase request with document URL:", error);
      showError("Gagal menyimpan URL dokumen ke database.");
      return;
    }
    showSuccess("URL dokumen pembelian berhasil diperbarui!");
    fetchPurchaseRequests();
  };

  const handleDocumentRemoveSuccess = async (purchaseRequestId: string) => {
    const { error } = await supabase
      .from("purchase_requests")
      .update({ document_url: null })
      .eq("id", purchaseRequestId);

    if (error) {
      console.error("Error removing document URL from purchase request:", error);
      showError("Gagal menghapus URL dokumen dari database.");
      return;
    }
    showSuccess("URL dokumen pembelian berhasil dihapus!");
    fetchPurchaseRequests();
  };

  const totalPages = Math.ceil(filteredPurchaseRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredPurchaseRequests.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: 'pending' | 'approved' | 'rejected' | 'waiting_for_receipt' | 'closed') => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800'; // Approved but not received
      case 'waiting_for_receipt': return 'bg-orange-100 text-orange-800'; // Waiting for receipt
      case 'closed': return 'bg-green-100 text-green-800'; // Fulfilled/Closed
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplay = (status: 'pending' | 'approved' | 'rejected' | 'waiting_for_receipt' | 'closed') => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'approved': return 'Disetujui'; // This status is now an intermediate state
      case 'waiting_for_receipt': return 'Menunggu Barang Diterima';
      case 'closed': return 'Terpenuhi';
      case 'rejected': return 'Ditolak';
      default: return status;
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
            <option value="waiting_for_receipt">Menunggu Barang Diterima</option>
            <option value="closed">Terpenuhi</option>
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
                    <TableHead className="text-right">Kuantitas Diajukan</TableHead>
                    <TableHead className="text-right">Diterima</TableHead>
                    <TableHead className="text-right">Dikembalikan</TableHead>
                    <TableHead className="text-right">Rusak</TableHead>
                    <TableHead>Gudang Tujuan</TableHead>
                    <TableHead className="text-right">Harga Beli/Unit</TableHead>
                    <TableHead className="text-right">Harga Jual Disarankan/Unit</TableHead>
                    <TableHead className="text-right">Total Harga</TableHead>
                    <TableHead>Pemasok</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dokumen</TableHead>
                    <TableHead>Catatan Pengajuan</TableHead>
                    <TableHead>Catatan Penerimaan</TableHead>
                    <TableHead>Tanggal Pengajuan</TableHead>
                    <TableHead>Tanggal Penerimaan</TableHead>
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
                      <TableCell className="text-right">{request.received_quantity || 0}</TableCell>
                      <TableCell className="text-right">{request.returned_quantity || 0}</TableCell>
                      <TableCell className="text-right">{request.damaged_quantity || 0}</TableCell>
                      <TableCell>{getCategoryDisplay(request.target_warehouse_category)}</TableCell>
                      <TableCell className="text-right">{request.unit_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                      <TableCell className="text-right">{request.suggested_selling_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                      <TableCell className="text-right">{request.total_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                      <TableCell>{request.supplier || "-"}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusDisplay(request.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <PurchaseRequestDocumentUpload
                          purchaseRequestId={request.id}
                          currentFileUrl={request.document_url}
                          onUploadSuccess={(fileUrl) => handleDocumentUploadSuccess(request.id, fileUrl)}
                          onRemoveSuccess={() => handleDocumentRemoveSuccess(request.id)}
                        />
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
                      <TableCell>
                        {request.received_notes ? (
                          <Button variant="outline" size="sm" onClick={() => handleViewNotes(request.received_notes!)} className="h-7 px-2">
                            <Eye className="h-3 w-3 mr-1" /> Lihat
                          </Button>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{format(new Date(request.created_at), "dd-MM-yyyy HH:mm")}</TableCell>
                      <TableCell>{request.received_at ? format(new Date(request.received_at), "dd-MM-yyyy HH:mm") : "-"}</TableCell>
                      <TableCell className="text-center flex items-center justify-center space-x-1">
                        {request.status === "pending" && (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => handleApproveRequest(request)} title="Setujui Pengajuan">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleRejectRequest(request)} title="Tolak Pengajuan">
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        {request.status === "waiting_for_receipt" && (
                          <Button variant="ghost" size="icon" onClick={() => handleReceiveItemsClick(request)} title="Terima Barang">
                            <PackageCheck className="h-4 w-4 text-blue-600" />
                          </Button>
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

      {selectedRequestForReceipt && (
        <ReceivePurchaseRequestForm
          purchaseRequest={selectedRequestForReceipt}
          isOpen={isReceiveFormOpen}
          onOpenChange={setIsReceiveFormOpen}
          onSuccess={fetchPurchaseRequests}
        />
      )}
    </Card>
  );
};

export default PurchaseRequestPage;