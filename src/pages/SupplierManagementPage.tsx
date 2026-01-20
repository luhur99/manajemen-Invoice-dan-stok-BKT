"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { SupplierWithDetails } from "@/types/data";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import AddSupplierForm from "@/components/AddSupplierForm";
import EditSupplierForm from "@/components/EditSupplierForm";
import PaginationControls from "@/components/PaginationControls";
import { format } from "date-fns";
import { Loader2, Edit, Trash2, PlusCircle, Eye } from "lucide-react";
import ViewNotesDialog from "@/components/ViewNotesDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const SupplierManagementPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierWithDetails | null>(null);

  const [isViewNotesOpen, setIsViewNotesOpen] = useState(false);
  const [notesToView, setNotesToView] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: suppliers = [], isLoading, error } = useQuery<SupplierWithDetails[], Error>({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        showError("Gagal memuat data pemasok.");
        throw error;
      }

      return data.map((sup, index) => ({
        ...sup,
        no: index + 1, // Assign sequential number for display
      }));
    },
  });

  const deleteSupplierMutation = useMutation({
    mutationFn: async (supplierId: string) => {
      const { error } = await supabase
        .from("suppliers")
        .delete()
        .eq("id", supplierId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess("Pemasok berhasil dihapus!");
      setIsDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["suppliers"] }); // Invalidate and refetch
    },
    onError: (err: any) => {
      showError(`Gagal menghapus pemasok: ${err.message}`);
      console.error("Error deleting supplier:", err);
    },
  });

  const filteredSuppliers = suppliers.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on search term change
  }, [searchTerm]);

  const handleDeleteSupplier = () => {
    if (selectedSupplier) {
      deleteSupplierMutation.mutate(selectedSupplier.id);
    }
  };

  const handleEditClick = (supplier: SupplierWithDetails) => {
    setSelectedSupplier(supplier);
    setIsEditFormOpen(true);
  };

  const handleViewNotes = (notes: string) => {
    setNotesToView(notes);
    setIsViewNotesOpen(true);
  };

  const handleDeleteClick = (supplier: SupplierWithDetails) => {
    setSelectedSupplier(supplier);
    setIsDeleteModalOpen(true);
  };

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredSuppliers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["suppliers"] });
  };

  if (isLoading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Manajemen Pemasok</CardTitle>
          <CardDescription>Memuat daftar pemasok...</CardDescription>
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
          <CardTitle className="text-2xl font-semibold">Manajemen Pemasok</CardTitle>
          <AddSupplierForm onSuccess={handleSuccess} />
        </div>
        <CardDescription>Kelola semua informasi pemasok Anda di sini.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-red-500 dark:text-red-400 mb-4">Error: {error.message}</p>}
        <Input
          type="text"
          placeholder="Cari berdasarkan nama, kontak, telepon, email, atau alamat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        {filteredSuppliers.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Pemasok</TableHead>
                    <TableHead>Kontak Person</TableHead>
                    <TableHead>Nomor Telepon</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Catatan</TableHead>
                    <TableHead>Dibuat Pada</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>{supplier.no}</TableCell>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>{supplier.contact_person || "-"}</TableCell>
                      <TableCell>{supplier.phone_number || "-"}</TableCell>
                      <TableCell>{supplier.email || "-"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{supplier.address || "-"}</TableCell>
                      <TableCell>
                        {supplier.notes ? (
                          <Button variant="outline" size="sm" onClick={() => handleViewNotes(supplier.notes!)} className="h-7 px-2">
                            <Eye className="h-3 w-3 mr-1" /> Lihat
                          </Button>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{format(new Date(supplier.created_at), "dd-MM-yyyy HH:mm")}</TableCell>
                      <TableCell className="text-center flex items-center justify-center space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(supplier)} title="Edit Pemasok">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(supplier)} title="Hapus Pemasok">
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
          <p className="text-gray-700 dark:text-gray-300">Tidak ada data pemasok yang tersedia atau cocok dengan pencarian Anda.</p>
        )}
      </CardContent>

      {selectedSupplier && (
        <EditSupplierForm
          supplier={selectedSupplier}
          isOpen={isEditFormOpen}
          onOpenChange={setIsEditFormOpen}
          onSuccess={handleSuccess}
        />
      )}

      <ViewNotesDialog
        notes={notesToView}
        isOpen={isViewNotesOpen}
        onOpenChange={setIsViewNotesOpen}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Pemasok</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pemasok "{selectedSupplier?.name}"? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDeleteSupplier} disabled={deleteSupplierMutation.isPending}>
              {deleteSupplierMutation.isPending ? (
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

export default SupplierManagementPage;