"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Edit, Trash2, PlusCircle, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { TechnicianWithDetails, TechnicianType } from "@/types/data";
import AddEditTechnicianForm from "@/components/AddEditTechnicianForm";
import PaginationControls from "@/components/PaginationControls";
import { format } from "date-fns";
import ViewNotesDialog from "@/components/ViewNotesDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const TechnicianManagementPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const [isAddEditFormOpen, setIsAddEditFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<TechnicianWithDetails | null>(null);

  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [detailsToView, setDetailsToView] = useState<string>("");
  const [viewDetailsTitle, setViewDetailsTitle] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: technicians = [], isLoading, error, refetch: fetchTechnicians } = useQuery<TechnicianWithDetails[], Error>({
    queryKey: ["technicians"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technicians")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      return data.map((tech, index) => ({
        ...tech,
        no: index + 1,
      }));
    },
  });

  const deleteTechnicianMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("technicians")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Teknisi berhasil dihapus!");
      setIsDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
    },
    onError: (err: any) => {
      showError(`Gagal menghapus teknisi: ${err.message}`);
    },
  });

  const handleDeleteTechnician = () => {
    if (selectedTechnician) {
      deleteTechnicianMutation.mutate(selectedTechnician.id);
    }
  };

  const filteredTechnicians = technicians.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.province?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClick = () => {
    setSelectedTechnician(null);
    setIsAddEditFormOpen(true);
  };

  const handleEditClick = (technician: TechnicianWithDetails) => {
    setSelectedTechnician(technician);
    setIsAddEditFormOpen(true);
  };

  const handleDeleteClick = (technician: TechnicianWithDetails) => {
    setSelectedTechnician(technician);
    setIsDeleteModalOpen(true);
  };

  const handleViewAddress = (technician: TechnicianWithDetails) => {
    setDetailsToView(`${technician.address || ''}\n${technician.city || ''}, ${technician.province || ''}`.trim());
    setViewDetailsTitle(`Alamat Teknisi: ${technician.name}`);
    setIsViewDetailsOpen(true);
  };

  const totalPages = Math.ceil(filteredTechnicians.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredTechnicians.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["technicians"] });
  };

  if (isLoading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Manajemen Teknisi</CardTitle>
          <CardDescription>Memuat daftar teknisi...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-2xl font-semibold">Manajemen Teknisi</CardTitle>
          <Button onClick={handleAddClick}>
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Teknisi
          </Button>
        </div>
        <CardDescription>Kelola semua informasi teknisi Anda di sini.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-red-500 dark:text-red-400 mb-4">Error: {error.message}</p>}
        <Input
          type="text"
          placeholder="Cari berdasarkan nama, telepon, tipe, atau alamat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        {filteredTechnicians.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>No. Telepon</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Dibuat Pada</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((technician) => (
                    <TableRow key={technician.id}>
                      <TableCell>{technician.no}</TableCell>
                      <TableCell>{technician.name}</TableCell>
                      <TableCell>{technician.phone_number || "-"}</TableCell>
                      <TableCell>{technician.type.charAt(0).toUpperCase() + technician.type.slice(1)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {technician.type === TechnicianType.EXTERNAL && (technician.address || technician.city || technician.province) ? (
                          <Button variant="outline" size="sm" onClick={() => handleViewAddress(technician)} className="h-7 px-2">
                            <Eye className="h-3 w-3 mr-1" /> Lihat Alamat
                          </Button>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{format(new Date(technician.created_at), "dd-MM-yyyy HH:mm")}</TableCell>
                      <TableCell className="text-center flex items-center justify-center space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(technician)} title="Edit Teknisi">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(technician)} title="Hapus Teknisi">
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
          <p className="text-gray-700 dark:text-gray-300">Tidak ada data teknisi yang tersedia atau cocok dengan pencarian Anda.</p>
        )}
      </CardContent>

      <AddEditTechnicianForm
        isOpen={isAddEditFormOpen}
        onOpenChange={setIsAddEditFormOpen}
        onSuccess={handleSuccess}
        initialData={selectedTechnician}
      />

      <ViewNotesDialog
        notes={detailsToView}
        isOpen={isViewDetailsOpen}
        onOpenChange={setIsViewDetailsOpen}
        title={viewDetailsTitle}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Teknisi</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus teknisi "{selectedTechnician?.name}"? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDeleteTechnician} disabled={deleteTechnicianMutation.isPending}>
              {deleteTechnicianMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Hapus"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TechnicianManagementPage;