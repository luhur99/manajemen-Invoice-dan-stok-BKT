import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import DashboardOverviewPage from "./pages/DashboardOverviewPage";
import InvoiceManagementPage from "./pages/InvoiceManagementPage";
import ScheduleManagementPage from "./pages/ScheduleManagementPage";
import StockPage from "./pages/StockPage";
import SalesDetailsPage from "./pages/SalesDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import StockHistoryPage from "./pages/StockHistoryPage";
import StockMovementHistoryPage from "./pages/StockMovementHistoryPage";
import PurchaseRequestPage from "./pages/PurchaseRequestPage";
import SupplierManagementPage from "./pages/SupplierManagementPage";
import WarehouseCategoryPage from "./pages/WarehouseCategoryPage";
import StockManagementPage from "./pages/StockManagementPage";
import SchedulingRequestPage from "./pages/SchedulingRequestPage";
import CustomerManagementPage from "./pages/CustomerManagementPage";
import TechnicianManagementPage from "./pages/TechnicianManagementPage";
import TechnicianScheduleCalendar from "./pages/TechnicianScheduleCalendar";
import PrintInvoicePage from "./pages/PrintInvoicePage"; // Import Print Invoice
import PrintSchedulePage from "./pages/PrintSchedulePage"; // Import Print Schedule
import NotFound from "./pages/NotFound";
import UserManagementPage from "./pages/UserManagementPage";
import AuthPage from "./pages/AuthPage";
import { SessionContextProvider } from "./components/SessionContextProvider";
import ErrorBoundary from "./components/ErrorBoundary"; // Import ErrorBoundary

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
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Print Routes (No Layout) */}
            <Route path="/print/invoice/:id" element={<PrintInvoicePage />} />
            <Route path="/print/schedule/:id" element={<PrintSchedulePage />} />

            {/* Main App Routes wrapped with ErrorBoundary */}
            <Route path="/" element={<ErrorBoundary><MainLayout><DashboardOverviewPage /></MainLayout></ErrorBoundary>} />
            <Route path="/invoices" element={<ErrorBoundary><MainLayout><InvoiceManagementPage /></MainLayout></ErrorBoundary>} />
            <Route path="/schedules" element={<ErrorBoundary><MainLayout><ScheduleManagementPage /></MainLayout></ErrorBoundary>} />
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
        </SessionContextProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;