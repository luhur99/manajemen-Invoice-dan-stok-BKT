"use client";

import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "./integrations/supabase/auth";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ScheduleManagementPage from "./pages/ScheduleManagementPage";
import NewSchedulePage from "./pages/NewSchedulePage";
import EditSchedulePage from "./pages/EditSchedulePage";
import ScheduleDetailPage from "./pages/ScheduleDetailPage"; // New import
import NewInvoicePage from "./pages/NewInvoicePage"; // New import

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="about" element={<About />} />
              <Route path="login" element={<Login />} />
              <Route
                path="schedule-management"
                element={
                  <ProtectedRoute>
                    <ScheduleManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="schedules/new"
                element={
                  <ProtectedRoute>
                    <NewSchedulePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="schedules/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditSchedulePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="schedules/:id"
                element={
                  <ProtectedRoute>
                    <ScheduleDetailPage /> {/* New Route */}
                  </ProtectedRoute>
                }
              />
              <Route
                path="invoices/new"
                element={
                  <ProtectedRoute>
                    <NewInvoicePage /> {/* New Route */}
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </QueryClientProvider>
  );
};