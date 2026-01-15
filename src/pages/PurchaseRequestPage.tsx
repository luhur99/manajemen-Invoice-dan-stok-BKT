"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash, Receipt, Eye, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showError, showSuccess } from "@/utils/toast";
import { format } from "date-fns";
import { PurchaseRequest, PurchaseRequestStatus, Product, WarehouseCategory as WarehouseCategoryType, Supplier, StockEventType } from "@/types/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const purchaseRequestSchema = z.object({
  id: z.string().uuid().optional(), // Add id for update scenarios
  item_name: z.string().min(1, "Nama item wajib diisi"),
  item_code: z.string().min(1, "Kode item wajib diisi"),
  quantity: z.number().min(1, "Kuantitas minimal 1"),
  unit_price: z.number().min(0, "Harga satuan tidak boleh negatif"),
  suggested_selling_price: z.number().min(0, "Harga jual yang disarankan tidak boleh negatif"),
  total_price: z.number().min(0, "Total harga tidak boleh negatif"),
  notes: z.string().optional(),
  status: z.nativeEnum(PurchaseRequestStatus).default(PurchaseRequestStatus.PENDING),
  document_url: z.string().optional().nullable(),
  received_quantity: z.number().optional().nullable(),
  returned_quantity: z.number().optional().nullable(),
  damaged_quantity: z.number().optional().nullable(),
  target_warehouse_category: z.string().optional().nullable(),
  received_notes: z.string().optional().nullable(),
  received_at: z.string().optional().nullable(),
  product_id: z.string().uuid().optional().nullable(),
  supplier_id: z.string().uuid().optional().nullable(),
  satuan: z.string().optional().nullable(),
});

const PurchaseRequestPage = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewReceiptDialogOpen, setIsViewReceiptDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [currentReceiptUrl, setCurrentReceiptUrl] = useState<string | null>(null);

  const { data: purchaseRequests, isLoading, isError, error, refetch } = useQuery<PurchaseRequest[], Error>({
    queryKey: ["purchaseRequests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchase_requests")
        .select(`
          *,
          products (nama_barang),
          suppliers (name)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map(req => ({
        ...req,
        product_name: req.products?.nama_barang || 'N/A',
        supplier_name: req.suppliers?.name || 'N/A',
      })) as PurchaseRequest[];
    },
  });

  const { data: products, isLoading: loadingProducts } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: warehouseCategories, isLoading: loadingCategories } = useQuery<WarehouseCategoryType[], Error>({
    queryKey: ["warehouseCategories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("warehouse_categories").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: suppliers, isLoading: loadingSuppliers } = useQuery<Supplier[], Error>({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("suppliers").select("*");
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<z.infer<typeof purchaseRequestSchema>>({
    resolver: zodResolver(purchaseRequestSchema),
    defaultValues: {
      item_name: "",
      item_code: "",
      quantity: 1,
      unit_price: 0,
      suggested_selling_price: 0,
      total_price: 0,
      notes: "",
      status: PurchaseRequestStatus.PENDING,
      document_url: null,
      received_quantity: 0,
      returned_quantity: 0,
      damaged_quantity: 0,
      target_warehouse_category: null,
      received_notes: null,
      received_at: null,
      product_id: null,
      supplier_id: null,
      satuan: "",
    },
  });

  const { reset, handleSubmit, register, setValue, watch, formState: { errors } } = form;
  const watchedQuantity = watch("quantity");
  const watchedUnitPrice = watch("unit_price");
  const watchedProductId = watch("product_id");

  useEffect(() => {
    setValue("total_price", watchedQuantity * watchedUnitPrice);
  }, [watchedQuantity, watchedUnitPrice, setValue]);

  useEffect(() => {
    if (watchedProductId && products) {
      const selectedProduct = products.find(p => p.id === watchedProductId);
      if (selectedProduct) {
        setValue("item_name", selectedProduct.nama_barang);
        setValue("item_code", selectedProduct.kode_barang);
        setValue("unit_price", selectedProduct.harga_beli || 0);
        setValue("suggested_selling_price", selectedProduct.harga_jual || 0);
        setValue("satuan", selectedProduct.satuan || "");
        setValue("supplier_id", selectedProduct.supplier_id || null);
      }
    }
  }, [watchedProductId, products, setValue]);

  const createPurchaseRequestMutation = useMutation({
    mutationFn: async (newRequest: z.infer<typeof purchaseRequestSchema>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from("purchase_requests")
        .insert({ ...newRequest, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchaseRequests"] });
      showSuccess("Permintaan pembelian berhasil dibuat!");
      setIsDialogOpen(false);
      reset();
    },
    onError: (err) => {
      showError(`Gagal membuat permintaan pembelian: ${err.message}`);
    },
  });

  const updatePurchaseRequestMutation = useMutation({
    mutationFn: async (updatedRequest: PurchaseRequest) => {
      const { data, error } = await supabase
        .from("purchase_requests")
        .update(updatedRequest)
        .eq("id", updatedRequest.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchaseRequests"] });
      showSuccess("Permintaan pembelian berhasil diperbarui!");
      setIsDialogOpen(false);
      setSelectedRequest(null);
      reset();
    },
    onError: (err) => {
      showError(`Gagal memperbarui permintaan pembelian: ${err.message}`);
    },
  });

  const deletePurchaseRequestMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("purchase_requests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchaseRequests"] });
      showSuccess("Permintaan pembelian berhasil dihapus!");
      setIsDeleteDialogOpen(false);
      setSelectedRequest(null);
    },
    onError: (err) => {
      showError(`Gagal menghapus permintaan pembelian: ${err.message}`);
    },
  });

  const handleAddRequest = () => {
    setSelectedRequest(null);
    reset({
      item_name: "",
      item_code: "",
      quantity: 1,
      unit_price: 0,
      suggested_selling_price: 0,
      total_price: 0,
      notes: "",
      status: PurchaseRequestStatus.PENDING,
      document_url: null,
      received_quantity: 0,
      returned_quantity: 0,
      damaged_quantity: 0,
      target_warehouse_category: null,
      received_notes: null,
      received_at: null,
      product_id: null,
      supplier_id: null,
      satuan: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditRequest = (request: PurchaseRequest) => {
    setSelectedRequest(request);
    reset({
      ...request,
      quantity: request.quantity || 0,
      unit_price: request.unit_price || 0,
      suggested_selling_price: request.suggested_selling_price || 0,
      total_price: request.total_price || 0,
      status: request.status || PurchaseRequestStatus.PENDING,
      received_quantity: request.received_quantity || 0,
      returned_quantity: request.returned_quantity || 0,
      damaged_quantity: request.damaged_quantity || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteRequest = (request: PurchaseRequest) => {
    setSelectedRequest(request);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRequest) {
      deletePurchaseRequestMutation.mutate(selectedRequest.id);
    }
  };

  const handleReceiptUploadClick = (request: PurchaseRequest) => {
    setSelectedRequest(request);
    setFileToUpload(null);
    setIsUploadDialogOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileToUpload(event.target.files[0]);
    } else {
      setFileToUpload(null);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedRequest || !fileToUpload) {
      showError("Tidak ada file yang dipilih atau permintaan tidak valid.");
      return;
    }

    const fileExtension = fileToUpload.name.split(".").pop();
    const fileName = `${selectedRequest.id}-${Date.now()}.${fileExtension}`;
    const filePath = `purchase_documents/${fileName}`; // Changed folder path here

    const { data, error } = await supabase.storage
      .from("documents")
      .upload(filePath, fileToUpload, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      showError(`Gagal mengunggah file: ${error.message}`);
      return;
    }

    const publicUrl = supabase.storage.from("documents").getPublicUrl(filePath).data.publicUrl;

    const { error: updateError } = await supabase
      .from("purchase_requests")
      .update({ document_url: publicUrl })
      .eq("id", selectedRequest.id);

    if (updateError) {
      showError(`Gagal memperbarui URL dokumen: ${updateError.message}`);
      return;
    }

    showSuccess("File berhasil diunggah dan permintaan diperbarui!");
    setIsUploadDialogOpen(false);
    setSelectedRequest(null);
    setFileToUpload(null);
    refetch();
  };

  const handleViewReceipt = (url: string) => {
    setCurrentReceiptUrl(url);
    setIsViewReceiptDialogOpen(true);
  };

  const handleCloseRequest = async (request: PurchaseRequest) => {
    if (!request.id) return;

    // Check if document_url exists
    if (!request.document_url) {
      showError("Tidak dapat menutup permintaan. Resi/dokumen PO/Inv belum diunggah.");
      return;
    }

    // Check if received_quantity is set and greater than 0
    if (!request.received_quantity || request.received_quantity <= 0) {
      showError("Tidak dapat menutup permintaan. Kuantitas diterima harus lebih besar dari 0.");
      return;
    }

    // Check if target_warehouse_category is set
    if (!request.target_warehouse_category) {
      showError("Tidak dapat menutup permintaan. Kategori gudang target belum ditentukan.");
      return;
    }

    // Update purchase request status to 'closed'
    const { error: updateRequestError } = await supabase
      .from("purchase_requests")
      .update({ status: PurchaseRequestStatus.CLOSED, received_at: new Date().toISOString() })
      .eq("id", request.id);

    if (updateRequestError) {
      showError(`Gagal menutup permintaan pembelian: ${updateRequestError.message}`);
      return;
    }

    // Add entry to stock_ledger for 'IN' event
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showError("User not authenticated for stock update.");
      return;
    }

    const { error: stockLedgerError } = await supabase.from("stock_ledger").insert({
      user_id: user.id,
      product_id: request.product_id,
      event_type: StockEventType.IN,
      quantity: request.received_quantity,
      to_warehouse_category: request.target_warehouse_category,
      notes: `Penerimaan dari permintaan pembelian #${request.item_code}. ${request.received_notes || ''}`,
      event_date: new Date().toISOString().split('T')[0], // Current date
    });

    if (stockLedgerError) {
      showError(`Gagal memperbarui ledger stok: ${stockLedgerError.message}`);
      // Optionally, revert purchase request status if stock update fails
      await supabase.from("purchase_requests").update({ status: request.status, received_at: request.received_at }).eq("id", request.id);
      return;
    }

    // Update or insert into warehouse_inventories
    const { data: existingInventory, error: inventoryFetchError } = await supabase
      .from("warehouse_inventories")
      .select("id, quantity")
      .eq("product_id", request.product_id)
      .eq("warehouse_category", request.target_warehouse_category)
      .single();

    if (inventoryFetchError && inventoryFetchError.code !== 'PGRST116') { // PGRST116 means no rows found
      showError(`Gagal memeriksa inventaris gudang: ${inventoryFetchError.message}`);
      return;
    }

    if (existingInventory) {
      // Update existing inventory
      const { error: updateInventoryError } = await supabase
        .from("warehouse_inventories")
        .update({ quantity: existingInventory.quantity + request.received_quantity, updated_at: new Date().toISOString() })
        .eq("id", existingInventory.id);

      if (updateInventoryError) {
        showError(`Gagal memperbarui inventaris gudang: ${updateInventoryError.message}`);
        return;
      }
    } else {
      // Insert new inventory entry
      const { error: insertInventoryError } = await supabase
        .from("warehouse_inventories")
        .insert({
          user_id: user.id,
          product_id: request.product_id,
          warehouse_category: request.target_warehouse_category,
          quantity: request.received_quantity,
        });

      if (insertInventoryError) {
        showError(`Gagal menambahkan ke inventaris gudang: ${insertInventoryError.message}`);
        return;
      }
    }

    showSuccess("Permintaan pembelian berhasil ditutup dan stok diperbarui!");
    queryClient.invalidateQueries({ queryKey: ["purchaseRequests"] });
    queryClient.invalidateQueries({ queryKey: ["stock_ledger"] });
    queryClient.invalidateQueries({ queryKey: ["warehouse_inventories"] });
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Terjadi Kesalahan!</AlertTitle>
        <AlertDescription>
          {error?.message || "Gagal memuat permintaan pembelian."}
          <div className="mt-2">
            <Button onClick={() => refetch()}>Coba Lagi</Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Permintaan Pembelian</h1>
        <Button onClick={handleAddRequest}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Permintaan
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Kode</TableHead>
              <TableHead>Kuantitas</TableHead>
              <TableHead>Harga Satuan</TableHead>
              <TableHead>Total Harga</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Dibuat</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseRequests?.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.item_name}</TableCell>
                <TableCell>{request.item_code}</TableCell>
                <TableCell>{request.quantity} {request.satuan}</TableCell>
                <TableCell>{request.unit_price?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                <TableCell>{request.total_price?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.status === PurchaseRequestStatus.PENDING ? "bg-yellow-100 text-yellow-800" :
                    request.status === PurchaseRequestStatus.APPROVED ? "bg-blue-100 text-blue-800" :
                    request.status === PurchaseRequestStatus.REJECTED ? "bg-red-100 text-red-800" :
                    request.status === PurchaseRequestStatus.WAITING_FOR_RECEIPT ? "bg-purple-100 text-purple-800" :
                    request.status === PurchaseRequestStatus.CLOSED ? "bg-green-100 text-green-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {request.status}
                  </span>
                </TableCell>
                <TableCell>{format(new Date(request.created_at), "dd/MM/yyyy HH:mm")}</TableCell>
                <TableCell className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditRequest(request)} title="Edit Permintaan">
                    <Edit className="h-4 w-4 text-gray-600" />
                  </Button>
                  {request.status === PurchaseRequestStatus.PENDING && (
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteRequest(request)} title="Hapus Permintaan">
                      <Trash className="h-4 w-4 text-red-600" />
                    </Button>
                  )}
                  {request.status !== PurchaseRequestStatus.CLOSED && (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => handleReceiptUploadClick(request)} title="Unggah PO/Inv">
                        <Receipt className="h-4 w-4 text-blue-600" />
                      </Button>
                      {request.document_url && (
                        <Button variant="ghost" size="icon" onClick={() => handleViewReceipt(request.document_url!)} title="Lihat PO/Inv">
                          <Eye className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      {request.status === PurchaseRequestStatus.WAITING_FOR_RECEIPT && (
                        <Button variant="ghost" size="icon" onClick={() => handleCloseRequest(request)} title="Tutup Permintaan & Perbarui Stok">
                          <FileText className="h-4 w-4 text-purple-600" />
                        </Button>
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedRequest ? "Edit Permintaan Pembelian" : "Tambah Permintaan Pembelian Baru"}</DialogTitle>
            <DialogDescription>
              {selectedRequest ? "Perbarui detail permintaan pembelian." : "Isi detail untuk permintaan pembelian baru."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit((data) => {
            if (selectedRequest) {
              updatePurchaseRequestMutation.mutate({ ...data, id: selectedRequest.id } as PurchaseRequest);
            } else {
              createPurchaseRequestMutation.mutate(data);
            }
          })} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product_id" className="text-right">
                Produk
              </Label>
              <Select
                onValueChange={(value) => setValue("product_id", value)}
                value={watch("product_id") || ""}
                disabled={loadingProducts}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Produk" />
                </SelectTrigger>
                <SelectContent>
                  {products?.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.nama_barang} ({product.kode_barang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.product_id && <p className="col-span-4 text-red-500 text-sm">{errors.product_id.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item_name" className="text-right">
                Nama Item
              </Label>
              <Input id="item_name" {...register("item_name")} className="col-span-3" readOnly={!!watch("product_id")} />
              {errors.item_name && <p className="col-span-4 text-red-500 text-sm">{errors.item_name.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item_code" className="text-right">
                Kode Item
              </Label>
              <Input id="item_code" {...register("item_code")} className="col-span-3" readOnly={!!watch("product_id")} />
              {errors.item_code && <p className="col-span-4 text-red-500 text-sm">{errors.item_code.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Kuantitas
              </Label>
              <Input id="quantity" type="number" {...register("quantity", { valueAsNumber: true })} className="col-span-3" />
              {errors.quantity && <p className="col-span-4 text-red-500 text-sm">{errors.quantity.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="satuan" className="text-right">
                Satuan
              </Label>
              <Input id="satuan" {...register("satuan")} className="col-span-3" readOnly={!!watch("product_id")} />
              {errors.satuan && <p className="col-span-4 text-red-500 text-sm">{errors.satuan.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit_price" className="text-right">
                Harga Satuan
              </Label>
              <Input id="unit_price" type="number" {...register("unit_price", { valueAsNumber: true })} className="col-span-3" />
              {errors.unit_price && <p className="col-span-4 text-red-500 text-sm">{errors.unit_price.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="suggested_selling_price" className="text-right">
                Harga Jual Disarankan
              </Label>
              <Input id="suggested_selling_price" type="number" {...register("suggested_selling_price", { valueAsNumber: true })} className="col-span-3" />
              {errors.suggested_selling_price && <p className="col-span-4 text-red-500 text-sm">{errors.suggested_selling_price.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="total_price" className="text-right">
                Total Harga
              </Label>
              <Input id="total_price" type="number" {...register("total_price", { valueAsNumber: true })} className="col-span-3" readOnly />
              {errors.total_price && <p className="col-span-4 text-red-500 text-sm">{errors.total_price.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier_id" className="text-right">
                Supplier
              </Label>
              <Select
                onValueChange={(value) => setValue("supplier_id", value)}
                value={watch("supplier_id") || ""}
                disabled={loadingSuppliers}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers?.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.supplier_id && <p className="col-span-4 text-red-500 text-sm">{errors.supplier_id.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Catatan
              </Label>
              <Textarea id="notes" {...register("notes")} className="col-span-3" />
              {errors.notes && <p className="col-span-4 text-red-500 text-sm">{errors.notes.message}</p>}
            </div>
            {selectedRequest && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    onValueChange={(value: PurchaseRequestStatus) => setValue("status", value)}
                    value={watch("status")}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(PurchaseRequestStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="col-span-4 text-red-500 text-sm">{errors.status.message}</p>}
                </div>
                {watch("status") === PurchaseRequestStatus.CLOSED && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="received_quantity" className="text-right">
                        Kuantitas Diterima
                      </Label>
                      <Input id="received_quantity" type="number" {...register("received_quantity", { valueAsNumber: true })} className="col-span-3" />
                      {errors.received_quantity && <p className="col-span-4 text-red-500 text-sm">{errors.received_quantity.message}</p>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="returned_quantity" className="text-right">
                        Kuantitas Dikembalikan
                      </Label>
                      <Input id="returned_quantity" type="number" {...register("returned_quantity", { valueAsNumber: true })} className="col-span-3" />
                      {errors.returned_quantity && <p className="col-span-4 text-red-500 text-sm">{errors.returned_quantity.message}</p>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="damaged_quantity" className="text-right">
                        Kuantitas Rusak
                      </Label>
                      <Input id="damaged_quantity" type="number" {...register("damaged_quantity", { valueAsNumber: true })} className="col-span-3" />
                      {errors.damaged_quantity && <p className="col-span-4 text-red-500 text-sm">{errors.damaged_quantity.message}</p>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="target_warehouse_category" className="text-right">
                        Gudang Target
                      </Label>
                      <Select
                        onValueChange={(value) => setValue("target_warehouse_category", value)}
                        value={watch("target_warehouse_category") || ""}
                        disabled={loadingCategories}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Pilih Kategori Gudang" />
                        </SelectTrigger>
                        <SelectContent>
                          {warehouseCategories?.map((category) => (
                            <SelectItem key={category.id} value={category.code}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.target_warehouse_category && <p className="col-span-4 text-red-500 text-sm">{errors.target_warehouse_category.message}</p>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="received_notes" className="text-right">
                        Catatan Penerimaan
                      </Label>
                      <Textarea id="received_notes" {...register("received_notes")} className="col-span-3" />
                      {errors.received_notes && <p className="col-span-4 text-red-500 text-sm">{errors.received_notes.message}</p>}
                    </div>
                  </>
                )}
              </>
            )}
            <DialogFooter>
              <Button type="submit" disabled={createPurchaseRequestMutation.isPending || updatePurchaseRequestMutation.isPending}>
                {(createPurchaseRequestMutation.isPending || updatePurchaseRequestMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {selectedRequest ? "Simpan Perubahan" : "Buat Permintaan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus permintaan pembelian "{selectedRequest?.item_name}"? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deletePurchaseRequestMutation.isPending}>
              {deletePurchaseRequestMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unggah PO/Inv</DialogTitle>
            <DialogDescription>
              Unggah dokumen PO/Inv untuk permintaan pembelian "{selectedRequest?.item_name}".
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input type="file" onChange={handleFileChange} />
            {fileToUpload && <p className="text-sm text-muted-foreground">File terpilih: {fileToUpload.name}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Batal</Button>
            <Button onClick={handleFileUpload} disabled={!fileToUpload}>
              {createPurchaseRequestMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Unggah
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewReceiptDialogOpen} onOpenChange={setIsViewReceiptDialogOpen}>
        <DialogContent className="sm:max-w-[800px] h-[90vh]">
          <DialogHeader>
            <DialogTitle>Lihat PO/Inv</DialogTitle>
            <DialogDescription>
              Dokumen PO/Inv untuk permintaan pembelian "{selectedRequest?.item_name}".
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow">
            {currentReceiptUrl ? (
              <iframe src={currentReceiptUrl} className="w-full h-full border-0" title="Purchase Receipt"></iframe>
            ) : (
              <p>Tidak ada dokumen untuk ditampilkan.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewReceiptDialogOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseRequestPage;