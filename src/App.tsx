"use client";

import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner"; // Using sonner for toasts
import { SessionContextProvider } from "./components/SessionContextProvider"; // Corrected import
import MainLayout from "./components/MainLayout"; // Corrected import
import Index from "./pages/Index";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage"; // Using AuthPage as the login route
import ProtectedRoute from "./components/ProtectedRoute";
import ScheduleManagementPage from "./pages/ScheduleManagementPage";
import NewSchedulePage from "./pages/NewSchedulePage";
import EditSchedulePage from "./pages/EditSchedulePage";
import ScheduleDetailPage from "./pages/ScheduleDetailPage";
import NewInvoicePage from "./pages/NewInvoicePage";
import CustomerManagementPage from "./pages/CustomerManagementPage"; // Added
import InvoiceManagementPage from "./pages/InvoiceManagementPage"; // Added
import ProductManagementPage from "./pages/ProductManagementPage"; // Added
import PurchaseRequestPage from "./pages/PurchaseRequestPage"; // Added
import SalesDetailsPage from "./pages/SalesDetailsPage"; // Added
import SchedulingRequestPage from "./pages/SchedulingRequestPage"; // Added
import StockHistoryPage from "./pages/StockHistoryPage"; // Added
import StockManagementPage from "./pages/StockManagementPage"; // Added
import StockMovementHistoryPage from "./pages/StockMovementHistoryPage"; // Added
import SupplierManagementPage from "./pages/SupplierManagementPage"; // Added
import TechnicianManagementPage from "./pages/TechnicianManagementPage"; // Added
import UserManagementPage from "./pages/UserManagementPage"; // Added
import ProfilePage from "./pages/ProfilePage"; // Added
import WarehouseCategoryPage from "./pages/WarehouseCategoryPage"; // Added
import DashboardOverviewPage from "./pages/DashboardOverviewPage"; // Added
import TechnicianScheduleCalendar from "./pages/TechnicianScheduleCalendar"; // Added
import PrintInvoicePage from "./pages/PrintInvoicePage"; // Added
import PrintSchedulePage from "./pages/PrintSchedulePage"; // Added
import AuthRedirector from "./components/AuthRedirector"; // New import


const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider> {/* Use your existing SessionContextProvider */}
        <Toaster /> {/* Using sonner for toasts */}
        <BrowserRouter>
          <AuthRedirector /> {/* Placed inside BrowserRouter */}
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/print/invoice/:id" element={<PrintInvoicePage />} /> {/* Public print route */}
            <Route path="/print/schedule/:id" element={<PrintSchedulePage />} /> {/* Public print route */}

            {/* Protected routes wrapped in MainLayout */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route index element={<DashboardOverviewPage />} /> {/* Default route to Dashboard */}
              <Route path="about" element={<About />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="users" element={<UserManagementPage />} />
              <Route path="customers" element={<CustomerManagementPage />} />
              <Route path="suppliers" element={<SupplierManagementPage />} />
              <Route path="technicians" element={<TechnicianManagementPage />} />
              <Route path="warehouse-categories" element={<WarehouseCategoryPage />} />
              <Route path="product-management" element={<ProductManagementPage />} />
              <Route path="stock-management" element={<StockManagementPage />} />
              <Route path="stock-history" element={<StockHistoryPage />} />
              <Route path="stock-movement-history" element={<StockMovementHistoryPage />} />
              <Route path="purchase-requests" element={<PurchaseRequestPage />} />
              <Route path="invoices" element={<InvoiceManagementPage />} />
              <Route path="invoices/new" element={<NewInvoicePage />} />
              <Route path="schedules" element={<ScheduleManagementPage />} />
              <Route path="schedules/new" element={<NewSchedulePage />} />
              <Route path="schedules/:id/edit" element={<EditSchedulePage />} />
              <Route path="schedules/:id" element={<ScheduleDetailPage />} />
              <Route path="scheduling-requests" element={<SchedulingRequestPage />} />
              <Route path="sales-details" element={<SalesDetailsPage />} />
              <Route path="technician-calendar" element={<TechnicianScheduleCalendar />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};