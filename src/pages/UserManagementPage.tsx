"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Terminal, Edit, Trash2, Loader2 } from "lucide-react";
import { useSession } from "@/components/SessionContextProvider";
import AddUserForm from "@/components/AddUserForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { UserWithProfile } from "@/types/data"; // Import new type
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PaginationControls from "@/components/PaginationControls";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import EditUserRoleForm from "@/components/EditUserRoleForm"; // Will create this
import { Input } from "@/components/ui/input"; // Added Input import

const UserManagementPage = () => {
  const { session, loading: sessionLoading, profile } = useSession();
  const queryClient = useQueryClient();

  const [isAddUserFormOpen, setIsAddUserFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isEditRoleFormOpen, setIsEditRoleFormOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserWithProfile | null>(null);

  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserWithProfile | null>(null);

  const { data: users, isLoading: usersLoading, error: usersError, refetch: refetchUsers } = useQuery<UserWithProfile[], Error>({
    queryKey: ["allUsersWithProfiles"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('list-users');
      if (error) {
        throw error;
      }
      if (data && data.error) {
        throw new Error(data.error);
      }
      // Add sequential 'no' for display
      return (data as UserWithProfile[]).map((user, index) => ({ ...user, no: index + 1 }));
    },
    enabled: !!session && profile?.role === 'admin', // Only fetch if authenticated and admin
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: JSON.stringify({ userId }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (error) throw error;
      if (data && data.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsersWithProfiles"] });
      showSuccess("Pengguna berhasil dihapus!");
      setIsDeleteUserModalOpen(false);
      setUserToDelete(null);
    },
    onError: (err) => {
      showError(`Gagal menghapus pengguna: ${err.message}`);
    },
  });

  const filteredUsers = users?.filter((user) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(lowerCaseSearchTerm) ||
      user.first_name?.toLowerCase().includes(lowerCaseSearchTerm) ||
      user.last_name?.toLowerCase().includes(lowerCaseSearchTerm) ||
      user.role.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }) || [];

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditRoleClick = (user: UserWithProfile) => {
    setUserToEdit(user);
    setIsEditRoleFormOpen(true);
  };

  const handleDeleteUserClick = (user: UserWithProfile) => {
    setUserToDelete(user);
    setIsDeleteUserModalOpen(true);
  };

  if (sessionLoading || usersLoading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Manajemen Pengguna</CardTitle>
          <CardDescription>Memuat informasi pengguna...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!session || profile?.role !== 'admin') {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Akses Ditolak!</AlertTitle>
          <AlertDescription>
            Anda tidak memiliki izin untuk mengakses halaman ini. Hanya administrator yang dapat mengelola pengguna.
            <div className="mt-2">
              <Link to="/" className="text-blue-500 hover:underline">Kembali ke Dashboard</Link>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Terjadi Kesalahan!</AlertTitle>
          <AlertDescription>
            {usersError?.message || "Gagal memuat daftar pengguna."}
            <div className="mt-2">
              <Button onClick={() => refetchUsers()}>Coba Lagi</Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-2xl font-semibold">Manajemen Pengguna</CardTitle>
          <Button onClick={() => setIsAddUserFormOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pengguna Baru
          </Button>
        </div>
        <CardDescription>Kelola akun pengguna dan peran mereka di sini.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          placeholder="Cari pengguna berdasarkan email, nama, atau peran..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        {filteredUsers.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-md border">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Nama Lengkap</TableHead>
                    <TableHead>Peran</TableHead>
                    <TableHead>Dibuat Pada</TableHead>
                    <TableHead>Terakhir Login</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.no}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{`${user.first_name || ''} ${user.last_name || ''}`.trim() || '-'}</TableCell>
                      <TableCell>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</TableCell>
                      <TableCell>{format(new Date(user.created_at), "dd-MM-yyyy HH:mm")}</TableCell>
                      <TableCell>{user.last_sign_in_at ? format(new Date(user.last_sign_in_at), "dd-MM-yyyy HH:mm") : "-"}</TableCell>
                      <TableCell className="text-center flex items-center justify-center space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditRoleClick(user)} title="Edit Peran">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {user.id !== session?.user.id && ( // Prevent admin from deleting themselves
                          <Button variant="destructive" size="icon" onClick={() => handleDeleteUserClick(user)} title="Hapus Pengguna">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
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
          <p className="text-gray-700 dark:text-gray-300">Tidak ada pengguna yang tersedia atau cocok dengan pencarian Anda.</p>
        )}
      </CardContent>

      <AddUserForm
        isOpen={isAddUserFormOpen}
        onOpenChange={setIsAddUserFormOpen}
        onSuccess={refetchUsers}
      />

      {userToEdit && (
        <EditUserRoleForm
          user={userToEdit}
          isOpen={isEditRoleFormOpen}
          onOpenChange={setIsEditRoleFormOpen}
          onSuccess={refetchUsers}
        />
      )}

      {/* Delete User Confirmation Modal */}
      <Dialog open={isDeleteUserModalOpen} onOpenChange={setIsDeleteUserModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Pengguna</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pengguna "{userToDelete?.email}"? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteUserModalOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={() => deleteUserMutation.mutate(userToDelete!.id)} disabled={deleteUserMutation.isPending}>
              {deleteUserMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UserManagementPage;