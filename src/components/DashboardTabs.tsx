"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StockPage from "@/pages/StockPage";
import SalesDetailsPage from "@/pages/SalesDetailsPage";

const DashboardTabs = () => {
  return (
    <Tabs defaultValue="stock" className="w-full max-w-4xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="stock" className="text-lg">Stock Barang</TabsTrigger>
        <TabsTrigger value="sales" className="text-lg">Detil Penjualan</TabsTrigger>
      </TabsList>
      <TabsContent value="stock" className="min-h-[300px]">
        <StockPage />
      </TabsContent>
      <TabsContent value="sales" className="min-h-[300px]">
        <SalesDetailsPage />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;