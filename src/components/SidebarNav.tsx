"use client";

import React from "react";
import { NavLink } from "react-router-dom";
import { useSession } from "./SessionContextProvider"; // Import useSession
import { cn } from "@/lib/utils";
import { Package, CalendarDays, ReceiptText, LayoutDashboard, LogOut, UserCircle, History, ArrowRightLeft, ShoppingCart, Users, Warehouse, Boxes, ListTodo, User, HardHat, Calendar } from "lucide-react"; // Import Calendar icon
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
    title: "Kalender Teknisi", // New item
    href: "/technician-calendar",
    icon: Calendar,
  },
  {
    title: "Permintaan Jadwal Teknis",
    href: "/scheduling-requests",
    icon: ListTodo,
  },
  {
    title: "Manajemen Produk", // Changed title
    href: "/product-management", // Changed href
    icon: Package,
  },
  {
    title: "Manajemen Stok", // Changed title
    href: "/stock-management", // Changed href
    icon: Boxes,
  },
  {
    title: "Riwayat Transaksi Produk", // Changed title
    href: "/stock-history",
    icon: History,
  },
  {
    title: "Riwayat Perpindahan Produk", // Changed title
    href: "/stock-movement-history", // Changed href
    icon: ArrowRightLeft,
  },
  {
    title: "Pengajuan Pembelian",
    href: "/purchase-requests",
    icon: ShoppingCart,
  },
  {
    title: "Manajemen Pemasok",
    href: "/suppliers",
    icon: Users,
  },
  {
    title: "Manajemen Pelanggan",
    href: "/customers",
    icon: User,
  },
  {
    title: "Manajemen Teknisi",
    href: "/technicians",
    icon: HardHat,
  },
  {
    title: "Kategori Gudang",
    href: "/warehouse-categories",
    icon: Warehouse,
  },
  {
    title: "Profil Saya",
    href: "/profile",
    icon: UserCircle,
  },
  {
    title: "Manajemen Pengguna",
    href: "/users",
    icon: Users,
    adminOnly: true,
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
  
  const { profile } = useSession(); // Get profile from session context
  const isAdmin = profile?.role === 'admin';

  return (
    <nav className="flex flex-col space-y-1 p-4 bg-sidebar dark:bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border h-full">
      <h2 className="text-xl font-bold mb-4 text-sidebar-primary-foreground">Budi Karya Teknologi</h2>
      <div className="flex-1 overflow-y-auto"> {/* Added overflow-y-auto for scrollable menu if items exceed height */}
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                (item as any).adminOnly && !isAdmin ? "hidden" : "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
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
        className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground justify-start mt-auto"
      >
        <LogOut className="h-5 w-5" />
        Logout
      </Button>
    </nav>
  );
};

export default SidebarNav;