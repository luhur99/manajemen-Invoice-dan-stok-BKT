"use client";

import React, { useState, useCallback, useEffect } from "react";
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

const CustomerManagementPage = () => {
  const [customers, setCustomers] = useState<CustomerWithDetails[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithDetails | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("customer_name", { ascending: true });

      if (error) {
        throw error;
      }

      const customersWithNo: CustomerWithDetails[] = data.map((cust, index) => ({
        ...cust,
        no: index + 1,
      }));

      setCustomers(customersWithNo);
      setFilteredCustomers(customersWithNo);
      setCurrentPage(1);
    } catch (err: any) {
      setError(`Gagal memuat data pelanggan: ${err.message}`);
      console.error("Error fetching customers:", err);
      showError("Gagal memuat data pelanggan.");
      setCustomers([]);
      setFilteredCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = customers.filter(item =>
      item.customer_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.company_name?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.address?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.phone_number?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.customer_type.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredCustomers(filtered);
    setCurrentPage(1);
  }, [searchTerm, customers]);

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;

    try {
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", selectedCustomer.id);

      if (error) {
        throw error;
      }

      showSuccess("Pelanggan berhasil dihapus!");
      setIsDeleteModalOpen(false);
      fetchCustomers(); // Refresh the list
    } catch (err: any) {
      showError(`Gagal menghapus pelanggan: ${err.message}`);
      console.error("Error deleting customer:", err);
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

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredCustomers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
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
        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
        <Input
          type="text"
          placeholder="Cari berdasarkan nama, perusahaan, alamat, atau telepon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        {filteredCustomers.length > 0 ? (
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
                  {currentItems.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.no}</TableCell>
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
            <Button variant="destructive" onClick={handleDeleteCustomer}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CustomerManagementPage;