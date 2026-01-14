"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SchedulingRequest } from "@/types/data";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import AddSchedulingRequestForm from "@/components/AddSchedulingRequestForm";
import ViewSchedulingRequestDetailsDialog from "@/components/ViewSchedulingRequestDetailsDialog";
import PaginationControls from "@/components/PaginationControls";
import { format } from "date-fns";
import { Loader2, CheckCircle, XCircle, Eye, Trash2, PlusCircle, Truck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "@/components/SessionContextProvider";

const SchedulingRequestPage = () => {
  const { session } = useSession();
  const [requests, setRequests] = useState<SchedulingRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<SchedulingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [requestToView, setRequestToView] = useState<SchedulingRequest | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchSchedulingRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("scheduling_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const requestsWithNo: SchedulingRequest[] = data.map((req, index) => ({
        ...req,
        no: index + 1,
      }));

      setRequests(requestsWithNo);
      setFilteredRequests(requestsWithNo);
      setCurrentPage(1);
    } catch (err: any) {
      setError(`Gagal memuat permintaan penjadwalan: ${err.message}`);
      console.error("Error fetching scheduling requests:", err);
      showError("Gagal memuat permintaan penjadwalan.");
      setRequests([]);
      setFilteredRequests([]);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchSchedulingRequests();
  }, [fetchSchedulingRequests]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = requests.filter(item =>
      item.customer_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.company_name?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.type.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.full_address.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.contact_person.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.phone_number.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.notes?.toLowerCase().includes(lowerCaseSearchTerm) ||
      format(new Date(item.requested_date), "dd-MM-yyyy").includes(lowerCaseSearchTerm)
    );
    setFilteredRequests(filtered);
    setCurrentPage(1);
  }, [searchTerm, requests]);

  const handleApproveRequest = async (request: SchedulingRequest) => {
    if (!window.confirm(`Apakah Anda yakin ingin MENYETUJUI permintaan penjadwalan untuk "${request.customer_name}"? Ini akan membuat Delivery Order baru.`)) {
      return;
    }

    try {
      // 1. Update scheduling_request status to 'approved'
      const { error: updateReqError } = await supabase
        .from("scheduling_requests")
        .update({ status: "approved" })
        .eq("id", request.id);

      if (updateReqError) {
        throw updateReqError;
      }

      // 2. Create a new Delivery Order
      const doNumber = `DO-${format(new Date(), "yyMMddHHmm")}-${Math.floor(Math.random() * 1000)}`;
      const { error: createDoError } = await supabase
        .from("delivery_orders")
        .insert({
          request_id: request.id,
          user_id: session?.user?.id,
          do_number: doNumber,
          delivery_date: request.requested_date,
          delivery_time: request.requested_time || null,
          status: "pending", // Initial status for DO
          notes: `Dibuat dari permintaan penjadwalan #${request.no} (${request.customer_name})`,
          // items_json can be populated later if needed, or from a more detailed request form
        });

      if (createDoError) {
        // If DO creation fails, consider rolling back the request status or logging a critical error
        console.error("Error creating Delivery Order:", createDoError);
        showError(`Gagal membuat Delivery Order: ${createDoError.message}. Permintaan penjadwalan disetujui, tetapi DO gagal dibuat.`);
        // Optionally, revert request status:
        // await supabase.from("scheduling_requests").update({ status: "pending" }).eq("id", request.id);
        return;
      }

      showSuccess(`Permintaan penjadwalan untuk "${request.customer_name}" berhasil disetujui dan Delivery Order #${doNumber} berhasil dibuat!`);
      fetchSchedulingRequests(); // Refresh the list
    } catch (err: any) {
      showError(`Gagal menyetujui permintaan: ${err.message}`);
      console.error("Error approving scheduling request:", err);
    }
  };

  const handleRejectRequest = async (request: SchedulingRequest) => {
    if (!window.confirm(`Apakah Anda yakin ingin MENOLAK permintaan penjadwalan untuk "${request.customer_name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("scheduling_requests")
        .update({ status: "rejected" })
        .eq("id", request.id);

      if (error) {
        throw error;
      }

      showSuccess(`Permintaan penjadwalan untuk "${request.customer_name}" berhasil ditolak.`);
      fetchSchedulingRequests(); // Refresh the list
    } catch (err: any) {
      showError(`Gagal menolak permintaan: ${err.message}`);
      console.error("Error rejecting scheduling request:", err);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus permintaan penjadwalan ini?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("scheduling_requests")
        .delete()
        .eq("id", requestId);

      if (error) {
        throw error;
      }

      showSuccess("Permintaan penjadwalan berhasil dihapus!");
      fetchSchedulingRequests(); // Refresh the list
    } catch (err: any) {
      showError(`Gagal menghapus permintaan penjadwalan: ${err.message}`);
      console.error("Error deleting scheduling request:", err);
    }
  };

  const handleViewDetails = (request: SchedulingRequest) => {
    setRequestToView(request);
    setIsViewDetailsOpen(true);
  };

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredRequests.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getRequestTypeDisplay = (type: 'instalasi' | 'service' | 'kirim') => {
    switch (type) {
      case 'instalasi': return 'Instalasi';
      case 'service': return 'Servis';
      case 'kirim': return 'Kirim Barang';
      default: return type;
    }
  };

  const getStatusColor = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Manajemen Permintaan Penjadwalan</CardTitle>
          <CardDescription>Memuat daftar permintaan penjadwalan...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">Memuat data permintaan penjadwalan...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-2xl font-semibold">Manajemen Permintaan Penjadwalan</CardTitle>
          <AddSchedulingRequestForm onSuccess={fetchSchedulingRequests} />
        </div>
        <CardDescription>Kelola semua permintaan penjadwalan instalasi, servis, atau pengiriman.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
        <div className="flex flex-col md:flex-row gap-4 mb-4 flex-wrap">
          <Input
            type="text"
            placeholder="Cari berdasarkan konsumen, perusahaan, alamat, kontak, atau telepon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Disetujui</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => { setSearchTerm(""); setFilterStatus("all"); }} variant="outline">
            Reset Filter
          </Button>
        </div>

        {filteredRequests.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Konsumen</TableHead>
                    <TableHead>Perusahaan</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Tanggal Diminta</TableHead>
                    <TableHead>Waktu Diminta</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Kontak Person</TableHead>
                    <TableHead>No. Telepon</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.no}</TableCell>
                      <TableCell>{request.customer_name}</TableCell>
                      <TableCell>{request.company_name || "-"}</TableCell>
                      <TableCell>{getRequestTypeDisplay(request.type)}</TableCell>
                      <TableCell>{format(new Date(request.requested_date), "dd-MM-yyyy")}</TableCell>
                      <TableCell>{request.requested_time || "-"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{request.full_address}</TableCell>
                      <TableCell>{request.contact_person}</TableCell>
                      <TableCell>{request.phone_number}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center flex items-center justify-center space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(request)} title="Lihat Detail">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {request.status === "pending" && (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => handleApproveRequest(request)} title="Setujui Permintaan">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleRejectRequest(request)} title="Tolak Permintaan">
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        {(request.status === "pending" || session?.user?.user_metadata.role === 'admin') && (
                          <Button variant="destructive" size="icon" onClick={() => handleDeleteRequest(request.id)} title="Hapus">
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
          <p className="text-gray-700 dark:text-gray-300">Tidak ada permintaan penjadwalan yang tersedia atau cocok dengan pencarian Anda.</p>
        )}
      </CardContent>

      {requestToView && (
        <ViewSchedulingRequestDetailsDialog
          request={requestToView}
          isOpen={isViewDetailsOpen}
          onOpenChange={setIsViewDetailsOpen}
        />
      )}
    </Card>
  );
};

export default SchedulingRequestPage;