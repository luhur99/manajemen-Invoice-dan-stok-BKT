import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout"; // Import MainLayout
import DashboardOverviewPage from "./pages/DashboardOverviewPage"; // New Dashboard page
import InvoiceManagementPage from "./pages/InvoiceManagementPage"; // New Invoice page
import ScheduleManagementPage from "./pages/ScheduleManagementPage"; // New Schedule page
import StockPage from "./pages/StockPage"; // Existing Stock page
import SalesDetailsPage from "./pages/SalesDetailsPage"; // Existing Sales Details page
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainLayout> {/* Wrap routes with MainLayout */}
          <Routes>
            <Route path="/" element={<DashboardOverviewPage />} />
            <Route path="/invoices" element={<InvoiceManagementPage />} />
            <Route path="/schedules" element={<ScheduleManagementPage />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/sales-details" element={<SalesDetailsPage />} /> {/* Keep existing sales details page */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;