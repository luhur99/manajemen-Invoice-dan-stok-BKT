"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { showError } from '@/utils/toast';

interface SessionContextType {
  session: Session | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndSetSession = async () => {
      console.log("Fetching latest session from Supabase...");
      const { data: { session: fetchedSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        showError("Gagal mendapatkan sesi.");
        setSession(null);
      } else {
        console.log("Session fetched:", fetchedSession);
        setSession(fetchedSession);
      }
      setIsLoading(false);
    };

    // Initial fetch when component mounts
    fetchAndSetSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth event detected:", event, "Current session from event:", currentSession);

        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED') {
          // For these events, always re-fetch the session to ensure latest metadata
          // This handles cases where currentSession from event might be slightly stale
          await fetchAndSetSession();

          // Additionally, if it's SIGNED_IN or INITIAL_SESSION, and a profile exists,
          // ensure the role is synced to user_metadata if it's not already.
          if (currentSession && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', currentSession.user.id)
              .single();

            if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means no rows found
              console.error("Error fetching user profile:", profileError);
              showError("Gagal memuat profil pengguna.");
            } else if (profile) {
              // Check if role in session metadata is already correct
              if (currentSession.user.user_metadata?.role !== profile.role) {
                console.log("User metadata role is different from profile role. Updating user metadata to:", profile.role);
                await supabase.auth.updateUser({
                  data: { role: profile.role }
                });
                // After updating, fetch and set session again to reflect this change immediately
                await fetchAndSetSession();
              } else {
                console.log("User metadata role already matches profile role:", profile.role);
              }
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out. Clearing session.");
          setSession(null);
          setIsLoading(false);
          navigate('/auth');
        } else if (event === 'PASSWORD_RECOVERY') {
          console.log("Password recovery event.");
          // handle password recovery event
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <SessionContext.Provider value={{ session, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionContextProvider');
  }
  return context;
};