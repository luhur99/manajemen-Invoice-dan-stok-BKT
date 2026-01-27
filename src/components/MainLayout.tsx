"use client";

import React from "react";
import { Outlet } from "react-router-dom"; // Import Outlet
import SidebarNav from "./SidebarNav";
import { MadeWithDyad } from "./made-with-elmony";

interface MainLayoutProps {
  // children: React.ReactNode; // No longer needed as Outlet handles nested routes
}

const MainLayout: React.FC<MainLayoutProps> = () => { // Removed children from props
  return (
    <div className="flex min-h-screen bg-background dark:bg-gray-900">
      <aside className="w-64 flex-shrink-0">
        <SidebarNav />
      </aside>
      <main className="flex-1 flex flex-col p-6 overflow-auto">
        <div className="flex-1">
          <Outlet /> {/* Render nested routes here */}
        </div>
        <MadeWithDyad />
      </main>
    </div>
  );
};

export default MainLayout;