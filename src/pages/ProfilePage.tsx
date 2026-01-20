"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Phone, Mail, Briefcase, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { useSession } from "@/components/SessionContextProvider";
import { Profile } from "@/types/data";
import EditProfileForm from "@/components/EditProfileForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react"; // Ensure Loader2 is imported

const ProfilePage = () => {
  const { session, loading: sessionLoading } = useSession();
  const queryClient = useQueryClient();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  // Use useQuery to fetch the user's profile
  const { data: profile, isLoading: loadingProfile, error: profileError, refetch: refetchProfile } = useQuery<Profile | null, Error>({
    queryKey: ["userProfile", session?.user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!session?.user?.id) {
        return null; // Return null if no user ID
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        throw error;
      }
      return data as Profile | null;
    },
    enabled: !!session?.user?.id && !sessionLoading, // Only run query if user ID is available and session is not loading
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Cache data for 10 minutes (renamed from cacheTime in React Query v5)
  });

  if (sessionLoading || loadingProfile) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Profil Pengguna</CardTitle>
          <CardDescription>Memuat informasi profil Anda...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (profileError) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Profil Pengguna</CardTitle>
          <CardDescription>Terjadi kesalahan saat memuat profil.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 dark:text-red-400">Error: {profileError.message}</p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">Silakan coba lagi nanti atau hubungi dukungan.</p>
        </CardContent>
      </Card>
    );
  }

  if (!session?.user) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Profil Pengguna</CardTitle>
          <CardDescription>Anda perlu login untuk melihat profil.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">Silakan login untuk mengakses halaman ini.</p>
        </CardContent>
      </Card>
    );
  }

  // Ensure profile is not null before accessing its properties
  // Provide a default Profile object if `profile` is null to satisfy EditProfileForm's prop type
  const currentProfile: Profile = profile || { 
    id: session.user.id, 
    role: 'user', 
    first_name: session.user.user_metadata.first_name as string || null,
    last_name: session.user.user_metadata.last_name as string || null,
    avatar_url: session.user.user_metadata.avatar_url as string || null,
    phone_number: null,
    updated_at: null,
  };

  const displayName = currentProfile.first_name || session.user.email?.split('@')[0] || "Pengguna";
  const displayFullName = `${currentProfile.first_name || ''} ${currentProfile.last_name || ''}`.trim();

  return (
    <Card className="border shadow-sm max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-semibold">Profil Pengguna</CardTitle>
          <CardDescription>Kelola informasi profil Anda.</CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={() => setIsEditFormOpen(true)}>
          <Edit className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={currentProfile.avatar_url || session.user.user_metadata.avatar_url} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold">{displayFullName || displayName}</h3>
            <p className="text-sm text-muted-foreground">{currentProfile.role || 'user'}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
            <span>{session.user.email}</span>
          </div>
          {currentProfile.phone_number && (
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>{currentProfile.phone_number}</span>
            </div>
          )}
          {currentProfile.first_name && (
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <User className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>Nama Depan: {currentProfile.first_name}</span>
            </div>
          )}
          {currentProfile.last_name && (
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <User className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>Nama Belakang: {currentProfile.last_name}</span>
            </div>
          )}
          {currentProfile.role && (
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Briefcase className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>Role: {currentProfile.role.charAt(0).toUpperCase() + currentProfile.role.slice(1)}</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Pass currentProfile which is guaranteed to be a Profile object */}
      <EditProfileForm
          profile={currentProfile}
          isOpen={isEditFormOpen}
          onOpenChange={setIsEditFormOpen}
          onSuccess={refetchProfile} // Pass refetch function to trigger re-fetch after successful edit
        />
    </Card>
  );
};

export default ProfilePage;