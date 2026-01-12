"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Invoice, InvoiceItem } from "@/types/data";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface ViewInvoiceDetailsDialogProps {
  invoice: Invoice;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewInvoiceDetailsDialog: React.FC<ViewInvoiceDetailsDialogProps> = ({
  invoice,
  isOpen,
  onOpenChange,
}) => {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    if (isOpen && invoice?.id) {
      const fetchInvoiceItems = async () => {
        setLoadingItems(true);
        try {
          const { data, error } = await supabase
            .from("invoice_items")
            .select("*")
            .eq("invoice_id", invoice.id);

          if (error) {
            throw error;
          }
          setItems(data as InvoiceItem[]);
        } catch (err: any) {
          showError(`Gagal memuat item invoice: ${err.message}`);
          console.error("Error fetching invoice items:", err);
          setItems([]);
        } finally {
          setLoadingItems(false);
        }
      };
      fetchInvoiceItems();
    } else if (!isOpen) {
      setItems([]); // Clear items when dialog closes
    }
  }, [isOpen, invoice?.id]);

  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Invoice #{invoice.invoice_number}</DialogTitle>
          <DialogDescription>Informasi lengkap mengenai invoice ini.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Nomor Invoice:</strong> {invoice.invoice_number}</p>
            <p><strong>Tanggal Invoice:</strong> {format(new Date(invoice.invoice_date), "dd-MM-yyyy")}</p>
            <p><strong>Jatuh Tempo:</strong> {invoice.due_date ? format(new Date(invoice.due_date), "dd-MM-yyyy") : "-"}</p>
            <p><strong>Nama Konsumen:</strong> {invoice.customer_name}</p>
            <p><strong>Perusahaan:</strong> {invoice.company_name || "-"}</p>
          </div>
          <div>
            <p><strong>Total Tagihan:</strong> {invoice.total_amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
            <p><strong>Status Pembayaran:</strong> {invoice.payment_status.charAt(0).toUpperCase() + invoice.payment_status.slice(1)}</p>
            <p><strong>Tipe:</strong> {invoice.type || "-"}</p>
            <p><strong>Tipe Konsumen:</strong> {invoice.customer_type || "-"}</p>
            <p><strong>Metode Pembayaran:</strong> {invoice.payment_method || "-"}</p>
          </div>
        </div>
        {invoice.notes && (
          <div className="mt-4 text-sm">
            <p><strong>Catatan:</strong> {invoice.notes}</p>
          </div>
        )}

        <h3 className="text-lg font-semibold mt-6 mb-2">Item Invoice</h3>
        {loadingItems ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : items.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Item</TableHead>
                  <TableHead className="text-right">Kuantitas</TableHead>
                  <TableHead>Tipe Unit</TableHead>
                  <TableHead className="text-right">Harga Satuan</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.item_name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell>{item.unit_type || "-"}</TableCell>
                    <TableCell className="text-right">{item.unit_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                    <TableCell className="text-right">{item.subtotal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400">Tidak ada item untuk invoice ini.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewInvoiceDetailsDialog;