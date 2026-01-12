"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Schedule } from "@/types/data";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import AddScheduleForm from "@/components/AddScheduleForm";
import EditScheduleForm from "@/components/EditScheduleForm";
import ScheduleDocumentUpload from "@/components/ScheduleDocumentUpload"; // Import new component
import PaginationControls from "@/components/PaginationControls";
import { format } from "date-fns";
import { Loader2, Edit, Trash2, PlusCircle } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Import DialogContent, DialogHeader, DialogTitle

const ScheduleManagementPage = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false); // State for AddScheduleForm dialog

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("schedules")
        .select("*")
        .order("schedule_date", { ascending: false })
        .order("schedule_time", { ascending: true });

      if (error) {
        throw error;
      }

      setSchedules(data as Schedule[]);
      setFilteredSchedules(data as Schedule[]);
      setCurrentPage(1);
    } catch (err: any) {
      setError(`Gagal memuat data jadwal: ${err.message}`);
      console.error("Error fetching schedules:", err);
      showError("Gagal memuat data jadwal.");
      setSchedules([]);
      setFilteredSchedules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = schedules.filter(item =>
      item.customer_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.type.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.technician_name?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.address?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.status.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.phone_number?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.courier_service?.toLowerCase().includes(lowerCaseSearchTerm) ||
      format(new Date(item.schedule_date), "dd-MM-yyyy").includes(lowerCaseSearchTerm)
    );
    setFilteredSchedules(filtered);
    setCurrentPage(1);
  }, [searchTerm, schedules]);

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("schedules")
        .delete()
        .eq("id", scheduleId);

      if (error) {
        throw error;
      }

      showSuccess("Jadwal berhasil dihapus!");
      fetchSchedules(); // Refresh the list
    } catch (err: any) {
      showError(`Gagal menghapus jadwal: ${err.message}`);
      console.error("Error deleting schedule:", err);
    }
  };

  const handleEditClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsEditFormOpen(true);
  };

  const handleDocumentUploadSuccess = async (scheduleId: string, fileUrl: string) => {
    // Update the schedule in the database with the new document_url
    const { error } = await supabase
      .from("schedules")
      .update({ document_url: fileUrl })
      .eq("id", scheduleId);

    if (error) {
      console.error("Error updating schedule with document URL:", error);
      showError("Gagal menyimpan URL dokumen ke database.");
      return;
    }
    showSuccess("URL dokumen jadwal berhasil diperbarui!");
    fetchSchedules(); // Refresh data to show the updated URL
  };

  const handleDocumentRemoveSuccess = async (scheduleId: string) => {
    // Update the schedule in the database, setting document_url to null
    const { error } = await supabase
      .from("schedules")
      .update({ document_url: null })
      .eq("id", scheduleId);

    if (error) {
      console.error("Error removing document URL from schedule:", error);
      showError("Gagal menghapus URL dokumen dari database.");
      return;
    }
    showSuccess("URL dokumen jadwal berhasil dihapus!");
    fetchSchedules(); // Refresh data
  };

  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredSchedules.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Manajemen Jadwal</CardTitle>
          <CardDescription>Kelola jadwal instalasi dan pengiriman barang.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">Memuat data jadwal...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-2xl font-semibold">Manajemen Jadwal</CardTitle>
          <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" /> Tambah Jadwal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Buat Jadwal Baru</DialogTitle>
              </DialogHeader>
              <AddScheduleForm onSuccess={fetchSchedules} />
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>Kelola jadwal instalasi dan pengiriman barang.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
        <Input
          type="text"
          placeholder="Cari berdasarkan konsumen, tipe, teknisi, alamat, status, No WA, atau Jasa Kurir..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        {filteredSchedules.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Konsumen</TableHead>
                    <TableHead>No WA</TableHead>
                    <TableHead>Jasa Kurir</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Teknisi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dokumen</TableHead> {/* New column for document */}
                    <TableHead>Catatan</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>{format(new Date(schedule.schedule_date), "dd-MM-yyyy")}</TableCell>
                      <TableCell>{schedule.schedule_time || "-"}</TableCell>
                      <TableCell>{schedule.type}</TableCell>
                      <TableCell>{schedule.customer_name}</TableCell>
                      <TableCell>{schedule.phone_number || "-"}</TableCell>
                      <TableCell>{schedule.courier_service || "-"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{schedule.address || "-"}</TableCell>
                      <TableCell>{schedule.technician_name || "-"}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          schedule.status === 'completed' ? 'bg-green-100 text-green-800' :
                          schedule.status === 'in progress' ? 'bg-blue-100 text-blue-800' :
                          schedule.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <ScheduleDocumentUpload
                          scheduleId={schedule.id}
                          currentFileUrl={schedule.document_url}
                          onUploadSuccess={(fileUrl) => handleDocumentUploadSuccess(schedule.id, fileUrl)}
                          onRemoveSuccess={() => handleDocumentRemoveSuccess(schedule.id)}
                        />
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{schedule.notes || "-"}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleEditClick(schedule)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteSchedule(schedule.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">Tidak ada data jadwal yang tersedia atau cocok dengan pencarian Anda.</p>
        )}
      </CardContent>

      {selectedSchedule && (
        <EditScheduleForm
          schedule={selectedSchedule}
          isOpen={isEditFormOpen}
          onOpenChange={setIsEditFormOpen}
          onSuccess={fetchSchedules}
        />
      )}
    </Card>
  );
};

export default ScheduleManagementPage;