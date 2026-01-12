"use client";

import { MadeWithDyad } from "@/components/made-with-elmony";
import DashboardTabs from "@/components/DashboardTabs"; 

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">Aplikasi Manajemen Penjualan & Stok</h1>
      <DashboardTabs /> 
      <MadeWithDyad />
    </div>
  );
};

export default Index;