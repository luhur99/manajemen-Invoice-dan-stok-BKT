"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Loader2 } from "lucide-react";
import { InvoiceDocumentStatus } from "@/types/data"; // Import new enum
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import useMutation and useQueryClient

interface InvoiceUploadProps {
  invoiceId: string;
  currentDocumentUrl?: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const InvoiceUpload: React.FC<InvoiceUploadProps> = ({
  invoiceId,
  currentDocumentUrl,
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(currentDocumentUrl || null);

  React.useEffect(() => {
    setPreviewUrl(currentDocumentUrl || null);
    if (!isOpen) {
      setFile(null); // Clear selected file when dialog closes
    }
  }, [currentDocumentUrl, isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreviewUrl(currentDocumentUrl || null);
    }
  };

  // Mutation for uploading a document
  const uploadDocumentMutation = useMutation({
    mutationFn: async (fileToUpload: File) => {
      const fileExt = fileToUpload.name.split(".").pop();
      const fileName = `${invoiceId}-${Math.random()}.${fileExt}`;
      const filePath = `invoice_documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, fileToUpload);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase
        .from("invoices")
        .update({ document_url: publicUrl, invoice_status: InvoiceDocumentStatus.COMPLETED, updated_at: new Date().toISOString() }) // Update status here
        .eq("id", invoiceId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      showSuccess("Dokumen invoice berhasil diunggah!");
      onSuccess();
      onOpenChange(false);
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ["invoices"] }); // Invalidate invoices to refetch
    },
    onError: (error: any) => {
      showError(`Gagal mengunggah dokumen: ${error.message}`);
      console.error("Error uploading invoice document:", error);
    },
  });

  // Mutation for deleting a document
  const deleteDocumentMutation = useMutation({
    mutationFn: async () => {
      if (!currentDocumentUrl) throw new Error("Tidak ada dokumen untuk dihapus.");

      // Extract file path from public URL
      const urlParts = currentDocumentUrl.split('/');
      const bucketNameIndex = urlParts.indexOf('documents'); // Assuming 'documents' is the bucket name
      const filePath = urlParts.slice(bucketNameIndex + 1).join('/');

      const { error: deleteError } = await supabase.storage
        .from("documents")
        .remove([filePath]);

      if (deleteError) throw deleteError;

      const { error: updateError } = await supabase
        .from("invoices")
        .update({ document_url: null, invoice_status: InvoiceDocumentStatus.WAITING_DOCUMENT_INV, updated_at: new Date().toISOString() }) // Revert status here
        .eq("id", invoiceId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      showSuccess("Dokumen invoice berhasil dihapus!");
      onSuccess();
      onOpenChange(false);
      setFile(null);
      setPreviewUrl(null);
      queryClient.invalidateQueries({ queryKey: ["invoices"] }); // Invalidate invoices to refetch
    },
    onError: (error: any) => {
      showError(`Gagal menghapus dokumen: ${error.message}`);
      console.error("Error deleting invoice document:", error);
    },
  });

  const handleUpload = () => {
    if (file) {
      uploadDocumentMutation.mutate(file);
    } else {
      showError("Pilih file untuk diunggah.");
    }
  };

  const handleDeleteDocument = () => {
    deleteDocumentMutation.mutate();
  };

  const isPending = uploadDocumentMutation.isPending || deleteDocumentMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unggah Dokumen Invoice</DialogTitle>
          <DialogDescription>
            Unggah atau perbarui dokumen terkait invoice ini.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="document">Dokumen Invoice</Label>
            <Input id="document" type="file" onChange={handleFileChange} />
          </div>
          {previewUrl && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">Dokumen saat ini:</p>
              {previewUrl.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                <img src={previewUrl} alt="Document Preview" className="max-w-full h-auto mt-2 rounded-md" />
              ) : (
                <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-2 block">
                  Lihat Dokumen
                </a>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          {currentDocumentUrl && (
            <Button
              variant="destructive"
              onClick={handleDeleteDocument}
              disabled={isPending}
              className="mr-auto"
            >
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Hapus Dokumen"}
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Batal
          </Button>
          <Button onClick={handleUpload} disabled={isPending || !file}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Unggah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceUpload;