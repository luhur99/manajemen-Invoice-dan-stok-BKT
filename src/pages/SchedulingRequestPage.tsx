"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AddEditSchedulingRequestForm } from "@/components/AddEditSchedulingRequestForm";
import ViewSchedulingRequestDetailsDialog from "@/components/ViewSchedulingRequestDetailsDialog";
import { format } from "date-fns";
import { PencilIcon, EyeIcon, TrashIcon, Loader2, PlusCircle } from "lucide-react"; // Added Loader2, PlusCircle
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Import useQuery, useMutation, useQueryClient
import { SchedulingRequestWithDetails, SchedulingRequestStatus, SchedulingRequestType, formatEnumForDisplay } from "@/types/data"; // Import types
import { Input } from "@/components/ui/input"; // Import Input for search
import { useDebounce } from "@/hooks/use-debounce"; // Import useDebounce
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import { DateRangePicker } from "@/components/ui/date-range-picker"; // Import DateRangePicker
import { DateRange } from "react-day-picker";
import { startOfDay, endOfDay } from "date-fns";

export default function SchedulingRequestPage() {
  const queryClient = useQueryClient(); // Initialize queryClient
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<SchedulingRequestWithDetails | null>(null);
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [viewingRequest, setViewingRequest] = useState<SchedulingRequestWithDetails | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [filterStatus, setFilterStatus] = useState<SchedulingRequestStatus | "all">("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { data: schedulingRequests, isLoading, error } = useQuery<SchedulingRequestWithDetails[], Error>({
    queryKey: ["schedulingRequests", debouncedSearchTerm, filterStatus, dateRange], // Include filters in query key
    queryFn: async () => {
      let query = supabase
        .from("scheduling_requests")
        .select(`
          *,
          customers (
            customer_name,
            company_name,
            phone_number,
            customer_type
          ),
          invoices (
            invoice_number
          )
        `)
        .order("created_at", { ascending: false });

      if (debouncedSearchTerm) {
        query = query.or(
          `sr_number.ilike.%${debouncedSearchTerm}%,customer_name.ilike.%${debouncedSearchTerm}%,company_name.ilike.%${debouncedSearchTerm}%,full_address.ilike.%${debouncedSearchTerm}%,technician_name.ilike.%${debouncedSearchTerm}%`
        );
      }

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      if (dateRange?.from) {
        query = query.gte("requested_date", format(startOfDay(dateRange.from), "yyyy-MM-dd"));
      }
      if (dateRange?.to) {
        query = query.lte("requested_date", format(endOfDay(dateRange.to), "yyyy-MM-dd"));
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }
      return data.map(req => ({
        ...req,
        customers: Array.isArray(req.customers) ? req.customers[0] : req.customers,
        invoices: Array.isArray(req.invoices) ? req.invoices[0] : req.invoices,
      })) as SchedulingRequestWithDetails[];
    },
  });

  const deleteRequestMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("scheduling_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Permintaan jadwal berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["schedulingRequests"] });
      setIsDeleteDialogOpen(false);
      setRequestToDelete(null);
    },
    onError: (err: any) => {
      toast.error(`Gagal menghapus permintaan jadwal: ${err.message}`);
    },
  });

  const handleAddClick = () => {
    setEditingRequest(null);
    setIsAddEditDialogOpen(true);
  };

  const handleEditClick = (request: SchedulingRequestWithDetails) => {
    setEditingRequest(request);
    setIsAddEditDialogOpen(true);
  };

  const handleViewDetailsClick = (request: SchedulingRequestWithDetails) => {
    setViewingRequest(request);
    setIsViewDetailsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setRequestToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (requestToDelete) {
      deleteRequestMutation.mutate(requestToDelete);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Permintaan Jadwal Teknis</h1>
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Cari permintaan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select onValueChange={(value: SchedulingRequestStatus | "all") => setFilterStatus(value)} value={filterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {Object.values(SchedulingRequestStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {formatEnumForDisplay(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>
        <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddClick}>
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Permintaan Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRequest ? "Edit Permintaan Jadwal" : "Tambah Permintaan Jadwal Baru"}</DialogTitle>
            </DialogHeader>
            <AddEditSchedulingRequestForm
              request={editingRequest}
              onClose={() => setIsAddEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. SR</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedulingRequests?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Tidak ada permintaan jadwal ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              schedulingRequests?.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.sr_number || "-"}</TableCell>
                  <TableCell>{formatEnumForDisplay(request.type)}</TableCell>
                  <TableCell>{request.customer_name || request.customers?.customer_name || "-"}</TableCell>
                  <TableCell>{format(new Date(request.requested_date), "dd-MM-yyyy")}</TableCell>
                  <TableCell>{formatEnumForDisplay(request.status)}</TableCell>
                  <TableCell className="flex space-x-2 justify-center">
                    <Button variant="outline" size="icon" onClick={() => handleViewDetailsClick(request)} title="Lihat Detail">
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleEditClick(request)} title="Edit Permintaan">
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(request.id)} title="Hapus Permintaan">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {viewingRequest && (
        <ViewSchedulingRequestDetailsDialog
          request={viewingRequest}
          isOpen={isViewDetailsDialogOpen}
          onClose={() => setIsViewDetailsDialogOpen(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Permintaan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus permintaan jadwal "{requestToDelete}"? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteRequestMutation.isPending}>
              {deleteRequestMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Hapus"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}