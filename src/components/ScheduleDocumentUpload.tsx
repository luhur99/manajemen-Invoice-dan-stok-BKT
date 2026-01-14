"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Loader2, Upload, FileText, X } from "lucide-react";

interface ScheduleDocumentUploadProps {
  scheduleId: string; // Unique ID for the schedule record
  currentFileUrl?: string;
  onUploadSuccess: (fileUrl: string) => void;
  onRemoveSuccess: () => void;
}

const ScheduleDocumentUpload: React.FC<ScheduleDocumentUploadProps> = ({
  scheduleId,
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
    const filePath = `schedule_documents/${scheduleId}/${file.name}`;

    try {
      const { data, error } = await supabase.storage
        .from("schedule_documents") // Assuming a new bucket for schedule documents
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from("schedule_documents")
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        onUploadSuccess(publicUrlData.publicUrl);
        showSuccess("Dokumen berhasil diunggah!");
        setFile(null); // Clear selected file after successful upload
      } else {
        throw new Error("Gagal mendapatkan URL publik file.");
      }
    } catch (error: any) {
      showError(`Gagal mengunggah dokumen: ${error.message}`);
      console.error("Error uploading schedule document:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!currentFileUrl) return;

    setUploading(true);
    try {
      const urlParts = currentFileUrl.split('/');
      const bucketIndex = urlParts.indexOf('schedule_documents');
      const filePath = urlParts.slice(bucketIndex + 1).join('/');

      const { error } = await supabase.storage
        .from("schedule_documents")
        .remove([filePath]);

      if (error) {
        throw error;
      }

      onRemoveSuccess();
      showSuccess("Dokumen berhasil dihapus!");
    } catch (error: any) {
      showError(`Gagal menghapus dokumen: ${error.message}`);
      console.error("Error removing schedule document:", error);
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
            Lihat Dokumen
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
            Unggah Dokumen
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScheduleDocumentUpload;