"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, FileText, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadButtonProps {
  label: string;
  onFileUpload: (file: File) => Promise<string | null>; // Mengembalikan URL file atau null jika gagal
  onFileRemove: () => Promise<void>; // Dipanggil saat file dihapus
  currentFileUrl?: string | null;
  isLoading?: boolean;
  disabled?: boolean;
  accept?: string; // Misalnya, "image/*,application/pdf"
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  label,
  onFileUpload,
  onFileRemove,
  currentFileUrl,
  isLoading = false,
  disabled = false,
  accept = "application/pdf,image/*",
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        await onFileUpload(file);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset input file
        }
      }
    }
  };

  const handleRemoveClick = async () => {
    setIsUploading(true); // Gunakan isUploading untuk menunjukkan proses penghapusan juga
    try {
      await onFileRemove();
    } finally {
      setIsUploading(false);
    }
  };

  const fileName = currentFileUrl ? currentFileUrl.split('/').pop() : '';

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {currentFileUrl ? (
        <div className="flex items-center space-x-2 p-2 border rounded-md bg-muted/50">
          <FileText className="h-5 w-5 text-primary" />
          <a
            href={currentFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-sm text-blue-600 hover:underline truncate"
          >
            {fileName}
          </a>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveClick}
            disabled={isLoading || isUploading || disabled}
            className="text-destructive hover:bg-destructive/10"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Input
            id="file-upload"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="flex-1"
            disabled={isLoading || isUploading || disabled}
            accept={accept}
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isUploading || disabled}
          >
            {isUploading ? (
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

export default FileUploadButton;