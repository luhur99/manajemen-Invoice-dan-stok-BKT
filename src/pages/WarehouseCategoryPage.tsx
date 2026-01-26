"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, PlusCircle, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { useSession } from "@/components/SessionContextProvider";
import { WarehouseCategory } from "@/types/data";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce"; // Import useDebounce

// Define the schema for the new warehouse_categories table
interface WarehouseCategoryWithNo extends WarehouseCategory {
  no: number;
}

// Helper function to generate a slug from a string
const slugify = (text: string) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '_');
};

const formSchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi."),
});

const WarehouseCategoryPage: React.FC = () => {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Apply debounce

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<WarehouseCategoryWithNo | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { data: categories = [], isLoading, error, refetch: fetchCategories } = useQuery<WarehouseCategoryWithNo[], Error>({
    queryKey: ["warehouseCategories", debouncedSearchTerm], // Include debounced search term
    queryFn: async () => {
      let query = supabase
        .from("warehouse_categories")
        .select("*")
        .order("name", { ascending: true });

      if (debouncedSearchTerm) {
        query = query.ilike("name", `%${debouncedSearchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map((cat, index) => ({
        ...cat,
        no: index + 1,
      }));
    },
  });

  const addCategoryMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const userId = session?.user?.id;
      if (!userId) throw new Error("Pengguna tidak terautentikasi.");

      const generatedCode = slugify(values.name);
      const { error } = await supabase.from("warehouse_categories").insert({
        user_id: userId,
        name: values.name,
        code: generatedCode,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Kategori gudang berhasil ditambahkan!");
      form.reset();
      setIsAddModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["warehouseCategories"] });
    },
    onError: (err: any) => {
      showError(`Gagal menambahkan kategori gudang: ${err.message}`);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!selectedCategory) throw new Error("Kategori tidak dipilih.");
      
      const generatedCode = slugify(values.name);
      const { error } = await supabase
        .from("warehouse_categories")
        .update({
          name: values.name,
          code: generatedCode,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedCategory.id);

      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Kategori gudang berhasil diperbarui!");
      setIsEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["warehouseCategories"] });
    },
    onError: (err: any) => {
      showError(`Gagal memperbarui kategori gudang: ${err.message}`);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("warehouse_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Kategori gudang berhasil dihapus!");
      setIsDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["warehouseCategories"] });
    },
    onError: (err: any) => {
      showError(`Gagal menghapus kategori gudang: ${err.message}`);
    },
  });

  // No need for local filtering anymore
  // const filteredCategories = categories.filter((category) =>
  //   category.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const handleAddCategory = (values: z.infer<typeof formSchema>) => {
    addCategoryMutation.mutate(values);
  };

  const handleEditClick = (category: WarehouseCategoryWithNo) => {
    setSelectedCategory(category);
    form.reset({
      name: category.name,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateCategory = (values: z.infer<typeof formSchema>) => {
    updateCategoryMutation.mutate(values);
  };

  const handleDeleteClick = (category: WarehouseCategoryWithNo) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCategory = () => {
    if (selectedCategory) {
      deleteCategoryMutation.mutate(selectedCategory.id);
    }
  };

  if (isLoading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Manajemen Kategori Gudang</CardTitle>
          <CardDescription>Memuat daftar kategori gudang...</CardDescription>
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
          <CardTitle className="text-2xl font-semibold">Manajemen Kategori Gudang</CardTitle>
          <Button onClick={() => { setIsAddModalOpen(true); form.reset(); }}>
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Kategori
          </Button>
        </div>
        <CardDescription>Kelola semua kategori gudang yang digunakan dalam sistem.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-red-500 dark:text-red-400 mb-4">Error: {error.message}</p>}
        <Input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        {categories.length > 0 ? ( // Use 'categories' directly
          <div className="overflow-x-auto rounded-md border">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead>Nama Kategori</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => ( // Use 'categories' directly
                  <TableRow key={category.id}>
                    <TableCell>{category.no}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell className="text-center flex items-center justify-center space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(category)} title="Edit Kategori">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(category)} title="Hapus Kategori">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">Tidak ada kategori gudang yang tersedia atau cocok dengan pencarian Anda.</p>
        )}
      </CardContent>

      {/* Add Category Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Kategori Gudang Baru</DialogTitle>
            <DialogDescription>Isi detail untuk menambahkan kategori gudang baru.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddCategory)} className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Kategori</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={addCategoryMutation.isPending}>
                  {addCategoryMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Tambah Kategori"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Kategori Gudang</DialogTitle>
            <DialogDescription>Perbarui detail kategori gudang ini.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateCategory)} className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Kategori</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={updateCategoryMutation.isPending}>
                  {updateCategoryMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Simpan Perubahan"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Kategori Gudang</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus kategori gudang "{selectedCategory?.name}"? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDeleteCategory} disabled={deleteCategoryMutation.isPending}>
              {deleteCategoryMutation.isPending ? (
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

export default WarehouseCategoryPage;