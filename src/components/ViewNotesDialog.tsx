"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Isi lengkap dari catatan.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(80vh-120px)] p-4 border rounded-md">
          <p className="whitespace-pre-wrap text-sm">{notes}</p>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewNotesDialog;