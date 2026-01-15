"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, PlusCircle, Edit, Trash2, Eye, CheckCircle, XCircle, RefreshCcw, Clock, PlayCircle } from "lucide-react"; // Changed CalendarRefresh to RefreshCcw
import { showSuccess, showError } from "@/utils/toast";
import AddEditSchedulingRequestForm from "@/components/AddEditSchedulingRequestForm";
import ViewSchedulingRequestDetailsDialog from "@/components/ViewSchedulingRequestDetailsDialog";
import RejectRequestDialog from "@/components/RejectRequestDialog"; // New import
import RescheduleRequestDialog from "@/components/RescheduleRequestDialog"; // New import
import CancelRequestDialog from "@/components/CancelRequestDialog"; // New import
import CompleteRequestDialog from "@/components/CompleteRequestDialog"; // New import
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { SchedulingRequestWithDetails, SchedulingRequestStatus, SchedulingRequestType } from "@/types/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const getStatusColor = (status: SchedulingRequestStatus) => {
  switch (status) {
    case SchedulingRequestStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case SchedulingRequestStatus.IN_PROGRESS:
      return "bg-blue-100 text-blue-800";
    case SchedulingRequestStatus.RESCHEDULED:
      return "bg-orange-100 text-orange-800";
    case SchedulingRequestStatus.REJECTED:
      return "bg-red-100 text-red-800";
    case SchedulingRequestStatus.CANCELLED:
      return "bg-gray-100 text-gray-800";
    case SchedulingRequestStatus.APPROVED:
      return "bg-green-100 text-green-800";
    case SchedulingRequestStatus.COMPLETED:
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusDisplay = (status: SchedulingRequestStatus) => {
  switch (status) {
    case SchedulingRequestStatus.PENDING: return "Pending";
    case SchedulingRequestStatus.IN_PROGRESS: return "Diproses";
    case SchedulingRequestStatus.RESCHEDULED: return "Dijadwal Ulang";
    case SchedulingRequestStatus.REJECTED: return "Ditolak";
    case SchedulingRequestStatus.CANCELLED: return "Dibatalkan";
    case SchedulingRequestStatus.APPROVED: return "Disetujui";
    case SchedulingRequestStatus.COMPLETED: return "Selesai";
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

  // States for new action dialogs
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false); // For technician name input on approve

  const { data: requests, isLoading, isError, error, refetch } = useQuery<SchedulingRequestWithDetails[], Error>({
    queryKey: ["schedulingRequests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scheduling_requests")
        .select(`
          *,
          invoices (invoice_number),
          customers (customer_name, company_name, phone_number, customer_type)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((req, index) => ({
        ...req,
        no: index + 1,
        invoice_number: req.invoices?.invoice_number || undefined,
        customer_name_from_customers: req.customers?.customer_name || undefined,
        company_name_from_customers: req.customers?.company_name || undefined,
        phone_number_from_customers: req.customers?.phone_number || undefined,
        customer_type_from_customers: req.customers?.customer_type || undefined,
        customer_name: req.customer_name || "",
        full_address: req.full_address || "",
        contact_person: req.contact_person || "",
        phone_number: req.phone_number || "",
        type: req.type || SchedulingRequestType.INSTALLATION,
        status: req.status || SchedulingRequestStatus.PENDING,
        technician_name: req.technician_name || undefined, // Ensure technician_name is passed
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

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes, technician_name }: { id: string; status: SchedulingRequestStatus; notes?: string | null; technician_name?: string | null }) => {
      const { error } = await supabase
        .from("scheduling_requests")
        .update({ status: status, notes: notes || null, technician_name: technician_name || null, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedulingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["schedules"] }); // Invalidate schedules cache as well
      showSuccess("Status permintaan jadwal berhasil diperbarui!");
      setSelectedRequest(null);
      setIsRejectModalOpen(false);
      setIsRescheduleModalOpen(false);
      setIsCancelModalOpen(false);
      setIsCompleteModalOpen(false);
      setIsApproveModalOpen(false);
    },
    onError: (err) => {
      showError(`Gagal memperbarui status permintaan jadwal: ${err.message}`);
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

  const handleViewDetails = (request: SchedulingRequestWithDetails) => {
    setSelectedRequest(request);
    setIsViewDetailsOpen(true);
  };

  // Handlers for new status transitions
  const handleInProgressClick = (request: SchedulingRequestWithDetails) => {
    updateStatusMutation.mutate({ id: request.id, status: SchedulingRequestStatus.IN_PROGRESS });
  };

  const handleRejectClick = (request: SchedulingRequestWithDetails) => {
    setSelectedRequest(request);
    setIsRejectModalOpen(true);
  };

  const handleRescheduleClick = (request: SchedulingRequestWithDetails) => {
    setSelectedRequest(request);
    setIsRescheduleModalOpen(true);
  };

  const handleCancelClick = (request: SchedulingRequestWithDetails) => {
    setSelectedRequest(request);
    setIsCancelModalOpen(true);
  };

  const handleCompleteClick = (request: SchedulingRequestWithDetails) => {
    setSelectedRequest(request);
    setIsCompleteModalOpen(true);
  };

  const handleApproveClick = (request: SchedulingRequestWithDetails) => {
    setSelectedRequest(request);
    setIsApproveModalOpen(true); // Open the dialog to input technician name
  };

  const filteredRequests = requests?.filter((request) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const customerName = request.customer_name_from_customers || request.customer_name;
    const companyName = request.company_name_from_customers || request.company_name;
    const phoneNumber = request.phone_number_from_customers || request.phone_number;

    return (
      request.sr_number?.toLowerCase().includes(lowerCaseSearchTerm) ||
      customerName.toLowerCase().includes(lowerCaseSearchTerm) ||
      companyName?.toLowerCase().includes(lowerCaseSearchTerm) ||
      getTypeDisplay(request.type).toLowerCase().includes(lowerCaseSearchTerm) ||
      getStatusDisplay(request.status).toLowerCase().includes(lowerCaseSearchTerm) ||
      request.contact_person.toLowerCase().includes(lowerCaseSearchTerm) ||
      phoneNumber.toLowerCase().includes(lowerCaseSearchTerm) ||
      request.invoice_number?.toLowerCase().includes(lowerCaseSearchTerm) ||
      request.technician_name?.toLowerCase().includes(lowerCaseSearchTerm) || // Search by technician name
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
              <TableHead>Nama Teknisi</TableHead> {/* New column */}
              <TableHead>No. Invoice Terkait</TableHead> {/* Renamed column */}
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
                <TableCell>{request.customer_name_from_customers || request.customer_name}</TableCell>
                <TableCell>{getTypeDisplay(request.type)}</TableCell>
                <TableCell>{format(new Date(request.requested_date), "dd-MM-yyyy")}</TableCell>
                <TableCell>{request.technician_name || "-"}</TableCell> {/* Display technician name */}
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
                  {/* Conditional Action Buttons based on status */}
                  {request.status === SchedulingRequestStatus.PENDING && (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => handleEditRequest(request)} title="Edit Permintaan">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleApproveClick(request)} title="Setujui Permintaan">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleInProgressClick(request)} title="Tandai Diproses">
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(request)} title="Hapus Permintaan">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {(request.status === SchedulingRequestStatus.PENDING || request.status === SchedulingRequestStatus.IN_PROGRESS || request.status === SchedulingRequestStatus.RESCHEDULED) && (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => handleRejectClick(request)} title="Tolak Permintaan">
                        <XCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleRescheduleClick(request)} title="Jadwal Ulang Permintaan">
                        <RefreshCcw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleCancelClick(request)} title="Batalkan Permintaan">
                        <Clock className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {(request.status === SchedulingRequestStatus.IN_PROGRESS || request.status === SchedulingRequestStatus.APPROVED) && (
                    <Button variant="ghost" size="icon" onClick={() => handleCompleteClick(request)} title="Selesaikan Permintaan">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
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

      {/* Reject Request Dialog */}
      {selectedRequest && (
        <RejectRequestDialog
          isOpen={isRejectModalOpen}
          onOpenChange={setIsRejectModalOpen}
          onRequestSuccess={refetch}
          requestId={selectedRequest.id}
          currentNotes={selectedRequest.notes}
        />
      )}

      {/* Reschedule Request Dialog */}
      {selectedRequest && (
        <RescheduleRequestDialog
          isOpen={isRescheduleModalOpen}
          onOpenChange={setIsRescheduleModalOpen}
          onRequestSuccess={refetch}
          requestId={selectedRequest.id}
          currentNotes={selectedRequest.notes}
        />
      )}

      {/* Cancel Request Dialog */}
      {selectedRequest && (
        <CancelRequestDialog
          isOpen={isCancelModalOpen}
          onOpenChange={setIsCancelModalOpen}
          onRequestSuccess={refetch}
          requestId={selectedRequest.id}
          currentNotes={selectedRequest.notes}
        />
      )}

      {/* Complete Request Dialog */}
      {selectedRequest && (
        <CompleteRequestDialog
          isOpen={isCompleteModalOpen}
          onOpenChange={setIsCompleteModalOpen}
          onRequestSuccess={refetch}
          requestId={selectedRequest.id}
        />
      )}

      {/* Approve Request Dialog (for technician name input) */}
      {selectedRequest && (
        <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Setujui Permintaan Jadwal</DialogTitle>
              <DialogDescription>
                Masukkan nama teknisi untuk permintaan jadwal ini.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const technicianInput = (e.target as HTMLFormElement).elements.namedItem('technician_name') as HTMLInputElement;
              const name = technicianInput.value;
              if (name.trim() === '') {
                showError('Nama teknisi wajib diisi.');
                return;
              }
              updateStatusMutation.mutate({ id: selectedRequest.id, status: SchedulingRequestStatus.APPROVED, technician_name: name });
            }} className="space-y-4">
              <Input
                id="technician_name"
                name="technician_name"
                placeholder="Nama Teknisi"
                defaultValue={selectedRequest.technician_name || ''}
                required
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsApproveModalOpen(false)} disabled={updateStatusMutation.isPending}>
                  Batal
                </Button>
                <Button type="submit" disabled={updateStatusMutation.isPending}>
                  {updateStatusMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Setujui & Simpan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SchedulingRequestPage;