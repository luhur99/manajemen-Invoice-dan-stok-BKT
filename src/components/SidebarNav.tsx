"use client";

import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Calendar,
  FileText,
  Package,
  Truck,
  Users,
  Wrench,
  Warehouse,
  Settings, // Import Settings icon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const navItems = [
  {
    to: "/",
    icon: <Home className="h-4 w-4" />,
    text: "Dashboard",
  },
  {
    to: "/scheduling-requests",
    icon: <Calendar className="h-4 w-4" />,
    text: "Manajemen Jadwal",
  },
  {
    to: "/invoices",
    icon: <FileText className="h-4 w-4" />,
    text: "Manajemen Invoice",
  },
  {
    to: "/purchase-requests",
    icon: <Package className="h-4 w-4" />,
    text: "Manajemen Permintaan Pembelian",
  },
  {
    to: "/delivery-orders",
    icon: <Truck className="h-4 w-4" />,
    text: "Manajemen Pesanan Pengiriman",
  },
  {
    to: "/technician-schedule-calendar",
    icon: <Calendar className="h-4 w-4" />,
    text: "Kalender Jadwal Teknisi",
  },
  {
    to: "/stock-ledger",
    icon: <Warehouse className="h-4 w-4" />,
    text: "Buku Besar Stok",
  },
  {
    to: "/warehouse-inventory",
    icon: <Warehouse className="h-4 w-4" />,
    text: "Inventaris Gudang",
  },
  {
    to: "/sales-details",
    icon: <FileText className="h-4 w-4" />,
    text: "Detail Penjualan",
  },
  {
    to: "/settings", // New settings item
    icon: <Settings className="h-4 w-4" />,
    text: "Pengaturan",
  },
];

const SidebarNav = () => {
  return (
    <nav className="flex flex-col space-y-1 p-4 bg-sidebar dark:bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border h-full">
      <h2 className="text-xl font-bold mb-4 text-sidebar-primary-foreground">Budi Karya Teknologi</h2>
      <div className="flex-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-hover dark:hover:bg-sidebar-hover"
            )}
          >
            {item.icon}
            <span className="ml-2 overflow-hidden whitespace-nowrap text-ellipsis">{item.text}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default SidebarNav;