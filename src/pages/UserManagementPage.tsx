"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Terminal } from "lucide-react";
import { useSession } from "@/components/SessionContextProvider";
import AddUserForm from "@/components/AddUserForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";

const UserManagementPage = () => {
  const { session, loading, profile } = useSession();
  const [isAddUserFormOpen, setIsAddUserFormOpen] = useState(false);

  // In a real application, you might also list existing users here
  // For now, we'll just focus on the creation part and access control.

  if (loading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Manajemen Pengguna</CardTitle>
          <CardDescription>Memuat informasi pengguna...</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">Memuat data sesi...</p>
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

  const handleUserAdded = () => {
    // Logic to refresh user list if one were displayed
    console.log("User added successfully, refreshing data if needed.");
  };

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
        <p className="text-gray-700 dark:text-gray-300">
          Gunakan tombol di atas untuk membuat pengguna baru dengan peran yang berbeda (Admin, Staff, User).
        </p>
        {/* You would typically list existing users here in a table */}
        {/* For example:
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Map through users here }
            </TableBody>
          </Table>
        </div>
        */}
      </CardContent>

      <AddUserForm
        isOpen={isAddUserFormOpen}
        onOpenChange={setIsAddUserFormOpen}
        onSuccess={handleUserAdded}
      />
    </Card>
  );
};

export default UserManagementPage;