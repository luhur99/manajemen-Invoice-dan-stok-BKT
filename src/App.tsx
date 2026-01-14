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
import StockMovementHistoryPage from "./pages/StockMovementHistoryPage"; // Import new page
import NotFound from "./pages/NotFound";
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
            <Route path="/" element={<MainLayout><DashboardOverviewPage /></MainLayout>} />
            <Route path="/invoices" element={<MainLayout><InvoiceManagementPage /></MainLayout>} />
            <Route path="/schedules" element={<MainLayout><ScheduleManagementPage /></MainLayout>} />
            <Route path="/stock" element={<MainLayout><StockPage /></MainLayout>} />
            <Route path="/sales-details" element={<MainLayout><SalesDetailsPage /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
            <Route path="/stock-history" element={<MainLayout><StockHistoryPage /></MainLayout>} />
            <Route path="/stock-movement-history" element={<MainLayout><StockMovementHistoryPage /></MainLayout>} /> {/* New route */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
          </Routes>
        </SessionContextProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;