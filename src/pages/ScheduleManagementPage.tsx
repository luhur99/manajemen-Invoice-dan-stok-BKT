"use client";

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError, showSuccess } from '@/utils/toast';
import { 
  fetchSchedules, 
  addSchedule, 
  updateSchedule, 
  deleteSchedule,
  Schedule
} from '@/api/schedules';
import AddScheduleForm from '@/components/AddScheduleForm';
import ScheduleTable from '@/components/ScheduleTable';
import ScheduleDetailDialog from '@/components/ScheduleDetailDialog'; // Import the new dialog component
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const ScheduleManagementPage: React.FC = () => {
  const { session } = useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState<string>('view');
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [editingSchedule, setEditingSchedule] = React.useState<Schedule | null>(null); // State for editing schedule
  const [viewingSchedule, setViewingSchedule] = React.useState<Schedule | null>(null); // State for viewing schedule

  const { data: schedules, isLoading, error } = useQuery({
    queryKey: ['schedules', userId],
    queryFn: () => fetchSchedules(userId!),
    enabled: !!userId,
  });

  const addScheduleMutation = useMutation({
    mutationFn: (newSchedule: Parameters<typeof addSchedule>[0]) =>
      addSchedule(newSchedule, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules', userId] });
      showSuccess('Jadwal berhasil ditambahkan!');
      setActiveTab('view');
    },
    onError: (err) => {
      showError(`Gagal menambahkan jadwal: ${err.message}`);
    },
  });

  const updateScheduleMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Schedule> }) =>
      updateSchedule(id, updates, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules', userId] });
      showSuccess('Jadwal berhasil diperbarui!');
      setEditingSchedule(null);
      setActiveTab('view');
    },
    onError: (err) => {
      showError(`Gagal memperbarui jadwal: ${err.message}`);
    },
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

  const handleAddOrUpdateSchedule = (values: any) => {
    if (!userId) {
      showError('Anda harus login untuk menambahkan/memperbarui jadwal.');
      return;
    }

    const scheduleData = {
      ...values,
      schedule_date: values.schedule_date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
    };

    if (editingSchedule) {
      updateScheduleMutation.mutate({ id: editingSchedule.id, updates: scheduleData });
    } else {
      addScheduleMutation.mutate(scheduleData);
    }
  };

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
    setActiveTab('add'); // Switch to the add/edit tab
  };

  const handleCancelEdit = () => {
    setEditingSchedule(null);
    setActiveTab('view');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Memuat data jadwal...</p>
      </div>
    );
  }

  if (error) {
    showError(`Gagal memuat jadwal: ${error.message}`);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manajemen Jadwal</h1>
      <p className="text-lg text-muted-foreground mb-8">Kelola jadwal Anda di sini.</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">Lihat Jadwal</TabsTrigger>
          <TabsTrigger value="add">{editingSchedule ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>{editingSchedule ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</CardTitle>
            </CardHeader>
            <CardContent>
              <AddScheduleForm 
                onSubmit={handleAddOrUpdateSchedule} 
                isLoading={addScheduleMutation.isPending || updateScheduleMutation.isPending} 
                existingSchedule={editingSchedule}
                onCancelEdit={handleCancelEdit}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view">
          <ScheduleTable
            schedules={schedules || []}
            isLoading={isLoading}
            error={error || null}
            onView={handleViewSchedule}
            onEdit={handleEditSchedule}
            onDelete={handleDeleteSchedule}
            deletingId={deletingId}
          />
        </TabsContent>
      </Tabs>

      <ScheduleDetailDialog
        schedule={viewingSchedule}
        onOpenChange={(open) => !open && setViewingSchedule(null)}
      />
    </div>
  );
};

export default ScheduleManagementPage;