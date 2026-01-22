"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UploadCloud } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InvoiceDocumentStatus } from "@/types/data"; // Import InvoiceDocumentStatus

interface InvoiceUploadProps {
  invoiceId: string;
  onUploadSuccess: (url: string) => void;
  currentDocumentUrl?: string | null;
}

const InvoiceUpload: React.FC<InvoiceUploadProps> = ({ invoiceId, onUploadSuccess, currentDocumentUrl }) => {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (fileToUpload: File) => {
      const fileExt = fileToUpload.name.split(".").pop();
      const fileName = `${invoiceId}.${fileExt}`;
      const filePath = `invoice_documents/${fileName}`;

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, fileToUpload, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error("Gagal mendapatkan URL publik dokumen.");
      }

      const publicUrl = publicUrlData.publicUrl;

      // Update invoice record with document URL and status
      const { error: updateError } = await supabase
        .from("invoices")
        .update({ document_url: publicUrl, invoice_status: InvoiceDocumentStatus.COMPLETED, updated_at: new Date().toISOString() }) // Update status here
        .eq("id", invoiceId);

      if (updateError) {
        throw updateError;
      }

      return publicUrl;
    },
    onSuccess: (url) => {
      showSuccess("Dokumen invoice berhasil diunggah dan status diperbarui!");
      onUploadSuccess(url);
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] });
    },
    onError: (err: any) => {
      showError(`Gagal mengunggah dokumen: ${err.message}`);
      console.error("Upload error:", err);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleUpload = () => {
    if (file) {
      uploadMutation.mutate(file);
    } else {
      showError("Pilih file untuk diunggah.");
    }
  };

  return (
    <div className="space-y-4">
      {currentDocumentUrl && (
        <div className="text-sm text-muted-foreground">
          Dokumen saat ini:{" "}
          <a href={currentDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Lihat Dokumen
          </a>
        </div>
      )}
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="invoice-document">Unggah Dokumen Invoice</Label>
        <Input id="invoice-document" type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
      </div>
      <Button onClick={handleUpload} disabled={!file || uploadMutation.isPending}>
        {uploadMutation.isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <UploadCloud className="mr-2 h-4 w-4" />
        )}
        {uploadMutation.isPending ? "Mengunggah..." : "Unggah Dokumen"}
      </Button>
    </div>
  );
};

export default InvoiceUpload;