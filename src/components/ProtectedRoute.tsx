"use client";

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '@/integrations/supabase/auth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading user session...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;