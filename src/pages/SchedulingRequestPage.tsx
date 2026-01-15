"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, PlusCircle, Edit, Trash2, Eye, CheckCircle, Clock } from "lucide-react"; // Removed XCircle, RefreshCcw, PlayCircle
import { showSuccess, showError } from "@/utils/toast";
import AddEditSchedulingRequestForm from "@/components/AddEditSchedulingRequestForm";
import ViewSchedulingRequestDetailsDialog from "@/components/ViewSchedulingRequestDetailsDialog";
import CancelRequestDialog from "@/components/CancelRequestDialog"; // Keep CancelRequestDialog
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { SchedulingRequestWithDetails, SchedulingRequestStatus, SchedulingRequestType, Technician } from "@/types/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import TechnicianCombobox from "@/components/TechnicianCombobox"; // Import TechnicianCombobox

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
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false); // For technician name input on approve
  const [technicianNameForApproval, setTechnicianNameForApproval] = useState(""); // State for technician name input
  const [technicianSearchInputForApproval, setTechnicianSearchInputForApproval] = useState(""); // State for combobox input

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

  const { data: technicians, isLoading: loadingTechnicians, error: techniciansError } = useQuery<Technician[], Error>({
    queryKey: ["technicians"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technicians")
        .select("*")
        .order("name", { ascending: true });
      if (error) {
        showError("Gagal memuat daftar teknisi.");
        throw error;
      }
      return data;
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
      setIsCancelModalOpen(false);
      setIsApproveModalOpen(false);
      setTechnicianNameForApproval(""); // Clear input
      setTechnicianSearchInputForApproval(""); // Clear combobox input
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
  const handleCancelClick = (request: SchedulingRequestWithDetails) => {
    setSelectedRequest(request);
    setIsCancelModalOpen(true);
  };

  const handleApproveClick = (request: SchedulingRequestWithDetails) => {
    setSelectedRequest(request);
    setTechnicianNameForApproval(request.technician_name || ""); // Pre-fill if exists
    setTechnicianSearchInputForApproval(request.technician_name || "");
    setIsApproveModalOpen(true); // Open the dialog to input technician name
  };

  const handleTechnicianSelectForApproval = (technician: Technician | undefined) => {
    if (technician) {
      setTechnicianNameForApproval(technician.name);
      setTechnicianSearchInputForApproval(technician.name);
    } else {
      setTechnicianNameForApproval("");
      setTechnicianSearchInputForApproval("");
    }
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
              <TableHead>Nama Teknisi</TableHead>
              <TableHead>No. Invoice Terkait</TableHead>
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
                <TableCell>{request.technician_name || "-"}</TableCell>
                <TableCell>{request.invoice_number || "-"}</TableCell>
                <TableCell>{request.contact_person}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {getStatusDisplay(request.status)}
                  </span>
                </TableCell>
                <TableCell className="flex space-x-2 justify-center">
                  {/* 1. View */}
                  <Button variant="ghost" size="icon" onClick={() => handleViewDetails(request)} title="Lihat Detail">
                    <Eye className="h-4 w-4" />
                  </Button>

                  {/* 2. Edit (only if PENDING) */}
                  {request.status === SchedulingRequestStatus.PENDING && (
                    <Button variant="ghost" size="icon" onClick={() => handleEditRequest(request)} title="Edit Permintaan">
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}

                  {/* 3. Disetujui (Approve) (only if PENDING) */}
                  {request.status === SchedulingRequestStatus.PENDING && (
                    <Button variant="ghost" size="icon" onClick={() => handleApproveClick(request)} title="Setujui Permintaan">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}

                  {/* 4. Dibatalkan (Cancel) (if PENDING, IN_PROGRESS, or RESCHEDULED) */}
                  {(request.status === SchedulingRequestStatus.PENDING ||
                    request.status === SchedulingRequestStatus.IN_PROGRESS ||
                    request.status === SchedulingRequestStatus.RESCHEDULED) && (
                    <Button variant="ghost" size="icon" onClick={() => handleCancelClick(request)} title="Batalkan Permintaan">
                      <Clock className="h-4 w-4" />
                    </Button>
                  )}

                  {/* 5. Dihapus (Delete) (only if PENDING) */}
                  {request.status === SchedulingRequestStatus.PENDING && (
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(request)} title="Hapus Permintaan">
                      <Trash2 className="h-4 w-4" />
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

      {/* Approve Request Dialog (for technician name input) */}
      {selectedRequest && (
        <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Setujui Permintaan Jadwal</DialogTitle>
              <DialogDescription>
                Pilih nama teknisi untuk permintaan jadwal ini.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (technicianNameForApproval.trim() === '') {
                showError('Nama teknisi wajib diisi.');
                return;
              }
              updateStatusMutation.mutate({ id: selectedRequest.id, status: SchedulingRequestStatus.APPROVED, technician_name: technicianNameForApproval });
            }} className="space-y-4">
              <TechnicianCombobox
                technicians={technicians || []}
                value={technicians?.find(t => t.name === technicianNameForApproval)?.id || undefined}
                onValueChange={handleTechnicianSelectForApproval}
                inputValue={technicianSearchInputForApproval}
                onInputValueChange={setTechnicianSearchInputForApproval}
                disabled={loadingTechnicians}
                loading={loadingTechnicians}
                placeholder="Pilih atau cari teknisi..."
                id="technician_name_for_approval"
                name="technician_name_for_approval"
              />
              {updateStatusMutation.isError && <p className="text-red-500 text-sm">{updateStatusMutation.error?.message}</p>}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsApproveModalOpen(false)} disabled={updateStatusMutation.isPending}>
                  Batal
                </Button>
                <Button type="submit" disabled={updateStatusMutation.isPending || !technicianNameForApproval.trim()}>
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