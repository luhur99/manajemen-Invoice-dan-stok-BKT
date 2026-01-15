"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, PlusCircle, Edit, Trash2, CheckCircle, XCircle, Receipt, Package, FileText } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import AddPurchaseRequestForm from "@/components/AddPurchaseRequestForm";
import EditPurchaseRequestForm from "@/components/EditPurchaseRequestForm";
import ViewPurchaseRequestDetailsDialog from "@/components/ViewPurchaseRequestDetailsDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { PurchaseRequestWithDetails, PurchaseRequestStatus, TransactionType, WarehouseCategory as WarehouseCategoryType } from "@/types/data"; // Import the interface
import PurchaseRequestReceiptUpload from "@/components/PurchaseRequestReceiptUpload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const getStatusColor = (status: PurchaseRequestStatus) => {
  switch (status) {
    case PurchaseRequestStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case PurchaseRequestStatus.APPROVED:
      return "bg-blue-100 text-blue-800";
    case PurchaseRequestStatus.REJECTED:
      return "bg-red-100 text-red-800";
    case PurchaseRequestStatus.WAITING_FOR_RECEIPT:
      return "bg-purple-100 text-purple-800";
    case PurchaseRequestStatus.CLOSED:
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const PurchaseRequestPage = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState<PurchaseRequestWithDetails | null>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = React.useState(false);
  const [requestToView, setRequestToView] = React.useState<PurchaseRequestWithDetails | null>(null);
  const [isReceiptUploadOpen, setIsReceiptUploadOpen] = React.useState(false);
  const [filterStatus, setFilterStatus] = React.useState<PurchaseRequestStatus | "all">("all");

  const { data: warehouseCategories, isLoading: loadingCategories, error: categoriesError } = useQuery<WarehouseCategoryType[], Error>({
    queryKey: ["warehouseCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warehouse_categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        showError("Gagal memuat kategori gudang.");
        throw error;
      }
      return data;
    },
  });

  const getCategoryDisplayName = (code: string) => {
    const category = warehouseCategories?.find(cat => cat.code === code);
    return category ? category.name : code;
  };

  const { data: requests, isLoading, error, refetch: fetchRequests } = useQuery<PurchaseRequestWithDetails[], Error>({
    queryKey: ["purchaseRequests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchase_requests")
        .select(`
          *,
          suppliers (name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((request, index) => ({
        ...request,
        no: index + 1, // Add sequential number
        supplier_name: request.suppliers?.name || "-",
      }));
    },
  });

  const handleEditClick = (request: PurchaseRequestWithDetails) => {
    setSelectedRequest(request);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (request: PurchaseRequestWithDetails) => {
    setSelectedRequest(request);
    setIsDeleteModalOpen(true);
  };

  const handleViewDetails = (request: PurchaseRequestWithDetails) => {
    setRequestToView(request);
    setIsViewDetailsOpen(true);
  };

  const handleReceiptUploadClick = (request: PurchaseRequestWithDetails) => {
    setSelectedRequest(request);
    setIsReceiptUploadOpen(true);
  };

  const handleApproveRequest = async (request: PurchaseRequestWithDetails) => {
    try {
      const { error } = await supabase
        .from("purchase_requests")
        .update({ status: PurchaseRequestStatus.APPROVED })
        .eq("id", request.id);

      if (error) throw error;

      showSuccess("Permintaan pembelian disetujui!");
      fetchRequests();
    } catch (err: any) {
      showError(`Gagal menyetujui permintaan: ${err.message}`);
      console.error("Error approving purchase request:", err);
    }
  };

  const handleRejectRequest = async (request: PurchaseRequestWithDetails) => {
    try {
      const { error } = await supabase
        .from("purchase_requests")
        .update({ status: PurchaseRequestStatus.REJECTED })
        .eq("id", request.id);

      if (error) throw error;

      showSuccess("Permintaan pembelian ditolak!");
      fetchRequests();
    } catch (err: any) {
      showError(`Gagal menolak permintaan: ${err.message}`);
      console.error("Error rejecting purchase request:", err);
    }
  };

  const handleMarkAsReceived = async (request: PurchaseRequestWithDetails) => {
    try {
      // First, update the purchase request status to WAITING_FOR_RECEIPT
      const { error: updateError } = await supabase
        .from("purchase_requests")
        .update({ status: PurchaseRequestStatus.WAITING_FOR_RECEIPT })
        .eq("id", request.id);

      if (updateError) throw updateError;

      showSuccess("Permintaan pembelian ditandai sebagai menunggu resi!");
      fetchRequests();
    } catch (err: any) {
      showError(`Gagal menandai sebagai menunggu resi: ${err.message}`);
      console.error("Error marking as waiting for receipt:", err);
    }
  };

  const handleCloseRequest = async (request: PurchaseRequestWithDetails) => {
    try {
      // Insert into stock_transactions
      const { error: transactionError } = await supabase
        .from("stock_transactions")
        .insert({
          user_id: request.user_id,
          product_id: request.product_id,
          transaction_type: TransactionType.IN,
          quantity: request.quantity,
          notes: `Stok masuk dari pengajuan pembelian #${request.no} (${request.item_name})`,
          transaction_date: format(new Date(), "yyyy-MM-dd"),
          warehouse_category: request.target_warehouse_category,
        });

      if (transactionError) throw transactionError;

      // Update warehouse_inventories
      const { data: existingInventory, error: inventoryFetchError } = await supabase
        .from("warehouse_inventories")
        .select("id, quantity")
        .eq("product_id", request.product_id)
        .eq("warehouse_category", request.target_warehouse_category)
        .single();

      if (inventoryFetchError && inventoryFetchError.code !== 'PGRST116') { // PGRST116 means no rows found
        throw inventoryFetchError;
      }

      if (existingInventory) {
        const { error: updateInventoryError } = await supabase
          .from("warehouse_inventories")
          .update({ quantity: existingInventory.quantity + request.quantity })
          .eq("id", existingInventory.id);
        if (updateInventoryError) throw updateInventoryError;
      } else {
        const { error: insertInventoryError } = await supabase
          .from("warehouse_inventories")
          .insert({
            product_id: request.product_id,
            warehouse_category: request.target_warehouse_category,
            quantity: request.quantity,
            user_id: request.user_id,
          });
        if (insertInventoryError) throw insertInventoryError;
      }

      // Update purchase request status to CLOSED
      const { error: updateRequestError } = await supabase
        .from("purchase_requests")
        .update({ status: PurchaseRequestStatus.CLOSED, received_quantity: request.quantity, received_at: new Date().toISOString() })
        .eq("id", request.id);

      if (updateRequestError) throw updateRequestError;

      showSuccess("Permintaan pembelian ditutup dan stok diperbarui!");
      fetchRequests();
    } catch (err: any) {
      showError(`Gagal menutup permintaan dan memperbarui stok: ${err.message}`);
      console.error("Error closing purchase request and updating stock:", err);
    }
  };

  const handleDeleteRequest = async () => {
    if (!selectedRequest) return;

    try {
      const { error } = await supabase
        .from("purchase_requests")
        .delete()
        .eq("id", selectedRequest.id);

      if (error) throw error;

      showSuccess("Permintaan pembelian berhasil dihapus!");
      setIsDeleteModalOpen(false);
      fetchRequests();
    } catch (err: any) {
      showError(`Gagal menghapus permintaan: ${err.message}`);
      console.error("Error deleting purchase request:", err);
    }
  };

  const filteredRequests = requests?.filter((item) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesSearch =
      item.item_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.item_code.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.supplier_name?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.notes?.toLowerCase().includes(lowerCaseSearchTerm) ||
      (item.target_warehouse_category && getCategoryDisplayName(item.target_warehouse_category).toLowerCase().includes(lowerCaseSearchTerm)) ||
      format(new Date(item.created_at), "dd-MM-yyyy").includes(lowerCaseSearchTerm);

    const matchesStatus = filterStatus === "all" || item.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (isLoading || loadingCategories) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || categoriesError) {
    return <div className="text-red-500">Error loading purchase requests or categories: {error?.message || categoriesError?.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Permintaan Pembelian</h1>

      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <Input
          placeholder="Cari permintaan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm flex-grow"
        />
        <div className="flex gap-4">
          <Select
            value={filterStatus}
            onValueChange={(value: PurchaseRequestStatus | "all") => setFilterStatus(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {Object.values(PurchaseRequestStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Permintaan
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Nama Item</TableHead>
              <TableHead>Kode Item</TableHead>
              <TableHead className="text-right">Kuantitas</TableHead>
              <TableHead className="text-right">Harga Beli/Unit</TableHead>
              <TableHead className="text-right">Harga Jual Disarankan/Unit</TableHead>
              <TableHead className="text-right">Total Harga</TableHead>
              <TableHead>Pemasok</TableHead>
              <TableHead>Kategori Gudang Tujuan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Catatan</TableHead>
              <TableHead>Tanggal Pengajuan</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests?.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.no}</TableCell>
                <TableCell>{request.item_name}</TableCell>
                <TableCell>{request.item_code}</TableCell>
                <TableCell className="text-right">{request.quantity}</TableCell>
                <TableCell className="text-right">{request.unit_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                <TableCell className="text-right">{request.suggested_selling_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                <TableCell className="text-right">{request.total_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                <TableCell>{request.supplier_name}</TableCell>
                <TableCell>{request.target_warehouse_category ? getCategoryDisplayName(request.target_warehouse_category) : "-"}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace(/_/g, ' ')}
                  </span>
                </TableCell>
                <TableCell>
                  {request.notes ? (
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(request)} className="h-7 px-2">
                      <FileText className="h-3 w-3 mr-1" /> Lihat
                    </Button>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{format(new Date(request.created_at), "dd-MM-yyyy HH:mm")}</TableCell>
                <TableCell className="text-center flex items-center justify-center space-x-1">
                  {request.status === PurchaseRequestStatus.PENDING && (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => handleApproveRequest(request)} title="Setujui">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleRejectRequest(request)} title="Tolak">
                        <XCircle className="h-4 w-4 text-red-600" />
                      </Button>
                    </>
                  )}
                  {request.status === PurchaseRequestStatus.APPROVED && (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => handleMarkAsReceived(request)} title="Tandai Menunggu Resi">
                        <Package className="h-4 w-4 text-purple-600" />
                      </Button>
                    </>
                  )}
                  {request.status === PurchaseRequestStatus.WAITING_FOR_RECEIPT && (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => handleReceiptUploadClick(request)} title="Unggah Resi">
                        <Receipt className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleCloseRequest(request)} title="Tutup Permintaan & Perbarui Stok">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                    </>
                  )}
                  {(request.status === PurchaseRequestStatus.PENDING || request.status === PurchaseRequestStatus.REJECTED) && (
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(request)} title="Hapus Permintaan">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  {(request.status === PurchaseRequestStatus.APPROVED || request.status === PurchaseRequestStatus.WAITING_FOR_RECEIPT || request.status === PurchaseRequestStatus.CLOSED) && (
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(request)} title="Edit Permintaan">
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddPurchaseRequestForm
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={fetchRequests}
      />

      {selectedRequest && (
        <EditPurchaseRequestForm
          purchaseRequest={selectedRequest}
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSuccess={fetchRequests}
        />
      )}

      {requestToView && (
        <ViewPurchaseRequestDetailsDialog
          purchaseRequest={requestToView}
          isOpen={isViewDetailsOpen}
          onOpenChange={setIsViewDetailsOpen}
        />
      )}

      {selectedRequest && (
        <PurchaseRequestReceiptUpload
          purchaseRequestId={selectedRequest.id}
          currentDocumentUrl={selectedRequest.document_url}
          isOpen={isReceiptUploadOpen}
          onOpenChange={setIsReceiptUploadOpen}
          onSuccess={fetchRequests}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Permintaan Pembelian</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus permintaan pembelian untuk "{selectedRequest?.item_name}"? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDeleteRequest}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseRequestPage;