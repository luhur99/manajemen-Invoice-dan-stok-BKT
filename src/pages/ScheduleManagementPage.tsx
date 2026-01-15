"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, PlusCircle, Edit, Trash2, Eye, FileText, CheckCircle } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import AddScheduleForm from "@/components/AddScheduleForm";
import EditScheduleForm from "@/components/EditScheduleForm";
import ViewScheduleDetailsDialog from "@/components/ViewScheduleDetailsDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ScheduleWithDetails, ScheduleStatus } from "@/types/data";
import ScheduleDocumentUpload from "@/components/ScheduleDocumentUpload";

const getStatusColor = (status: ScheduleStatus) => {
  switch (status) {
    case ScheduleStatus.SCHEDULED:
      return "bg-blue-100 text-blue-800";
    case ScheduleStatus.IN_PROGRESS:
      return "bg-yellow-100 text-yellow-800";
    case ScheduleStatus.COMPLETED:
      return "bg-green-100 text-green-800";
    case ScheduleStatus.CANCELLED:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ScheduleManagementPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = React.useState(false); // New state for complete dialog
  const [selectedSchedule, setSelectedSchedule] = React.useState<ScheduleWithDetails | null>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = React.useState(false);
  const [scheduleToView, setScheduleToView] = React.useState<ScheduleWithDetails | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);

  const { data: schedules, isLoading, error, refetch: fetchSchedules } = useQuery<ScheduleWithDetails[], Error>({
    queryKey: ["schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schedules")
        .select(`
          *,
          invoices (invoice_number),
          scheduling_requests (sr_number)
        `)
        .order("schedule_date", { ascending: false });

      if (error) throw error;

      return data.map((schedule, index) => ({
        ...schedule,
        no: index + 1, // Add sequential number
        invoice_number: schedule.invoices?.invoice_number || "-",
        sr_number: schedule.scheduling_requests?.sr_number || "-", // Get SR number
      }));
    },
  });

  const completeScheduleMutation = useMutation({
    mutationFn: async (scheduleId: string) => {
      const { error } = await supabase
        .from("schedules")
        .update({ status: ScheduleStatus.COMPLETED, updated_at: new Date().toISOString() })
        .eq("id", scheduleId);
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess(`Jadwal berhasil diselesaikan!`);
      setIsCompleteModalOpen(false);
      setSelectedSchedule(null);
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: (err: any) => {
      showError(`Gagal menyelesaikan jadwal: ${err.message}`);
      console.error("Error completing schedule:", err);
    },
  });

  const handleEditClick = (schedule: ScheduleWithDetails) => {
    setSelectedSchedule(schedule);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (schedule: ScheduleWithDetails) => {
    setSelectedSchedule(schedule);
    setIsDeleteModalOpen(true);
  };

  const handleViewDetails = (schedule: ScheduleWithDetails) => {
    setScheduleToView(schedule);
    setIsViewDetailsOpen(true);
  };

  const handleUploadClick = (schedule: ScheduleWithDetails) => {
    setSelectedSchedule(schedule);
    setIsUploadModalOpen(true);
  };

  const handleCompleteClick = (schedule: ScheduleWithDetails) => {
    setSelectedSchedule(schedule);
    setIsCompleteModalOpen(true);
  };

  const handleConfirmComplete = () => {
    if (selectedSchedule) {
      completeScheduleMutation.mutate(selectedSchedule.id);
    }
  };

  const handleDeleteSchedule = async () => {
    if (!selectedSchedule) return;

    try {
      const { error } = await supabase
        .from("schedules")
        .delete()
        .eq("id", selectedSchedule.id);

      if (error) throw error;

      showSuccess("Jadwal berhasil dihapus!");
      setIsDeleteModalOpen(false);
      fetchSchedules();
    } catch (err: any) {
      showError(`Gagal menghapus jadwal: ${err.message}`);
      console.error("Error deleting schedule:", err);
    }
  };

  const filteredSchedules = schedules?.filter((item) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      item.customer_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.address?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.technician_name?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.type.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.status.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.phone_number?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.courier_service?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.invoice_number?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.do_number?.toLowerCase().includes(lowerCaseSearchTerm) || // Search by DO number
      item.sr_number?.toLowerCase().includes(lowerCaseSearchTerm) || // Search by SR number
      format(new Date(item.schedule_date), "dd-MM-yyyy").includes(lowerCaseSearchTerm)
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading schedules: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Jadwal</h1>

      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Cari jadwal..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Jadwal
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>No. DO</TableHead>
              {/* <TableHead>No. SR</TableHead> Removed as per user request */}
              <TableHead>Tanggal</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Pelanggan</TableHead>
              {/* <TableHead>Alamat</TableHead> Removed as per user request */}
              <TableHead>Teknisi</TableHead>
              {/* <TableHead>No. Invoice Terkait</TableHead> Removed as per user request */}
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchedules?.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{schedule.no}</TableCell>
                <TableCell>{schedule.do_number || "-"}</TableCell>
                {/* <TableCell>{schedule.sr_number || "-"}</TableCell> Removed as per user request */}
                <TableCell>{format(new Date(schedule.schedule_date), "dd-MM-yyyy")}</TableCell>
                <TableCell>{schedule.schedule_time || "-"}</TableCell>
                <TableCell>{schedule.type}</TableCell>
                <TableCell>{schedule.customer_name}</TableCell>
                {/* <TableCell className="max-w-[200px] truncate">{schedule.address || "-"}</TableCell> Removed as per user request */}
                <TableCell>{schedule.technician_name || "-"}</TableCell>
                {/* <TableCell>{schedule.invoice_number || "-"}</TableCell> Removed as per user request */}
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                    {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="flex space-x-2 justify-center">
                  <Button variant="ghost" size="icon" onClick={() => handleViewDetails(schedule)} title="Lihat Detail">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(schedule)} title="Edit Jadwal">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {schedule.status !== ScheduleStatus.COMPLETED && schedule.status !== ScheduleStatus.CANCELLED && (
                    <Button variant="outline" size="icon" onClick={() => handleCompleteClick(schedule)} title="Selesaikan Jadwal">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Button>
                  )}
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(schedule)} title="Hapus Jadwal">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleUploadClick(schedule)} title="Unggah Dokumen">
                    <FileText className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddScheduleForm
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={fetchSchedules}
      />

      {selectedSchedule && (
        <EditScheduleForm
          schedule={selectedSchedule}
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSuccess={fetchSchedules}
        />
      )}

      {scheduleToView && (
        <ViewScheduleDetailsDialog
          schedule={scheduleToView}
          isOpen={isViewDetailsOpen}
          onOpenChange={setIsViewDetailsOpen}
        />
      )}

      {selectedSchedule && (
        <ScheduleDocumentUpload
          scheduleId={selectedSchedule.id}
          currentDocumentUrl={selectedSchedule.document_url}
          isOpen={isUploadModalOpen}
          onOpenChange={setIsUploadModalOpen}
          onSuccess={fetchSchedules}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Jadwal</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus jadwal untuk "{selectedSchedule?.customer_name}" pada tanggal {selectedSchedule?.schedule_date ? format(new Date(selectedSchedule.schedule_date), "dd-MM-yyyy") : "-"}? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDeleteSchedule}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Schedule Confirmation Modal */}
      <Dialog open={isCompleteModalOpen} onOpenChange={setIsCompleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Selesaikan Jadwal</DialogTitle>
            <DialogDescription>
              Anda akan Menyelesaikan pekerjaan dengan no DO: <strong>{selectedSchedule?.do_number || "-"}</strong>. Apakah Anda yakin?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCompleteModalOpen(false)} disabled={completeScheduleMutation.isPending}>Batal</Button>
            <Button onClick={handleConfirmComplete} disabled={completeScheduleMutation.isPending}>
              {completeScheduleMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Selesaikan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleManagementPage;