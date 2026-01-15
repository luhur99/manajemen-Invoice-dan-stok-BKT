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

interface PurchaseRequestReceiptUploadProps {
  purchaseRequestId: string;
  currentDocumentUrl?: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PurchaseRequestReceiptUpload: React.FC<PurchaseRequestReceiptUploadProps> = ({
  purchaseRequestId,
  currentDocumentUrl,
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(currentDocumentUrl || null);

  React.useEffect(() => {
    setPreviewUrl(currentDocumentUrl || null);
  }, [currentDocumentUrl]);

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

  const handleUpload = async () => {
    if (!file) {
      showError("Pilih file untuk diunggah.");
      return;
    }

    setLoading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${purchaseRequestId}-${Math.random()}.${fileExt}`;
      const filePath = `purchase_receipts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("documents") // Assuming 'documents' is the bucket for all documents
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase
        .from("purchase_requests")
        .update({ document_url: publicUrl })
        .eq("id", purchaseRequestId);

      if (updateError) throw updateError;

      showSuccess("Dokumen resi berhasil diunggah!");
      onSuccess();
      onOpenChange(false);
      setFile(null);
    } catch (error: any) {
      showError(`Gagal mengunggah dokumen: ${error.message}`);
      console.error("Error uploading purchase receipt document:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (!currentDocumentUrl) return;

    setLoading(true);
    try {
      // Extract file path from public URL
      const urlParts = currentDocumentUrl.split('/');
      const bucketNameIndex = urlParts.indexOf('documents'); // Assuming 'documents' is the bucket name
      const filePath = urlParts.slice(bucketNameIndex + 1).join('/');

      const { error: deleteError } = await supabase.storage
        .from("documents")
        .remove([filePath]);

      if (deleteError) throw deleteError;

      const { error: updateError } = await supabase
        .from("purchase_requests")
        .update({ document_url: null })
        .eq("id", purchaseRequestId);

      if (updateError) throw updateError;

      showSuccess("Dokumen resi berhasil dihapus!");
      onSuccess();
      onOpenChange(false);
      setFile(null);
      setPreviewUrl(null);
    } catch (error: any) {
      showError(`Gagal menghapus dokumen: ${error.message}`);
      console.error("Error deleting purchase receipt document:", error);
    } finally {
      setLoading(false);
    }
  };

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
              {previewUrl.match(/\.(jpeg|jpg|gif|png|pdf)$/i) != null ? ( // Added PDF to preview check
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
              disabled={loading}
              className="mr-auto"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Hapus Dokumen"}
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Batal
          </Button>
          <Button onClick={handleUpload} disabled={loading || !file}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Unggah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseRequestReceiptUpload;