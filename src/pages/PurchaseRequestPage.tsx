"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash, Receipt, Eye, Loader2, FileText, CheckCircle } from "lucide-react"; // Import CheckCircle icon
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
  pr_number: z.string().optional(), // Added pr_number to schema
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

const generatePrNumber = async (): Promise<string> => {
  const today = format(new Date(), "yyyy-MM-dd");
  const prefix = `PR-${format(new Date(), "yyyyMMdd")}`;

  // Fetch the count of PRs created today
  const { data, error } = await supabase
    .from("purchase_requests")
    .select("pr_number")
    .like("pr_number", `${prefix}%`)
    .order("pr_number", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error fetching latest PR number:", error);
    // Fallback to a less ideal but unique number
    return `${prefix}-${Date.now().toString().slice(-4)}`;
  }

  let sequence = 1;
  if (data && data.length > 0 && data[0].pr_number) {
    const latestPrNumber = data[0].pr_number;
    const parts = latestPrNumber.split('-');
    const lastPart = parts[parts.length - 1];
    const currentSequence = parseInt(lastPart, 10);
    if (!isNaN(currentSequence)) {
      sequence = currentSequence + 1;
    }
  }

  return `${prefix}-${String(sequence).padStart(4, '0')}`;
};

const PurchaseRequestPage = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewReceiptDialogOpen, setIsViewReceiptDialogOpen] = useState(false);
  const [isCloseRequestDialogOpen, setIsCloseRequestDialogOpen] = useState(false);
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
      pr_number: "", // Added default value
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

  const approvePurchaseRequestMutation = useMutation({
    mutationFn: async (request: PurchaseRequest) => {
      const { data, error } = await supabase
        .from("purchase_requests")
        .update({ status: PurchaseRequestStatus.APPROVED })
        .eq("id", request.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchaseRequests"] });
      showSuccess("Permintaan pembelian berhasil disetujui!");
      setSelectedRequest(null);
    },
    onError: (err) => {
      showError(`Gagal menyetujui permintaan pembelian: ${err.message}`);
    },
  });

  const confirmCloseRequestMutation = useMutation({
    mutationFn: async (formData: z.infer<typeof purchaseRequestSchema>) => {
      if (!selectedRequest || !selectedRequest.id) throw new Error("Permintaan tidak valid.");

      // Use selectedRequest.document_url for the check
      if (!selectedRequest.document_url) {
        throw new Error("Tidak dapat menutup permintaan. Resi/dokumen PO/Inv belum diunggah.");
      }
      if (!formData.received_quantity || formData.received_quantity <= 0) {
        throw new Error("Tidak dapat menutup permintaan. Kuantitas diterima harus lebih besar dari 0.");
      }
      if (!formData.target_warehouse_category) {
        throw new Error("Tidak dapat menutup permintaan. Kategori gudang target belum ditentukan.");
      }

      // 1. Update purchase request status to 'closed' and other received details
      const { error: updateRequestError } = await supabase
        .from("purchase_requests")
        .update({
          status: PurchaseRequestStatus.CLOSED,
          received_at: new Date().toISOString(),
          received_quantity: formData.received_quantity,
          returned_quantity: formData.returned_quantity,
          damaged_quantity: formData.damaged_quantity,
          target_warehouse_category: formData.target_warehouse_category,
          received_notes: formData.received_notes,
        })
        .eq("id", selectedRequest.id);

      if (updateRequestError) throw new Error(`Gagal menutup permintaan pembelian: ${updateRequestError.message}`);

      // 2. Add entry to stock_ledger for 'IN' event
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated for stock update.");

      const { error: stockLedgerError } = await supabase.from("stock_ledger").insert({
        user_id: user.id,
        product_id: selectedRequest.product_id,
        event_type: StockEventType.IN,
        quantity: formData.received_quantity,
        to_warehouse_category: formData.target_warehouse_category,
        notes: `Penerimaan dari permintaan pembelian #${selectedRequest.pr_number || selectedRequest.item_code}. ${formData.received_notes || ''}`, // Included pr_number
        event_date: new Date().toISOString().split('T')[0],
      });

      if (stockLedgerError) {
        await supabase.from("purchase_requests").update({ status: selectedRequest.status, received_at: selectedRequest.received_at }).eq("id", selectedRequest.id);
        throw new Error(`Gagal memperbarui ledger stok: ${stockLedgerError.message}`);
      }

      // 3. Update or insert into warehouse_inventories
      const { data: existingInventory, error: inventoryFetchError } = await supabase
        .from("warehouse_inventories")
        .select("id, quantity")
        .eq("product_id", selectedRequest.product_id)
        .eq("warehouse_category", formData.target_warehouse_category)
        .single();

      if (inventoryFetchError && inventoryFetchError.code !== 'PGRST116') {
        throw new Error(`Gagal memeriksa inventaris gudang: ${inventoryFetchError.message}`);
      }

      if (existingInventory) {
        const { error: updateInventoryError } = await supabase
          .from("warehouse_inventories")
          .update({ quantity: existingInventory.quantity + formData.received_quantity })
          .eq("id", existingInventory.id);
        if (updateInventoryError) throw new Error(`Gagal memperbarui inventaris gudang: ${updateInventoryError.message}`);
      } else {
        const { error: insertInventoryError } = await supabase
          .from("warehouse_inventories")
          .insert({
            user_id: user.id,
            product_id: selectedRequest.product_id,
            warehouse_category: formData.target_warehouse_category,
            quantity: formData.received_quantity,
          });
        if (insertInventoryError) throw new Error(`Gagal menambahkan ke inventaris gudang: ${insertInventoryError.message}`);
      }
      return formData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchaseRequests"] });
      queryClient.invalidateQueries({ queryKey: ["stock_ledger"] });
      queryClient.invalidateQueries({ queryKey: ["warehouse_inventories"] });
      showSuccess("Permintaan pembelian berhasil ditutup dan stok diperbarui!");
      setIsCloseRequestDialogOpen(false);
      setSelectedRequest(null);
      form.reset();
    },
    onError: (err) => {
      showError(`Gagal menutup permintaan pembelian: ${err.message}`);
    },
  });

  const handleAddRequest = async () => { // Made async to await generatePrNumber
    setSelectedRequest(null);
    const newPrNumber = await generatePrNumber(); // Generate PR number
    reset({
      pr_number: newPrNumber, // Set generated PR number
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
      pr_number: request.pr_number || "", // Ensure pr_number is set for edit
      quantity: request.quantity || 0,
      unit_price: request.unit_price || 0,
      suggested_selling_price: request.suggested_selling_price || 0,
      total_price: request.total_price || 0,
      status: request.status || PurchaseRequestStatus.PENDING,
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

  const handleApproveRequest = (request: PurchaseRequest) => {
    setSelectedRequest(request);
    approvePurchaseRequestMutation.mutate(request);
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
    const filePath = `purchase_documents/${fileName}`;

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
      .update({ 
        document_url: publicUrl, 
        status: PurchaseRequestStatus.WAITING_FOR_RECEIVED // Set status to WAITING_FOR_RECEIVED after upload
      }) 
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

  const handleCloseRequest = (request: PurchaseRequest) => {
    setSelectedRequest(request);
    form.reset({
      ...request,
      received_quantity: request.received_quantity || request.quantity, // Default to requested quantity
      returned_quantity: request.returned_quantity || 0,
      damaged_quantity: request.damaged_quantity || 0,
      target_warehouse_category: request.target_warehouse_category || null,
      received_notes: request.received_notes || "",
    });
    setIsCloseRequestDialogOpen(true);
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

  const getStatusDisplay = (status: PurchaseRequestStatus) => {
    switch (status) {
      case PurchaseRequestStatus.PENDING:
        return "Pending";
      case PurchaseRequestStatus.APPROVED:
        return "Approved";
      case PurchaseRequestStatus.REJECTED:
        return "Rejected";
      case PurchaseRequestStatus.WAITING_FOR_RECEIVED:
        return "Waiting for Received"; // Updated display text
      case PurchaseRequestStatus.CLOSED:
        return "Closed";
      default:
        return status;
    }
  };

  const getStatusClasses = (status: PurchaseRequestStatus) => {
    switch (status) {
      case PurchaseRequestStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case PurchaseRequestStatus.APPROVED:
        return "bg-blue-100 text-blue-800";
      case PurchaseRequestStatus.REJECTED:
        return "bg-red-100 text-red-800";
      case PurchaseRequestStatus.WAITING_FOR_RECEIVED:
        return "bg-purple-100 text-purple-800"; // Keep purple for this status
      case PurchaseRequestStatus.CLOSED:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
              <TableHead>No. PR</TableHead>
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
                <TableCell>{request.pr_number || "-"}</TableCell>
                <TableCell>{request.item_name}</TableCell>
                <TableCell>{request.item_code}</TableCell>
                <TableCell>{request.quantity} {request.satuan}</TableCell>
                <TableCell>{request.unit_price?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                <TableCell>{request.total_price?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(request.status)}`}>
                    {getStatusDisplay(request.status)}
                  </span>
                </TableCell>
                <TableCell>{format(new Date(request.created_at), "dd/MM/yyyy HH:mm")}</TableCell>
                <TableCell className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditRequest(request)} title="Edit Permintaan">
                    <Edit className="h-4 w-4 text-gray-600" />
                  </Button>
                  {request.status === PurchaseRequestStatus.PENDING && (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => handleApproveRequest(request)} title="Setujui Permintaan">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteRequest(request)} title="Hapus Permintaan">
                        <Trash className="h-4 w-4 text-red-600" />
                      </Button>
                    </>
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
                      {request.status === PurchaseRequestStatus.WAITING_FOR_RECEIVED && (
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
              <Label htmlFor="pr_number" className="text-right">
                No. PR
              </Label>
              <Input id="pr_number" {...register("pr_number")} className="col-span-3" readOnly />
              {errors.pr_number && <p className="col-span-4 text-red-500 text-sm">{errors.pr_number.message}</p>}
            </div>
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
                          {getStatusDisplay(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="col-span-4 text-red-500 text-sm">{errors.status.message}</p>}
                </div>
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

      {/* New Dialog for Closing Purchase Request */}
      <Dialog open={isCloseRequestDialogOpen} onOpenChange={setIsCloseRequestDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tutup Permintaan Pembelian & Perbarui Stok</DialogTitle>
            <DialogDescription>
              Konfirmasi detail penerimaan untuk permintaan "{selectedRequest?.item_name}".
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit((data) => confirmCloseRequestMutation.mutate(data))} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pr_number_display" className="text-right">
                No. PR
              </Label>
              <Input id="pr_number_display" value={selectedRequest?.pr_number || "-"} className="col-span-3" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="requested_quantity" className="text-right">
                Kuantitas Diajukan
              </Label>
              <Input id="requested_quantity" value={selectedRequest?.quantity || 0} className="col-span-3" readOnly />
            </div>
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
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCloseRequestDialogOpen(false)}>Batal</Button>
              <Button type="submit" disabled={confirmCloseRequestMutation.isPending}>
                {confirmCloseRequestMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Konfirmasi & Tutup
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseRequestPage;