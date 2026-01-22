"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Edit, Trash2, PlusCircle, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { CustomerWithDetails } from "@/types/data";
import AddCustomerForm from "@/components/AddCustomerForm";
import EditCustomerForm from "@/components/EditCustomerForm";
import ViewCustomerDetailsDialog from "@/components/ViewCustomerDetailsDialog";
import PaginationControls from "@/components/PaginationControls";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce"; // Import useDebounce

const CustomerManagementPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Apply debounce

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithDetails | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: customers = [], isLoading, error, refetch: fetchCustomers } = useQuery<CustomerWithDetails[], Error>({
    queryKey: ["customers", debouncedSearchTerm], // Include debounced search term
    queryFn: async () => {
      let query = supabase
        .from("customers")
        .select("*")
        .order("customer_name", { ascending: true });

      if (debouncedSearchTerm) {
        query = query.or(
          `customer_name.ilike.%${debouncedSearchTerm}%,company_name.ilike.%${debouncedSearchTerm}%,address.ilike.%${debouncedSearchTerm}%,phone_number.ilike.%${debouncedSearchTerm}%,customer_type.ilike.%${debouncedSearchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        showError("Gagal memuat data pelanggan.");
        throw error;
      }

      return data as CustomerWithDetails[];
    },
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: async (customerId: string) => {
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", customerId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess("Pelanggan berhasil dihapus!");
      setIsDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["customers"] }); // Invalidate and refetch
    },
    onError: (err: any) => {
      showError(`Gagal menghapus pelanggan: ${err.message}`);
      console.error("Error deleting customer:", err);
    },
  });

  // No need for local filtering anymore, as the query itself is filtered
  // useEffect(() => {
  //   const lowerCaseSearchTerm = searchTerm.toLowerCase();
  //   const filtered = customers.filter(item =>
  //     item.customer_name.toLowerCase().includes(lowerCaseSearchTerm) ||
  //     item.company_name?.toLowerCase().includes(lowerCaseSearchTerm) ||
  //     item.address?.toLowerCase().includes(lowerCaseSearchTerm) ||
  //     item.phone_number?.toLowerCase().includes(lowerCaseSearchTerm) ||
  //     item.customer_type.toLowerCase().includes(lowerCaseSearchTerm)
  //   );
  //   setFilteredCustomers(filtered);
  //   setCurrentPage(1);
  // }, [searchTerm, customers]);

  const handleDeleteCustomer = () => {
    if (selectedCustomer) {
      deleteCustomerMutation.mutate(selectedCustomer.id);
    }
  };

  const handleEditClick = (customer: CustomerWithDetails) => {
    setSelectedCustomer(customer);
    setIsEditFormOpen(true);
  };

  const handleViewDetails = (customer: CustomerWithDetails) => {
    setSelectedCustomer(customer);
    setIsViewDetailsOpen(true);
  };

  const handleDeleteClick = (customer: CustomerWithDetails) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const totalPages = Math.ceil(customers.length / itemsPerPage); // Use 'customers' directly
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = customers.slice(startIndex, endIndex); // Use 'customers' directly

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Manajemen Pelanggan</CardTitle>
          <CardDescription>Memuat daftar pelanggan...</CardDescription>
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
          <CardTitle className="text-2xl font-semibold">Manajemen Pelanggan</CardTitle>
          <AddCustomerForm onSuccess={fetchCustomers} />
        </div>
        <CardDescription>Kelola semua informasi pelanggan Anda di sini.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error.message}</p>}
        <Input
          type="text"
          placeholder="Cari berdasarkan nama, perusahaan, alamat, atau telepon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        {customers.length > 0 ? ( // Use 'customers' directly
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Pelanggan</TableHead>
                    <TableHead>Nama Perusahaan</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Nomor Telepon</TableHead>
                    <TableHead>Tipe Pelanggan</TableHead>
                    <TableHead>Dibuat Pada</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((customer, index) => (
                    <TableRow key={customer.id}>
                      <TableCell>{startIndex + index + 1}</TableCell>
                      <TableCell>{customer.customer_name}</TableCell>
                      <TableCell>{customer.company_name || "-"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{customer.address || "-"}</TableCell>
                      <TableCell>{customer.phone_number || "-"}</TableCell>
                      <TableCell>{customer.customer_type}</TableCell>
                      <TableCell>{format(new Date(customer.created_at), "dd-MM-yyyy HH:mm")}</TableCell>
                      <TableCell className="text-center flex items-center justify-center space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(customer)} title="Lihat Detail">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(customer)} title="Edit Pelanggan">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(customer)} title="Hapus Pelanggan">
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
          <p className="text-gray-700 dark:text-gray-300">Tidak ada data pelanggan yang tersedia atau cocok dengan pencarian Anda.</p>
        )}
      </CardContent>

      {selectedCustomer && (
        <EditCustomerForm
          customer={selectedCustomer}
          isOpen={isEditFormOpen}
          onOpenChange={setIsEditFormOpen}
          onSuccess={fetchCustomers}
        />
      )}

      {selectedCustomer && (
        <ViewCustomerDetailsDialog
          customer={selectedCustomer}
          isOpen={isViewDetailsOpen}
          onClose={() => setIsViewDetailsOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Pelanggan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pelanggan "{selectedCustomer?.customer_name}"? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDeleteCustomer} disabled={deleteCustomerMutation.isPending}>
              {deleteCustomerMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CustomerManagementPage;