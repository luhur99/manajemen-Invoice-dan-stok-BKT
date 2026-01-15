"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SchedulingRequestStatus } from "@/types/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestSuccess: () => void;
  requestId: string;
}

const CompleteRequestDialog = ({ isOpen, onOpenChange, onRequestSuccess, requestId }: Props) => {
  const queryClient = useQueryClient();

  const { mutate: completeRequest, isPending: isCompleting } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('scheduling_requests')
        .update({ status: SchedulingRequestStatus.COMPLETED, updated_at: new Date().toISOString() })
        .eq('id', requestId);
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess("Permintaan berhasil diselesaikan.");
      onRequestSuccess();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["schedulingRequests"] });
    },
    onError: (error: any) => {
      showError("Gagal menyelesaikan permintaan: " + error.message);
    },
  });

  const handleConfirmComplete = () => {
    completeRequest();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Selesaikan Permintaan Jadwal</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menandai permintaan jadwal ini sebagai "Selesai"?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCompleting}>
            Batal
          </Button>
          <Button type="button" onClick={handleConfirmComplete} disabled={isCompleting}>
            {isCompleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Konfirmasi Selesai"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteRequestDialog;