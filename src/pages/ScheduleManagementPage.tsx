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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const ScheduleManagementPage: React.FC = () => {
  const { session } = useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState<string>('view');
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

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

  const handleAddSchedule = (values: any) => {
    if (!userId) {
      showError('Anda harus login untuk menambahkan jadwal.');
      return;
    }

    addScheduleMutation.mutate(values);
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
    // Implementasi untuk melihat detail jadwal
    console.log('View schedule:', schedule);
    // Di sini Anda bisa membuka modal atau navigasi ke halaman detail
  };

  const handleEditSchedule = (schedule: Schedule) => {
    // Implementasi untuk mengedit jadwal
    console.log('Edit schedule:', schedule);
    // Di sini Anda bisa membuka modal edit atau navigasi ke halaman edit
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
          <TabsTrigger value="add">Tambah Jadwal Baru</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Tambah Jadwal Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <AddScheduleForm 
                onSubmit={handleAddSchedule} 
                isLoading={addScheduleMutation.isPending} 
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
    </div>
  );
};

export default ScheduleManagementPage;