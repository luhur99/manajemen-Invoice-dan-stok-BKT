import React, { useState } from "react";
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
import { useDebounce } from "@/hooks/use-debounce"; // Import useDebounce

const ScheduleManagementPage = () => {
  const queryClient = useQueryClient();
  const [isAddEditFormOpen, setIsAddEditFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Apply debounce

  const { data: schedules, isLoading, error } = useQuery<Schedule[], Error>({
    queryKey: ["schedules", debouncedSearchTerm], // Include debounced search term
    queryFn: async () => {
      let query = supabase
        .from("schedules")
        .select(`
          id,
          user_id,
          schedule_date,
          schedule_time,
          type,
          customer_name,
          address,
          technician_name,
          invoice_id,
          status,
          notes,
          created_at,
          phone_number,
          courier_service,
          document_url,
          scheduling_request_id,
          do_number,
          updated_at,
          product_category,
          customer_id,
          customers (customer_name)
        `) // Optimized select statement, only customer_name from customers
        .order("schedule_date", { ascending: false });

      if (debouncedSearchTerm) {
        query = query.or(
          `do_number.ilike.%${debouncedSearchTerm}%,customer_name.ilike.%${debouncedSearchTerm}%,technician_name.ilike.%${debouncedSearchTerm}%,type.ilike.%${debouncedSearchTerm}%,status.ilike.%${debouncedSearchTerm}%`
        );
      }

      const { data, error } = await query;
      if (error) {
        showError("Gagal memuat jadwal.");
        throw error;
      }
      // Map the data to ensure it matches the Schedule interface, providing defaults for missing fields
      return data.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        schedule_date: item.schedule_date,
        schedule_time: item.schedule_time,
        type: item.type,
        customer_name: item.customer_name,
        address: item.address,
        technician_name: item.technician_name,
        invoice_id: item.invoice_id,
        status: item.status,
        notes: item.notes,
        created_at: item.created_at,
        phone_number: item.phone_number,
        courier_service: item.courier_service,
        document_url: item.document_url,
        scheduling_request_id: item.scheduling_request_id,
        do_number: item.do_number,
        updated_at: item.updated_at,
        product_category: item.product_category,
        customer_id: item.customer_id,
        // Add any other fields from Schedule interface with default/null if not selected
      })) as Schedule[];
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
            {schedules?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  Tidak ada jadwal ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              schedules?.map((schedule, index) => (
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
                  <TableCell>{schedule.customer_name}</TableCell> {/* Use schedule.customer_name directly */}
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
    </div>
  );
};

export default ScheduleManagementPage;