"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash, Receipt, Eye, Loader2, FileText, CheckCircle, XCircle } from "lucide-react"; // Import XCircle icon
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showError, showSuccess } from "@/utils/toast";
import { format } from "date-fns";
import { PurchaseRequest, PurchaseRequestStatus, Product, WarehouseCategory as WarehouseCategoryType, Supplier, StockEventType, PurchaseRequestWithDetails } from "@/types/data"; // Import PurchaseRequestWithDetails
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import AddPurchaseRequestForm from "@/components/AddPurchaseRequestForm"; // Import AddPurchaseRequestForm
import EditPurchaseRequestForm from "@/components/EditPurchaseRequestForm"; // Import EditPurchaseRequestForm
import PurchaseRequestReceiptUpload from "@/components/PurchaseRequestReceiptUpload"; // Import PurchaseRequestReceiptUpload
import ViewPurchaseRequestDetailsDialog from "@/components/ViewPurchaseRequestDetailsDialog"; // Import ViewPurchaseRequestDetailsDialog

const closeRequestSchema = z.object({
  received_quantity: z.number().min(0, "Kuantitas diterima tidak boleh negatif."),
  returned_quantity: z.number().min(0, "Kuantitas dikembalikan tidak boleh negatif.").optional().nullable(),
  damaged_quantity: z.number().min(0, "Kuantitas rusak tidak boleh negatif.").optional().nullable(),
  target_warehouse_category: z.string().min(1, "Kategori gudang target wajib dipilih."),
  received_notes: z.string().optional().nullable(),
});

const PurchaseRequestPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for Add form
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for Edit form
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewReceiptDialogOpen, setIsViewReceiptDialogOpen] = useState(false);
  const [isCloseRequestDialogOpen, setIsCloseRequestDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false); // State for View Details Dialog
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequestWithDetails | null>(null); // Use PurchaseRequestWithDetails
  const [currentReceiptUrl, setCurrentReceiptUrl] = useState<string | null>(null);

  const { data: purchaseRequests, isLoading, isError, error, refetch } = useQuery<PurchaseRequestWithDetails[], Error>({ // Changed type here
    queryKey: ["purchaseRequests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchase_requests")
        .select(`
          *,
          products (nama_barang),
          suppliers (name)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map(req => ({
        ...req,
        product_name: req.products?.nama_barang || 'N/A',
        supplier_name: req.suppliers?.name || 'N/A',
      })) as PurchaseRequestWithDetails[]; // Cast to PurchaseRequestWithDetails[]
    },
  });

  const { data: warehouseCategories, isLoading: loadingCategories } = useQuery<WarehouseCategoryType[], Error>({
    queryKey: ["warehouseCategories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("warehouse_categories").select("*");
      if (error) throw error;
      return data;
    },
  });

  const closeRequestForm = useForm<z.infer<typeof closeRequestSchema>>({
    resolver: zodResolver(closeRequestSchema),
    defaultValues: {
      received_quantity: 0,
      returned_quantity: 0,
      damaged_quantity: 0,
      target_warehouse_category: "",
      received_notes: "",
    },
  });

  const { reset: resetCloseForm, handleSubmit: handleCloseSubmit, register: registerCloseForm, setValue: setCloseValue, watch: watchCloseForm, formState: { errors: closeFormErrors } } = closeRequestForm;
  const watchedTargetWarehouseCategory = watchCloseForm("target_warehouse_category");

  useEffect(() => {
    if (isCloseRequestDialogOpen && selectedRequest) {
      resetCloseForm({
        received_quantity: selectedRequest.received_quantity || selectedRequest.quantity,
        returned_quantity: selectedRequest.returned_quantity || 0,
        damaged_quantity: selectedRequest.damaged_quantity || 0,
        target_warehouse_category: selectedRequest.target_warehouse_category || (warehouseCategories && warehouseCategories.length > 0 ? warehouseCategories[0].code : ""),
        received_notes: selectedRequest.received_notes || "",
      });
    }
  }, [isCloseRequestDialogOpen, selectedRequest, resetCloseForm, warehouseCategories]);

  const deletePurchaseRequestMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("purchase_requests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchaseRequests"] });
      showSuccess("Permintaan pembelian berhasil dihapus!");
      setIsDeleteDialogOpen(false);
      setSelectedRequest(null);
    },
    onError: (err) => {
      showError(`Gagal menghapus permintaan pembelian: ${err.message}`);
    },
  });

  const approvePurchaseRequestMutation = useMutation({
    mutationFn: async (request: PurchaseRequest) => {
      const { data, error } = await supabase
        .from("purchase_requests")
        .update({ status: PurchaseRequestStatus.APPROVED, updated_at: new Date().toISOString() })
        .eq("id", request.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchaseRequests"] });
      showSuccess("Permintaan pembelian berhasil disetujui!");
      setSelectedRequest(null);
    },
    onError: (err) => {
      showError(`Gagal menyetujui permintaan pembelian: ${err.message}`);
    },
  });

  const rejectPurchaseRequestMutation = useMutation({
    mutationFn: async (request: PurchaseRequest) => {
      const { data, error } = await supabase
        .from("purchase_requests")
        .update({ status: PurchaseRequestStatus.REJECTED, updated_at: new Date().toISOString() })
        .eq("id", request.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchaseRequests"] });
      showSuccess("Permintaan pembelian berhasil ditolak!");
      setSelectedRequest(null);
    },
    onError: (err) => {
      showError(`Gagal menolak permintaan pembelian: ${err.message}`);
    },
  });

  const confirmCloseRequestMutation = useMutation({
    mutationFn: async (formData: z.infer<typeof closeRequestSchema>) => {
      if (!selectedRequest || !selectedRequest.id) throw new Error("Permintaan tidak valid.");

      // Invoke atomic Edge Function
      const { data, error } = await supabase.functions.invoke('close-purchase-request', {
        body: JSON.stringify({
          request_id: selectedRequest.id,
          received_quantity: formData.received_quantity,
          returned_quantity: formData.returned_quantity,
          damaged_quantity: formData.damaged_quantity,
          target_warehouse_category: formData.target_warehouse_category,
          received_notes: formData.received_notes,
        }),
      });

      if (error) throw error;
      if (data && data.error) throw new Error(data.error);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchaseRequests"] });
      queryClient.invalidateQueries({ queryKey: ["stock_ledger"] }); // Invalidate stock ledger cache
      queryClient.invalidateQueries({ queryKey: ["warehouse_inventories"] }); // Invalidate inventory cache
      showSuccess("Permintaan pembelian berhasil ditutup dan stok diperbarui!");
      setIsCloseRequestDialogOpen(false);
      setSelectedRequest(null);
      closeRequestForm.reset();
    },
    onError: (err: any) => {
      showError(`Gagal menutup permintaan pembelian: ${err.message}`);
    },
  });

  const handleAddRequest = () => {
    setSelectedRequest(null); // Ensure no request is selected for add form
    setIsAddModalOpen(true);
  };

  const handleEditRequest = (request: PurchaseRequestWithDetails) => { // Use PurchaseRequestWithDetails
    setSelectedRequest(request);
    setIsEditModalOpen(true);
  };

  const handleDeleteRequest = (request: PurchaseRequestWithDetails) => { // Use PurchaseRequestWithDetails
    setSelectedRequest(request);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRequest) {
      deletePurchaseRequestMutation.mutate(selectedRequest.id);
    }
  };

  const handleApproveRequest = (request: PurchaseRequestWithDetails) => { // Use PurchaseRequestWithDetails
    setSelectedRequest(request);
    approvePurchaseRequestMutation.mutate(request);
  };

  const handleRejectRequest = (request: PurchaseRequestWithDetails) => { // Use PurchaseRequestWithDetails
    setSelectedRequest(request);
    rejectPurchaseRequestMutation.mutate(request);
  };

  const handleReceiptUploadClick = (request: PurchaseRequestWithDetails) => { // Use PurchaseRequestWithDetails
    setSelectedRequest(request);
    setIsUploadDialogOpen(true);
  };

  const handleViewReceipt = (url: string) => {
    setCurrentReceiptUrl(url);
    setIsViewReceiptDialogOpen(true);
  };

  const handleCloseRequest = (request: PurchaseRequestWithDetails) => { // Use PurchaseRequestWithDetails
    setSelectedRequest(request);
    setIsCloseRequestDialogOpen(true);
  };

  const handleViewDetails = (request: PurchaseRequestWithDetails) => { // Use PurchaseRequestWithDetails
    setSelectedRequest(request);
    setIsViewDetailsOpen(true);
  };

  const filteredPurchaseRequests = purchaseRequests?.filter((request) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      request.pr_number?.toLowerCase().includes(lowerCaseSearchTerm) ||
      request.item_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      request.item_code.toLowerCase().includes(lowerCaseSearchTerm) ||
      request.supplier_name?.toLowerCase().includes(lowerCaseSearchTerm) ||
      getStatusDisplay(request.status).toLowerCase().includes(lowerCaseSearchTerm) ||
      format(new Date(request.created_at), "dd-MM-yyyy").includes(lowerCaseSearchTerm)
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Terjadi Kesalahan!</AlertTitle>
        <AlertDescription>
          {error?.message || "Gagal memuat permintaan pembelian."}
          <div className="mt-2">
            <Button onClick={() => refetch()}>Coba Lagi</Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  const getStatusDisplay = (status: PurchaseRequestStatus) => {
    switch (status) {
      case PurchaseRequestStatus.PENDING:
        return "Pending";
      case PurchaseRequestStatus.APPROVED:
        return "Approved";
      case PurchaseRequestStatus.REJECTED:
        return "Rejected";
      case PurchaseRequestStatus.WAITING_FOR_RECEIVED:
        return "Waiting for Received";
      case PurchaseRequestStatus.CLOSED:
        return "Closed";
      default:
        return status;
    }
  };

  const getStatusClasses = (status: PurchaseRequestStatus) => {
    switch (status) {
      case PurchaseRequestStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case PurchaseRequestStatus.APPROVED:
        return "bg-blue-100 text-blue-800";
      case PurchaseRequestStatus.REJECTED:
        return "bg-red-100 text-red-800";
      case PurchaseRequestStatus.WAITING_FOR_RECEIVED:
        return "bg-purple-100 text-purple-800";
      case PurchaseRequestStatus.CLOSED:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Permintaan Pembelian</h1>
        <Button onClick={handleAddRequest}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Permintaan
        </Button>
      </div>

      <Input
        placeholder="Cari permintaan pembelian..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm mb-4"
      />

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. PR</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Kode</TableHead>
              <TableHead>Kuantitas</TableHead>
              <TableHead>Harga Satuan</TableHead>
              <TableHead>Total Harga</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Dibuat</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPurchaseRequests?.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.pr_number || "-"}</TableCell>
                <TableCell>{request.item_name}</TableCell>
                <TableCell>{request.item_code}</TableCell>
                <TableCell>{request.quantity} {request.satuan}</TableCell>
                <TableCell>{request.unit_price?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                <TableCell>{request.total_price?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(request.status)}`}>
                    {getStatusDisplay(request.status)}
                  </span>
                </TableCell>
                <TableCell>{format(new Date(request.created_at), "dd/MM/yyyy HH:mm")}</TableCell>
                <TableCell className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleViewDetails(request)} title="Lihat Detail">
                    <Eye className="h-4 w-4 text-gray-600" />
                  </Button>
                  {request.status === PurchaseRequestStatus.PENDING && (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => handleEditRequest(request)} title="Edit Permintaan">
                        <Edit className="h-4 w-4 text-gray-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleApproveRequest(request)} title="Setujui Permintaan">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleRejectRequest(request)} title="Tolak Permintaan">
                        <XCircle className="h-4 w-4 text-red-600" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteRequest(request)} title="Hapus Permintaan">
                        <Trash className="h-4 w-4 text-red-600" />
                      </Button>
                    </>
                  )}
                  {request.status !== PurchaseRequestStatus.CLOSED && request.status !== PurchaseRequestStatus.REJECTED && (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => handleReceiptUploadClick(request)} title="Unggah PO/Inv">
                        <Receipt className="h-4 w-4 text-blue-600" />
                      </Button>
                      {request.document_url && (
                        <Button variant="ghost" size="icon" onClick={() => handleViewReceipt(request.document_url!)} title="Lihat PO/Inv">
                          <Eye className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      {request.status === PurchaseRequestStatus.WAITING_FOR_RECEIVED && (
                        <Button variant="ghost" size="icon" onClick={() => handleCloseRequest(request)} title="Tutup Permintaan & Perbarui Stok">
                          <FileText className="h-4 w-4 text-purple-600" />
                        </Button>
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Purchase Request Form */}
      <AddPurchaseRequestForm
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={refetch}
      />

      {/* Edit Purchase Request Form */}
      {selectedRequest && (
        <EditPurchaseRequestForm
          purchaseRequest={selectedRequest}
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSuccess={refetch}
        />
      )}

      {/* View Purchase Request Details Dialog */}
      {selectedRequest && (
        <ViewPurchaseRequestDetailsDialog
          isOpen={isViewDetailsOpen}
          onClose={() => setIsViewDetailsOpen(false)}
          request={selectedRequest}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus permintaan pembelian "{selectedRequest?.item_name}"? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deletePurchaseRequestMutation.isPending}>
              {deletePurchaseRequestMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload PO/Inv Dialog */}
      {selectedRequest && (
        <PurchaseRequestReceiptUpload
          purchaseRequestId={selectedRequest.id}
          currentDocumentUrl={selectedRequest.document_url}
          isOpen={isUploadDialogOpen}
          onOpenChange={setIsUploadDialogOpen}
          onSuccess={refetch}
        />
      )}

      {/* View Receipt Dialog */}
      <Dialog open={isViewReceiptDialogOpen} onOpenChange={setIsViewReceiptDialogOpen}>
        <DialogContent className="sm:max-w-[800px] h-[90vh]">
          <DialogHeader>
            <DialogTitle>Lihat PO/Inv</DialogTitle>
            <DialogDescription>
              Dokumen PO/Inv untuk permintaan pembelian "{selectedRequest?.item_name}".
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow">
            {currentReceiptUrl ? (
              <iframe src={currentReceiptUrl} className="w-full h-full border-0" title="Purchase Receipt"></iframe>
            ) : (
              <p>Tidak ada dokumen untuk ditampilkan.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewReceiptDialogOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Purchase Request Dialog */}
      <Dialog open={isCloseRequestDialogOpen} onOpenChange={setIsCloseRequestDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tutup Permintaan Pembelian & Perbarui Stok</DialogTitle>
            <DialogDescription>
              Konfirmasi detail penerimaan untuk permintaan "{selectedRequest?.item_name}".
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCloseSubmit((data) => confirmCloseRequestMutation.mutate(data))} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pr_number_display" className="text-right">
                No. PR
              </Label>
              <Input id="pr_number_display" value={selectedRequest?.pr_number || "-"} className="col-span-3" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="requested_quantity" className="text-right">
                Kuantitas Diajukan
              </Label>
              <Input id="requested_quantity" value={selectedRequest?.quantity || 0} className="col-span-3" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="received_quantity" className="text-right">
                Kuantitas Diterima
              </Label>
              <Input id="received_quantity" type="number" {...registerCloseForm("received_quantity", { valueAsNumber: true })} className="col-span-3" />
              {closeFormErrors.received_quantity && <p className="col-span-4 text-red-500 text-sm">{closeFormErrors.received_quantity.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="returned_quantity" className="text-right">
                Kuantitas Dikembalikan
              </Label>
              <Input id="returned_quantity" type="number" {...registerCloseForm("returned_quantity", { valueAsNumber: true })} className="col-span-3" />
              {closeFormErrors.returned_quantity && <p className="col-span-4 text-red-500 text-sm">{closeFormErrors.returned_quantity.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="damaged_quantity" className="text-right">
                Kuantitas Rusak
              </Label>
              <Input id="damaged_quantity" type="number" {...registerCloseForm("damaged_quantity", { valueAsNumber: true })} className="col-span-3" />
              {closeFormErrors.damaged_quantity && <p className="col-span-4 text-red-500 text-sm">{closeFormErrors.damaged_quantity.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="target_warehouse_category" className="text-right">
                Gudang Target
              </Label>
              <Select
                onValueChange={(value) => setCloseValue("target_warehouse_category", value)}
                value={watchedTargetWarehouseCategory || ""}
                disabled={loadingCategories}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Kategori Gudang" />
                </SelectTrigger>
                <SelectContent>
                  {warehouseCategories?.map((category) => (
                    <SelectItem key={category.id} value={category.code}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {closeFormErrors.target_warehouse_category && <p className="col-span-4 text-red-500 text-sm">{closeFormErrors.target_warehouse_category.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="received_notes" className="text-right">
                Catatan Penerimaan
              </Label>
              <Textarea id="received_notes" {...registerCloseForm("received_notes")} className="col-span-3" />
              {closeFormErrors.received_notes && <p className="col-span-4 text-red-500 text-sm">{closeFormErrors.received_notes.message}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCloseRequestDialogOpen(false)}>Batal</Button>
              <Button type="submit" disabled={confirmCloseRequestMutation.isPending}>
                {confirmCloseRequestMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Konfirmasi & Tutup
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseRequestPage;