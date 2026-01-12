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
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage"; // Import AuthPage
import { SessionContextProvider } from "./components/SessionContextProvider"; // Import SessionContextProvider

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SessionContextProvider> {/* Wrap with SessionContextProvider */}
          <Routes>
            <Route path="/auth" element={<AuthPage />} /> {/* Add AuthPage route */}
            <Route path="/" element={<MainLayout><DashboardOverviewPage /></MainLayout>} />
            <Route path="/invoices" element={<MainLayout><InvoiceManagementPage /></MainLayout>} />
            <Route path="/schedules" element={<MainLayout><ScheduleManagementPage /></MainLayout>} />
            <Route path="/stock" element={<MainLayout><StockPage /></MainLayout>} />
            <Route path="/sales-details" element={<MainLayout><SalesDetailsPage /></MainLayout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
          </Routes>
        </SessionContextProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;