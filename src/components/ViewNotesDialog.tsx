"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { WarehouseCategory as WarehouseCategoryType } from "@/types/data"; // Import the interface
import { showError } from "@/utils/toast";

interface ViewNotesDialogProps {
  notes: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
}

const ViewNotesDialog: React.FC<ViewNotesDialogProps> = ({
  notes,
  isOpen,
  onOpenChange,
  title = "Detail Catatan",
}) => {
  const [displayNotes, setDisplayNotes] = useState(notes);
  const [loadingInvoiceNumber, setLoadingInvoiceNumber] = useState(false);
  const [warehouseCategories, setWarehouseCategories] = useState<WarehouseCategoryType[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const fetchWarehouseCategories = useCallback(async () => {
    setLoadingCategories(true);
    const { data, error } = await supabase
      .from("warehouse_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      showError("Gagal memuat kategori gudang.");
      console.error("Error fetching warehouse categories:", error);
    } else {
      setWarehouseCategories(data as WarehouseCategoryType[]);
    }
    setLoadingCategories(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchWarehouseCategories();
    }
  }, [isOpen, fetchWarehouseCategories]);

  const getCategoryDisplayName = (code: string) => {
    const category = warehouseCategories.find(cat => cat.code === code);
    return category ? category.name : code;
  };

  useEffect(() => {
    if (!isOpen || !notes) {
      setDisplayNotes(notes);
      return;
    }

    const parseAndFetchInvoiceNumber = async () => {
      const invoiceIdRegex = /(Invoice: )([0-9a-fA-F-]+)/;
      const match = notes.match(invoiceIdRegex);

      if (match && match[2]) {
        const invoiceId = match[2];
        setLoadingInvoiceNumber(true);
        try {
          const { data, error } = await supabase
            .from("invoices")
            .select("invoice_number")
            .eq("id", invoiceId)
            .single();

          if (error) {
            console.error("Error fetching invoice number for notes:", error);
            setDisplayNotes(notes);
          } else if (data) {
            const newDisplayNotes = notes.replace(invoiceIdRegex, `Invoice: ${data.invoice_number}`);
            setDisplayNotes(newDisplayNotes);
          } else {
            setDisplayNotes(notes);
          }
        } catch (err) {
          console.error("Unexpected error fetching invoice number:", err);
          setDisplayNotes(notes);
        } finally {
          setLoadingInvoiceNumber(false);
        }
      } else {
        setDisplayNotes(notes);
      }
    };

    parseAndFetchInvoiceNumber();
  }, [notes, isOpen]);

  if (loadingCategories) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>Memuat detail catatan...</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center h-24">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Memuat kategori gudang...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Isi lengkap dari catatan.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(80vh-120px)] p-4 border rounded-md">
          {loadingInvoiceNumber ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Memuat detail invoice...</span>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-sm">{displayNotes}</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewNotesDialog;