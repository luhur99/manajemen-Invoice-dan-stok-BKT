"use client";

import React from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

const AuthPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          Selamat Datang di Budi Karya Teknologi
        </h2>
        <Auth
          supabaseClient={supabase}
          providers={[]} // Anda bisa menambahkan 'google', 'github', dll. di sini jika diperlukan
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary-foreground))',
                },
              },
            },
          }}
          theme="light" // Gunakan tema terang secara default
          redirectTo={window.location.origin + '/'} // Redirect ke halaman utama setelah login
        />
      </div>
    </div>
  );
};

export default AuthPage;