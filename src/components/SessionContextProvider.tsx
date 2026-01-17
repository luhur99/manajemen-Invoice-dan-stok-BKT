"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Profile } from "@/types/data";

interface SessionContextType {
  session: Session | null;
  loading: boolean;
  profile: Profile | null;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionContextProvider");
  }
  return context;
};

interface SessionContextProviderProps {
  children: React.ReactNode;
}

export const SessionContextProvider: React.FC<SessionContextProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async (userId: string | undefined) => {
      if (!userId) {
        setProfile(null);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        if (error) throw error;
        setProfile(data as Profile);
      } catch (error) {
        console.error("SessionContextProvider: Error fetching profile:", error);
        setProfile(null);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        await fetchProfile(currentSession?.user?.id);
        setLoading(false);

        if (event === 'SIGNED_OUT' || !currentSession) {
          if (location.pathname !== '/auth') {
            navigate('/auth');
          }
        } else if (currentSession) {
          if (location.pathname === '/auth') {
            navigate('/');
          }
        }
      }
    );

    // Fetch initial session
    const getInitialSession = async () => {
      const { data: { session: initialSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting initial session:", error);
      }
      setSession(initialSession);
      await fetchProfile(initialSession?.user?.id);
      setLoading(false);

      if (!initialSession && location.pathname !== '/auth') {
        navigate('/auth');
      } else if (initialSession && location.pathname === '/auth') {
        navigate('/');
      }
    };

    getInitialSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SessionContext.Provider value={{ session, loading, profile }}>
      {children}
    </SessionContext.Provider>
  );
};