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
import { Loader2, PlusCircle, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { useDebounce } from "react-use";
import AddUserForm from "@/components/AddUserForm"; // Corrected import path
import { EditUserForm } from "@/components/EditUserForm"; // Corrected to named import
import PaginationControls from "@/components/PaginationControls";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Profile } from "@/types/data"; // Import Profile type
import { formatDateSafely } from "@/lib/utils"; // Import formatDateSafely

const ITEMS_PER_PAGE = 10;

// Define a specific interface for the data returned by this query
interface UserProfileWithAuth extends Profile {
  email: string; // Add email directly as it's joined
}

const UserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfileWithAuth | null>(null); // Use the new interface

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
    setCurrentPage(1);
  }, 500, [searchTerm]);

  const queryClient = useQueryClient();

  const { data: usersData, isLoading, isError, error } = useQuery<{ data: UserProfileWithAuth[]; count: number }, Error>({ // Apply the new interface here
    queryKey: ["users", debouncedSearchTerm, currentPage],
    queryFn: async () => {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from("profiles")
        .select(
          `
          id,
          first_name,
          last_name,
          role,
          phone_number,
          updated_at,
          email:auth.users(email)
        `,
          { count: "exact" }
        );

      if (debouncedSearchTerm) {
        query = query.or(
          `first_name.ilike.%${debouncedSearchTerm}%,last_name.ilike.%${debouncedSearchTerm}%,email.ilike.%${debouncedSearchTerm}%`
        );
      }

      const { data, error } = await query.range(start, end);

      if (error) throw error;

      // Map the data to flatten the auth_users object into the main UserProfileWithAuth object
      const mappedData = (data as any[]).map(item => ({
        id: item.id,
        first_name: item.first_name,
        last_name: item.last_name,
        role: item.role,
        phone_number: item.phone_number,
        updated_at: item.updated_at,
        email: item.email?.[0]?.email || '-', // Flatten email from array if it's an array
      }));

      return { data: mappedData as UserProfileWithAuth[], count }; // Cast data to the new interface
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => { // Explicitly type id
      // Note: Deleting a profile does not automatically delete the auth.user.
      // For full user deletion, an Edge Function or Admin API call would be needed.
      // For now, we'll just delete the profile.
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Pengguna berhasil dihapus (profil).");
    },
    onError: (error) => {
      toast.error(`Gagal menghapus pengguna: ${error.message}`);
    },
  });

  const handleDeleteUser = (id: string) => { // Explicitly type id
    deleteUserMutation.mutate(id);
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

  const users = usersData?.data || [];
  const totalCount = usersData?.count || 0;
  const pageCount = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Manajemen Pengguna</CardTitle>
        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Tambah Pengguna</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Tambah Pengguna Baru</DialogTitle>
            </DialogHeader>
            <AddUserForm onSuccess={() => setIsAddUserDialogOpen(false)} isOpen={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Cari pengguna..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Nomor Telepon</TableHead>
                <TableHead>Terakhir Diperbarui</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Tidak ada pengguna ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell>{user.email || "-"}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.phone_number || "-"}</TableCell>
                    <TableCell>
                      {user.updated_at
                        ? format(new Date(user.updated_at), "dd MMM yyyy, HH:mm", { locale: idLocale })
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
                              setSelectedUser(user);
                              setIsEditUserDialogOpen(true);
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
                                  Tindakan ini tidak dapat dibatalkan. Ini akan menghapus profil pengguna secara permanen.
                                  (Catatan: Penghapusan akun otentikasi Supabase memerlukan tindakan manual atau Edge Function).
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
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

        {/* Edit User Dialog */}
        <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Pengguna</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <EditUserForm
                user={selectedUser}
                onSuccess={() => setIsEditUserDialogOpen(false)}
                isOpen={isEditUserDialogOpen}
                onOpenChange={setIsEditUserDialogOpen}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UserManagementPage;