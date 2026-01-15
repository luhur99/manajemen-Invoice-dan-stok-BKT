"use client";

import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Package, CalendarDays, ReceiptText, LayoutDashboard, LogOut, UserCircle, History, ArrowRightLeft, ShoppingCart, Users } from "lucide-react"; // Import Users icon
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Manajemen Invoice",
    href: "/invoices",
    icon: ReceiptText,
  },
  {
    title: "Manajemen Jadwal",
    href: "/schedules",
    icon: CalendarDays,
  },
  {
    title: "Manajemen Produk", // Changed from Manajemen Stok
    href: "/stock", // Kept the same href for now, but it will display products
    icon: Package,
  },
  {
    title: "Riwayat Transaksi Produk", // Changed from Riwayat Stok
    href: "/stock-history",
    icon: History,
  },
  {
    title: "Riwayat Perpindahan Produk", // Changed from Riwayat Perpindahan Stok
    href: "/stock-movement-history",
    icon: ArrowRightLeft,
  },
  {
    title: "Pengajuan Pembelian",
    href: "/purchase-requests",
    icon: ShoppingCart,
  },
  {
    title: "Manajemen Pemasok", // New nav item
    href: "/suppliers",
    icon: Users, // Using Users icon for suppliers
  },
  {
    title: "Profil Saya",
    href: "/profile",
    icon: UserCircle,
  },
];

const SidebarNav = () => {
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      showSuccess("Anda telah berhasil logout.");
    } catch (error: any) {
      showError(`Gagal logout: ${error.message}`);
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="flex flex-col space-y-1 p-4 bg-sidebar dark:bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border h-full">
      <h2 className="text-xl font-bold mb-4 text-sidebar-primary-foreground">Budi Karya Teknologi</h2>
      <div className="flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </NavLink>
        ))}
      </div>
      <Button
        variant="ghost"
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground justify-start"
      >
        <LogOut className="h-5 w-5" />
        Logout
      </Button>
    </nav>
  );
};

export default SidebarNav;