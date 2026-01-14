"use client";

import React, { useEffect } from "react"; // Import useEffect
import { useSession } from "./SessionContextProvider";
import { useNavigate } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import { MadeWithDyad } from "./made-with-elmony";
import { Loader2 } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { session, isLoading } = useSession();
  const navigate = useNavigate();

  // Pindahkan logika navigasi ke useEffect
  useEffect(() => {
    if (!isLoading && !session) {
      navigate("/auth");
    }
  }, [session, isLoading, navigate]); // Tambahkan dependensi yang relevan

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Jika tidak ada sesi dan tidak sedang memuat, kita sudah mengarahkan di useEffect, jadi tidak perlu render apa-apa di sini.
  // Ini juga mencegah rendering layout utama sebelum navigasi selesai.
  if (!session) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 flex-shrink-0 border-r bg-sidebar dark:bg-sidebar-background">
        <SidebarNav />
      </aside>
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
        <MadeWithDyad />
      </main>
    </div>
  );
};

export default MainLayout;