import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Loader2, PlusCircle, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react";
import { useDebounce } from "react-use";
import AddEditTechnicianForm from "@/components/AddEditTechnicianForm"; // Corrected import path
import ViewTechnicianDetailsDialog from "@/components/ViewTechnicianDetailsDialog"; // Corrected import path
import PaginationControls from "@/components/PaginationControls";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Technician } from "@/types/data"; // Import Technician type
import { formatDateSafely } from "@/lib/utils"; // Import formatDateSafely

const ITEMS_PER_PAGE = 10;

const TechnicianManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddTechnicianDialogOpen, setIsAddTechnicianDialogOpen] = useState(false);
  const [isEditTechnicianDialogOpen, setIsEditTechnicianDialogOpen] = useState(false);
  const [isViewTechnicianDetailsDialogOpen, setIsViewTechnicianDetailsDialogOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null); // Use Technician type

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
    setCurrentPage(1);
  }, 500, [searchTerm]);

  const queryClient = useQueryClient();

  const { data: techniciansData, isLoading, isError, error } = useQuery<{ data: Technician[]; count: number }, Error>({
    queryKey: ["technicians", debouncedSearchTerm, currentPage],
    queryFn: async () => {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from("technicians")
        .select(
          `
          id,
          name,
          phone_number,
          type,
          address,
          city,
          province,
          created_at,
          updated_at
        `,
          { count: "exact" }
        );

      if (debouncedSearchTerm) {
        query = query.or(
          `name.ilike.%${debouncedSearchTerm}%,phone_number.ilike.%${debouncedSearchTerm}%`
        );
      }

      const { data, error, count } = await query.range(start, end);

      if (error) throw error;
      return { data: data as Technician[], count };
    },
  });

  const deleteTechnicianMutation = useMutation({
    mutationFn: async (id: string) => { // Explicitly type id
      const { error } = await supabase.from("technicians").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
      toast.success("Teknisi berhasil dihapus.");
    },
    onError: (error) => {
      toast.error(`Gagal menghapus teknisi: ${error.message}`);
    },
  });

  const handleDeleteTechnician = (id: string) => { // Explicitly type id
    deleteTechnicianMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  const technicians = techniciansData?.data || [];
  const totalCount = techniciansData?.count || 0;
  const pageCount = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Manajemen Teknisi</CardTitle>
        <Dialog open={isAddTechnicianDialogOpen} onOpenChange={setIsAddTechnicianDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Tambah Teknisi</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Tambah Teknisi Baru</DialogTitle>
            </DialogHeader>
            <AddEditTechnicianForm onSuccess={() => setIsAddTechnicianDialogOpen(false)} isOpen={isAddTechnicianDialogOpen} onOpenChange={setIsAddTechnicianDialogOpen} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Cari teknisi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Nomor Telepon</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Kota</TableHead>
                <TableHead>Dibuat Pada</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicians.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Tidak ada teknisi ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                technicians.map((technician) => (
                  <TableRow key={technician.id}>
                    <TableCell className="font-medium">{technician.name}</TableCell>
                    <TableCell>{technician.phone_number || "-"}</TableCell>
                    <TableCell>{technician.type}</TableCell>
                    <TableCell>{technician.city || "-"}</TableCell>
                    <TableCell>
                      {formatDateSafely(technician.created_at, "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTechnician(technician);
                              setIsViewTechnicianDetailsDialogOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" /> Lihat
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTechnician(technician);
                              setIsEditTechnicianDialogOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4" /> Hapus
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tindakan ini tidak dapat dibatalkan. Ini akan menghapus teknisi secara permanen.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteTechnician(technician.id)}>
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <PaginationControls
          currentPage={currentPage}
          pageCount={pageCount}
          onPageChange={setCurrentPage}
        />

        {/* Edit Technician Dialog */}
        <Dialog open={isEditTechnicianDialogOpen} onOpenChange={setIsEditTechnicianDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Teknisi</DialogTitle>
            </DialogHeader>
            {selectedTechnician && (
              <AddEditTechnicianForm // Re-using AddEditTechnicianForm for editing
                initialData={selectedTechnician}
                onSuccess={() => setIsEditTechnicianDialogOpen(false)}
                isOpen={isEditTechnicianDialogOpen}
                onOpenChange={setIsEditTechnicianDialogOpen}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* View Technician Details Dialog */}
        <Dialog open={isViewTechnicianDetailsDialogOpen} onOpenChange={setIsViewTechnicianDetailsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Detail Teknisi</DialogTitle>
            </DialogHeader>
            {selectedTechnician && <ViewTechnicianDetailsDialog technician={selectedTechnician} isOpen={isViewTechnicianDetailsDialogOpen} onOpenChange={setIsViewTechnicianDetailsDialogOpen} />}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TechnicianManagementPage;