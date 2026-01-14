"use client";

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, Calendar, Package, BarChart, User, History, Truck, ShoppingCart, ListChecks, LogOut } from "lucide-react"; // Import LogOut icon
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client'; // Import supabase client
import { showSuccess, showError } from '@/utils/toast'; // Import toast utilities

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
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError(`Gagal logout: ${error.message}`);
    } else {
      showSuccess('Anda telah berhasil logout.');
      navigate('/auth'); // Redirect to auth page after logout
    }
  };

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
      <div className="mt-auto pt-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className="ml-3">Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default SidebarNav;