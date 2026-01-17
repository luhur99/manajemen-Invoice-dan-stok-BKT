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

const queryClient = new QueryClient();

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

            {/* Main App Routes */}
            <Route path="/" element={<MainLayout><DashboardOverviewPage /></MainLayout>} />
            <Route path="/invoices" element={<MainLayout><InvoiceManagementPage /></MainLayout>} />
            <Route path="/schedules" element={<MainLayout><ScheduleManagementPage /></MainLayout>} />
            <Route path="/stock" element={<MainLayout><StockPage /></MainLayout>} />
            <Route path="/stock-management" element={<MainLayout><StockManagementPage /></MainLayout>} />
            <Route path="/sales-details" element={<MainLayout><SalesDetailsPage /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
            <Route path="/stock-history" element={<MainLayout><StockHistoryPage /></MainLayout>} />
            <Route path="/stock-movement-history" element={<MainLayout><StockMovementHistoryPage /></MainLayout>} />
            <Route path="/purchase-requests" element={<MainLayout><PurchaseRequestPage /></MainLayout>} />
            <Route path="/suppliers" element={<MainLayout><SupplierManagementPage /></MainLayout>} />
            <Route path="/warehouse-categories" element={<MainLayout><WarehouseCategoryPage /></MainLayout>} />
            <Route path="/scheduling-requests" element={<MainLayout><SchedulingRequestPage /></MainLayout>} />
            <Route path="/customers" element={<MainLayout><CustomerManagementPage /></MainLayout>} />
            <Route path="/technicians" element={<MainLayout><TechnicianManagementPage /></MainLayout>} />
            <Route path="/technician-calendar" element={<MainLayout><TechnicianScheduleCalendar /></MainLayout>} />
            <Route path="/users" element={<MainLayout><UserManagementPage /></MainLayout>} />
            <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
          </Routes>
        </SessionContextProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;