"use client";

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError, showSuccess } from '@/utils/toast';
import { fetchProfile, updateProfile, Profile } from '@/api/profiles';
import ProfileForm from '@/components/ProfileForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { session } = useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery<Profile | null>({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchProfile(userId!),
    enabled: !!userId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updates: Partial<Omit<Profile, 'id' | 'role' | 'created_at'>>) =>
      updateProfile(userId!, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
      showSuccess('Profil berhasil diperbarui!');
    },
    onError: (err) => {
      showError(`Gagal memperbarui profil: ${err.message}`);
    },
  });

  const handleUpdateProfile = (values: any) => {
    if (!userId) {
      showError('Anda harus login untuk memperbarui profil.');
      return;
    }
    updateProfileMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Memuat profil...</p>
      </div>
    );
  }

  if (error) {
    showError(`Gagal memuat profil: ${error.message}`);
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">Gagal memuat profil pengguna. Silakan coba lagi.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Profil pengguna tidak ditemukan.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <p className="text-lg text-muted-foreground mb-8">Lihat dan edit informasi profil Anda.</p>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            profile={profile}
            onSubmit={handleUpdateProfile}
            isLoading={updateProfileMutation.isPending}
          />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Detail Akun</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-muted-foreground">
          <p><strong>Email:</strong> {session?.user?.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          <p><strong>Terakhir Diperbarui:</strong> {profile.updated_at ? new Date(profile.updated_at).toLocaleString() : '-'}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;