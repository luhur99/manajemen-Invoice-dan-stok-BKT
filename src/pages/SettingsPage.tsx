"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Package,
  Truck,
  Users,
  Wrench,
  Warehouse,
  Settings as SettingsIcon // Renamed to avoid conflict with page name
} from "lucide-react";

const settingsNavItems = [
  { to: "/product-management", icon: <Package className="h-5 w-5" />, text: "Manajemen Produk" },
  { to: "/supplier-management", icon: <Truck className="h-5 w-5" />, text: "Manajemen Pemasok" },
  { to: "/customer-management", icon: <Users className="h-5 w-5" />, text: "Manajemen Pelanggan" },
  { to: "/technician-management", icon: <Wrench className="h-5 w-5" />, text: "Manajemen Teknisi" },
  { to: "/warehouse-category-management", icon: <Warehouse className="h-5 w-5" />, text: "Kategori Gudang" },
];

const SettingsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <SettingsIcon className="mr-3 h-7 w-7" /> Pengaturan
      </h1>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Menu Pengaturan</CardTitle>
          <CardDescription>Pilih kategori pengaturan yang ingin Anda kelola.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {settingsNavItems.map((item) => (
              <Link key={item.to} to={item.to} className="flex items-center p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                {item.icon}
                <span className="ml-3 text-lg font-medium">{item.text}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;