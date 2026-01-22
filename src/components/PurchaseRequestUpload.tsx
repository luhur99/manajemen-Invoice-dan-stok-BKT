"use client";

import React, { useState } from "react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import useMutation and useQueryClient
import { PurchaseRequestStatus } from "@/types/data"; // Import PurchaseRequestStatus

interface PurchaseRequestUploadProps {
  purchaseRequestId: string;
  currentDocumentUrl?: string | null;
  isOpen: boolean; // Added isOpen prop
  onOpenChange: (open: boolean) => void; // Added onOpenChange prop
  onSuccess: () => void; // Changed from onUploadSuccess
}

const PurchaseRequestUpload: React.FC<PurchaseRequestUploadProps> = ({
  purchaseRequestId,
  currentDocumentUrl,
  isOpen, // Destructure new prop
  onOpenChange, // Destructure new prop
  onSuccess, // Changed from onUploadSuccess
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
      const fileName = `${purchaseRequestId}-${Math.random()}.${fileExt}`;
      const filePath = `purchase_receipts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, fileToUpload);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase
        .from("purchase_requests")
        .update({ 
          document_url: publicUrl, 
          status: PurchaseRequestStatus.WAITING_FOR_RECEIVED, // Set status to WAITING_FOR_RECEIVED after upload
          updated_at: new Date().toISOString() 
        })
        .eq("id", purchaseRequestId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      showSuccess("Dokumen resi berhasil diunggah!");
      onSuccess();
      onOpenChange(false);
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ["purchaseRequests"] }); // Invalidate purchase requests to refetch
    },
    onError: (error: any) => {
      showError(`Gagal mengunggah dokumen: ${error.message}`);
      console.error("Error uploading purchase receipt document:", error);
    },
  });

  // Mutation for deleting a document
  const deleteDocumentMutation = useMutation({
    mutationFn: async () => {
      if (!currentDocumentUrl) throw new Error("Tidak ada dokumen untuk dihapus.");

      const urlParts = currentDocumentUrl.split('/');
      const bucketNameIndex = urlParts.indexOf('documents');
      const filePath = urlParts.slice(bucketNameIndex + 1).join('/');

      const { error: deleteError } = await supabase.storage
        .from("documents")
        .remove([filePath]);

      if (deleteError) throw deleteError;

      const { error: updateError } = await supabase
        .from("purchase_requests")
        .update({ 
          document_url: null, 
          status: PurchaseRequestStatus.APPROVED, // Revert status to APPROVED after deleting document
          updated_at: new Date().toISOString() 
        })
        .eq("id", purchaseRequestId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      showSuccess("Dokumen resi berhasil dihapus!");
      onSuccess();
      onOpenChange(false);
      setFile(null);
      setPreviewUrl(null);
      queryClient.invalidateQueries({ queryKey: ["purchaseRequests"] }); // Invalidate purchase requests to refetch
    },
    onError: (error: any) => {
      showError(`Gagal menghapus dokumen: ${error.message}`);
      console.error("Error deleting purchase receipt document:", error);
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
          <DialogTitle>Unggah Dokumen Resi Pembelian</DialogTitle>
          <DialogDescription>
            Unggah atau perbarui dokumen resi terkait permintaan pembelian ini.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="document">Dokumen Resi</Label>
            <Input id="document" type="file" onChange={handleFileChange} />
          </div>
          {previewUrl && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">Dokumen saat ini:</p>
              {previewUrl.match(/\.(jpeg|jpg|gif|png|pdf)$/i) != null ? (
                <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-2 block">
                  Lihat Dokumen
                </a>
              ) : (
                <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-2 block">
                  Lihat Dokumen (Tipe file tidak dapat dipratinjau)
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

export default PurchaseRequestUpload;