"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, Calendar, Package, BarChart, User, History, Truck, ShoppingCart, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "Invoices",
    href: "/invoices",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Schedules",
    href: "/schedules",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    title: "Scheduling Requests",
    href: "/scheduling-requests",
    icon: <ListChecks className="h-4 w-4" />,
  },
  {
    title: "Delivery Orders",
    href: "/delivery-orders",
    icon: <Truck className="h-4 w-4" />,
  },
  {
    title: "Stock",
    href: "/stock",
    icon: <Package className="h-4 w-4" />,
  },
  {
    title: "Sales Details",
    href: "/sales-details",
    icon: <BarChart className="h-4 w-4" />,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: <User className="h-4 w-4" />,
  },
  {
    title: "Stock History",
    href: "/stock-history",
    icon: <History className="h-4 w-4" />,
  },
  {
    title: "Stock Movement History",
    href: "/stock-movement-history",
    icon: <History className="h-4 w-4" />,
  },
  {
    title: "Purchase Requests",
    href: "/purchase-requests",
    icon: <ShoppingCart className="h-4 w-4" />,
  },
];

const SidebarNav: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-4">
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-sidebar-foreground">Budi Karya Teknologi</h2>
        <nav className="grid items-start gap-2">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  location.pathname === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SidebarNav;