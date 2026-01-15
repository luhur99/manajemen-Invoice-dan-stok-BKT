"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StockPage from "@/pages/StockPage";
import SalesDetailsPage from "@/pages/SalesDetailsPage";

const DashboardTabs = () => {
  return (
    <Tabs defaultValue="products" className="w-full max-w-6xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"> {/* Changed default value */}
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="products" className="text-lg">Produk</TabsTrigger> {/* Changed label */}
        <TabsTrigger value="sales" className="text-lg">Detil Penjualan</TabsTrigger>
      </TabsList>
      <TabsContent value="products"> {/* Changed value */}
        <StockPage />
      </TabsContent>
      <TabsContent value="sales">
        <SalesDetailsPage />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;