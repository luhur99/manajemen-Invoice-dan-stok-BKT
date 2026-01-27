"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NewSchedulePage = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <h1 className="text-2xl font-bold mb-4">New Schedule Page</h1>
      <p>This is a placeholder for the new schedule creation form.</p>
    </div>
  );
};

export default NewSchedulePage;