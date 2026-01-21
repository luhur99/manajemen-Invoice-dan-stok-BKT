"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, PlusCircle, Edit, Trash2, Eye, FileText, CheckCircle, ReceiptText, Printer } from "lucide-react"; // Added Printer
import { showSuccess, showError } from "@/utils/toast";
import AddScheduleForm from "@/components/AddScheduleForm";
import EditScheduleForm from "@/components/EditScheduleForm";
import ViewScheduleDetailsDialog from "@/components/ViewScheduleDetailsDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { ScheduleWithDetails, ScheduleStatus } from "@/types/data";
import ScheduleDocumentUpload from "@/components/ScheduleDocumentUpload";
import AddInvoiceForm from "@/components/AddInvoiceForm";

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
  const [startDate, setStartDate] = React.useState<string>(""); // Date filter
  const [endDate, setEndDate] = React.useState<string>("");     // Date filter

  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = React.useState(false);
  const [selectedSchedule, setSelectedSchedule] = React.useState<ScheduleWithDetails | null>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = React.useState(false);
  const [scheduleToView, setScheduleToView] = React.useState<ScheduleWithDetails | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = React.useState(false);
  const [scheduleForInvoiceCreation, setScheduleForInvoiceCreation] = React.useState<ScheduleWithDetails | null>(null);

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
        no: index + 1,
        invoice_number: schedule.invoices?.invoice_number || "-",
        sr_number: schedule.scheduling_requests?.sr_number || "-",
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

  const deleteScheduleMutation = useMutation({
    mutationFn: async (scheduleId: string) => {
      const { error } = await supabase
        .from("schedules")
        .delete()
        .eq("id", scheduleId);
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess("Jadwal berhasil dihapus!");
      setIsDeleteModalOpen(false);
      setSelectedSchedule(null);
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: (err: any) => {
      showError(`Gagal menghapus jadwal: ${err.message}`);
      console.error("Error deleting schedule:", err);
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

  const handlePrintClick = (scheduleId: string) => {
    window.open(`/print/schedule/${scheduleId}`, '_blank');
  };

  const handleConfirmComplete = () => {
    if (selectedSchedule) {
      completeScheduleMutation.mutate(selectedSchedule.id);
    }
  };

  const handleCreateInvoiceClick = (schedule: ScheduleWithDetails) => {
    setScheduleForInvoiceCreation(schedule);
    setIsCreateInvoiceModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSchedule) {
      deleteScheduleMutation.mutate(selectedSchedule.id);
    }
  };

  const filteredSchedules = schedules?.filter((item) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesSearch =
      item.customer_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.address?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.technician_name?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.type.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.product_category?.toLowerCase().includes(lowerCaseSearchTerm) || // Include product_category in search
      item.status.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.phone_number?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.courier_service?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.invoice_number?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.do_number?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.sr_number?.toLowerCase().includes(lowerCaseSearchTerm);

    // Date Filtering
    let matchesDate = true;
    if (startDate && endDate) {
      const itemDate = new Date(item.schedule_date);
      matchesDate = isWithinInterval(itemDate, {
        start: startOfDay(new Date(startDate)),
        end: endOfDay(new Date(endDate))
      });
    } else if (startDate) {
      const itemDate = new Date(item.schedule_date);
      matchesDate = itemDate >= startOfDay(new Date(startDate));
    } else if (endDate) {
      const itemDate = new Date(item.schedule_date);
      matchesDate = itemDate <= endOfDay(new Date(endDate));
    }

    return matchesSearch && matchesDate;
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

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Cari jadwal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <div className="flex items-center gap-2">
            <Input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              className="w-auto"
              title="Dari Tanggal"
            />
            <span className="text-gray-500">-</span>
            <Input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              className="w-auto"
              title="Sampai Tanggal"
            />
          </div>
        </div>
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
              <TableHead>Tanggal</TableHead>
              <TableHead>Kategori Produk</TableHead> {/* New TableHead */}
              <TableHead>Waktu</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Teknisi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchedules?.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{schedule.no}</TableCell>
                <TableCell>{schedule.do_number || "-"}</TableCell>
                <TableCell>{format(new Date(schedule.schedule_date), "dd-MM-yyyy")}</TableCell>
                <TableCell>{schedule.product_category ? schedule.product_category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "-"}</TableCell> {/* New TableCell */}
                <TableCell>{schedule.schedule_time || "-"}</TableCell>
                <TableCell>{schedule.type}</TableCell>
                <TableCell>{schedule.customer_name}</TableCell>
                <TableCell>{schedule.technician_name || "-"}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                    {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="flex space-x-2 justify-center">
                  <Button variant="ghost" size="icon" onClick={() => handlePrintClick(schedule.id)} title="Cetak Surat Jalan/SPK">
                    <Printer className="h-4 w-4 text-blue-600" />
                  </Button>
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
                  {schedule.status === ScheduleStatus.COMPLETED && (
                    <Button variant="outline" size="icon" onClick={() => handleCreateInvoiceClick(schedule)} title="Buat Invoice">
                      <ReceiptText className="h-4 w-4 text-purple-600" />
                    </Button>
                  )}
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

      {/* Add Invoice Form (triggered by "Buat Invoice" button) */}
      {scheduleForInvoiceCreation && (
        <AddInvoiceForm
          isOpen={isCreateInvoiceModalOpen}
          onOpenChange={setIsCreateInvoiceModalOpen}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            fetchSchedules();
          }}
          initialSchedule={scheduleForInvoiceCreation}
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
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={deleteScheduleMutation.isPending}>Batal</Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleteScheduleMutation.isPending}>
              {deleteScheduleMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Hapus"}
            </Button>
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