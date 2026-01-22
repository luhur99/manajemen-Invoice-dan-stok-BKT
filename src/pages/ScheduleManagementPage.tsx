"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Schedule, ScheduleProductCategory, ScheduleType, ScheduleStatus } from "@/types/data";
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
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Edit, Trash2, PlusCircle, Search, Loader2, Share2, Printer, Eye } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";
import AddEditScheduleForm from "@/components/AddEditScheduleForm"; // Corrected import
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ScheduleManagementPage = () => {
  const queryClient = useQueryClient();
  const [isAddEditFormOpen, setIsAddEditFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: schedules, isLoading, error } = useQuery<Schedule[], Error>({
    queryKey: ["schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schedules")
        .select(`
          *,
          customers (customer_name, company_name, phone_number, address, customer_type)
        `) // Join customers table
        .order("schedule_date", { ascending: false });
      if (error) {
        showError("Gagal memuat jadwal.");
        throw error;
      }
      return data;
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("schedules").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Jadwal berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: (err) => {
      showError(`Gagal menghapus jadwal: ${err.message}`);
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) {
      deleteScheduleMutation.mutate(id);
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setIsAddEditFormOpen(true);
  };

  const handleAdd = () => {
    setEditingSchedule(null);
    setIsAddEditFormOpen(true);
  };

  const filteredSchedules = useMemo(() => {
    if (!schedules) return [];
    return schedules.filter((schedule) => {
      const searchLower = searchTerm.toLowerCase();
      const customerName = (schedule as any).customers?.customer_name || schedule.customer_name; // Use joined data
      return (
        schedule.do_number?.toLowerCase().includes(searchLower) ||
        customerName.toLowerCase().includes(searchLower) ||
        schedule.technician_name?.toLowerCase().includes(searchLower) ||
        schedule.type.toLowerCase().includes(searchLower) ||
        schedule.status.toLowerCase().includes(searchLower) ||
        format(new Date(schedule.schedule_date), "dd-MM-yyyy").includes(searchLower)
      );
    });
  }, [schedules, searchTerm]);

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
          Gagal memuat jadwal: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Jadwal</h1>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-sm">
          <Input
            type="text"
            placeholder="Cari jadwal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
        <Dialog open={isAddEditFormOpen} onOpenChange={setIsAddEditFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Jadwal
            </Button>
          </DialogTrigger>
          <AddEditScheduleForm
            isOpen={isAddEditFormOpen}
            onOpenChange={setIsAddEditFormOpen}
            onSuccess={() => {
              setIsAddEditFormOpen(false);
              setEditingSchedule(null);
            }}
            initialData={editingSchedule}
          />
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>DO Number</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Kategori Produk</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Teknisi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  Tidak ada jadwal ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredSchedules.map((schedule, index) => (
                <TableRow key={schedule.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Link to={`/schedules/${schedule.id}`} className="text-blue-600 hover:underline font-medium">
                        {schedule.do_number || "-"}
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const scheduleUrl = `${window.location.origin}/schedules/${schedule.id}`;
                          const whatsappText = encodeURIComponent(`Detail Jadwal:\nDO Number: ${schedule.do_number || '-'}\nPelanggan: ${schedule.customer_name}\nTanggal: ${format(new Date(schedule.schedule_date), 'dd-MM-yyyy')}\nWaktu: ${schedule.schedule_time || '-'}\nAlamat: ${schedule.address || '-'}\n\nLihat selengkapnya di: ${scheduleUrl}`);
                          window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
                        }}
                        className="h-7 w-7"
                      >
                        <Share2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(schedule.schedule_date), "dd-MM-yyyy")}</TableCell>
                  <TableCell>{schedule.product_category ? schedule.product_category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "-"}</TableCell>
                  <TableCell>{schedule.schedule_time || "-"}</TableCell>
                  <TableCell>{(schedule as any).customers?.customer_name || schedule.customer_name}</TableCell> {/* Use joined data */}
                  <TableCell>{schedule.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</TableCell>
                  <TableCell>{schedule.technician_name || "-"}</TableCell>
                  <TableCell>{schedule.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Buka menu</span>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(schedule)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(schedule.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(`/print/schedule/${schedule.id}`, '_blank')}>
                          <Printer className="mr-2 h-4 w-4" /> Cetak
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

      <AddEditScheduleForm
        isOpen={isAddEditFormOpen}
        onOpenChange={setIsAddEditFormOpen}
        onSuccess={() => {
          setIsAddEditFormOpen(false);
          setEditingSchedule(null);
        }}
        initialData={editingSchedule}
      />
    </div>
  );
};

export default ScheduleManagementPage;