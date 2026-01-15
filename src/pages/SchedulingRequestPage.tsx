"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, PlusCircle, Edit, Trash2, Eye, CheckCircle } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import AddEditSchedulingRequestForm from "@/components/AddEditSchedulingRequestForm";
import ViewSchedulingRequestDetailsDialog from "@/components/ViewSchedulingRequestDetailsDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { SchedulingRequestWithDetails, SchedulingRequestStatus, SchedulingRequestType } from "@/types/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const getStatusColor = (status: SchedulingRequestStatus) => {
  switch (status) {
    case SchedulingRequestStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case SchedulingRequestStatus.APPROVED:
      return "bg-blue-100 text-blue-800";
    case SchedulingRequestStatus.REJECTED:
      return "bg-red-100 text-red-800";
    case SchedulingRequestStatus.COMPLETED:
      return "bg-green-100 text-green-800";
    case SchedulingRequestStatus.CANCELLED:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusDisplay = (status: SchedulingRequestStatus) => {
  switch (status) {
    case SchedulingRequestStatus.PENDING: return "Pending";
    case SchedulingRequestStatus.APPROVED: return "Disetujui";
    case SchedulingRequestStatus.REJECTED: return "Ditolak";
    case SchedulingRequestStatus.COMPLETED: return "Selesai";
    case SchedulingRequestStatus.CANCELLED: return "Dibatalkan";
    default: return status;
  }
};

const getTypeDisplay = (type: SchedulingRequestType) => {
  return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const SchedulingRequestPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SchedulingRequestWithDetails | null>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);

  const { data: requests, isLoading, isError, error, refetch } = useQuery<SchedulingRequestWithDetails[], Error>({
    queryKey: ["schedulingRequests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scheduling_requests")
        .select(`
          *,
          invoices (invoice_number),
          customers (customer_name, company_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((req, index) => ({
        ...req,
        no: index + 1,
        invoice_number: req.invoices?.invoice_number || undefined,
        customer_name: req.customers?.customer_name || req.customer_name, // Use customer_name from customers table if available
        company_name: req.customers?.company_name || req.company_name, // Use company_name from customers table if available
      }));
    },
  });

  const deleteRequestMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("scheduling_requests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedulingRequests"] });
      showSuccess("Permintaan jadwal berhasil dihapus!");
      setIsDeleteModalOpen(false);
      setSelectedRequest(null);
    },
    onError: (err) => {
      showError(`Gagal menghapus permintaan jadwal: ${err.message}`);
    },
  });

  const approveRequestMutation = useMutation({
    mutationFn: async (request: SchedulingRequestWithDetails) => {
      const { error } = await supabase
        .from("scheduling_requests")
        .update({ status: SchedulingRequestStatus.APPROVED, updated_at: new Date().toISOString() })
        .eq("id", request.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedulingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["schedules"] }); // Invalidate schedules cache as well
      showSuccess("Permintaan jadwal berhasil disetujui dan jadwal dibuat!");
      setSelectedRequest(null);
    },
    onError: (err) => {
      showError(`Gagal menyetujui permintaan jadwal: ${err.message}`);
    },
  });

  const handleAddRequest = () => {
    setSelectedRequest(null);
    setIsAddEditModalOpen(true);
  };

  const handleEditRequest = (request: SchedulingRequestWithDetails) => {
    setSelectedRequest(request);
    setIsAddEditModalOpen(true);
  };

  const handleDeleteClick = (request: SchedulingRequestWithDetails) => {
    setSelectedRequest(request);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRequest) {
      deleteRequestMutation.mutate(selectedRequest.id);
    }
  };

  const handleApproveClick = (request: SchedulingRequestWithDetails) => {
    setSelectedRequest(request);
    approveRequestMutation.mutate(request);
  };

  const handleViewDetails = (request: SchedulingRequestWithDetails) => {
    setSelectedRequest(request);
    setIsViewDetailsOpen(true);
  };

  const filteredRequests = requests?.filter((request) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      request.sr_number?.toLowerCase().includes(lowerCaseSearchTerm) ||
      request.customer_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      request.company_name?.toLowerCase().includes(lowerCaseSearchTerm) ||
      getTypeDisplay(request.type).toLowerCase().includes(lowerCaseSearchTerm) ||
      getStatusDisplay(request.status).toLowerCase().includes(lowerCaseSearchTerm) ||
      request.contact_person.toLowerCase().includes(lowerCaseSearchTerm) ||
      request.phone_number.toLowerCase().includes(lowerCaseSearchTerm) ||
      request.invoice_number?.toLowerCase().includes(lowerCaseSearchTerm) ||
      format(new Date(request.requested_date), "dd-MM-yyyy").includes(lowerCaseSearchTerm)
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
          {error?.message || "Gagal memuat permintaan jadwal."}
          <div className="mt-2">
            <Button onClick={() => refetch()}>Coba Lagi</Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Permintaan Jadwal Teknis</h1>

      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Cari permintaan jadwal..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAddRequest}>
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Permintaan
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Nomor SR</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Tanggal Diminta</TableHead>
              <TableHead>No. Invoice</TableHead>
              <TableHead>Kontak Person</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests?.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.no}</TableCell>
                <TableCell>{request.sr_number || "-"}</TableCell>
                <TableCell>{request.customer_name}</TableCell>
                <TableCell>{getTypeDisplay(request.type)}</TableCell>
                <TableCell>{format(new Date(request.requested_date), "dd-MM-yyyy")}</TableCell>
                <TableCell>{request.invoice_number || "-"}</TableCell>
                <TableCell>{request.contact_person}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {getStatusDisplay(request.status)}
                  </span>
                </TableCell>
                <TableCell className="flex space-x-2 justify-center">
                  <Button variant="ghost" size="icon" onClick={() => handleViewDetails(request)} title="Lihat Detail">
                    <Eye className="h-4 w-4" />
                  </Button>
                  {request.status === SchedulingRequestStatus.PENDING && (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => handleEditRequest(request)} title="Edit Permintaan">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleApproveClick(request)} title="Setujui Permintaan">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(request)} title="Hapus Permintaan">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddEditSchedulingRequestForm
        isOpen={isAddEditModalOpen}
        onOpenChange={setIsAddEditModalOpen}
        onSuccess={refetch}
        initialData={selectedRequest}
      />

      {selectedRequest && (
        <ViewSchedulingRequestDetailsDialog
          isOpen={isViewDetailsOpen}
          onClose={() => setIsViewDetailsOpen(false)}
          request={selectedRequest}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Permintaan Jadwal</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus permintaan jadwal "{selectedRequest?.sr_number || selectedRequest?.customer_name}"? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleteRequestMutation.isPending}>
              {deleteRequestMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchedulingRequestPage;