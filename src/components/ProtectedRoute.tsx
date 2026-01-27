"use client";

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '@/components/SessionContextProvider'; // Corrected import path

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading: isLoading } = useSession(); // Use 'loading' from the correct context

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading user session...</div>;
  }

  if (!session) {
    return <Navigate to="/auth" replace />; // Redirect to /auth page
  }

  return <>{children}</>;
};

export default ProtectedRoute;