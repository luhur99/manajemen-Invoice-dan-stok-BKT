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
import { AddCustomerForm } from "@/components/customers/AddCustomerForm";
import { EditCustomerForm } from "@/components/customers/EditCustomerForm";
import { ViewCustomerDetailsDialog } from "@/components/customers/ViewCustomerDetailsDialog";
import PaginationControls from "@/components/PaginationControls";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const ITEMS_PER_PAGE = 10;

const CustomerManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false);
  const [isEditCustomerDialogOpen, setIsEditCustomerDialogOpen] = useState(false);
  const [isViewCustomerDetailsDialogOpen, setIsViewCustomerDetailsDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
    setCurrentPage(1);
  }, 500, [searchTerm]);

  const queryClient = useQueryClient();

  const { data: customersData, isLoading, isError, error } = useQuery({
    queryKey: ["customers", debouncedSearchTerm, currentPage],
    queryFn: async () => {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from("customers")
        .select(
          `
          id,
          customer_name,
          company_name,
          address,
          phone_number,
          customer_type,
          created_at,
          updated_at
        `,
          { count: "exact" }
        );

      if (debouncedSearchTerm) {
        query = query.or(
          `customer_name.ilike.%${debouncedSearchTerm}%,company_name.ilike.%${debouncedSearchTerm}%,phone_number.ilike.%${debouncedSearchTerm}%`
        );
      }

      const { data, error, count } = await query.range(start, end);

      if (error) throw error;
      return { data, count };
    },
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("customers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Pelanggan berhasil dihapus.");
    },
    onError: (error) => {
      toast.error(`Gagal menghapus pelanggan: ${error.message}`);
    },
  });

  const handleDeleteCustomer = (id) => {
    deleteCustomerMutation.mutate(id);
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

  const customers = customersData?.data || [];
  const totalCount = customersData?.count || 0;
  const pageCount = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Manajemen Pelanggan</CardTitle>
        <Dialog open={isAddCustomerDialogOpen} onOpenChange={setIsAddCustomerDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Tambah Pelanggan</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
            </DialogHeader>
            <AddCustomerForm onSuccess={() => setIsAddCustomerDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Cari pelanggan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pelanggan</TableHead>
                <TableHead>Nama Perusahaan</TableHead>
                <TableHead>Tipe Pelanggan</TableHead>
                <TableHead>Nomor Telepon</TableHead>
                <TableHead>Dibuat Pada</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Tidak ada pelanggan ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.customer_name}</TableCell>
                    <TableCell>{customer.company_name || "-"}</TableCell>
                    <TableCell>{customer.customer_type}</TableCell>
                    <TableCell>{customer.phone_number || "-"}</TableCell>
                    <TableCell>
                      {customer.created_at
                        ? format(new Date(customer.created_at), "dd MMM yyyy", { locale: idLocale })
                        : "-"}
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
                              setSelectedCustomer(customer);
                              setIsViewCustomerDetailsDialogOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" /> Lihat
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setIsEditCustomerDialogOpen(true);
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
                                  Tindakan ini tidak dapat dibatalkan. Ini akan menghapus pelanggan secara permanen.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteCustomer(customer.id)}>
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
          pageCount={pageCount} // Corrected prop name
          onPageChange={setCurrentPage}
        />

        {/* Edit Customer Dialog */}
        <Dialog open={isEditCustomerDialogOpen} onOpenChange={setIsEditCustomerDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Pelanggan</DialogTitle>
            </DialogHeader>
            {selectedCustomer && (
              <EditCustomerForm
                customer={selectedCustomer}
                onSuccess={() => setIsEditCustomerDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* View Customer Details Dialog */}
        <Dialog open={isViewCustomerDetailsDialogOpen} onOpenChange={setIsViewCustomerDetailsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Detail Pelanggan</DialogTitle>
            </DialogHeader>
            {selectedCustomer && <ViewCustomerDetailsDialog customer={selectedCustomer} />}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CustomerManagementPage;