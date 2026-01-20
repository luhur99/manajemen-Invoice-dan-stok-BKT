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
  const currentProfile = profile || { id: session.user.id, role: 'user' }; // Provide a<dyad-problem-report summary="16 problems">
<problem file="src/pages/ProfilePage.tsx" line="41" column="5" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;Profile, Error, Profile, readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;Profile, Error&gt;', gave the following error.
    Object literal may only specify known properties, and 'cacheTime' does not exist in type 'DefinedInitialDataOptions&lt;Profile, Error, Profile, readonly unknown[]&gt;'.
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;Profile, Error, Profile, readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;Profile, Error&gt;', gave the following error.
    Object literal may only specify known properties, and 'cacheTime' does not exist in type 'UndefinedInitialDataOptions&lt;Profile, Error, Profile, readonly unknown[]&gt;'.
  Overload 3 of 3, '(options: UseQueryOptions&lt;Profile, Error, Profile, readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;Profile, Error&gt;', gave the following error.
    Object literal may only specify known properties, and 'cacheTime' does not exist in type 'UseQueryOptions&lt;Profile, Error, Profile, readonly unknown[]&gt;'.</problem>
<problem file="src/pages/ProfilePage.tsx" line="87" column="32" code="2339">Property 'first_name' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/pages/ProfilePage.tsx" line="88" column="39" code="2339">Property 'first_name' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/pages/ProfilePage.tsx" line="88" column="68" code="2339">Property 'last_name' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/pages/ProfilePage.tsx" line="104" column="40" code="2339">Property 'avatar_url' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/pages/ProfilePage.tsx" line="111" column="68" code="2339">Property 'role' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/pages/ProfilePage.tsx" line="120" column="21" code="2339">Property 'phone_number' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/pages/ProfilePage.tsx" line="123" column="30" code="2339">Property 'phone_number' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/pages/ProfilePage.tsx" line="126" column="21" code="2339">Property 'first_name' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/pages/ProfilePage.tsx" line="129" column="42" code="2339">Property 'first_name' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/pages/ProfilePage.tsx" line="132" column="21" code="2339">Property 'last_name' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/pages/ProfilePage.tsx" line="135" column="45" code="2339">Property 'last_name' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/pages/ProfilePage.tsx" line="138" column="21" code="2339">Property 'role' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/pages/ProfilePage.tsx" line="141" column="36" code="2339">Property 'role' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/pages/ProfilePage.tsx" line="141" column="75" code="2339">Property 'role' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/pages/ProfilePage.tsx" line="149" column="11" code="2322">Type 'TQueryFnData' is not assignable to type 'Profile'.</problem>
</dyad-problem-report><think>**Fixing TypeScript Errors**

I'm currently addressing sixteen TypeScript compile-time errors within `src/pages/ProfilePage.tsx`. First on my list: the obsolete `cacheTime` property; React Query v5 has deprecated it.


**Refining Error Resolution**

I'm now diving into the remaining fifteen TypeScript errors in `src/pages/ProfilePage.tsx`. I see that errors 2 through 15 stem from the `useQuery` data type potentially being `null` or `undefined`. The plan is to refine the type definition to explicitly handle `Profile | null`, and I'll use optional chaining to safely access object properties. Finally, for the `EditProfileForm` component, I'll provide a default profile object if `profile` is null.


**Applying Suggested Fixes**

I'm now implementing the proposed solutions to resolve all sixteen compile-time TypeScript errors. My initial step involves replacing the deprecated `cacheTime` with `gcTime`. For errors 2 through 15, I'll refine the `useQuery` type to be explicitly `Profile | null` and will implement optional chaining to safely access object properties within the component. Lastly, for the `EditProfileForm`, I am ensuring a default profile object is passed in the event that the profile object is null, to satisfy the `Profile` type requirement.


</think>You're right, those TypeScript errors need to be addressed! It looks like the main issues are related to the `useQuery` configuration in React Query v5 (where `cacheTime` was renamed to `gcTime`) and how the `profile` data, which can be `null`, is being accessed.

Here's the updated `src/pages/ProfilePage.tsx` with all 16 errors resolved:

<dyad-write path="src/pages/ProfilePage.tsx" description="Fixing TypeScript errors in ProfilePage related to React Query configuration and data access.">
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
    first_name: session.user.user_metadata.first_name || null,
    last_name: session.user.user_metadata.last_name || null,
    avatar_url: session.user.user_metadata.avatar_url || null,
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