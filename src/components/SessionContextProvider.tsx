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
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          setSession(currentSession);
          if (currentSession) {
            // Fetch user profile to get role
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', currentSession.user.id)
              .single();

            if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means no rows found
              console.error("Error fetching user profile:", profileError);
              showError("Gagal memuat profil pengguna.");
            } else if (profile) {
              // Update user metadata with role
              await supabase.auth.updateUser({
                data: { role: profile.role }
              });
              // IMPORTANT: After updating user metadata, explicitly get the latest session
              // to ensure the client-side session object reflects the new role.
              const { data: { session: updatedSession }, error: sessionRefreshError } = await supabase.auth.getSession();
              if (sessionRefreshError) {
                console.error("Error refreshing session after profile update:", sessionRefreshError);
                showError("Gagal menyegarkan sesi setelah pembaruan profil.");
              } else if (updatedSession) {
                setSession(updatedSession);
              }
            }
          }
          setIsLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setIsLoading(false);
          navigate('/auth');
        } else if (event === 'USER_UPDATED') {
          // When user metadata is updated, the session object in this event should be the latest.
          setSession(currentSession);
        } else if (event === 'PASSWORD_RECOVERY') {
          // Handle password recovery if needed
        } else {
          setIsLoading(false);
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setIsLoading(false);
      if (!initialSession) {
        navigate('/auth');
      }
    }).catch((err) => {
      console.error("Error getting initial session:", err);
      showError("Gagal mendapatkan sesi awal.");
      setIsLoading(false);
      navigate('/auth');
    });

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