"use client";

import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <p className="text-lg text-muted-foreground">Lihat dan edit informasi profil Anda.</p>
      {/* Placeholder for user profile form */}
      <div className="mt-8 bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Informasi Profil</h2>
        <p>Formulir profil pengguna akan ditampilkan di sini.</p>
      </div>
    </div>
  );
};

export default ProfilePage;