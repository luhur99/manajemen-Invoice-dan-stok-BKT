"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, PlusCircle, Edit, Trash2, Eye } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import AddSalesDetailForm from "@/components/AddSalesDetailForm";
import EditSalesDetailForm from "@/components/EditSalesDetailForm";
import ViewSalesDetailDialog from "@/components/ViewSalesDetailDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { SalesDetail } from "@/types/data"; // Corrected import
import { useDebounce } from "@/hooks/use-debounce"; // Import useDebounce

const SalesDetailsPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Apply debounce
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedSalesDetail, setSelectedSalesDetail] = React.useState<SalesDetail | null>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = React.useState(false);
  const [salesDetailToView, setSalesDetailToView] = React.useState<SalesDetail | null>(null);

  const { data: salesDetails, isLoading, error, refetch: fetchSalesDetails } = useQuery<SalesDetail[], Error>({
    queryKey: ["salesDetails", debouncedSearchTerm], // Include debounced search term
    queryFn: async () => {
      let query = supabase
        .from("sales_details")
        .select("*")
        .order("tanggal", { ascending: false });

      if (debouncedSearchTerm) {
        query = query.or(
          `customer.ilike.%${debouncedSearchTerm}%,no_transaksi.ilike.%${debouncedSearchTerm}%,invoice_number.ilike.%${debouncedSearchTerm}%,perusahaan.ilike.%${debouncedSearchTerm}%,teknisi.ilike.%${debouncedSearchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as SalesDetail[];
    },
  });

  const deleteSalesDetailMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("sales_details")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Detil penjualan berhasil dihapus!");
      setIsDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["salesDetails"] });
    },
    onError: (err: any) => {
      showError(`Gagal menghapus detil penjualan: ${err.message}`);
      console.error("Error deleting sales detail:", err);
    },
  });

  const handleEditClick = (detail: SalesDetail) => {
    setSelectedSalesDetail(detail);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (detail: SalesDetail) => {
    setSelectedSalesDetail(detail);
    setIsDeleteModalOpen(true);
  };

  const handleViewDetails = (detail: SalesDetail) => {
    setSalesDetailToView(detail);
    setIsViewDetailsOpen(true);
  };

  const handleDeleteSalesDetail = () => {
    if (selectedSalesDetail) {
      deleteSalesDetailMutation.mutate(selectedSalesDetail.id);
    }
  };

  // No need for local filtering anymore
  // const filteredSalesDetails = salesDetails?.filter((item) => {
  //   const lowerCaseSearchTerm = searchTerm.toLowerCase();
  //   return (
  //     item.customer.toLowerCase().includes(lowerCaseSearchTerm) ||
  //     item.no_transaksi.toLowerCase().includes(lowerCaseSearchTerm) ||
  //     item.invoice_number.toLowerCase().includes(lowerCaseSearchTerm) ||
  //     item.perusahaan?.toLowerCase().includes(lowerCaseSearchTerm) ||
  //     item.teknisi?.toLowerCase().includes(lowerCaseSearchTerm) ||
  //     format(new Date(item.tanggal), "dd-MM-yyyy").includes(lowerCaseSearchTerm)
  //   );
  // });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading sales details: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Detail Penjualan</h1>

      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Cari detail penjualan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Detail Penjualan
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>No. Transaksi</TableHead>
              <TableHead>No. Invoice</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Perusahaan</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Teknisi</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesDetails?.map((detail, index) => ( // Use 'salesDetails' directly
              <TableRow key={detail.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{format(new Date(detail.tanggal), "dd-MM-yyyy")}</TableCell>
                <TableCell>{detail.no_transaksi}</TableCell>
                <TableCell>{detail.invoice_number}</TableCell>
                <TableCell>{detail.customer}</TableCell>
                <TableCell>{detail.perusahaan || "-"}</TableCell>
                <TableCell>{detail.type || "-"}</TableCell>
                <TableCell>{detail.teknisi || "-"}</TableCell>
                <TableCell className="flex space-x-2 justify-center">
                  <Button variant="ghost" size="icon" onClick={() => handleViewDetails(detail)} title="Lihat Detail">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(detail)} title="Edit Detail">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(detail)} title="Hapus Detail">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddSalesDetailForm
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={fetchSalesDetails}
      />

      {selectedSalesDetail && (
        <EditSalesDetailForm
          salesDetail={selectedSalesDetail}
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSuccess={fetchSalesDetails}
        />
      )}

      {salesDetailToView && (
        <ViewSalesDetailDialog
          salesDetail={salesDetailToView}
          isOpen={isViewDetailsOpen}
          onOpenChange={setIsViewDetailsOpen}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Detail Penjualan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus detail penjualan untuk "{selectedSalesDetail?.customer}" dengan No. Transaksi "{selectedSalesDetail?.no_transaksi}"? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDeleteSalesDetail} disabled={deleteSalesDetailMutation.isPending}>
              {deleteSalesDetailMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesDetailsPage;