"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  currentNotes?: string | null;
}

const rejectSchema = z.object({
  reason: z.string().min(3, { message: "Alasan penolakan wajib diisi." }),
});

const RejectRequestDialog = ({ isOpen, onOpenChange, onRequestSuccess, requestId, currentNotes }: Props) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof rejectSchema>>({
    resolver: zodResolver(rejectSchema),
    defaultValues: { reason: currentNotes || '' },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({ reason: currentNotes || '' });
    }
  }, [isOpen, currentNotes, form]);

  const { mutate: rejectRequest, isPending: isRejecting } = useMutation({
    mutationFn: async (reason: string) => {
      const { error } = await supabase
        .from('scheduling_requests')
        .update({ status: SchedulingRequestStatus.REJECTED, notes: reason, updated_at: new Date().toISOString() })
        .eq('id', requestId);
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess("Permintaan berhasil ditolak.");
      onRequestSuccess();
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["schedulingRequests"] });
    },
    onError: (error: any) => {
      showError("Gagal menolak permintaan: " + error.message);
    },
  });

  const onSubmit = (values: z.infer<typeof rejectSchema>) => {
    rejectRequest(values.reason);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tolak Permintaan Jadwal</DialogTitle>
          <DialogDescription>
            Berikan alasan mengapa permintaan jadwal ini ditolak.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Textarea
            {...form.register("reason")}
            placeholder="Alasan penolakan..."
            className="min-h-[100px]"
          />
          {form.formState.errors.reason && <p className="text-red-500 text-sm">{form.formState.errors.reason.message}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isRejecting}>
              Batal
            </Button>
            <Button type="submit" variant="destructive" disabled={isRejecting}>
              {isRejecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Tolak Permintaan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RejectRequestDialog;