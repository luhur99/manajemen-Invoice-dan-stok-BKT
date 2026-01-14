"use client";

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogOut, LayoutDashboard, FileText, Calendar, Package, ShoppingCart, User, History, Truck, ListChecks } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "Manajemen Invoice",
    href: "/invoices",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Manajemen Jadwal",
    href: "/schedules",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    title: "Permintaan Penjadwalan",
    href: "/scheduling-requests",
    icon: <ListChecks className="h-4 w-4" />,
  },
  {
    title: "Delivery Order",
    href: "/delivery-orders",
    icon: <Truck className="h-4 w-4" />,
  },
  {
    title: "Stok Barang",
    href: "/stock",
    icon: <Package className="h-4 w-4" />,
  },
  {
    title: "Detail Penjualan",
    href: "/sales-details",
    icon: <ShoppingCart className="h-4 w-4" />,
  },
  {
    title: "Riwayat Stok",
    href: "/stock-history",
    icon: <History className="h-4 w-4" />,
  },
  {
    title: "Riwayat Pergerakan Stok",
    href: "/stock-movement-history",
    icon: <History className="h-4 w-4" />,
  },
  {
    title: "Permintaan Pembelian",
    href: "/purchase-requests",
    icon: <ShoppingCart className="h-4 w-4" />,
  },
  {
    title: "Profil",
    href: "/profile",
    icon: <User className="h-4 w-4" />,
  },
];

const SidebarNav: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError("Gagal logout: " + error.message);
    } else {
      showSuccess("Berhasil logout!");
      navigate("/auth");
    }
  };

  return (
    <div className="flex h-full flex-col py-4">
      <div className="px-4 mb-6">
        <h1 className="text-2xl font-bold text-sidebar-primary">Budi Karya Teknologi</h1>
      </div>
      <ScrollArea className="flex-1 px-3">
        <nav className="grid items-start gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground"
                }`
              }
            >
              {item.icon}
              {item.title}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto px-4 pt-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default SidebarNav;