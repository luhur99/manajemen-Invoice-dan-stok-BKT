"use client";

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession } from '@/components/SessionContextProvider';

const AuthRedirector: React.FC = () => {
  const { session, loading } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        // User is not authenticated
        if (location.pathname !== '/auth') {
          navigate('/auth', { replace: true });
        }
      } else {
        // User is authenticated
        if (location.pathname === '/auth') {
          navigate('/', { replace: true });
        }
      }
    }
  }, [session, loading, navigate, location.pathname]);

  return null; // This component doesn't render anything itself
};

export default AuthRedirector;