"use client";

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError, showSuccess } from '@/utils/toast';
import { fetchSchedules, deleteSchedule, Schedule } from '@/api/schedules';
import ScheduleTable from '@/components/ScheduleTable';
import ScheduleDetailDialog from '@/components/ScheduleDetailDialog'; // We'll create this next
import { Loader2 } from 'lucide-react';

const SchedulesPage: React.FC = () => {
  const { session, isLoading: isSessionLoading } = useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [viewingSchedule, setViewingSchedule] = React.useState<Schedule | null>(null);
  const [editingSchedule, setEditingSchedule] = React.useState<Schedule | null>(null); // For future edit functionality

  const { data: schedules, isLoading, error } = useQuery({
    queryKey: ['schedules', userId],
    queryFn: () => fetchSchedules(userId!),
    enabled: !!userId,
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteSchedule(id, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules', userId] });
      showSuccess('Jadwal berhasil dihapus!');
    },
    onError: (err) => {
      showError(`Gagal menghapus jadwal: ${err.message}`);
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleDeleteSchedule = (id: string) => {
    if (!userId) {
      showError('Anda harus login untuk menghapus jadwal.');
      return;
    }
    setDeletingId(id);
    deleteScheduleMutation.mutate({ id });
  };

  const handleViewSchedule = (schedule: Schedule) => {
    setViewingSchedule(schedule);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    // TODO: Implement an edit form/dialog for schedules
    showSuccess('Fungsi edit jadwal akan segera hadir!');
  };

  if (isLoading || isSessionLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Memuat jadwal...</p>
      </div>
    );
  }

  if (error) {
    showError(`Gagal memuat jadwal: ${error.message}`);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Daftar Jadwal</h1>
      <p className="text-lg text-muted-foreground mb-8">Lihat dan kelola semua jadwal Anda di sini.</p>

      <ScheduleTable
        schedules={schedules || []}
        isLoading={isLoading}
        error={error || null}
        onView={handleViewSchedule}
        onEdit={handleEditSchedule}
        onDelete={handleDeleteSchedule}
        deletingId={deletingId}
      />

      <ScheduleDetailDialog
        schedule={viewingSchedule}
        onOpenChange={(open) => !open && setViewingSchedule(null)}
      />
    </div>
  );
};

export default SchedulesPage;