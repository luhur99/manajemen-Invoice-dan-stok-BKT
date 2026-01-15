"use client";

import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import SidebarNav from "./components/SidebarNav";
import DashboardOverviewPage from "./pages/DashboardOverviewPage"; // Mengimpor DashboardOverviewPage
import SchedulingRequestManagementPage from "./pages/SchedulingRequestManagementPage";
import InvoiceManagementPage from "./pages/InvoiceManagementPage";
import PurchaseRequestManagementPage from "./pages/PurchaseRequestManagementPage";
import DeliveryOrderManagementPage from "./pages/DeliveryOrderManagementPage";
import TechnicianScheduleCalendar from "./pages/TechnicianScheduleCalendar";
import StockLedgerPage from "./pages/StockLedgerPage";
import WarehouseInventoryPage from "./pages/WarehouseInventoryPage";
import SalesDetailsPage from "./pages/SalesDetailsPage";
import SettingsPage from "./pages/SettingsPage";
import ProductManagementPage from "./pages/ProductManagementPage";
import SupplierManagementPage from "./pages/SupplierManagementPage";
import CustomerManagementPage from "./pages/CustomerManagementPage";
import TechnicianManagementPage from "./pages/TechnicianManagementPage";
import WarehouseCategoryManagementPage from "./pages/WarehouseCategoryManagementPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router>
          <div className="flex h-screen">
            <SidebarNav />
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<DashboardOverviewPage />} /> {/* Menggunakan DashboardOverviewPage */}
                <Route path="/scheduling-requests" element={<SchedulingRequestManagementPage />} />
                <Route path="/invoices" element={<InvoiceManagementPage />} />
                <Route path="/purchase-requests" element={<PurchaseRequestManagementPage />} />
                <Route path="/delivery-orders" element={<DeliveryOrderManagementPage />} />
                <Route path="/technician-schedule-calendar" element={<TechnicianScheduleCalendar />} />
                <Route path="/stock-ledger" element={<StockLedgerPage />} />
                <Route path="/warehouse-inventory" element={<WarehouseInventoryPage />} />
                <Route path="/sales-details" element={<SalesDetailsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/product-management" element={<ProductManagementPage />} />
                <Route path="/supplier-management" element={<SupplierManagementPage />} />
                <Route path="/customer-management" element={<CustomerManagementPage />} />
                <Route path="/technician-management" element={<TechnicianManagementPage />} />
                <Route path="/warehouse-category-management" element={<WarehouseCategoryManagementPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;