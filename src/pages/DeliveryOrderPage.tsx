"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DeliveryOrder } from "@/types/data";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import ViewDeliveryOrderDetailsDialog from "@/components/ViewDeliveryOrderDetailsDialog";
import PaginationControls from "@/components/PaginationControls";
import { format } from "date-fns";
import { Loader2, Eye, Trash2, CalendarPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "@/components/SessionContextProvider";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddScheduleForm from "@/components/AddScheduleForm"; // Import AddScheduleForm

const DeliveryOrderPage = () => {
  const { session } = useSession();
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([]);
  const [filteredDeliveryOrders, setFilteredDeliveryOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [deliveryOrderToView, setDeliveryOrderToView] = useState<DeliveryOrder | null>(null);

  const [isConvertScheduleOpen, setIsConvertScheduleOpen] = useState(false);
  const [deliveryOrderToConvert, setDeliveryOrderToConvert] = useState<DeliveryOrder | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchDeliveryOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("delivery_orders")
        .select(`
          *,
          scheduling_requests (
            customer_name,
            type,
            requested_date,
            requested_time,
            full_address,
            phone_number
          )
        `)
        .order("created_at", { ascending: false });

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const ordersWithNo: DeliveryOrder[] = data.map((order, index) => ({
        ...order,
        no: index + 1,
      }));

      setDeliveryOrders(ordersWithNo);
      setFilteredDeliveryOrders(ordersWithNo);
      setCurrentPage(1);
    } catch (err: any) {
      setError(`Gagal memuat Delivery Order: ${err.message}`);
      console.error("Error fetching delivery orders:", err);
      showError("Gagal memuat Delivery Order.");
      setDeliveryOrders([]);
      setFilteredDeliveryOrders([]);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchDeliveryOrders();
  }, [fetchDeliveryOrders]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = deliveryOrders.filter(item =>
      item.do_number.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.scheduling_requests?.customer_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.scheduling_requests?.full_address.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.status.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.notes?.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredDeliveryOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, deliveryOrders]);

  const handleDeleteDeliveryOrder = async (orderId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus Delivery Order ini?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("delivery_orders")
        .delete()
        .eq("id", orderId);

      if (error) {
        throw error;
      }

      showSuccess("Delivery Order berhasil dihapus!");
      fetchDeliveryOrders(); // Refresh the list
    } catch (err: any) {
      showError(`Gagal menghapus Delivery Order: ${err.message}`);
      console.error("Error deleting delivery order:", err);
    }
  };

  const handleViewDetails = (order: DeliveryOrder) => {
    setDeliveryOrderToView(order);
    setIsViewDetailsOpen(true);
  };

  const handleConvertToSchedule = (order: DeliveryOrder) => {
    setDeliveryOrderToConvert(order);
    setIsConvertScheduleOpen(true);
  };

  const totalPages = Math.ceil(filteredDeliveryOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredDeliveryOrders.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: 'pending' | 'in progress' | 'completed' | 'cancelled') => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestTypeDisplay = (type?: 'instalasi' | 'service' | 'kirim') => {
    switch (type) {
      case 'instalasi': return 'Instalasi';
      case 'service': return 'Servis';
      case 'kirim': return 'Kirim Barang';
      default: return '-';
    }
  };

  if (loading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Manajemen Delivery Order</CardTitle>
          <CardDescription>Memuat daftar Delivery Order...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">Memuat data Delivery Order...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-2xl font-semibold">Manajemen Delivery Order</CardTitle>
          {/* No direct add button for DO, as they are created from approved scheduling requests */}
        </div>
        <CardDescription>Kelola semua Delivery Order yang telah disetujui dari permintaan penjadwalan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
        <div className="flex flex-col md:flex-row gap-4 mb-4 flex-wrap">
          <Input
            type="text"
            placeholder="Cari berdasarkan nomor DO, konsumen, alamat, atau status..."
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
              <SelectItem value="in progress">Dalam Proses</SelectItem>
              <SelectItem value="completed">Selesai</SelectItem>
              <SelectItem value="cancelled">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => { setSearchTerm(""); setFilterStatus("all"); }} variant="outline">
            Reset Filter
          </Button>
        </div>

        {filteredDeliveryOrders.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nomor DO</TableHead>
                    <TableHead>Konsumen</TableHead>
                    <TableHead>Tipe Permintaan</TableHead>
                    <TableHead>Tanggal Pengiriman</TableHead>
                    <TableHead>Waktu Pengiriman</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Catatan</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.no}</TableCell>
                      <TableCell>{order.do_number}</TableCell>
                      <TableCell>{order.scheduling_requests?.customer_name || "-"}</TableCell>
                      <TableCell>{getRequestTypeDisplay(order.scheduling_requests?.type)}</TableCell>
                      <TableCell>{format(new Date(order.delivery_date), "dd-MM-yyyy")}</TableCell>
                      <TableCell>{order.delivery_time || "-"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{order.scheduling_requests?.full_address || "-"}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{order.notes || "-"}</TableCell>
                      <TableCell className="text-center flex items-center justify-center space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(order)} title="Lihat Detail">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {order.status === "pending" && ( // Only allow conversion if DO is pending
                          <Button variant="ghost" size="icon" onClick={() => handleConvertToSchedule(order)} title="Buat Jadwal dari DO">
                            <CalendarPlus className="h-4 w-4" />
                          </Button>
                        )}
                        {(order.status === "pending" || session?.user?.user_metadata.role === 'admin') && (
                          <Button variant="destructive" size="icon" onClick={() => handleDeleteDeliveryOrder(order.id)} title="Hapus">
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
          <p className="text-gray-700 dark:text-gray-300">Tidak ada Delivery Order yang tersedia atau cocok dengan pencarian Anda.</p>
        )}
      </CardContent>

      {deliveryOrderToView && (
        <ViewDeliveryOrderDetailsDialog
          deliveryOrder={deliveryOrderToView}
          isOpen={isViewDetailsOpen}
          onOpenChange={setIsViewDetailsOpen}
        />
      )}

      {deliveryOrderToConvert && (
        <Dialog open={isConvertScheduleOpen} onOpenChange={setIsConvertScheduleOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Buat Jadwal dari Delivery Order #{deliveryOrderToConvert.do_number}</DialogTitle>
            </DialogHeader>
            <AddScheduleForm
              onSuccess={() => {
                fetchDeliveryOrders(); // Refresh DOs after schedule creation
                setIsConvertScheduleOpen(false);
              }}
              onOpenChange={setIsConvertScheduleOpen}
              initialData={{
                customer_name: deliveryOrderToConvert.scheduling_requests?.customer_name || "",
                address: deliveryOrderToConvert.scheduling_requests?.full_address || "",
                phone_number: deliveryOrderToConvert.scheduling_requests?.phone_number || "",
                schedule_date: deliveryOrderToConvert.delivery_date ? new Date(deliveryOrderToConvert.delivery_date) : new Date(),
                schedule_time: deliveryOrderToConvert.delivery_time || "",
                type: deliveryOrderToConvert.scheduling_requests?.type === 'kirim' ? 'kirim' : 'instalasi', // Map request type to schedule type
                notes: `Jadwal dibuat dari Delivery Order #${deliveryOrderToConvert.do_number}`,
                delivery_order_id: deliveryOrderToConvert.id, // Pass the DO ID
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default DeliveryOrderPage;