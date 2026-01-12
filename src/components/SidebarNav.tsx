"use client";

import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Package, CalendarDays, ReceiptText, LayoutDashboard } from "lucide-react";

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
    title: "Manajemen Stok",
    href: "/stock",
    icon: Package,
  },
];

const SidebarNav = () => {
  return (
    <nav className="flex flex-col space-y-1 p-4 bg-sidebar dark:bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border h-full">
      <h2 className="text-xl font-bold mb-4 text-sidebar-primary-foreground">Budi Karya Teknologi</h2>
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
    </nav>
  );
};

export default SidebarNav;