"use client";

import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScheduleWithDetails } from "@/types/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Share2, Printer } from "lucide-react";
import { showError } from "@/utils/toast";
import { format, parseISO } from "date-fns";
import { Separator } from "@/components/ui/separator";

const ScheduleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: schedule, isLoading, error } = useQuery<ScheduleWithDetails, Error>({
    queryKey: ["schedule", id],
    queryFn: async () => {
      if (!id) throw new Error("Schedule ID is missing.");
      const { data, error } = await supabase
        .from("schedules")
        .select(`
          *,
          customers (customer_name, company_name, phone_number, address, customer_type),
          invoices (invoice_number)
        `)
        .eq("id", id)
        .single();

      if (error) {
        showError("Gagal memuat detail jadwal.");
        throw error;
      }
      if (!data) {
        throw new Error("Jadwal tidak ditemukan.");
      }
      return data as ScheduleWithDetails;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Gagal memuat detail jadwal.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error.message}</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!schedule) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Jadwal Tidak Ditemukan</CardTitle>
          <CardDescription>Jadwal dengan ID ini tidak ada.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate(-1)} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
        </CardContent>
      </Card>
    );
  }

  const scheduleUrl = `${window.location.origin}/schedules/${schedule.id}`;
  const whatsappText = encodeURIComponent(`Detail Jadwal:\nDO Number: ${schedule.do_number || '-'}\nPelanggan: ${schedule.customer_name}\nTanggal: ${format(new Date(schedule.schedule_date), 'dd-MM-yyyy')}\nWaktu: ${schedule.schedule_time || '-'}\nTeknisi: ${schedule.technician_name || '-'}\nAlamat: ${schedule.address || '-'}\n\nLihat selengkapnya di: ${scheduleUrl}`);

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => window.open(`https://wa.me/?text=${whatsappText}`, '_blank')}
          >
            <Share2 className="mr-2 h-4 w-4" /> Bagikan via WhatsApp
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(`/print/schedule/${schedule.id}`, '_blank')}
          >
            <Printer className="mr-2 h-4 w-4" /> Cetak
          </Button>
        </div>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Detail Jadwal: {schedule.do_number || 'N/A'}</CardTitle>
          <CardDescription>Informasi lengkap mengenai jadwal ini.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Informasi Umum</h3>
            <p><strong>DO Number:</strong> {schedule.do_number || '-'}</p>
            <p><strong>Tipe:</strong> {schedule.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
            <p><strong>Kategori Produk:</strong> {schedule.product_category ? schedule.product_category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '-'}</p>
            <p><strong>Tanggal Jadwal:</strong> {format(new Date(schedule.schedule_date), "dd MMMM yyyy")}</p>
            <p><strong>Waktu Jadwal:</strong> {schedule.schedule_time || '-'}</p>
            <p><strong>Status:</strong> {schedule.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
            <p><strong>Teknisi:</strong> {schedule.technician_name || '-'}</p>
            <p><strong>Layanan Kurir:</strong> {schedule.courier_service || '-'}</p>
            <p><strong>Invoice Terkait:</strong> {schedule.invoices?.invoice_number ? <Link to={`/invoices/${schedule.invoice_id}`} className="text-blue-600 hover:underline">{schedule.invoices.invoice_number}</Link> : '-'}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Detail Pelanggan</h3>
            <p><strong>Nama Pelanggan:</strong> {schedule.customers?.customer_name || schedule.customer_name}</p>
            <p><strong>Perusahaan:</strong> {schedule.customers?.company_name || '-'}</p>
            <p><strong>Tipe Pelanggan:</strong> {schedule.customers?.customer_type ? schedule.customers.customer_type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '-'}</p>
            <p><strong>Nomor Telepon:</strong> {schedule.customers?.phone_number || schedule.phone_number || '-'}</p>
            <p><strong>Alamat:</strong> {schedule.customers?.address || schedule.address || '-'}</p>
          </div>
          <div className="md:col-span-2">
            <Separator className="my-4" />
            <h3 className="text-lg font-semibold mb-2">Catatan</h3>
            <p className="whitespace-pre-wrap">{schedule.notes || 'Tidak ada catatan.'}</p>
          </div>
          <div className="md:col-span-2">
            <Separator className="my-4" />
            <h3 className="text-lg font-semibold mb-2">Dokumen</h3>
            {schedule.document_url ? (
              <a href={schedule.document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Lihat Dokumen
              </a>
            ) : (
              <p>Tidak ada dokumen terlampir.</p>
            )}
          </div>
          <div className="md:col-span-2 text-sm text-muted-foreground mt-4">
            <p>Dibuat pada: {format(parseISO(schedule.created_at), 'dd MMMM yyyy HH:mm')}</p>
            <p>Terakhir diperbarui: {format(parseISO(schedule.updated_at), 'dd MMMM yyyy HH:mm')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleDetailPage;