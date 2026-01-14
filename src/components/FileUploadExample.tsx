"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Loader2, Upload, FileText, X } from "lucide-react";

interface FileUploadExampleProps {
  entityId: string; // ID unik untuk entitas yang terkait (misalnya, ID invoice, ID jadwal)
  bucketName: string; // Nama bucket Supabase Storage (misalnya, "invoices", "schedule_documents")
  currentFileUrl?: string; // URL file yang sudah ada
  onUploadSuccess: (fileUrl: string) => void;
  onRemoveSuccess: () => void;
}

const FileUploadExample: React.FC<FileUploadExampleProps> = ({
  entityId,
  bucketName,
  currentFileUrl,
  onUploadSuccess,
  onRemoveSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showError("Pilih file untuk diunggah.");
      return;
    }

    setUploading(true);
    // Path file di storage akan menjadi: bucketName/entityId/nama_file.ext
    const filePath = `${bucketName}/${entityId}/${file.name}`;

    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true, // Mengganti file jika sudah ada
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        onUploadSuccess(publicUrlData.publicUrl);
        showSuccess("File berhasil diunggah!");
        setFile(null);
      } else {
        throw new Error("Gagal mendapatkan URL publik file.");
      }
    } catch (error: any) {
      showError(`Gagal mengunggah file: ${error.message}`);
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!currentFileUrl) return;

    setUploading(true);
    try {
      // Ekstrak path file dari URL publik
      const urlParts = currentFileUrl.split('/');
      const bucketIndex = urlParts.indexOf(bucketName);
      const filePath = urlParts.slice(bucketIndex + 1).join('/');

      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) {
        throw error;
      }

      onRemoveSuccess();
      showSuccess("File berhasil dihapus!");
    } catch (error: any) {
      showError(`Gagal menghapus file: ${error.message}`);
      console.error("Error removing file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-start space-y-2">
      {currentFileUrl ? (
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-blue-500" />
          <a
            href={currentFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            Lihat File
          </a>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={uploading}
            className="h-6 w-6 text-red-500 hover:text-red-700"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      ) : (
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="file" onChange={handleFileChange} disabled={uploading} className="flex-grow" />
          <Button onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Unggah
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploadExample;