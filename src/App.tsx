import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import { SessionContextProvider } from "./components/SessionContextProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import { Loader2 } from "lucide-react";

// Lazy-loaded page components
const DashboardOverviewPage = React.lazy(() => import("./pages/DashboardOverviewPage"));
const InvoiceManagementPage = React.lazy(() => import("./pages/InvoiceManagementPage"));
const ScheduleManagementPage = React.lazy(() => import("./pages/ScheduleManagementPage"));
const StockPage = React.lazy(() => import("./pages/StockPage"));
const SalesDetailsPage = React.lazy(() => import("./pages/SalesDetailsPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const StockHistoryPage = React.lazy(() => import("./pages/StockHistoryPage"));
const StockMovementHistoryPage = React.lazy(() => import("./pages/StockMovementHistoryPage"));
const PurchaseRequestPage = React.lazy(() => import("./pages/PurchaseRequestPage"));
const SupplierManagementPage = React.lazy(() => import("./pages/SupplierManagementPage"));
const WarehouseCategoryPage = React.lazy(() => import("./pages/WarehouseCategoryPage"));
const StockManagementPage = React.lazy(() => import("./pages/StockManagementPage"));
const SchedulingRequestPage = React.lazy(() => import("./pages/SchedulingRequestPage"));
const CustomerManagementPage = React.lazy(() => import("./pages/CustomerManagementPage"));
const TechnicianManagementPage = React.lazy(() => import("./pages/TechnicianManagementPage"));
const TechnicianScheduleCalendar = React.lazy(() => import("./pages/TechnicianScheduleCalendar"));
const PrintInvoicePage = React.lazy(() => import("./pages/PrintInvoicePage"));
const PrintSchedulePage = React.lazy(() => import("./pages/PrintSchedulePage"));
const UserManagementPage = React.lazy(() => import("./pages/UserManagementPage"));
const ScheduleDetailPage = React.lazy(() => import("./pages/ScheduleDetailPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Cache data for 10 minutes
      retry: 1, // Limit retries to 1 attempt
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <SessionContextProvider>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          }>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Print Routes (No Layout) */}
              <Route path="/print/invoice/:id" element={<PrintInvoicePage />} />
              <Route path="/print/schedule/:id" element={<PrintSchedulePage />} />

              {/* Main App Routes wrapped with ErrorBoundary */}
              <Route path="/" element={<ErrorBoundary><MainLayout><DashboardOverviewPage /></MainLayout></ErrorBoundary>} />
              <Route path="/invoices" element={<ErrorBoundary><MainLayout><InvoiceManagementPage /></MainLayout></ErrorBoundary>} />
              <Route path="/schedules" element={<ErrorBoundary><MainLayout><ScheduleManagementPage /></MainLayout></ErrorBoundary>} />
              <Route path="/schedules/:id" element={<ErrorBoundary><MainLayout><ScheduleDetailPage /></MainLayout></ErrorBoundary>} />
              <Route path="/stock" element={<ErrorBoundary><MainLayout><StockPage /></MainLayout></ErrorBoundary>} />
              <Route path="/stock-management" element={<ErrorBoundary><MainLayout><StockManagementPage /></MainLayout></ErrorBoundary>} />
              <Route path="/sales-details" element={<ErrorBoundary><MainLayout><SalesDetailsPage /></MainLayout></ErrorBoundary>} />
              <Route path="/profile" element={<ErrorBoundary><MainLayout><ProfilePage /></MainLayout></ErrorBoundary>} />
              <Route path="/stock-history" element={<ErrorBoundary><MainLayout><StockHistoryPage /></MainLayout></ErrorBoundary>} />
              <Route path="/stock-movement-history" element={<ErrorBoundary><MainLayout><StockMovementHistoryPage /></MainLayout></ErrorBoundary>} />
              <Route path="/purchase-requests" element={<ErrorBoundary><MainLayout><PurchaseRequestPage /></MainLayout></ErrorBoundary>} />
              <Route path="/suppliers" element={<ErrorBoundary><MainLayout><SupplierManagementPage /></MainLayout></ErrorBoundary>} />
              <Route path="/warehouse-categories" element={<ErrorBoundary><MainLayout><WarehouseCategoryPage /></MainLayout></ErrorBoundary>} />
              <Route path="/scheduling-requests" element={<ErrorBoundary><MainLayout><SchedulingRequestPage /></MainLayout></ErrorBoundary>} />
              <Route path="/customers" element={<ErrorBoundary><MainLayout><CustomerManagementPage /></MainLayout></ErrorBoundary>} />
              <Route path="/technicians" element={<ErrorBoundary><MainLayout><TechnicianManagementPage /></MainLayout></ErrorBoundary>} />
              <Route path="/technician-calendar" element={<ErrorBoundary><MainLayout><TechnicianScheduleCalendar /></MainLayout></ErrorBoundary>} />
              <Route path="/users" element={<ErrorBoundary><MainLayout><UserManagementPage /></MainLayout></ErrorBoundary>} />
              <Route path="*" element={<ErrorBoundary><MainLayout><NotFound /></MainLayout></ErrorBoundary>} />
            </Routes>
          </Suspense>
        </SessionContextProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;