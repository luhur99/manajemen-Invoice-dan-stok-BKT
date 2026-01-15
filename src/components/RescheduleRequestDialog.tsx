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

const rescheduleSchema = z.object({
  reason: z.string().min(3, { message: "Alasan penjadwalan ulang wajib diisi." }),
});

const RescheduleRequestDialog = ({ isOpen, onOpenChange, onRequestSuccess, requestId, currentNotes }: Props) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof rescheduleSchema>>({
    resolver: zodResolver(rescheduleSchema),
    defaultValues: { reason: currentNotes || '' },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({ reason: currentNotes || '' });
    }
  }, [isOpen, currentNotes, form]);

  const { mutate: rescheduleRequest, isPending: isRescheduling } = useMutation({
    mutationFn: async (reason: string) => {
      const { error } = await supabase
        .from('scheduling_requests')
        .update({ status: SchedulingRequestStatus.RESCHEDULED, notes: reason, updated_at: new Date().toISOString() })
        .eq('id', requestId);
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess("Permintaan berhasil dijadwal ulang.");
      onRequestSuccess();
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["schedulingRequests"] });
    },
    onError: (error: any) => {
      showError("Gagal menjadwal ulang permintaan: " + error.message);
    },
  });

  const onSubmit = (values: z.infer<typeof rescheduleSchema>) => {
    rescheduleRequest(values.reason);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Jadwal Ulang Permintaan</DialogTitle>
          <DialogDescription>
            Berikan alasan mengapa permintaan jadwal ini perlu dijadwal ulang.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Textarea
            {...form.register("reason")}
            placeholder="Alasan penjadwalan ulang..."
            className="min-h-[100px]"
          />
          {form.formState.errors.reason && <p className="text-red-500 text-sm">{form.formState.errors.reason.message}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isRescheduling}>
              Batal
            </Button>
            <Button type="submit" disabled={isRescheduling}>
              {isRescheduling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Jadwal Ulang Permintaan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleRequestDialog;