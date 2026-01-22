"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format, parseISO, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { PurchaseRequest, PurchaseRequestStatus, Product, WarehouseCategoryEnum, Supplier, StockEventType, PurchaseRequestWithDetails } from "@/types/data";
import { Edit, Trash2, PlusCircle, Search, Loader2, Eye, UploadCloud } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";
import AddPurchaseRequestForm from "@/components/AddPurchaseRequestForm";
import EditPurchaseRequestForm from "@/components/EditPurchaseRequestForm";
import ViewPurchaseRequestDetailsDialog from "@/components/ViewPurchaseRequestDetailsDialog";
import PurchaseRequestUpload from "@/components/PurchaseRequestUpload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const getStatusBadgeClass = (status: PurchaseRequestStatus) => {
  switch (status) {
    case PurchaseRequestStatus.APPROVED:
      return "bg-green-100 text-green-800";
    case PurchaseRequestStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case PurchaseRequestStatus.REJECTED:
      return "bg-red-100 text-red-800";
    case PurchaseRequestStatus.WAITING_FOR_RECEIVED:
      return "bg-blue-100 text-blue-800";
    case PurchaseRequestStatus.CLOSED:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusDisplay = (status: PurchaseRequestStatus) => {
  switch (status) {
    case PurchaseRequestStatus.APPROVED: return "Disetujui";
    case PurchaseRequestStatus.PENDING: return "Pending";
    case PurchaseRequestStatus.REJECTED: return "Ditolak";
    case PurchaseRequestStatus.WAITING_FOR_RECEIVED: return "Menunggu Diterima";
    case PurchaseRequestStatus.CLOSED: return "Ditutup";
    default: return "Tidak Diketahui";
  }
};

const PurchaseRequestPage = () => {
  const queryClient = useQueryClient();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedPurchaseRequest, setSelectedPurchaseRequest] = useState<PurchaseRequestWithDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<PurchaseRequestStatus | "all">("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { data: purchaseRequests, isLoading, error } = useQuery<PurchaseRequestWithDetails[], Error>({
    queryKey: ["purchaseRequests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchase_requests")
        .select(`
          *,
          products (nama_barang, kode_barang, satuan),
          suppliers (name)
        `)
        .order("created_at", { ascending: false });
      if (error) {
        showError("Gagal memuat pengajuan pembelian.");
        throw error;
      }
      return data as PurchaseRequestWithDetails[];
    },
  });

  const deletePurchaseRequestMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("purchase_requests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Pengajuan pembelian berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["purchaseRequests"] });
    },
    onError: (err) => {
      showError(`Gagal menghapus pengajuan pembelian: ${err.message}`);
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengajuan pembelian ini?")) {
      deletePurchaseRequestMutation.mutate(id);
    }
  };

  const handleEdit = (request: PurchaseRequestWithDetails) => {
    setSelectedPurchaseRequest(request);
    setIsEditFormOpen(true);
  };

  const handleViewDetails = (request: PurchaseRequestWithDetails) => {
    setSelectedPurchaseRequest(request);
    setIsViewDetailsOpen(true);
  };

  const handleUploadDocument = (request: PurchaseRequestWithDetails) => {
    setSelectedPurchaseRequest(request);
    setIsUploadDialogOpen(true);
  };

  const filteredPurchaseRequests = useMemo(() => {
    if (!purchaseRequests) return [];
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return purchaseRequests.filter((request) => {
      const matchesSearch =
        request.pr_number?.toLowerCase().includes(lowerCaseSearchTerm) ||
        request.item_name.toLowerCase().includes(lowerCaseSearchTerm) ||
        request.item_code.toLowerCase().includes(lowerCaseSearchTerm) ||
        request.suppliers?.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
        getStatusDisplay(request.status).toLowerCase().includes(lowerCaseSearchTerm) ||
        request.notes?.toLowerCase().includes(lowerCaseSearchTerm);

      const matchesStatus =
        selectedStatus === "all" || request.status === selectedStatus;

      const requestDate = parseISO(request.created_at);
      const matchesDateRange = dateRange?.from
        ? isWithinInterval(requestDate, {
            start: startOfDay(dateRange.from),
            end: dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from),
          })
        : true;

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [purchaseRequests, searchTerm, selectedStatus, dateRange]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Gagal memuat pengajuan pembelian: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <React.Fragment>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Manajemen Pengajuan Pembelian</h1>

        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="relative w-full max-w-sm">
              <Input
                type="text"
                placeholder="Cari pengajuan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
            <Select
              onValueChange={(value: PurchaseRequestStatus | "all") => setSelectedStatus(value)}
              value={selectedStatus}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {Object.values(PurchaseRequestStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {getStatusDisplay(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          </div>
          <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddFormOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pengajuan
              </Button>
            </DialogTrigger>
            <AddPurchaseRequestForm
              isOpen={isAddFormOpen}
              onOpenChange={setIsAddFormOpen}
              onSuccess={() => setIsAddFormOpen(false)}
            />
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Nomor PR</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Kode Item</TableHead>
                <TableHead>Kuantitas</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchaseRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    Tidak ada pengajuan pembelian ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPurchaseRequests.map((request, index) => (
                  <TableRow key={request.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{request.pr_number || "-"}</TableCell>
                    <TableCell>{request.item_name}</TableCell>
                    <TableCell>{request.item_code}</TableCell>
                    <TableCell>{request.quantity} {request.satuan || ""}</TableCell>
                    <TableCell>{request.suppliers?.name || "-"}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(request.status)}`}>
                        {getStatusDisplay(request.status)}
                      </span>
                    </TableCell>
                    <TableCell>{format(parseISO(request.created_at), "dd-MM-yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(request)}>
                            <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(request)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUploadDocument(request)}>
                            <UploadCloud className="mr-2 h-4 w-4" /> Unggah Dokumen
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(request.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {selectedPurchaseRequest && (
          <React.Fragment>
            <EditPurchaseRequestForm
              isOpen={isEditFormOpen}
              onOpenChange={setIsEditFormOpen}
              onSuccess={() => setIsEditFormOpen(false)}
              initialData={selectedPurchaseRequest}
            />
            <ViewPurchaseRequestDetailsDialog
              isOpen={isViewDetailsOpen}
              onClose={() => setIsViewDetailsOpen(false)}
              request={selectedPurchaseRequest}
            />
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Unggah Dokumen Pengajuan Pembelian</DialogTitle>
                  <DialogDescription>
                    Unggah dokumen terkait untuk pengajuan pembelian {selectedPurchaseRequest.pr_number || selectedPurchaseRequest.item_name}.
                  </DialogDescription>
                </DialogHeader>
                <PurchaseRequestUpload
                  isOpen={isUploadDialogOpen}
                  onOpenChange={setIsUploadDialogOpen}
                  purchaseRequestId={selectedPurchaseRequest.id}
                  onSuccess={(url) => {
                    setSelectedPurchaseRequest((prev) => prev ? { ...prev, document_url: url } : null);
                    setIsUploadDialogOpen(false);
                  }}
                  currentDocumentUrl={selectedPurchaseRequest.document_url}
                />
              </DialogContent>
            </Dialog>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};

export default PurchaseRequestPage;