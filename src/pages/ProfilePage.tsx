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

const ProfilePage = () => {
  const { session, loading: sessionLoading } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        throw error;
      }
      setProfile(data as Profile);
    } catch (err: any) {
      showError(`Gagal memuat profil: ${err.message}`);
      console.error("Error fetching profile:", err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (!sessionLoading) {
      fetchProfile();
    }
  }, [sessionLoading, fetchProfile]);

  if (sessionLoading || loading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Profil Pengguna</CardTitle>
          <CardDescription>Memuat informasi profil Anda...</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">Memuat data profil...</p>
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

  const displayName = profile?.first_name || session.user.email?.split('@')[0] || "Pengguna";
  const displayFullName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim();

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
            <AvatarImage src={profile?.avatar_url || session.user.user_metadata.avatar_url} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold">{displayFullName || displayName}</h3>
            <p className="text-sm text-muted-foreground">{profile?.role || 'user'}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
            <span>{session.user.email}</span>
          </div>
          {profile?.phone_number && (
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>{profile.phone_number}</span>
            </div>
          )}
          {profile?.first_name && (
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <User className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>Nama Depan: {profile.first_name}</span>
            </div>
          )}
          {profile?.last_name && (
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <User className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>Nama Belakang: {profile.last_name}</span>
            </div>
          )}
          {profile?.role && (
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Briefcase className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>Role: {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}</span>
            </div>
          )}
        </div>
      </CardContent>

      {profile && (
        <EditProfileForm
          profile={profile}
          isOpen={isEditFormOpen}
          onOpenChange={setIsEditFormOpen}
          onSuccess={fetchProfile}
        />
      )}
    </Card>
  );
};

export default ProfilePage;