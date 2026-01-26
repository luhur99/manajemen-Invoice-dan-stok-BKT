"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, PlusCircle, Edit, Trash2, Eye, CheckCircle, Clock } from "lucide-react"; 
import { showSuccess, showError } from "@/utils/toast";
import AddEditSchedulingRequestForm from "@/components/AddEditSchedulingRequestForm";
import ViewSchedulingRequestDetailsDialog from "@/components/ViewSchedulingRequestDetailsDialog";
import CancelRequestDialog from "@/components/CancelRequestDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { SchedulingRequestWithDetails, SchedulingRequestStatus, SchedulingRequestType, Technician, ScheduleProductCategory, CustomerTypeEnum } from "@/types/data"; // Import ScheduleProductCategory
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import TechnicianCombobox from "@/components/TechnicianCombobox";
import { useDebounce } from "@/hooks/use-debounce"; // Import useDebounce

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

const getProductCategoryDisplay = (category: ScheduleProductCategory | null | undefined) => {
  if (!category) return "-";
  return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const SchedulingRequestPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Apply debounce
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SchedulingRequestWithDetails | null>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);

  // States for new action dialogs
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false); 
  const [technicianNameForApproval, setTechnicianNameForApproval] = useState(""); 
  const [technicianSearchInputForApproval, setTechnicianSearchInputForApproval] = useState(""); 

  const { data: requests, isLoading, isError, error, refetch } = useQuery<SchedulingRequestWithDetails[], Error>({
    queryKey: ["schedulingRequests", debouncedSearchTerm], // Include debounced search term
    queryFn: async () => {
      let query = supabase
        .from("scheduling_requests")
        .select(`
          id,
          type,
          full_address,
          requested_date,
          contact_person,
          status,
          notes,
          sr_number,
          invoice_id,
          customer_id,
          customer_name,
          phone_number,
          technician_name,
          product_category,
          customers (customer_name, company_name, phone_number, customer_type),
          invoices (invoice_number)
        `) // Optimized select statement
        .order("created_at", { ascending: false });

      if (debouncedSearchTerm) {
        query = query.or(
          `sr_number.ilike.%${debouncedSearchTerm}%,customer_name.ilike.%${debouncedSearchTerm}%,company_name.ilike.%${debouncedSearchTerm}%,type.ilike.%${debouncedSearchTerm}%,product_category.ilike.%${debouncedSearchTerm}%,status.ilike.%${debouncedSearchTerm}%,contact_person.ilike.%${debouncedSearchTerm}%,phone_number.ilike.%${debouncedSearchTerm}%,invoices.invoice_number.ilike.%${debouncedSearchTerm}%,technician_name.ilike.%${debouncedSearchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      // Type assertion needed here because Supabase joins return arrays or single objects depending on query, but TS doesn't know for sure
      return (data as any[]).map((req, index) => ({
        ...req,
        no: index + 1,
        // Safe access to joined tables
        invoice_number: Array.isArray(req.invoices) ? req.invoices[0]?.invoice_number : req.invoices?.invoice_number,
        customer_name_from_customers: Array.isArray(req.customers) ? req.customers[0]?.customer_name : req.customers?.customer_name,
        company_name_from_customers: Array.isArray(req.customers) ? req.customers[0]?.company_name : req.customers?.company_name,
        phone_number_from_customers: Array.isArray(req.customers) ? req.customers[0]?.phone_number : req.customers?.phone_number,
        customer_type_from_customers: Array.isArray(req.customers) ? req.customers[0]?.customer_type : req.customers?.customer_type,
        
        // Ensure default values matching SchedulingRequestWithDetails
        customer_name: req.customer_name || "",
        full_address: req.full_address || "",
        contact_person: req.contact_person || "",
        phone_number: req.phone_number || "",
        type: req.type || SchedulingRequestType.INSTALLATION,
        product_category: req.product_category || undefined, 
        status: req.status || SchedulingRequestStatus.PENDING,
        technician_name: req.technician_name || undefined,
        // Map joined data to expected structure for SchedulingRequestWithDetails
        customers: Array.isArray(req.customers) ? req.customers[0] : req.customers,
        invoices: Array.isArray(req.invoices) ? req.invoices[0] : req.invoices,
      })) as SchedulingRequestWithDetails[];
    },
  });

  const { data: technicians, isLoading: loadingTechnicians } = useQuery<Technician[], Error>({
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

  // Use Edge Function for Approval
  const approveRequestMutation = useMutation({
    mutationFn: async ({ id, technician_name }: { id: string; technician_name: string }) => {
      const { data, error } = await supabase.functions.invoke('approve-scheduling-request', {
        body: JSON.stringify({ request_id: id, technician_name }),
      });
      if (error) throw error;
      if (data && data.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedulingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["schedules"] }); 
      showSuccess("Permintaan disetujui dan jadwal telah dibuat!");
      setIsApproveModalOpen(false);
      setTechnicianNameForApproval("");
      setTechnicianSearchInputForApproval("");
      setSelectedRequest(null);
    },
    onError: (err) => {
      showError(`Gagal menyetujui permintaan: ${err.message}`);
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

  const handleViewDetails = (request: SchedulingRequestWithDetails) => {
    setSelectedRequest(request);
    setIsViewDetailsOpen(true);
  };

  const handleCancelClick = (request: SchedulingRequestWithDetails) => {
    setSelectedRequest(request);
    setIsCancelModalOpen(true);
  };

  const handleApproveClick = (request: SchedulingRequestWithDetails) => {
    setSelectedRequest(request);
    setTechnicianNameForApproval(request.technician_name || ""); 
    setTechnicianSearchInputForApproval(request.technician_name || "");
    setIsApproveModalOpen(true); 
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

  const handleConfirmDelete = () => {
    if (selectedRequest) {
      deleteRequestMutation.mutate(selectedRequest.id);
    }
  };

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
              <TableHead>Kategori Produk</TableHead> {/* New TableHead */}
              <TableHead>Tanggal Diminta</TableHead>
              <TableHead>Nama Teknisi</TableHead>
              <TableHead>No. Invoice Terkait</TableHead>
              <TableHead>Kontak Person</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests?.map((request, index) => ( // Use 'requests' directly
              <TableRow key={request.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{request.sr_number || "-"}</TableCell>
                <TableCell>{request.customers?.customer_name || request.customer_name}</TableCell>
                <TableCell>{getTypeDisplay(request.type)}</TableCell>
                <TableCell>{getProductCategoryDisplay(request.product_category)}</TableCell> {/* New TableCell */}
                <TableCell>{format(new Date(request.requested_date), "dd-MM-yyyy")}</TableCell>
                <TableCell>{request.technician_name || "-"}</TableCell>
                <TableCell>{request.invoices?.invoice_number || "-"}</TableCell>
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
                    <Button variant="ghost" size="icon" onClick={() => handleEditRequest(request)} title="Edit Permintaan">
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}

                  {request.status === SchedulingRequestStatus.PENDING && (
                    <Button variant="ghost" size="icon" onClick={() => handleApproveClick(request)} title="Setujui Permintaan">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Button>
                  )}

                  {(request.status === SchedulingRequestStatus.PENDING ||
                    request.status === SchedulingRequestStatus.IN_PROGRESS ||
                    request.status === SchedulingRequestStatus.RESCHEDULED) && (
                    <Button variant="ghost" size="icon" onClick={() => handleCancelClick(request)} title="Batalkan Permintaan">
                      <Clock className="h-4 w-4" />
                    </Button>
                  )}

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

      {/* Approve Request Dialog */}
      {selectedRequest && (
        <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Setujui Permintaan Jadwal</DialogTitle>
              <DialogDescription>
                Pilih nama teknisi untuk permintaan jadwal ini. Jadwal akan otomatis dibuat.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (technicianNameForApproval.trim() === '') {
                showError('Nama teknisi wajib diisi.');
                return;
              }
              approveRequestMutation.mutate({ id: selectedRequest.id, technician_name: technicianNameForApproval });
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
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsApproveModalOpen(false)} disabled={approveRequestMutation.isPending}>
                  Batal
                </Button>
                <Button type="submit" disabled={approveRequestMutation.isPending || !technicianNameForApproval.trim()}>
                  {approveRequestMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Setujui & Buat Jadwal"}
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