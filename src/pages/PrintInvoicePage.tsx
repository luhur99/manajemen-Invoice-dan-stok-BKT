"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { InvoiceWithDetails, InvoiceItem } from "@/types/data";
import { Loader2, Printer } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

const PrintInvoicePage = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<InvoiceWithDetails | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // Fetch Invoice details
        const { data: invoiceData, error: invoiceError } = await supabase
          .from("invoices")
          .select("*") // Select all columns for Invoice
          .eq("id", id)
          .single();

        if (invoiceError) throw invoiceError;
        setInvoice(invoiceData as InvoiceWithDetails); // Cast to InvoiceWithDetails

        // Fetch Invoice Items
        const { data: itemsData, error: itemsError } = await supabase
          .from("invoice_items")
          .select("*") // Select all columns for InvoiceItem
          .eq("invoice_id", id);

        if (itemsError) throw itemsError;
        setItems(itemsData as InvoiceItem[] || []); // Cast to InvoiceItem[]

      } catch (err: any) {
        console.error("Error fetching invoice for print:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="p-8 text-center text-red-500">
        <h1>Error loading invoice</h1>
        <p>{error || "Invoice not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8 text-black print:p-0">
      {/* Print Controls - Hidden when printing */}
      <div className="mb-8 flex justify-end print:hidden">
        <Button onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" /> Cetak Invoice
        </Button>
      </div>

      {/* Invoice Container */}
      <div className="mx-auto max-w-[210mm] border p-8 print:border-0 print:p-0">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between border-b pb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
            <p className="mt-2 text-sm text-gray-500">
              <strong>No. Invoice:</strong> {invoice.invoice_number}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Tanggal:</strong> {format(new Date(invoice.invoice_date), "dd MMMM yyyy")}
            </p>
            {invoice.due_date && (
              <p className="text-sm text-gray-500">
                <strong>Jatuh Tempo:</strong> {format(new Date(invoice.due_date), "dd MMMM yyyy")}
              </p>
            )}
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold">Budi Karya Teknologi</h2>
            <p className="text-sm text-gray-500">Jl. Contoh No. 123</p>
            <p className="text-sm text-gray-500">Jakarta, Indonesia</p>
            <p className="text-sm text-gray-500">info@budikaryateknologi.com</p>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-8">
          <h3 className="mb-2 font-bold text-gray-700">TAGIHAN KEPADA:</h3>
          <p className="text-lg font-semibold">{invoice.customer_name}</p>
          {invoice.company_name && <p className="text-gray-600">{invoice.company_name}</p>}
          <p className="text-sm text-gray-500 mt-1">
            {invoice.customer_type} • {invoice.payment_method}
          </p>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300 bg-gray-50">
              <th className="py-3 text-left font-bold text-gray-700">Item</th>
              <th className="py-3 text-right font-bold text-gray-700">Qty</th>
              <th className="py-3 text-right font-bold text-gray-700">Harga Satuan</th>
              <th className="py-3 text-right font-bold text-gray-700">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-3">
                  <div className="font-medium">{item.item_name}</div>
                  <div className="text-xs text-gray-500">{item.item_code}</div>
                </td>
                <td className="py-3 text-right">{item.quantity} {item.unit_type}</td>
                <td className="py-3 text-right">Rp {item.unit_price.toLocaleString("id-ID")}</td>
                <td className="py-3 text-right font-medium">Rp {item.subtotal.toLocaleString("id-ID")}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end border-t pt-4">
          <div className="w-1/2 md:w-1/3">
            <div className="flex justify-between border-b pb-2 text-lg font-bold">
              <span>Total</span>
              <span>Rp {invoice.total_amount.toLocaleString("id-ID")}</span>
            </div>
            {invoice.notes && (
              <div className="mt-4 text-sm text-gray-500">
                <strong>Catatan:</strong>
                <p className="whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer / Signatures */}
        <div className="mt-16 grid grid-cols-2 gap-8 text-center text-sm">
          <div>
            <p className="mb-16 font-bold">Penerima</p>
            <div className="border-t border-gray-300 pt-2 w-2/3 mx-auto">
              ( {invoice.customer_name} )
            </div>
          </div>
          <div>
            <p className="mb-16 font-bold">Hormat Kami</p>
            <div className="border-t border-gray-300 pt-2 w-2/3 mx-auto">
              ( Budi Karya Teknologi )
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintInvoicePage;