"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ScheduleWithDetails, InvoiceItem } from "@/types/data";
import { Loader2, Printer } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

const PrintSchedulePage = () => {
  const { id } = useParams<{ id: string }>();
  const [schedule, setSchedule] = useState<ScheduleWithDetails | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // Fetch Schedule details
        const { data: scheduleData, error: scheduleError } = await supabase
          .from("schedules")
          .select(`
            *,
            invoices (invoice_number),
            scheduling_requests (sr_number)
          `)
          .eq("id", id)
          .single();

        if (scheduleError) throw scheduleError;
        
        const scheduleWithDetails = {
            ...scheduleData,
            invoice_number: scheduleData.invoices?.invoice_number,
            sr_number: scheduleData.scheduling_requests?.sr_number
        }
        setSchedule(scheduleWithDetails as ScheduleWithDetails); // Cast to ScheduleWithDetails

        // If linked to an invoice, fetch items
        if (scheduleData.invoice_id) {
          const { data: itemsData, error: itemsError } = await supabase
            .from("invoice_items")
            .select("*") // Select all columns for InvoiceItem
            .eq("invoice_id", scheduleData.invoice_id);

          if (!itemsError && itemsData) {
            setItems(itemsData as InvoiceItem[]); // Cast to InvoiceItem[]
          }
        }

      } catch (err: any) {
        console.error("Error fetching schedule for print:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !schedule) {
    return (
      <div className="p-8 text-center text-red-500">
        <h1>Error loading document</h1>
        <p>{error || "Schedule not found"}</p>
      </div>
    );
  }

  const isDelivery = schedule.type === 'kirim';
  const documentTitle = isDelivery ? "SURAT JALAN (DELIVERY ORDER)" : "SURAT PERINTAH KERJA (SPK)";

  return (
    <div className="min-h-screen bg-white p-8 text-black print:p-0">
      {/* Print Controls */}
      <div className="mb-8 flex justify-end print:hidden">
        <Button onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" /> Cetak Dokumen
        </Button>
      </div>

      {/* Document Container */}
      <div className="mx-auto max-w-[210mm] border p-8 print:border-0 print:p-0">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between border-b pb-8">
          <div className="w-1/2">
            <h2 className="text-xl font-bold">Budi Karya Teknologi</h2>
            <p className="text-sm text-gray-500">Jl. Contoh No. 123</p>
            <p className="text-sm text-gray-500">Jakarta, Indonesia</p>
          </div>
          <div className="w-1/2 text-right">
            <h1 className="text-2xl font-bold text-gray-900">{documentTitle}</h1>
            <p className="mt-2 text-sm"><strong>No. DO:</strong> {schedule.do_number || "-"}</p>
            <p className="text-sm"><strong>No. SR:</strong> {schedule.sr_number || "-"}</p>
            <p className="text-sm"><strong>Tanggal:</strong> {format(new Date(schedule.schedule_date), "dd MMMM yyyy")}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mb-8 grid grid-cols-2 gap-8">
          <div>
            <h3 className="mb-2 font-bold text-gray-700 bg-gray-100 p-1">CUSTOMER:</h3>
            <p className="font-semibold">{schedule.customer_name}</p>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{schedule.address}</p>
            <p className="text-sm text-gray-600 mt-1">Telp: {schedule.phone_number || "-"}</p>
          </div>
          <div>
            <h3 className="mb-2 font-bold text-gray-700 bg-gray-100 p-1">DETAIL PEKERJAAN:</h3>
            <p className="text-sm"><strong>Teknisi:</strong> {schedule.technician_name || "-"}</p>
            <p className="text-sm"><strong>Waktu:</strong> {schedule.schedule_time || "-"}</p>
            {schedule.invoices?.invoice_number && <p className="text-sm"><strong>Ref Invoice:</strong> {schedule.invoices.invoice_number}</p>}
            {schedule.courier_service && <p className="text-sm"><strong>Kurir:</strong> {schedule.courier_service}</p>}
          </div>
        </div>

        {/* Items Table (if available) */}
        {items.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-2 font-bold text-gray-700">DAFTAR BARANG:</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 py-2 px-3 text-left font-bold text-sm">Nama Barang</th>
                  <th className="border border-gray-300 py-2 px-3 text-center font-bold text-sm w-24">Qty</th>
                  <th className="border border-gray-300 py-2 px-3 text-center font-bold text-sm w-32">Ceklis</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 py-2 px-3 text-sm">{item.item_name}</td>
                    <td className="border border-gray-300 py-2 px-3 text-center text-sm">{item.quantity} {item.unit_type}</td>
                    <td className="border border-gray-300 py-2 px-3 text-center">☐</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Notes */}
        <div className="mb-8">
          <h3 className="mb-2 font-bold text-gray-700">CATATAN:</h3>
          <div className="min-h-[60px] rounded border border-gray-300 p-2 text-sm">
            {schedule.notes || "Tidak ada catatan khusus."}
          </div>
        </div>

        {/* Signatures */}
        <div className="mt-16 grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p className="mb-16 font-bold">Dibuat Oleh (Admin)</p>
            <div className="border-t border-gray-300 pt-2 w-3/4 mx-auto"></div>
          </div>
          <div>
            <p className="mb-16 font-bold">Dikirim/Dikerjakan Oleh</p>
            <div className="border-t border-gray-300 pt-2 w-3/4 mx-auto">
              ( {schedule.technician_name || "Teknisi"} )
            </div>
          </div>
          <div>
            <p className="mb-16 font-bold">Diterima Oleh (Customer)</p>
            <div className="border-t border-gray-300 pt-2 w-3/4 mx-auto">
              ( {schedule.customer_name} )
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintSchedulePage;