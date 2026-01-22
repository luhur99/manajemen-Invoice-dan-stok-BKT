import React, { Suspense } from "react"; // Import Suspense
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
import { Loader2 } from "lucide-react"; // Import Loader2 for fallback

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
      staleTime: 5<dyad-problem-report summary="2518 problems">
<problem file="src/components/AddEditScheduleForm.tsx" line="144" column="49" code="1005">',' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="145" column="1" code="2657">JSX expressions must have one parent element.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="147" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="147" column="64" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="148" column="28" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="148" column="57" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="149" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="149" column="59" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="150" column="21" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="150" column="50" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="151" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="151" column="52" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="153" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="153" column="64" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="154" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="154" column="66" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="155" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="155" column="59" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="156" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="156" column="61" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="157" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="157" column="52" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="158" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="158" column="54" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="160" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="160" column="64" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="161" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="161" column="66" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="162" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="162" column="59" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="163" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="163" column="61" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="164" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="164" column="52" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="165" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="165" column="54" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="167" column="133" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="167" column="249" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="167" column="271" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="167" column="276" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="168" column="136" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="168" column="252" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="168" column="274" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="168" column="279" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="169" column="136" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="169" column="252" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="169" column="274" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="169" column="279" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="170" column="142" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="170" column="258" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="170" column="280" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="170" column="285" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="171" column="137" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="171" column="253" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="171" column="275" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="171" column="280" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="172" column="134" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="172" column="250" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="172" column="272" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="172" column="277" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="173" column="137" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="173" column="253" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="173" column="275" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="173" column="280" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="174" column="137" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="174" column="253" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="174" column="275" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="174" column="280" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="175" column="143" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="175" column="259" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="175" column="281" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="175" column="286" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="176" column="138" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="176" column="254" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="176" column="276" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="176" column="281" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="182" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="182" column="64" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="183" column="28" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="183" column="57" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="184" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="184" column="59" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="185" column="21" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="185" column="50" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="186" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="186" column="52" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="188" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="188" column="64" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="189" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="189" column="66" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="190" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="190" column="59" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="191" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="191" column="61" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="192" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="192" column="52" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="193" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="193" column="54" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="195" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="195" column="64" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="196" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="196" column="66" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="197" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="197" column="59" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="198" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="198" column="61" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="199" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="199" column="52" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="200" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="200" column="54" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="206" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="206" column="64" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="207" column="28" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="207" column="57" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="208" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="208" column="59" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="209" column="21" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="209" column="50" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="210" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="210" column="52" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="212" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="212" column="64" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="213" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="213" column="66" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="214" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="214" column="59" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="215" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="215" column="61" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="216" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="216" column="52" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="217" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="217" column="54" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="219" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="219" column="64" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="220" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="220" column="66" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="221" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="221" column="59" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="222" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="222" column="61" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="223" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="223" column="52" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="224" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="224" column="54" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="228" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="228" column="99" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="229" column="28" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="229" column="92" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="230" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="230" column="94" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="231" column="21" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="231" column="85" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="232" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="232" column="87" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="234" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="234" column="99" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="235" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="235" column="101" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="236" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="236" column="94" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="237" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="237" column="96" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="238" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="238" column="87" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="239" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="239" column="89" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="241" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="241" column="99" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="242" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="242" column="101" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="243" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="243" column="94" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="244" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="244" column="96" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="245" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="245" column="87" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="246" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="246" column="89" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="249" column="45" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="249" column="231" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="249" column="233" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="249" column="238" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="250" column="38" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="250" column="224" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="250" column="226" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="250" column="231" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="251" column="40" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="251" column="226" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="251" column="228" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="251" column="233" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="252" column="31" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="252" column="217" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="252" column="219" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="252" column="224" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="253" column="33" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="253" column="219" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="253" column="221" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="253" column="226" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="255" column="45" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="255" column="231" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="255" column="233" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="255" column="238" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="256" column="47" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="256" column="233" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="256" column="235" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="256" column="240" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="257" column="40" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="257" column="226" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="257" column="228" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="257" column="233" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="258" column="42" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="258" column="228" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="258" column="230" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="258" column="235" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="259" column="33" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="259" column="219" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="259" column="221" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="259" column="226" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="260" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="260" column="221" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="260" column="223" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="260" column="228" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="262" column="45" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="262" column="231" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="262" column="233" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="262" column="238" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="263" column="47" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="263" column="233" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="263" column="235" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="263" column="240" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="264" column="40" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="264" column="226" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="264" column="228" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="264" column="233" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="265" column="42" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="265" column="228" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="265" column="230" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="265" column="235" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="266" column="33" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="266" column="219" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="266" column="221" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="266" column="226" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="267" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="267" column="221" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="267" column="223" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="267" column="228" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="268" column="157" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="268" column="182" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="269" column="157" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="269" column="182" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="275" column="107" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="275" column="313" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="275" column="315" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="275" column="320" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="276" column="13" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="276" column="219" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="276" column="221" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="276" column="226" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="278" column="26" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="278" column="51" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="279" column="115" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="279" column="321" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="279" column="323" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="279" column="328" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="280" column="13" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="280" column="219" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="280" column="221" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="280" column="226" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="282" column="26" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="282" column="51" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="283" column="141" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="283" column="292" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="283" column="314" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="283" column="319" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="284" column="144" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="284" column="295" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="284" column="317" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="284" column="322" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="285" column="150" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="285" column="301" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="285" column="323" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="285" column="328" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="288" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="288" column="53" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="289" column="28" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="289" column="46" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="290" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="290" column="48" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="291" column="21" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="291" column="39" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="292" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="292" column="41" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="294" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="294" column="53" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="295" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="295" column="55" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="296" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="296" column="48" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="297" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="297" column="50" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="298" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="298" column="41" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="299" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="299" column="43" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="301" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="301" column="53" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="302" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="302" column="55" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="303" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="303" column="48" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="304" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="304" column="50" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="305" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="305" column="41" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="306" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="306" column="43" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="309" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="309" column="64" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="310" column="28" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="310" column="57" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="311" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="311" column="59" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="312" column="21" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="312" column="50" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="313" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="313" column="52" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="315" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="315" column="64" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="316" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="316" column="66" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="317" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="317" column="59" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="318" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="318" column="61" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="319" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="319" column="52" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="320" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="320" column="54" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="322" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="322" column="64" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="323" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="323" column="66" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="324" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="324" column="59" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="325" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="325" column="61" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="326" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="326" column="52" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="327" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="327" column="54" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="332" column="142" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="332" column="293" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="332" column="315" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="332" column="320" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="333" column="145" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="333" column="296" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="333" column="318" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="333" column="323" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="334" column="151" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="334" column="302" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="334" column="324" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="334" column="329" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="337" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="337" column="53" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="338" column="28" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="338" column="46" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="339" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="339" column="48" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="340" column="21" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="340" column="39" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="341" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="341" column="41" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="343" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="343" column="53" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="344" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="344" column="55" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="345" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="345" column="48" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="346" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="346" column="50" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="347" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="347" column="41" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="348" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="348" column="43" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="350" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="350" column="53" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="351" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="351" column="55" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="352" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="352" column="48" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="353" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="353" column="50" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="354" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="354" column="41" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="355" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="355" column="43" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="357" column="110" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="357" column="361" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="357" column="363" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="357" column="368" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="358" column="13" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="358" column="264" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="358" column="266" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="358" column="271" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="360" column="26" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="360" column="64" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="363" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="363" column="64" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="364" column="28" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="364" column="57" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="365" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="365" column="59" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="366" column="21" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="366" column="50" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="367" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="367" column="52" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="369" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="369" column="64" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="370" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="370" column="66" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="371" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="371" column="59" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="372" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="372" column="61" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="373" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="373" column="52" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="374" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="374" column="54" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="376" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="376" column="64" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="377" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="377" column="66" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="378" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="378" column="59" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="379" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="379" column="61" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="380" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="380" column="52" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="381" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="381" column="54" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="385" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="385" column="64" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="386" column="28" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="386" column="57" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="387" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="387" column="59" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="388" column="21" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="388" column="50" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="389" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="389" column="52" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="391" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="391" column="64" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="392" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="392" column="66" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="393" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="393" column="59" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="394" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="394" column="61" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="395" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="395" column="52" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="396" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="396" column="54" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="398" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="398" column="64" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="399" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="399" column="66" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="400" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="400" column="59" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="401" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="401" column="61" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="402" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="402" column="52" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="403" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="403" column="54" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="407" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="407" column="99" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="408" column="28" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="408" column="92" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="409" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="409" column="94" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="410" column="21" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="410" column="85" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="411" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="411" column="87" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="413" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="413" column="99" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="414" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="414" column="101" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="415" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="415" column="94" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="416" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="416" column="96" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="417" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="417" column="87" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="418" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="418" column="89" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="420" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="420" column="99" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="421" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="421" column="101" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="422" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="422" column="94" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="423" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="423" column="96" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="424" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="424" column="87" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="425" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="425" column="89" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="433" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="433" column="134" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="434" column="28" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="434" column="127" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="435" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="435" column="129" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="436" column="21" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="436" column="120" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="437" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="437" column="122" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="439" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="439" column="134" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="440" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="440" column="136" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="441" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="441" column="129" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="442" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="442" column="131" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="443" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="443" column="122" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="444" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="444" column="124" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="446" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="446" column="134" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="447" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="447" column="136" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="448" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="448" column="129" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="449" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="449" column="131" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="450" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="450" column="122" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="451" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="451" column="124" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="454" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="454" column="64" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="455" column="28" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="455" column="57" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="456" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="456" column="59" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="457" column="21" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="457" column="50" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="458" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="458" column="52" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="460" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="460" column="64" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="461" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="461" column="66" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="462" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="462" column="59" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="463" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="463" column="61" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="464" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="464" column="52" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="465" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="465" column="54" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="467" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="467" column="64" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="468" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="468" column="66" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="469" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="469" column="59" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="470" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="470" column="61" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="471" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="471" column="52" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="472" column="25" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="472" column="54" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="480" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="480" column="256" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="480" column="258" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="480" column="263" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="481" column="28" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="481" column="249" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="481" column="251" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="481" column="256" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="482" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="482" column="251" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="482" column="253" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="482" column="258" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="483" column="21" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="483" column="242" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="483" column="244" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="483" column="249" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="484" column="62" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="484" column="283" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="484" column="285" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="484" column="290" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="486" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="486" column="256" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="486" column="258" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="486" column="263" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="487" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="487" column="258" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="487" column="260" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="487" column="265" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="488" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="488" column="251" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="488" column="253" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="488" column="258" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="489" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="489" column="253" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="489" column="255" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="489" column="260" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="490" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="490" column="244" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="490" column="246" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="490" column="251" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="491" column="64" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="491" column="285" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="491" column="287" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="491" column="292" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="493" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="493" column="256" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="493" column="258" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="493" column="263" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="494" column="37" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="494" column="258" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="494" column="260" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="494" column="265" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="495" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="495" column="251" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="495" column="253" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="495" column="258" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="496" column="32" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="496" column="253" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="496" column="255" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="496" column="260" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="497" column="23" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="497" column="244" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="497" column="246" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="497" column="251" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="498" column="64" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="498" column="285" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="498" column="287" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="498" column="292" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="499" column="154" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="499" column="161" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="500" column="152" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="500" column="217" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="501" column="151" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="501" column="216" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="502" column="151" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="502" column="216" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="503" column="152" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="503" column="217" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="508" column="1" code="1005">',' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="635" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="635" column="5" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="636" column="3" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="641" column="9" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="645" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="646" column="13" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="647" column="24" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="648" column="7" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="652" column="75" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="654" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="656" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="657" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="661" column="23" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="663" column="31" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="665" column="49" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="669" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="671" column="23" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="672" column="5" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="673" column="53" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="674" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="675" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="677" column="45" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="678" column="31" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="680" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="682" column="46" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="684" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="685" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="741" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="745" column="13" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="748" column="137" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="754" column="13" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="777" column="1" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="785" column="11" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="787" column="53" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="789" column="40" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="793" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="804" column="1" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="804" column="5" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="805" column="3" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="809" column="9" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="813" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="814" column="13" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="815" column="24" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="816" column="7" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="819" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="819" column="42" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="821" column="51" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="823" column="7" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="825" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="826" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="830" column="23" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="832" column="35" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="834" column="49" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="838" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="840" column="23" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="841" column="5" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="842" column="53" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="843" column="5" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="844" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="846" column="45" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="847" column="31" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="849" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="851" column="46" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="853" column="30" code="1005">'}' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="854" column="3" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="876" column="135" code="1003">Identifier expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="881" column="22" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="882" column="20" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="884" column="19" code="17002">Expected corresponding JSX closing tag for 'Button'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="885" column="17" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="886" column="15" code="17002">Expected corresponding JSX closing tag for 'PopoverTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="887" column="13" code="17002">Expected corresponding JSX closing tag for 'Popover'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="888" column="11" code="17002">Expected corresponding JSX closing tag for 'StockItemComboboxProps'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="889" column="9" code="17002">Expected corresponding JSX closing tag for 'think'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="890" column="5" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="891" column="3" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="892" column="1" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="895" column="3" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="900" column="6" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="901" column="6" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="902" column="6" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="905" column="4" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="988" column="12" code="1005">',' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="988" column="18" code="1005">',' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="990" column="2" code="1005">',' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="990" column="435" code="1002">Unterminated string literal.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="993" column="12" code="1005">',' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="993" column="18" code="1005">',' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="995" column="2" code="1005">',' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="995" column="435" code="1002">Unterminated string literal.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="997" column="1" code="1127">Invalid character.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="997" column="3" code="1127">Invalid character.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="998" column="3" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1105" column="104" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1105" column="122" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1105" column="141" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1105" column="184" code="1011">An element access expression should take an argument.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1105" column="185" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1105" column="240" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1108" column="2" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1221" column="1" code="1136">Property assignment expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1221" column="12" code="1005">',' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1221" column="20" code="1005">',' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1221" column="24" code="1005">'(' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1221" column="29" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="2" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="203" code="1005">')' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="214" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="223" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="234" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="237" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="246" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="250" code="1435">Unknown keyword or identifier. Did you mean 'require'?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="259" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="279" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="288" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="295" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="308" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="317" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="335" code="1005">'(' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="343" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="352" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1225" column="1" code="1127">Invalid character.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1225" column="3" code="1127">Invalid character.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1226" column="3" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1282" column="29" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1282" column="36" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1282" column="37" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1283" column="22" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1283" column="29" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1283" column="36" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1283" column="45" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1286" column="27" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1286" column="34" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1286" column="35" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1287" column="20" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1287" column="27" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1287" column="34" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1287" column="43" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1292" column="29" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1292" column="36" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1292" column="47" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1293" column="29" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1293" column="36" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1293" column="46" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1294" column="29" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1294" column="36" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1294" column="46" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1295" column="29" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1295" column="36" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1295" column="47" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1296" column="29" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1296" column="36" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1296" column="45" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1297" column="29" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1297" column="36" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1297" column="46" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1319" column="64" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1319" column="223" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1319" column="241" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1324" column="110" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1324" column="241" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1327" column="2" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1328" column="3" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1328" column="4" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1330" column="7" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1330" column="8" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1356" column="5" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1357" column="3" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1357" column="4" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1357" column="37" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1417" column="1" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1417" column="12" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="2" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="35" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="37" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="46" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="55" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="63" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="66" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="75" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="84" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="111" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="115" code="1005">'(' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="126" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="154" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="180" code="1005">')' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="190" code="1228">A type predicate is only allowed in return type position for functions and methods.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="193" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="196" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="205" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="227" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="239" code="1005">'=' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="246" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="250" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="260" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="278" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1421" column="1" code="1127">Invalid character.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1421" column="3" code="1127">Invalid character.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1422" column="3" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1426" column="29" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1426" column="36" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1426" column="47" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1427" column="29" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1427" column="36" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1427" column="46" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1428" column="29" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1428" column="36" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1428" column="46" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1429" column="29" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1429" column="36" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1429" column="47" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1432" column="29" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1432" column="36" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1432" column="47" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1433" column="29" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1433" column="36" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1433" column="46" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1434" column="29" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1434" column="36" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1434" column="46" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1435" column="29" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1435" column="36" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1435" column="47" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1510" column="18" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1510" column="24" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1510" column="41" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1526" column="92" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1526" column="103" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1526" column="169" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1526" column="187" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1526" column="206" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1529" column="2" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1530" column="7" code="1005">',' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1530" column="22" code="1005">',' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1530" column="32" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1635" column="1" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1635" column="12" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1637" column="2" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1637" column="288" code="1002">Unterminated string literal.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1639" column="1" code="1127">Invalid character.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1639" column="3" code="1127">Invalid character.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1640" column="3" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1672" column="18" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1672" column="24" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1672" column="41" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1761" column="36" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1761" column="185" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1761" column="196" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1764" column="2" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1868" column="20" code="1002">Unterminated string literal.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1870" column="12" code="1005">',' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1870" column="18" code="1005">',' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1872" column="2" code="1005">',' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1872" column="320" code="1002">Unterminated string literal.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1874" column="1" code="1127">Invalid character.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1874" column="3" code="1127">Invalid character.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1875" column="3" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1960" column="77" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1960" column="234" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1960" column="252" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1963" column="2" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2067" column="29" code="1002">Unterminated string literal.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2069" column="12" code="1005">',' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2069" column="19" code="1005">',' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2071" column="2" code="1005">',' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2071" column="309" code="1002">Unterminated string literal.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2073" column="1" code="1127">Invalid character.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2073" column="3" code="1127">Invalid character.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2074" column="3" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2181" column="37" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2181" column="149" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2184" column="2" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2296" column="237" code="1005">',' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2296" column="262" code="1005">',' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2299" column="4" code="1005">',' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2300" column="1" code="1005">',' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2406" column="1" code="1109">Expression expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2406" column="12" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="2" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="119" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="121" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="130" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="133" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="149" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="166" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="169" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="177" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="198" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="198" code="1434">Unexpected keyword or identifier.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="235" code="1002">Unterminated string literal.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2410" column="1" code="1127">Invalid character.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2410" column="3" code="1127">Invalid character.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2528" column="43" code="1005">';' expected.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2528" column="53" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2528" column="410" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2531" column="155" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2531" column="170" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2531" column="185" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2533" column="42" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2534" column="56" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2540" column="34" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2541" column="45" code="1443">Module declaration names may only use ' or &quot; quoted strings.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2560" column="2" code="1160">Unterminated template literal.</problem>
<problem file="src/components/StockItemCombobox.tsx" line="49" column="5" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;WarehouseCategory[], Error, WarehouseCategory[], readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseCategory[], readonly unknown[]&gt;'.
      Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'WarehouseCategory[] | Promise&lt;WarehouseCategory[]&gt;'.
        Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseCategory[]&gt;'.
          Type '{ id: any; name: any; code: any; }[]' is not assignable to type 'WarehouseCategory[]'.
            Type '{ id: any; name: any; code: any; }' is missing the following properties from type 'WarehouseCategory': user_id, created_at, updated_at
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;WarehouseCategory[], Error, WarehouseCategory[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'WarehouseCategory[] | Promise&lt;WarehouseCategory[]&gt;'.
          Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseCategory[]&gt;'.
            Type '{ id: any; name: any; code: any; }[]' is not assignable to type 'WarehouseCategory[]'.
              Type '{ id: any; name: any; code: any; }' is missing the following properties from type 'WarehouseCategory': user_id, created_at, updated_at
  Overload 3 of 3, '(options: UseQueryOptions&lt;WarehouseCategory[], Error, WarehouseCategory[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'WarehouseCategory[] | Promise&lt;WarehouseCategory[]&gt;'.
          Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseCategory[]&gt;'.
            Type '{ id: any; name: any; code: any; }[]' is not assignable to type 'WarehouseCategory[]'.
              Type '{ id: any; name: any; code: any; }' is missing the following properties from type 'WarehouseCategory': user_id, created_at, updated_at</problem>
<problem file="src/components/StockItemCombobox.tsx" line="63" column="43" code="2339">Property 'find' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/components/AddInvoiceForm.tsx" line="127" column="23" code="2339">Property 'user_id' does not exist on type '{ id: any; kode_barang: any; nama_barang: any; satuan: any; harga_jual: any; warehouse_inventories: { warehouse_category: any; quantity: any; }[]; }'.</problem>
<problem file="src/components/AddInvoiceForm.tsx" line="128" column="26" code="2339">Property 'created_at' does not exist on type '{ id: any; kode_barang: any; nama_barang: any; satuan: any; harga_jual: any; warehouse_inventories: { warehouse_category: any; quantity: any; }[]; }'.</problem>
<problem file="src/components/AddInvoiceForm.tsx" line="132" column="26" code="2339">Property 'harga_beli' does not exist on type '{ id: any; kode_barang: any; nama_barang: any; satuan: any; harga_jual: any; warehouse_inventories: { warehouse_category: any; quantity: any; }[]; }'.</problem>
<problem file="src/components/AddInvoiceForm.tsx" line="134" column="32" code="2339">Property 'safe_stock_limit' does not exist on type '{ id: any; kode_barang: any; nama_barang: any; satuan: any; harga_jual: any; warehouse_inventories: { warehouse_category: any; quantity: any; }[]; }'.</problem>
<problem file="src/components/AddInvoiceForm.tsx" line="135" column="27" code="2339">Property 'supplier_id' does not exist on type '{ id: any; kode_barang: any; nama_barang: any; satuan: any; harga_jual: any; warehouse_inventories: { warehouse_category: any; quantity: any; }[]; }'.</problem>
<problem file="src/components/EditInvoiceForm.tsx" line="137" column="23" code="2339">Property 'user_id' does not exist on type '{ id: any; kode_barang: any; nama_barang: any; satuan: any; harga_jual: any; warehouse_inventories: { warehouse_category: any; quantity: any; }[]; }'.</problem>
<problem file="src/components/EditInvoiceForm.tsx" line="138" column="26" code="2339">Property 'created_at' does not exist on type '{ id: any; kode_barang: any; nama_barang: any; satuan: any; harga_jual: any; warehouse_inventories: { warehouse_category: any; quantity: any; }[]; }'.</problem>
<problem file="src/components/EditInvoiceForm.tsx" line="142" column="26" code="2339">Property 'harga_beli' does not exist on type '{ id: any; kode_barang: any; nama_barang: any; satuan: any; harga_jual: any; warehouse_inventories: { warehouse_category: any; quantity: any; }[]; }'.</problem>
<problem file="src/components/EditInvoiceForm.tsx" line="144" column="32" code="2339">Property 'safe_stock_limit' does not exist on type '{ id: any; kode_barang: any; nama_barang: any; satuan: any; harga_jual: any; warehouse_inventories: { warehouse_category: any; quantity: any; }[]; }'.</problem>
<problem file="src/components/EditInvoiceForm.tsx" line="145" column="27" code="2339">Property 'supplier_id' does not exist on type '{ id: any; kode_barang: any; nama_barang: any; satuan: any; harga_jual: any; warehouse_inventories: { warehouse_category: any; quantity: any; }[]; }'.</problem>
<problem file="src/components/EditInvoiceForm.tsx" line="717" column="47" code="2552">Cannot find name 'addInvoiceMutation'. Did you mean 'updateInvoiceMutation'?</problem>
<problem file="src/components/EditInvoiceForm.tsx" line="718" column="18" code="2552">Cannot find name 'addInvoiceMutation'. Did you mean 'updateInvoiceMutation'?</problem>
<problem file="src/components/EditInvoiceForm.tsx" line="732" column="16" code="2552">Cannot find name 'AddInvoiceForm'. Did you mean 'EditInvoiceForm'?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="32" column="10" code="2300">Duplicate identifier 'supabase'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="907" column="10" code="2300">Duplicate identifier 'supabase'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="33" column="10" code="2300">Duplicate identifier 'showError'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="908" column="10" code="2300">Duplicate identifier 'showError'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="33" column="21" code="2300">Duplicate identifier 'showSuccess'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="908" column="21" code="2300">Duplicate identifier 'showSuccess'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="36" column="20" code="2300">Duplicate identifier 'useMutation'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="909" column="10" code="2300">Duplicate identifier 'useMutation'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="36" column="33" code="2300">Duplicate identifier 'useQueryClient'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="909" column="23" code="2300">Duplicate identifier 'useQueryClient'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="4" column="10" code="2300">Duplicate identifier 'useForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="911" column="10" code="2300">Duplicate identifier 'useForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="3" column="8" code="2300">Duplicate identifier 'React'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="912" column="13" code="2300">Duplicate identifier 'React'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="17" column="3" code="2300">Duplicate identifier 'Form'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="914" column="3" code="2300">Duplicate identifier 'Form'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="18" column="3" code="2300">Duplicate identifier 'FormControl'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="915" column="3" code="2300">Duplicate identifier 'FormControl'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="19" column="3" code="2300">Duplicate identifier 'FormField'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="917" column="3" code="2300">Duplicate identifier 'FormField'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="20" column="3" code="2300">Duplicate identifier 'FormItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="918" column="3" code="2300">Duplicate identifier 'FormItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="21" column="3" code="2300">Duplicate identifier 'FormLabel'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="919" column="3" code="2300">Duplicate identifier 'FormLabel'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="22" column="3" code="2300">Duplicate identifier 'FormMessage'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="920" column="3" code="2300">Duplicate identifier 'FormMessage'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="24" column="10" code="2300">Duplicate identifier 'Input'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="922" column="10" code="2300">Duplicate identifier 'Input'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="7" column="10" code="2300">Duplicate identifier 'Button'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="923" column="10" code="2300">Duplicate identifier 'Button'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="5" column="10" code="2300">Duplicate identifier 'zodResolver'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="924" column="10" code="2300">Duplicate identifier 'zodResolver'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="6" column="13" code="2300">Duplicate identifier 'z'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="925" column="13" code="2300">Duplicate identifier 'z'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="39" column="10" code="2300">Duplicate identifier 'useSession'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="926" column="10" code="2300">Duplicate identifier 'useSession'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="10" code="2300">Duplicate identifier 'Select'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="927" column="10" code="2300">Duplicate identifier 'Select'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="18" code="2300">Duplicate identifier 'SelectContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="929" column="3" code="2300">Duplicate identifier 'SelectContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="33" code="2300">Duplicate identifier 'SelectItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="930" column="3" code="2300">Duplicate identifier 'SelectItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="45" code="2300">Duplicate identifier 'SelectTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="931" column="3" code="2300">Duplicate identifier 'SelectTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="60" code="2300">Duplicate identifier 'SelectValue'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="932" column="3" code="2300">Duplicate identifier 'SelectValue'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="36" column="10" code="2300">Duplicate identifier 'useQuery'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="937" column="10" code="2300">Duplicate identifier 'useQuery'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="3" column="8" code="2300">Duplicate identifier 'React'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1112" column="8" code="2300">Duplicate identifier 'React'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="3" column="17" code="2300">Duplicate identifier 'useEffect'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1112" column="17" code="2300">Duplicate identifier 'useEffect'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="3" column="28" code="2300">Duplicate identifier 'useState'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1112" column="28" code="2300">Duplicate identifier 'useState'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="4" column="10" code="2300">Duplicate identifier 'useForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1113" column="10" code="2300">Duplicate identifier 'useForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="5" column="10" code="2300">Duplicate identifier 'zodResolver'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1114" column="10" code="2300">Duplicate identifier 'zodResolver'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="6" column="13" code="2300">Duplicate identifier 'z'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1115" column="13" code="2300">Duplicate identifier 'z'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="7" column="10" code="2300">Duplicate identifier 'Button'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1116" column="10" code="2300">Duplicate identifier 'Button'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="9" column="3" code="2300">Duplicate identifier 'Dialog'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1118" column="3" code="2300">Duplicate identifier 'Dialog'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="10" column="3" code="2300">Duplicate identifier 'DialogContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1119" column="3" code="2300">Duplicate identifier 'DialogContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="11" column="3" code="2300">Duplicate identifier 'DialogHeader'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1120" column="3" code="2300">Duplicate identifier 'DialogHeader'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="12" column="3" code="2300">Duplicate identifier 'DialogTitle'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1121" column="3" code="2300">Duplicate identifier 'DialogTitle'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="13" column="3" code="2300">Duplicate identifier 'DialogDescription'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1122" column="3" code="2300">Duplicate identifier 'DialogDescription'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="14" column="3" code="2300">Duplicate identifier 'DialogFooter'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1123" column="3" code="2300">Duplicate identifier 'DialogFooter'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="17" column="3" code="2300">Duplicate identifier 'Form'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1126" column="3" code="2300">Duplicate identifier 'Form'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="18" column="3" code="2300">Duplicate identifier 'FormControl'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1127" column="3" code="2300">Duplicate identifier 'FormControl'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="19" column="3" code="2300">Duplicate identifier 'FormField'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1128" column="3" code="2300">Duplicate identifier 'FormField'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="20" column="3" code="2300">Duplicate identifier 'FormItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1129" column="3" code="2300">Duplicate identifier 'FormItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="21" column="3" code="2300">Duplicate identifier 'FormLabel'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1130" column="3" code="2300">Duplicate identifier 'FormLabel'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="22" column="3" code="2300">Duplicate identifier 'FormMessage'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1131" column="3" code="2300">Duplicate identifier 'FormMessage'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="24" column="10" code="2300">Duplicate identifier 'Input'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1133" column="10" code="2300">Duplicate identifier 'Input'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="10" code="2300">Duplicate identifier 'Select'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1135" column="3" code="2300">Duplicate identifier 'Select'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="18" code="2300">Duplicate identifier 'SelectContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1136" column="3" code="2300">Duplicate identifier 'SelectContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="33" code="2300">Duplicate identifier 'SelectItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1137" column="3" code="2300">Duplicate identifier 'SelectItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="45" code="2300">Duplicate identifier 'SelectTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1138" column="3" code="2300">Duplicate identifier 'SelectTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="60" code="2300">Duplicate identifier 'SelectValue'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1139" column="3" code="2300">Duplicate identifier 'SelectValue'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="26" column="10" code="2300">Duplicate identifier 'Textarea'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1141" column="10" code="2300">Duplicate identifier 'Textarea'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="27" column="10" code="2300">Duplicate identifier 'Calendar'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1142" column="10" code="2300">Duplicate identifier 'Calendar'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="28" column="10" code="2300">Duplicate identifier 'Popover'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1143" column="10" code="2300">Duplicate identifier 'Popover'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="28" column="19" code="2300">Duplicate identifier 'PopoverContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1143" column="19" code="2300">Duplicate identifier 'PopoverContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="28" column="35" code="2300">Duplicate identifier 'PopoverTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1143" column="35" code="2300">Duplicate identifier 'PopoverTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="29" column="10" code="2300">Duplicate identifier 'cn'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1144" column="10" code="2300">Duplicate identifier 'cn'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="30" column="10" code="2300">Duplicate identifier 'format'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1145" column="10" code="2300">Duplicate identifier 'format'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="31" column="10" code="2300">Duplicate identifier 'CalendarIcon'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1147" column="3" code="2300">Duplicate identifier 'CalendarIcon'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="31" column="24" code="2300">Duplicate identifier 'Loader2'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1150" column="3" code="2300">Duplicate identifier 'Loader2'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="32" column="10" code="2300">Duplicate identifier 'supabase'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1152" column="10" code="2300">Duplicate identifier 'supabase'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="33" column="10" code="2300">Duplicate identifier 'showError'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1153" column="10" code="2300">Duplicate identifier 'showError'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="33" column="21" code="2300">Duplicate identifier 'showSuccess'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1153" column="21" code="2300">Duplicate identifier 'showSuccess'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="910" column="23" code="2300">Duplicate identifier 'Product'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1155" column="3" code="2300">Duplicate identifier 'Product'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="910" column="10" code="2300">Duplicate identifier 'InvoiceItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1162" column="3" code="2300">Duplicate identifier 'InvoiceItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="36" column="10" code="2300">Duplicate identifier 'useQuery'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1165" column="10" code="2300">Duplicate identifier 'useQuery'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="36" column="20" code="2300">Duplicate identifier 'useMutation'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1165" column="20" code="2300">Duplicate identifier 'useMutation'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="36" column="33" code="2300">Duplicate identifier 'useQueryClient'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1165" column="33" code="2300">Duplicate identifier 'useQueryClient'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="39" column="10" code="2300">Duplicate identifier 'useSession'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1166" column="10" code="2300">Duplicate identifier 'useSession'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="35" column="10" code="2300">Duplicate identifier 'Tabs'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1167" column="10" code="2300">Duplicate identifier 'Tabs'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="35" column="16" code="2300">Duplicate identifier 'TabsContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1167" column="16" code="2300">Duplicate identifier 'TabsContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="35" column="29" code="2300">Duplicate identifier 'TabsList'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1167" column="29" code="2300">Duplicate identifier 'TabsList'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="35" column="39" code="2300">Duplicate identifier 'TabsTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1167" column="39" code="2300">Duplicate identifier 'TabsTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="934" column="10" code="2300">Duplicate identifier 'addInvoiceSchema'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1168" column="10" code="2300">Duplicate identifier 'addInvoiceSchema'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="944" column="14" code="2451">Cannot redeclare block-scoped variable 'AddInvoiceForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1177" column="14" code="2451">Cannot redeclare block-scoped variable 'AddInvoiceForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="3" column="8" code="2300">Duplicate identifier 'React'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1765" column="8" code="2300">Duplicate identifier 'React'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="3" column="17" code="2300">Duplicate identifier 'useEffect'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1765" column="17" code="2300">Duplicate identifier 'useEffect'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="3" column="28" code="2300">Duplicate identifier 'useState'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1765" column="29" code="2300">Duplicate identifier 'useState'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="4" column="10" code="2300">Duplicate identifier 'useForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1766" column="10" code="2300">Duplicate identifier 'useForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1113" column="19" code="2300">Duplicate identifier 'useFieldArray'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1766" column="19" code="2300">Duplicate identifier 'useFieldArray'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="5" column="10" code="2300">Duplicate identifier 'zodResolver'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1767" column="10" code="2300">Duplicate identifier 'zodResolver'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="6" column="13" code="2300">Duplicate identifier 'z'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1768" column="13" code="2300">Duplicate identifier 'z'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="7" column="10" code="2300">Duplicate identifier 'Button'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1769" column="10" code="2300">Duplicate identifier 'Button'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="9" column="3" code="2300">Duplicate identifier 'Dialog'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1771" column="3" code="2300">Duplicate identifier 'Dialog'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="10" column="3" code="2300">Duplicate identifier 'DialogContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1772" column="3" code="2300">Duplicate identifier 'DialogContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="11" column="3" code="2300">Duplicate identifier 'DialogHeader'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1773" column="3" code="2300">Duplicate identifier 'DialogHeader'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="12" column="3" code="2300">Duplicate identifier 'DialogTitle'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1774" column="3" code="2300">Duplicate identifier 'DialogTitle'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="13" column="3" code="2300">Duplicate identifier 'DialogDescription'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1775" column="3" code="2300">Duplicate identifier 'DialogDescription'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="14" column="3" code="2300">Duplicate identifier 'DialogFooter'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1776" column="3" code="2300">Duplicate identifier 'DialogFooter'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="17" column="3" code="2300">Duplicate identifier 'Form'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1779" column="3" code="2300">Duplicate identifier 'Form'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="18" column="3" code="2300">Duplicate identifier 'FormControl'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1780" column="3" code="2300">Duplicate identifier 'FormControl'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="19" column="3" code="2300">Duplicate identifier 'FormField'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1781" column="3" code="2300">Duplicate identifier 'FormField'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="20" column="3" code="2300">Duplicate identifier 'FormItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1782" column="3" code="2300">Duplicate identifier 'FormItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="21" column="3" code="2300">Duplicate identifier 'FormLabel'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1783" column="3" code="2300">Duplicate identifier 'FormLabel'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="22" column="3" code="2300">Duplicate identifier 'FormMessage'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1784" column="3" code="2300">Duplicate identifier 'FormMessage'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="24" column="10" code="2300">Duplicate identifier 'Input'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1786" column="10" code="2300">Duplicate identifier 'Input'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="10" code="2300">Duplicate identifier 'Select'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1788" column="3" code="2300">Duplicate identifier 'Select'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="18" code="2300">Duplicate identifier 'SelectContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1789" column="3" code="2300">Duplicate identifier 'SelectContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="33" code="2300">Duplicate identifier 'SelectItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1790" column="3" code="2300">Duplicate identifier 'SelectItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="45" code="2300">Duplicate identifier 'SelectTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1791" column="3" code="2300">Duplicate identifier 'SelectTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="60" code="2300">Duplicate identifier 'SelectValue'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1792" column="3" code="2300">Duplicate identifier 'SelectValue'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="26" column="10" code="2300">Duplicate identifier 'Textarea'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1794" column="10" code="2300">Duplicate identifier 'Textarea'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="27" column="10" code="2300">Duplicate identifier 'Calendar'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1795" column="10" code="2300">Duplicate identifier 'Calendar'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="28" column="10" code="2300">Duplicate identifier 'Popover'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1796" column="10" code="2300">Duplicate identifier 'Popover'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="28" column="19" code="2300">Duplicate identifier 'PopoverContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1796" column="19" code="2300">Duplicate identifier 'PopoverContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="28" column="35" code="2300">Duplicate identifier 'PopoverTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1796" column="35" code="2300">Duplicate identifier 'PopoverTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="29" column="10" code="2300">Duplicate identifier 'cn'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1797" column="10" code="2300">Duplicate identifier 'cn'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="30" column="10" code="2300">Duplicate identifier 'format'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1798" column="10" code="2300">Duplicate identifier 'format'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="31" column="10" code="2300">Duplicate identifier 'CalendarIcon'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1799" column="10" code="2300">Duplicate identifier 'CalendarIcon'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1148" column="3" code="2300">Duplicate identifier 'PlusCircle'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1799" column="24" code="2300">Duplicate identifier 'PlusCircle'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1149" column="3" code="2300">Duplicate identifier 'Trash2'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1799" column="36" code="2300">Duplicate identifier 'Trash2'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="31" column="24" code="2300">Duplicate identifier 'Loader2'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1799" column="44" code="2300">Duplicate identifier 'Loader2'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="32" column="10" code="2300">Duplicate identifier 'supabase'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1800" column="10" code="2300">Duplicate identifier 'supabase'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="33" column="10" code="2300">Duplicate identifier 'showError'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1801" column="10" code="2300">Duplicate identifier 'showError'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="33" column="21" code="2300">Duplicate identifier 'showSuccess'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1801" column="21" code="2300">Duplicate identifier 'showSuccess'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="910" column="23" code="2300">Duplicate identifier 'Product'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1803" column="3" code="2300">Duplicate identifier 'Product'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1156" column="3" code="2300">Duplicate identifier 'InvoicePaymentStatus'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1804" column="3" code="2300">Duplicate identifier 'InvoicePaymentStatus'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1157" column="3" code="2300">Duplicate identifier 'InvoiceType'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1805" column="3" code="2300">Duplicate identifier 'InvoiceType'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1158" column="3" code="2300">Duplicate identifier 'CustomerTypeEnum'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1806" column="3" code="2300">Duplicate identifier 'CustomerTypeEnum'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1159" column="3" code="2300">Duplicate identifier 'WarehouseInventory'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1807" column="3" code="2300">Duplicate identifier 'WarehouseInventory'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1160" column="3" code="2300">Duplicate identifier 'ScheduleWithDetails'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1808" column="4" code="2300">Duplicate identifier 'ScheduleWithDetails'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1161" column="3" code="2300">Duplicate identifier 'InvoiceDocumentStatus'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1809" column="3" code="2300">Duplicate identifier 'InvoiceDocumentStatus'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="910" column="10" code="2300">Duplicate identifier 'InvoiceItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1810" column="3" code="2300">Duplicate identifier 'InvoiceItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1164" column="8" code="2300">Duplicate identifier 'StockItemCombobox'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1812" column="8" code="2300">Duplicate identifier 'StockItemCombobox'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="36" column="10" code="2300">Duplicate identifier 'useQuery'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1813" column="10" code="2300">Duplicate identifier 'useQuery'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="36" column="20" code="2300">Duplicate identifier 'useMutation'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1813" column="20" code="2300">Duplicate identifier 'useMutation'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="36" column="33" code="2300">Duplicate identifier 'useQueryClient'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1813" column="33" code="2300">Duplicate identifier 'useQueryClient'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="39" column="10" code="2300">Duplicate identifier 'useSession'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1814" column="10" code="2300">Duplicate identifier 'useSession'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="35" column="10" code="2300">Duplicate identifier 'Tabs'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1815" column="10" code="2300">Duplicate identifier 'Tabs'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="35" column="16" code="2300">Duplicate identifier 'TabsContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1815" column="16" code="2300">Duplicate identifier 'TabsContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="35" column="29" code="2300">Duplicate identifier 'TabsList'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1815" column="29" code="2300">Duplicate identifier 'TabsList'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="35" column="39" code="2300">Duplicate identifier 'TabsTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1815" column="39" code="2300">Duplicate identifier 'TabsTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="934" column="10" code="2300">Duplicate identifier 'addInvoiceSchema'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1816" column="10" code="2300">Duplicate identifier 'addInvoiceSchema'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="935" column="10" code="2300">Duplicate identifier 'useRouter'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1817" column="10" code="2300">Duplicate identifier 'useRouter'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="3" column="8" code="2300">Duplicate identifier 'React'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1964" column="8" code="2300">Duplicate identifier 'React'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="3" column="17" code="2300">Duplicate identifier 'useEffect'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1964" column="17" code="2300">Duplicate identifier 'useEffect'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="3" column="28" code="2300">Duplicate identifier 'useState'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1964" column="29" code="2300">Duplicate identifier 'useState'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="4" column="10" code="2300">Duplicate identifier 'useForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1965" column="10" code="2300">Duplicate identifier 'useForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1113" column="19" code="2300">Duplicate identifier 'useFieldArray'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1965" column="19" code="2300">Duplicate identifier 'useFieldArray'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="5" column="10" code="2300">Duplicate identifier 'zodResolver'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1966" column="10" code="2300">Duplicate identifier 'zodResolver'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="6" column="13" code="2300">Duplicate identifier 'z'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1967" column="13" code="2300">Duplicate identifier 'z'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="7" column="10" code="2300">Duplicate identifier 'Button'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1968" column="10" code="2300">Duplicate identifier 'Button'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="9" column="3" code="2300">Duplicate identifier 'Dialog'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1970" column="3" code="2300">Duplicate identifier 'Dialog'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="10" column="3" code="2300">Duplicate identifier 'DialogContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1971" column="3" code="2300">Duplicate identifier 'DialogContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="11" column="3" code="2300">Duplicate identifier 'DialogHeader'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1972" column="3" code="2300">Duplicate identifier 'DialogHeader'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="12" column="3" code="2300">Duplicate identifier 'DialogTitle'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1973" column="3" code="2300">Duplicate identifier 'DialogTitle'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="13" column="3" code="2300">Duplicate identifier 'DialogDescription'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1974" column="3" code="2300">Duplicate identifier 'DialogDescription'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="14" column="3" code="2300">Duplicate identifier 'DialogFooter'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1975" column="3" code="2300">Duplicate identifier 'DialogFooter'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="17" column="3" code="2300">Duplicate identifier 'Form'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1978" column="3" code="2300">Duplicate identifier 'Form'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="18" column="3" code="2300">Duplicate identifier 'FormControl'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1979" column="3" code="2300">Duplicate identifier 'FormControl'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="19" column="3" code="2300">Duplicate identifier 'FormField'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1980" column="3" code="2300">Duplicate identifier 'FormField'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="20" column="3" code="2300">Duplicate identifier 'FormItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1981" column="3" code="2300">Duplicate identifier 'FormItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="21" column="3" code="2300">Duplicate identifier 'FormLabel'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1982" column="3" code="2300">Duplicate identifier 'FormLabel'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="22" column="3" code="2300">Duplicate identifier 'FormMessage'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1983" column="3" code="2300">Duplicate identifier 'FormMessage'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="24" column="10" code="2300">Duplicate identifier 'Input'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1985" column="10" code="2300">Duplicate identifier 'Input'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="10" code="2300">Duplicate identifier 'Select'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1986" column="10" code="2300">Duplicate identifier 'Select'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="18" code="2300">Duplicate identifier 'SelectContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1986" column="18" code="2300">Duplicate identifier 'SelectContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="33" code="2300">Duplicate identifier 'SelectItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1986" column="33" code="2300">Duplicate identifier 'SelectItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="45" code="2300">Duplicate identifier 'SelectTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1986" column="45" code="2300">Duplicate identifier 'SelectTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="60" code="2300">Duplicate identifier 'SelectValue'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1986" column="60" code="2300">Duplicate identifier 'SelectValue'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="26" column="10" code="2300">Duplicate identifier 'Textarea'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1987" column="10" code="2300">Duplicate identifier 'Textarea'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="27" column="10" code="2300">Duplicate identifier 'Calendar'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1988" column="10" code="2300">Duplicate identifier 'Calendar'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="28" column="10" code="2300">Duplicate identifier 'Popover'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1989" column="10" code="2300">Duplicate identifier 'Popover'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="28" column="19" code="2300">Duplicate identifier 'PopoverContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1989" column="19" code="2300">Duplicate identifier 'PopoverContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="28" column="35" code="2300">Duplicate identifier 'PopoverTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1989" column="35" code="2300">Duplicate identifier 'PopoverTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="29" column="10" code="2300">Duplicate identifier 'cn'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1990" column="10" code="2300">Duplicate identifier 'cn'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="30" column="10" code="2300">Duplicate identifier 'format'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1991" column="10" code="2300">Duplicate identifier 'format'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="31" column="10" code="2300">Duplicate identifier 'CalendarIcon'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1992" column="10" code="2300">Duplicate identifier 'CalendarIcon'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1148" column="3" code="2300">Duplicate identifier 'PlusCircle'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1992" column="24" code="2300">Duplicate identifier 'PlusCircle'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1149" column="3" code="2300">Duplicate identifier 'Trash2'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1992" column="36" code="2300">Duplicate identifier 'Trash2'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="31" column="24" code="2300">Duplicate identifier 'Loader2'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1992" column="44" code="2300">Duplicate identifier 'Loader2'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="32" column="10" code="2300">Duplicate identifier 'supabase'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1993" column="10" code="2300">Duplicate identifier 'supabase'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="33" column="10" code="2300">Duplicate identifier 'showError'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1994" column="10" code="2300">Duplicate identifier 'showError'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="33" column="21" code="2300">Duplicate identifier 'showSuccess'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1994" column="21" code="2300">Duplicate identifier 'showSuccess'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="910" column="23" code="2300">Duplicate identifier 'Product'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1996" column="3" code="2300">Duplicate identifier 'Product'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1156" column="3" code="2300">Duplicate identifier 'InvoicePaymentStatus'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1997" column="3" code="2300">Duplicate identifier 'InvoicePaymentStatus'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1157" column="3" code="2300">Duplicate identifier 'InvoiceType'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1998" column="3" code="2300">Duplicate identifier 'InvoiceType'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1158" column="3" code="2300">Duplicate identifier 'CustomerTypeEnum'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1999" column="3" code="2300">Duplicate identifier 'CustomerTypeEnum'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1159" column="3" code="2300">Duplicate identifier 'WarehouseInventory'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2000" column="3" code="2300">Duplicate identifier 'WarehouseInventory'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1160" column="3" code="2300">Duplicate identifier 'ScheduleWithDetails'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2001" column="4" code="2300">Duplicate identifier 'ScheduleWithDetails'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1161" column="3" code="2300">Duplicate identifier 'InvoiceDocumentStatus'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2002" column="3" code="2300">Duplicate identifier 'InvoiceDocumentStatus'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1164" column="8" code="2300">Duplicate identifier 'StockItemCombobox'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2004" column="8" code="2300">Duplicate identifier 'StockItemCombobox'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="36" column="10" code="2300">Duplicate identifier 'useQuery'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2005" column="10" code="2300">Duplicate identifier 'useQuery'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="36" column="20" code="2300">Duplicate identifier 'useMutation'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2005" column="20" code="2300">Duplicate identifier 'useMutation'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="36" column="33" code="2300">Duplicate identifier 'useQueryClient'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2005" column="33" code="2300">Duplicate identifier 'useQueryClient'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="39" column="10" code="2300">Duplicate identifier 'useSession'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2006" column="10" code="2300">Duplicate identifier 'useSession'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="35" column="10" code="2300">Duplicate identifier 'Tabs'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2007" column="10" code="2300">Duplicate identifier 'Tabs'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="35" column="16" code="2300">Duplicate identifier 'TabsContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2007" column="16" code="2300">Duplicate identifier 'TabsContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="35" column="29" code="2300">Duplicate identifier 'TabsList'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2007" column="29" code="2300">Duplicate identifier 'TabsList'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="35" column="39" code="2300">Duplicate identifier 'TabsTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2007" column="39" code="2300">Duplicate identifier 'TabsTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="935" column="10" code="2300">Duplicate identifier 'useRouter'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2008" column="10" code="2300">Duplicate identifier 'useRouter'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="934" column="10" code="2300">Duplicate identifier 'addInvoiceSchema'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2009" column="10" code="2300">Duplicate identifier 'addInvoiceSchema'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="944" column="14" code="2451">Cannot redeclare block-scoped variable 'AddInvoiceForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1177" column="14" code="2451">Cannot redeclare block-scoped variable 'AddInvoiceForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1827" column="7" code="2451">Cannot redeclare block-scoped variable 'AddInvoiceForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2019" column="7" code="2451">Cannot redeclare block-scoped variable 'AddInvoiceForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="3" column="8" code="2300">Duplicate identifier 'React'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2185" column="8" code="2300">Duplicate identifier 'React'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="3" column="17" code="2300">Duplicate identifier 'useEffect'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2185" column="17" code="2300">Duplicate identifier 'useEffect'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="3" column="28" code="2300">Duplicate identifier 'useState'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2185" column="29" code="2300">Duplicate identifier 'useState'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="4" column="10" code="2300">Duplicate identifier 'useForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2186" column="10" code="2300">Duplicate identifier 'useForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1113" column="19" code="2300">Duplicate identifier 'useFieldArray'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2186" column="19" code="2300">Duplicate identifier 'useFieldArray'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="5" column="10" code="2300">Duplicate identifier 'zodResolver'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2187" column="10" code="2300">Duplicate identifier 'zodResolver'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="6" column="13" code="2300">Duplicate identifier 'z'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2188" column="13" code="2300">Duplicate identifier 'z'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="7" column="10" code="2300">Duplicate identifier 'Button'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2189" column="10" code="2300">Duplicate identifier 'Button'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="9" column="3" code="2300">Duplicate identifier 'Dialog'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2191" column="3" code="2300">Duplicate identifier 'Dialog'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="10" column="3" code="2300">Duplicate identifier 'DialogContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2192" column="3" code="2300">Duplicate identifier 'DialogContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="11" column="3" code="2300">Duplicate identifier 'DialogHeader'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2193" column="3" code="2300">Duplicate identifier 'DialogHeader'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="12" column="3" code="2300">Duplicate identifier 'DialogTitle'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2194" column="3" code="2300">Duplicate identifier 'DialogTitle'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="13" column="3" code="2300">Duplicate identifier 'DialogDescription'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2195" column="3" code="2300">Duplicate identifier 'DialogDescription'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="14" column="3" code="2300">Duplicate identifier 'DialogFooter'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2196" column="3" code="2300">Duplicate identifier 'DialogFooter'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="17" column="3" code="2300">Duplicate identifier 'Form'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2199" column="3" code="2300">Duplicate identifier 'Form'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="18" column="3" code="2300">Duplicate identifier 'FormControl'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2200" column="3" code="2300">Duplicate identifier 'FormControl'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="19" column="3" code="2300">Duplicate identifier 'FormField'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2201" column="3" code="2300">Duplicate identifier 'FormField'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="20" column="3" code="2300">Duplicate identifier 'FormItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2202" column="3" code="2300">Duplicate identifier 'FormItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="21" column="3" code="2300">Duplicate identifier 'FormLabel'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2203" column="3" code="2300">Duplicate identifier 'FormLabel'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="22" column="3" code="2300">Duplicate identifier 'FormMessage'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2204" column="3" code="2300">Duplicate identifier 'FormMessage'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="24" column="10" code="2300">Duplicate identifier 'Input'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2206" column="10" code="2300">Duplicate identifier 'Input'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="10" code="2300">Duplicate identifier 'Select'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2207" column="10" code="2300">Duplicate identifier 'Select'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="18" code="2300">Duplicate identifier 'SelectContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2207" column="18" code="2300">Duplicate identifier 'SelectContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="33" code="2300">Duplicate identifier 'SelectItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2207" column="33" code="2300">Duplicate identifier 'SelectItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="45" code="2300">Duplicate identifier 'SelectTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2207" column="45" code="2300">Duplicate identifier 'SelectTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="25" column="60" code="2300">Duplicate identifier 'SelectValue'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2207" column="60" code="2300">Duplicate identifier 'SelectValue'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="26" column="10" code="2300">Duplicate identifier 'Textarea'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2208" column="10" code="2300">Duplicate identifier 'Textarea'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="27" column="10" code="2300">Duplicate identifier 'Calendar'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2209" column="10" code="2300">Duplicate identifier 'Calendar'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="28" column="10" code="2300">Duplicate identifier 'Popover'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2210" column="10" code="2300">Duplicate identifier 'Popover'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="28" column="19" code="2300">Duplicate identifier 'PopoverContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2210" column="19" code="2300">Duplicate identifier 'PopoverContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="28" column="35" code="2300">Duplicate identifier 'PopoverTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2210" column="35" code="2300">Duplicate identifier 'PopoverTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="29" column="10" code="2300">Duplicate identifier 'cn'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2211" column="10" code="2300">Duplicate identifier 'cn'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="30" column="10" code="2300">Duplicate identifier 'format'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2212" column="10" code="2300">Duplicate identifier 'format'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="31" column="10" code="2300">Duplicate identifier 'CalendarIcon'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2213" column="10" code="2300">Duplicate identifier 'CalendarIcon'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1148" column="3" code="2300">Duplicate identifier 'PlusCircle'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2213" column="24" code="2300">Duplicate identifier 'PlusCircle'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1149" column="3" code="2300">Duplicate identifier 'Trash2'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2213" column="36" code="2300">Duplicate identifier 'Trash2'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="31" column="24" code="2300">Duplicate identifier 'Loader2'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2213" column="44" code="2300">Duplicate identifier 'Loader2'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="32" column="10" code="2300">Duplicate identifier 'supabase'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2214" column="10" code="2300">Duplicate identifier 'supabase'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="33" column="10" code="2300">Duplicate identifier 'showError'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2215" column="10" code="2300">Duplicate identifier 'showError'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="33" column="21" code="2300">Duplicate identifier 'showSuccess'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2215" column="21" code="2300">Duplicate identifier 'showSuccess'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="910" column="23" code="2300">Duplicate identifier 'Product'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2217" column="3" code="2300">Duplicate identifier 'Product'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1156" column="3" code="2300">Duplicate identifier 'InvoicePaymentStatus'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2218" column="3" code="2300">Duplicate identifier 'InvoicePaymentStatus'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1157" column="3" code="2300">Duplicate identifier 'InvoiceType'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2219" column="3" code="2300">Duplicate identifier 'InvoiceType'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1158" column="3" code="2300">Duplicate identifier 'CustomerTypeEnum'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2220" column="3" code="2300">Duplicate identifier 'CustomerTypeEnum'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1159" column="3" code="2300">Duplicate identifier 'WarehouseInventory'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2221" column="3" code="2300">Duplicate identifier 'WarehouseInventory'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1160" column="3" code="2300">Duplicate identifier 'ScheduleWithDetails'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2222" column="4" code="2300">Duplicate identifier 'ScheduleWithDetails'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1161" column="3" code="2300">Duplicate identifier 'InvoiceDocumentStatus'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2223" column="3" code="2300">Duplicate identifier 'InvoiceDocumentStatus'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1164" column="8" code="2300">Duplicate identifier 'StockItemCombobox'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2225" column="8" code="2300">Duplicate identifier 'StockItemCombobox'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="36" column="10" code="2300">Duplicate identifier 'useQuery'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2226" column="10" code="2300">Duplicate identifier 'useQuery'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="36" column="20" code="2300">Duplicate identifier 'useMutation'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2226" column="20" code="2300">Duplicate identifier 'useMutation'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="36" column="33" code="2300">Duplicate identifier 'useQueryClient'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2226" column="33" code="2300">Duplicate identifier 'useQueryClient'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="39" column="10" code="2300">Duplicate identifier 'useSession'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2227" column="10" code="2300">Duplicate identifier 'useSession'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="35" column="10" code="2300">Duplicate identifier 'Tabs'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2228" column="10" code="2300">Duplicate identifier 'Tabs'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="35" column="16" code="2300">Duplicate identifier 'TabsContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2228" column="16" code="2300">Duplicate identifier 'TabsContent'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="35" column="29" code="2300">Duplicate identifier 'TabsList'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2228" column="29" code="2300">Duplicate identifier 'TabsList'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="35" column="39" code="2300">Duplicate identifier 'TabsTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2228" column="39" code="2300">Duplicate identifier 'TabsTrigger'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="935" column="10" code="2300">Duplicate identifier 'useRouter'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2229" column="10" code="2300">Duplicate identifier 'useRouter'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="934" column="10" code="2300">Duplicate identifier 'addInvoiceSchema'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2230" column="10" code="2300">Duplicate identifier 'addInvoiceSchema'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="944" column="14" code="2451">Cannot redeclare block-scoped variable 'AddInvoiceForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1177" column="14" code="2451">Cannot redeclare block-scoped variable 'AddInvoiceForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1827" column="7" code="2451">Cannot redeclare block-scoped variable 'AddInvoiceForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2240" column="7" code="2451">Cannot redeclare block-scoped variable 'AddInvoiceForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="64" column="7" code="2322">Type '({ isOpen, onOpenChange, onSuccess, initialData }: AddEditScheduleFormProps) =&gt; void' is not assignable to type 'FC&lt;AddEditScheduleFormProps&gt;'.
  Type 'void' is not assignable to type 'ReactNode'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="92" column="5" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;Technician[], Error, Technician[], readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; type: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;Technician[], readonly unknown[]&gt;'.
      Type 'Promise&lt;{ id: any; name: any; type: any; }[]&gt;' is not assignable to type 'Technician[] | Promise&lt;Technician[]&gt;'.
        Type 'Promise&lt;{ id: any; name: any; type: any; }[]&gt;' is not assignable to type 'Promise&lt;Technician[]&gt;'.
          Type '{ id: any; name: any; type: any; }[]' is not assignable to type 'Technician[]'.
            Type '{ id: any; name: any; type: any; }' is missing the following properties from type 'Technician': user_id, phone_number, address, city, and 3 more.
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;Technician[], Error, Technician[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; type: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;Technician[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; name: any; type: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;Technician[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; name: any; type: any; }[]&gt;' is not assignable to type 'Technician[] | Promise&lt;Technician[]&gt;'.
          Type 'Promise&lt;{ id: any; name: any; type: any; }[]&gt;' is not assignable to type 'Promise&lt;Technician[]&gt;'.
            Type '{ id: any; name: any; type: any; }[]' is not assignable to type 'Technician[]'.
              Type '{ id: any; name: any; type: any; }' is missing the following properties from type 'Technician': user_id, phone_number, address, city, and 3 more.
  Overload 3 of 3, '(options: UseQueryOptions&lt;Technician[], Error, Technician[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;Technician[], Error&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; type: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;Technician[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; name: any; type: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;Technician[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; name: any; type: any; }[]&gt;' is not assignable to type 'Technician[] | Promise&lt;Technician[]&gt;'.
          Type 'Promise&lt;{ id: any; name: any; type: any; }[]&gt;' is not assignable to type 'Promise&lt;Technician[]&gt;'.
            Type '{ id: any; name: any; type: any; }[]' is not assignable to type 'Technician[]'.
              Type '{ id: any; name: any; type: any; }' is missing the following properties from type 'Technician': user_id, phone_number, address, city, and 3 more.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="108" column="5" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;Customer[], Error, Customer[], readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;Customer[], Error&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;Customer[], readonly unknown[]&gt;'.
      Type 'Promise&lt;{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]&gt;' is not assignable to type 'Customer[] | Promise&lt;Customer[]&gt;'.
        Type 'Promise&lt;{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]&gt;' is not assignable to type 'Promise&lt;Customer[]&gt;'.
          Type '{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]' is not assignable to type 'Customer[]'.
            Type '{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }' is missing the following properties from type 'Customer': user_id, created_at, updated_at
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;Customer[], Error, Customer[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;Customer[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;Customer[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]&gt;' is not assignable to type 'Customer[] | Promise&lt;Customer[]&gt;'.
          Type 'Promise&lt;{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]&gt;' is not assignable to type 'Promise&lt;Customer[]&gt;'.
            Type '{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]' is not assignable to type 'Customer[]'.
              Type '{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }' is missing the following properties from type 'Customer': user_id, created_at, updated_at
  Overload 3 of 3, '(options: UseQueryOptions&lt;Customer[], Error, Customer[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;Customer[], Error&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;Customer[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;Customer[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]&gt;' is not assignable to type 'Customer[] | Promise&lt;Customer[]&gt;'.
          Type 'Promise&lt;{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]&gt;' is not assignable to type 'Promise&lt;Customer[]&gt;'.
            Type '{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]' is not assignable to type 'Customer[]'.
              Type '{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }' is missing the following properties from type 'Customer': user_id, created_at, updated_at</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="144" column="11" code="2322">Type 'boolean' is not assignable to type 'string'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="144" column="24" code="18050">The value 'null' cannot be used here.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="144" column="29" code="2304">Cannot find name 'dyad'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="144" column="34" code="2304">Cannot find name 'problem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="144" column="42" code="2304">Cannot find name 'report'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="144" column="57" code="2365">Operator '&gt;' cannot be applied to types 'string' and 'Element'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="145" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="147" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="148" column="26" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="149" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="150" column="19" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="151" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="153" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="154" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="155" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="156" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="157" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="158" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="160" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="161" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="162" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="163" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="164" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="165" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="165" column="155" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="166" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="166" column="142" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="167" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="167" column="131" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="167" column="231" code="2304">Cannot find name 'warehouse_category'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="167" column="279" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="168" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="168" column="134" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="168" column="234" code="2304">Cannot find name 'warehouse_category'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="168" column="282" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="169" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="169" column="134" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="169" column="234" code="2304">Cannot find name 'warehouse_category'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="169" column="282" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="170" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="170" column="140" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="170" column="240" code="2304">Cannot find name 'warehouse_category'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="170" column="288" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="171" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="171" column="135" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="171" column="235" code="2304">Cannot find name 'warehouse_category'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="171" column="283" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="172" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="172" column="132" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="172" column="232" code="2304">Cannot find name 'warehouse_category'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="172" column="280" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="173" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="173" column="135" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="173" column="235" code="2304">Cannot find name 'warehouse_category'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="173" column="283" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="174" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="174" column="135" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="174" column="235" code="2304">Cannot find name 'warehouse_category'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="174" column="283" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="175" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="175" column="141" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="175" column="241" code="2304">Cannot find name 'warehouse_category'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="175" column="289" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="176" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="176" column="136" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="176" column="236" code="2304">Cannot find name 'warehouse_category'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="176" column="284" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="177" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="177" column="163" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="178" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="178" column="163" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="179" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="179" column="153" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="180" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="182" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="183" column="26" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="184" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="185" column="19" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="186" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="188" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="189" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="190" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="191" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="192" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="193" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="195" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="196" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="197" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="198" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="199" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="200" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="200" column="155" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="201" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="201" column="143" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="202" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="202" column="142" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="203" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="203" column="141" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="204" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="206" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="207" column="26" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="208" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="209" column="19" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="210" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="212" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="213" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="214" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="215" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="216" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="217" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="219" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="220" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="221" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="222" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="223" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="224" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="224" column="155" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="225" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="225" column="151" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="226" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="228" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="229" column="26" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="230" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="231" column="19" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="232" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="234" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="235" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="236" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="237" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="238" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="239" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="241" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="242" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="243" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="244" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="245" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="246" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="246" column="191" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="247" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="249" column="33" code="2304">Cannot find name 'product_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="249" column="226" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="250" column="26" code="2304">Cannot find name 'product_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="250" column="219" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="251" column="28" code="2304">Cannot find name 'product_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="251" column="221" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="252" column="19" code="2304">Cannot find name 'product_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="252" column="212" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="253" column="21" code="2304">Cannot find name 'product_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="253" column="214" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="255" column="33" code="2304">Cannot find name 'product_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="255" column="226" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="256" column="35" code="2304">Cannot find name 'product_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="256" column="228" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="257" column="28" code="2304">Cannot find name 'product_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="257" column="221" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="258" column="30" code="2304">Cannot find name 'product_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="258" column="223" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="259" column="21" code="2304">Cannot find name 'product_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="259" column="214" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="260" column="23" code="2304">Cannot find name 'product_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="260" column="216" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="262" column="33" code="2304">Cannot find name 'product_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="262" column="226" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="263" column="35" code="2304">Cannot find name 'product_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="263" column="228" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="264" column="28" code="2304">Cannot find name 'product_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="264" column="221" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="265" column="30" code="2304">Cannot find name 'product_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="265" column="223" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="266" column="21" code="2304">Cannot find name 'product_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="266" column="214" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="267" column="23" code="2304">Cannot find name 'product_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="267" column="216" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="267" column="334" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="268" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="268" column="146" code="2304">Cannot find name 'nama_barang'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="268" column="187" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="269" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="269" column="146" code="2304">Cannot find name 'nama_barang'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="269" column="187" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="270" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="270" column="154" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="271" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="271" column="154" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="272" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="272" column="151" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="273" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="273" column="154" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="274" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="274" column="151" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="275" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="275" column="105" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="275" column="308" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="276" column="11" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="276" column="214" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="278" column="15" code="2304">Cannot find name 'nama_barang'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="278" column="200" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="279" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="279" column="113" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="279" column="316" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="280" column="11" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="280" column="214" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="282" column="15" code="2304">Cannot find name 'nama_barang'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="282" column="200" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="283" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="283" column="139" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="283" column="274" code="2304">Cannot find name 'warehouse_category'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="283" column="322" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="284" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="284" column="142" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="284" column="277" code="2304">Cannot find name 'warehouse_category'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="284" column="325" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="285" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="285" column="148" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="285" column="283" code="2304">Cannot find name 'warehouse_category'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="285" column="331" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="286" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="288" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="289" column="26" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="290" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="291" column="19" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="292" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="294" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="295" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="296" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="297" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="298" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="299" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="301" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="302" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="303" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="304" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="305" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="306" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="306" column="161" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="307" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="309" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="310" column="26" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="311" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="312" column="19" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="313" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="315" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="316" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="317" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="318" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="319" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="320" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="322" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="323" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="324" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="325" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="326" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="327" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="327" column="155" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="328" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="328" column="150" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="329" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="329" column="150" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="330" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="330" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="331" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="331" column="147" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="332" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="332" column="140" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="332" column="275" code="2304">Cannot find name 'warehouse_category'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="332" column="323" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="333" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="333" column="143" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="333" column="278" code="2304">Cannot find name 'warehouse_category'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="333" column="326" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="334" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="334" column="149" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="334" column="284" code="2304">Cannot find name 'warehouse_category'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="334" column="332" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="335" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="337" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="338" column="26" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="339" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="340" column="19" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="341" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="343" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="344" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="345" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="346" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="347" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="348" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="350" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="351" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="352" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="353" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="354" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="355" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="355" column="161" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="356" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="356" column="148" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="357" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="357" column="108" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="357" column="356" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="358" column="11" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="358" column="259" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="360" column="15" code="2304">Cannot find name 'nama_barang'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="360" column="242" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="361" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="363" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="364" column="26" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="365" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="366" column="19" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="367" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="369" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="370" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="371" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="372" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="373" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="374" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="376" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="377" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="378" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="379" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="380" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="381" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="381" column="155" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="382" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="382" column="148" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="383" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="385" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="386" column="26" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="387" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="388" column="19" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="389" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="391" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="392" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="393" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="394" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="395" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="396" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="398" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="399" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="400" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="401" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="402" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="403" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="403" column="155" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="404" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="404" column="144" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="405" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="407" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="408" column="26" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="409" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="410" column="19" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="411" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="413" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="414" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="415" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="416" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="417" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="418" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="420" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="421" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="422" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="423" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="424" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="425" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="425" column="191" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="426" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="426" column="145" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="427" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="427" column="145" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="428" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="428" column="145" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="429" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="429" column="144" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="430" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="430" column="145" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="431" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="433" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="434" column="26" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="435" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="436" column="19" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="437" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="439" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="440" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="441" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="442" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="443" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="444" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="446" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="447" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="448" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="449" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="450" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="451" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="451" column="216" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="452" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="454" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="455" column="26" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="456" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="457" column="19" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="458" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="460" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="461" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="462" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="463" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="464" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="465" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="467" column="33" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="468" column="35" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="469" column="28" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="470" column="30" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="471" column="21" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="472" column="23" code="2304">Cannot find name 'id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="472" column="166" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="473" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="474" column="62" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="475" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="476" column="64" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="477" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="477" column="154" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="478" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="480" column="33" code="2304">Cannot find name 'no'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="480" column="251" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="481" column="26" code="2304">Cannot find name 'no'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="481" column="244" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="482" column="28" code="2304">Cannot find name 'no'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="482" column="246" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="483" column="19" code="2304">Cannot find name 'no'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="483" column="237" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="484" column="60" code="2304">Cannot find name 'no'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="484" column="278" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="486" column="33" code="2304">Cannot find name 'no'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="486" column="251" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="487" column="35" code="2304">Cannot find name 'no'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="487" column="253" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="488" column="28" code="2304">Cannot find name 'no'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="488" column="246" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="489" column="30" code="2304">Cannot find name 'no'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="489" column="248" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="490" column="21" code="2304">Cannot find name 'no'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="490" column="239" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="491" column="62" code="2304">Cannot find name 'no'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="491" column="280" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="493" column="33" code="2304">Cannot find name 'no'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="493" column="251" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="494" column="35" code="2304">Cannot find name 'no'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="494" column="253" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="495" column="28" code="2304">Cannot find name 'no'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="495" column="246" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="496" column="30" code="2304">Cannot find name 'no'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="496" column="248" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="497" column="21" code="2304">Cannot find name 'no'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="497" column="239" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="498" column="62" code="2304">Cannot find name 'no'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="498" column="280" code="2609">JSX spread child must be an array type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="498" column="347" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="499" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="499" column="140" code="2304">Cannot find name 'invoice_number'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="499" column="166" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="500" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="500" column="139" code="2304">Cannot find name 'customer_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="500" column="222" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="501" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="501" column="138" code="2304">Cannot find name 'customer_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="501" column="221" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="502" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="502" column="138" code="2304">Cannot find name 'customer_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="502" column="221" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="503" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="503" column="139" code="2304">Cannot find name 'customer_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="503" column="222" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="504" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="504" column="141" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="505" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="505" column="145" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="506" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="506" column="145" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="507" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="507" column="145" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="508" column="3" code="2304">Cannot find name 'dyad'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="508" column="3" code="2365">Operator '&gt;' cannot be applied to types 'number' and 'Element'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="508" column="8" code="2304">Cannot find name 'problem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="508" column="16" code="2552">Cannot find name 'report'. Did you mean 'Report'?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="508" column="23" code="2339">Property 'think' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="641" column="5" code="2304">Cannot find name 'data'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="646" column="5" code="2304">Cannot find name 'queryKey'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="648" column="15" code="2304">Cannot find name 'data'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="648" column="15" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="648" column="21" code="2304">Cannot find name 'error'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="652" column="59" code="2304">Cannot find name 'error'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="663" column="5" code="2304">Cannot find name 'setSearchValue'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="663" column="20" code="2304">Cannot find name 'inputValue'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="673" column="27" code="2304">Cannot find name 'errorCategories'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="678" column="5" code="2304">Cannot find name 'onSelectProduct'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="678" column="21" code="2304">Cannot find name 'productId'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="684" column="5" code="2304">Cannot find name 'onInputValueChange'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="684" column="24" code="2304">Cannot find name 'value'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="688" column="14" code="2322">Type '(url?: string | URL, target?: string, features?: string) =&gt; Window' is not assignable to type 'boolean'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="688" column="40" code="2304">Cannot find name 'setOpen'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="690" column="10" code="2322">Type '{ children: any[]; variant: &quot;outline&quot;; role: &quot;combobox&quot;; &quot;aria-expanded&quot;: (url?: string | URL, target?: string, features?: string) =&gt; Window; className: string; disabled: any; }' is not assignable to type 'ButtonProps'.
  Types of property '&quot;aria-expanded&quot;' are incompatible.
    Type '(url?: string | URL, target?: string, features?: string) =&gt; Window' is not assignable to type 'Booleanish'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="695" column="21" code="2304">Cannot find name 'disabled'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="695" column="33" code="2304">Cannot find name 'loading'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="697" column="12" code="2304">Cannot find name 'selectedProductId'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="698" column="15" code="2304">Cannot find name 'products'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="698" column="57" code="2304">Cannot find name 'selectedProductId'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="700" column="15" code="2304">Cannot find name 'placeholder'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="701" column="12" code="2304">Cannot find name 'ChevronsUpDown'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="705" column="10" code="2304">Cannot find name 'Command'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="706" column="12" code="2304">Cannot find name 'CommandInput'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="707" column="26" code="2304">Cannot find name 'placeholder'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="708" column="20" code="2304">Cannot find name 'searchValue'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="709" column="30" code="2304">Cannot find name 'handleInputChange'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="711" column="12" code="2304">Cannot find name 'CommandEmpty'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="711" column="50" code="2304">Cannot find name 'CommandEmpty'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="712" column="12" code="2304">Cannot find name 'CommandList'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="713" column="14" code="2304">Cannot find name 'CommandGroup'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="714" column="16" code="2304">Cannot find name 'loadingCategories'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="715" column="18" code="2304">Cannot find name 'CommandItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="718" column="19" code="2304">Cannot find name 'CommandItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="720" column="16" code="2304">Cannot find name 'filteredProducts'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="721" column="18" code="2304">Cannot find name 'CommandItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="724" column="35" code="2304">Cannot find name 'handleSelect'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="726" column="20" code="2304">Cannot find name 'Check'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="729" column="23" code="2304">Cannot find name 'selectedProductId'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="733" column="19" code="2304">Cannot find name 'CommandItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="735" column="15" code="2304">Cannot find name 'CommandGroup'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="736" column="13" code="2304">Cannot find name 'CommandList'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="737" column="11" code="2304">Cannot find name 'Command'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="752" column="10" code="2304">Cannot find name 'Check'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="752" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="752" column="17" code="2304">Cannot find name 'ChevronsUpDown'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="754" column="3" code="2304">Cannot find name 'Adjusting'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="765" column="10" code="2304">Cannot find name 'Check'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="765" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="765" column="17" code="2304">Cannot find name 'ChevronsUpDown'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="771" column="3" code="2304">Cannot find name 'Command'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="771" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="771" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="771" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="771" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="771" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="771" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="772" column="3" code="2304">Cannot find name 'CommandEmpty'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="773" column="3" code="2304">Cannot find name 'CommandGroup'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="774" column="3" code="2304">Cannot find name 'CommandInput'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="775" column="3" code="2304">Cannot find name 'CommandItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="776" column="3" code="2304">Cannot find name 'CommandList'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="778" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="778" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="779" column="10" code="2693">'Product' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="779" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="779" column="19" code="2693">'WarehouseInventory' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="785" column="3" code="2304">Cannot find name 'products'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="795" column="35" code="2304">Cannot find name 'StockItemComboboxProps'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="796" column="3" code="2304">Cannot find name 'products'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="796" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="796" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="796" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="796" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="796" column="3" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="797" column="3" code="2304">Cannot find name 'selectedProductId'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="798" column="3" code="2304">Cannot find name 'onSelectProduct'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="799" column="3" code="2304">Cannot find name 'inputValue'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="800" column="3" code="2304">Cannot find name 'onInputValueChange'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="801" column="3" code="2304">Cannot find name 'placeholder'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="802" column="3" code="2304">Cannot find name 'disabled'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="803" column="3" code="2304">Cannot find name 'loading'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="809" column="5" code="2304">Cannot find name 'data'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="814" column="5" code="2304">Cannot find name 'queryKey'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="816" column="15" code="2304">Cannot find name 'data'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="816" column="15" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="816" column="21" code="2304">Cannot find name 'error'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="819" column="26" code="2304">Cannot find name 'ascending'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="832" column="5" code="2304">Cannot find name 'onInputValueChange'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="832" column="24" code="2304">Cannot find name 'inputValue'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="842" column="27" code="2304">Cannot find name 'errorCategories'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="847" column="5" code="2304">Cannot find name 'onSelectProduct'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="847" column="21" code="2304">Cannot find name 'productId'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="853" column="5" code="2304">Cannot find name 'onInputValueChange'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="853" column="24" code="2304">Cannot find name 'value'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="857" column="14" code="2322">Type '(url?: string | URL, target?: string, features?: string) =&gt; Window' is not assignable to type 'boolean'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="857" column="40" code="2304">Cannot find name 'setOpen'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="859" column="10" code="2322">Type '{ children: any[]; variant: &quot;outline&quot;; role: &quot;combobox&quot;; &quot;aria-expanded&quot;: (url?: string | URL, target?: string, features?: string) =&gt; Window; className: string; disabled: any; }' is not assignable to type 'ButtonProps'.
  Types of property '&quot;aria-expanded&quot;' are incompatible.
    Type '(url?: string | URL, target?: string, features?: string) =&gt; Window' is not assignable to type 'Booleanish'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="864" column="21" code="2304">Cannot find name 'disabled'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="864" column="33" code="2304">Cannot find name 'loadingCategories'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="864" column="54" code="2304">Cannot find name 'loading'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="866" column="12" code="2304">Cannot find name 'loadingCategories'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="866" column="33" code="2304">Cannot find name 'loading'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="868" column="15" code="2304">Cannot find name 'selectedProductId'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="869" column="15" code="2304">Cannot find name 'products'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="869" column="57" code="2304">Cannot find name 'selectedProductId'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="871" column="15" code="2304">Cannot find name 'inputValue'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="871" column="29" code="2304">Cannot find name 'placeholder'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="872" column="12" code="2304">Cannot find name 'ChevronsUpDown'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="883" column="20" code="2304">Cannot find name 'item'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="883" column="40" code="2304">Cannot find name 'item'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="884" column="19" code="2304">Cannot find name 'CommandItem'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="886" column="15" code="2304">Cannot find name 'CommandGroup'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="887" column="13" code="2304">Cannot find name 'CommandList'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="888" column="11" code="2304">Cannot find name 'Command'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="895" column="1" code="2349">This expression is not callable.
  Type 'String' has no call signatures.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="899" column="6" code="2304">Cannot find name 'src'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="899" column="10" code="2304">Cannot find name 'components'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="899" column="21" code="2552">Cannot find name 'forms'. Did you mean 'Form'?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="899" column="27" code="2448">Block-scoped variable 'AddInvoiceForm' used before its declaration.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="899" column="42" code="2339">Property 'tsx' does not exist on type '({ onClose, invoiceId, onInvoiceCreated, refetchInvoices, }: AddInvoiceFormProps) =&gt; void'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="900" column="6" code="2304">Cannot find name 'src'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="900" column="10" code="2304">Cannot find name 'components'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="900" column="21" code="2304">Cannot find name 'forms'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="900" column="27" code="2304">Cannot find name 'EditInvoiceForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="901" column="6" code="2304">Cannot find name 'src'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="901" column="10" code="2304">Cannot find name 'components'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="901" column="21" code="2304">Cannot find name 'forms'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="901" column="27" code="2304">Cannot find name 'AddPurchaseRequestForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="902" column="6" code="2304">Cannot find name 'src'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="902" column="10" code="2304">Cannot find name 'components'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="902" column="21" code="2304">Cannot find name 'forms'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="902" column="27" code="2304">Cannot find name 'EditPurchaseRequestForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="905" column="4" code="2304">Cannot find name 'typescript'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="926" column="28" code="2307">Cannot find module 'next-auth/react' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="934" column="34" code="2307">Cannot find module '@/lib/validations/invoice' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="935" column="27" code="2307">Cannot find module 'next/router' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="944" column="14" code="2395">Individual declarations in merged declaration 'AddInvoiceForm' must be all exported or all local.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="946" column="11" code="2339">Property 'data' does not exist on type 'SessionContextType'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="988" column="3" code="2304">Cannot find name 'Refining'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="988" column="12" code="2304">Cannot find name 'Query'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="988" column="18" code="2304">Cannot find name 'Selections'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="988" column="18" code="2554">Expected 2-3 arguments, but got 8.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="990" column="1" code="2304">Cannot find name 'I'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="990" column="2" code="2362">The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="993" column="3" code="2304">Cannot find name 'Refining'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="993" column="12" code="2304">Cannot find name 'Query'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="993" column="18" code="2304">Cannot find name 'Selections'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="995" column="1" code="2304">Cannot find name 'I'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="997" column="2" code="2304">Cannot find name 'n'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="997" column="4" code="2304">Cannot find name 'n'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1105" column="104" code="2345">Argument of type 'TemplateStringsArray' is not assignable to parameter of type 'StockItemComboboxProps'.
  Type 'TemplateStringsArray' is missing the following properties from type 'StockItemComboboxProps': products, selectedProductId, onSelectProduct, inputValue, onInputValueChange</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1105" column="108" code="2448">Block-scoped variable 'AddInvoiceForm' used before its declaration.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1105" column="122" code="2345">Argument of type 'TemplateStringsArray' is not assignable to parameter of type 'AddInvoiceFormProps'.
  Type 'TemplateStringsArray' is missing the following properties from type 'AddInvoiceFormProps': onClose, invoiceId, isOpen, onOpenChange, onSuccess</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1105" column="126" code="2304">Cannot find name 'EditInvoiceForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1105" column="176" code="2693">'Product' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1105" column="229" code="2304">Cannot find name 'select'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1105" column="250" code="2304">Cannot find name 'products'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1108" column="4" code="2304">Cannot find name 'javascript'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1168" column="34" code="2307">Cannot find module '@/lib/validations/invoice' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1177" column="14" code="2395">Individual declarations in merged declaration 'AddInvoiceForm' must be all exported or all local.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1184" column="11" code="2339">Property 'data' does not exist on type 'SessionContextType'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1219" column="69" code="2362">The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1219" column="69" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;unknown, Error, unknown, readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;unknown, Error&gt;', gave the following error.
    Argument of type 'number' is not assignable to parameter of type 'DefinedInitialDataOptions&lt;unknown, Error, unknown, readonly unknown[]&gt;'.
      Type 'number' is not assignable to type 'Omit&lt;UseQueryOptions&lt;unknown, Error, unknown, readonly unknown[]&gt;, &quot;queryFn&quot;&gt;'.
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;unknown, Error, unknown, readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;unknown, Error&gt;', gave the following error.
    Argument of type 'number' is not assignable to parameter of type 'UndefinedInitialDataOptions&lt;unknown, Error, unknown, readonly unknown[]&gt;'.
      Type 'number' is not assignable to type 'UseQueryOptions&lt;unknown, Error, unknown, readonly unknown[]&gt;'.
  Overload 3 of 3, '(options: UseQueryOptions&lt;unknown, Error, unknown, readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;unknown, Error&gt;', gave the following error.
    Argument of type 'number' is not assignable to parameter of type 'UseQueryOptions&lt;unknown, Error, unknown, readonly unknown[]&gt;'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1221" column="3" code="2304">Cannot find name 'Refining'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1221" column="12" code="2304">Cannot find name 'Queries'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1221" column="24" code="2304">Cannot find name 'Data'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1221" column="29" code="2304">Cannot find name 'Accuracy'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="1" code="2304">Cannot find name 'I'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="203" code="2304">Cannot find name 'm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="205" code="2304">Cannot find name 'updating'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="223" code="2304">Cannot find name 'statements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="234" code="2304">Cannot find name 'to'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="237" code="2304">Cannot find name 'retrieve'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="246" code="2304">Cannot find name 'all'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="250" code="2304">Cannot find name 'required'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="259" code="2304">Cannot find name 'product'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="267" code="2304">Cannot find name 'fields'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="267" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="275" code="2304">Cannot find name 'and'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="279" code="2304">Cannot find name 'handling'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="288" code="2304">Cannot find name 'nested'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="295" code="2304">Cannot find name 'join'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="300" code="2304">Cannot find name 'data'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="308" code="2304">Cannot find name 'am'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="311" code="2304">Cannot find name 'using'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="335" code="2304">Cannot find name 'product'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="343" code="2304">Cannot find name 'data'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="343" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="349" code="2304">Cannot find name 'as'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1223" column="352" code="2304">Cannot find name 'well'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1225" column="2" code="2304">Cannot find name 'n'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1225" column="4" code="2304">Cannot find name 'n'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1282" column="22" code="2304">Cannot find name 'items'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1282" column="30" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1282" column="37" code="2581">Cannot find name '$'. Do you need to install type definitions for jQuery? Try `npm i --save-dev @types/jquery`.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1282" column="39" code="2304">Cannot find name 'field'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1283" column="22" code="2304">Cannot find name 'items'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1283" column="30" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1283" column="37" code="2304">Cannot find name 'subtotal'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1286" column="20" code="2304">Cannot find name 'items'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1286" column="28" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1286" column="35" code="2581">Cannot find name '$'. Do you need to install type definitions for jQuery? Try `npm i --save-dev @types/jquery`.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1286" column="37" code="2304">Cannot find name 'field'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1287" column="20" code="2304">Cannot find name 'items'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1287" column="28" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1287" column="35" code="2304">Cannot find name 'subtotal'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1292" column="22" code="2304">Cannot find name 'items'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1292" column="30" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1292" column="37" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1293" column="22" code="2304">Cannot find name 'items'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1293" column="30" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1293" column="37" code="2304">Cannot find name 'item_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1294" column="22" code="2304">Cannot find name 'items'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1294" column="30" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1294" column="37" code="2304">Cannot find name 'item_code'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1295" column="22" code="2304">Cannot find name 'items'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1295" column="30" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1295" column="37" code="2304">Cannot find name 'unit_price'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1296" column="22" code="2304">Cannot find name 'items'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1296" column="30" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1296" column="37" code="2304">Cannot find name 'subtotal'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1297" column="22" code="2304">Cannot find name 'items'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1297" column="30" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1297" column="37" code="2304">Cannot find name 'unit_type'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1319" column="58" code="2304">Cannot find name 'select'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1319" column="223" code="2345">Argument of type 'TemplateStringsArray' is not assignable to parameter of type 'StockItemComboboxProps'.
  Type 'TemplateStringsArray' is missing the following properties from type 'StockItemComboboxProps': products, selectedProductId, onSelectProduct, inputValue, onInputValueChange</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1319" column="241" code="2345">Argument of type 'TemplateStringsArray' is not assignable to parameter of type 'AddInvoiceFormProps'.
  Type 'TemplateStringsArray' is missing the following properties from type 'AddInvoiceFormProps': onClose, invoiceId, isOpen, onOpenChange, onSuccess</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1324" column="99" code="2304">Cannot find name 'select'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1324" column="241" code="2345">Argument of type 'TemplateStringsArray' is not assignable to parameter of type 'AddInvoiceFormProps'.
  Type 'TemplateStringsArray' is missing the following properties from type 'AddInvoiceFormProps': onClose, invoiceId, isOpen, onOpenChange, onSuccess</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1324" column="248" code="2349">This expression is not callable.
  No constituent of type 'ReactNode' is callable.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1324" column="265" code="2345">Argument of type 'TemplateStringsArray' is not assignable to parameter of type 'StockItemComboboxProps'.
  Type 'TemplateStringsArray' is missing the following properties from type 'StockItemComboboxProps': products, selectedProductId, onSelectProduct, inputValue, onInputValueChange</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1327" column="4" code="2304">Cannot find name 'javascript'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1329" column="16" code="2304">Cannot find name 'defaultNotes'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1329" column="16" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1333" column="11" code="2304">Cannot find name 'initialSchedule'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1335" column="9" code="2304">Cannot find name 'form'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1336" column="9" code="2304">Cannot find name 'initialSchedule'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1338" column="11" code="2304">Cannot find name 'form'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1347" column="11" code="2304">Cannot find name 'form'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1349" column="11" code="2304">Cannot find name 'form'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1350" column="11" code="2304">Cannot find name 'form'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1351" column="11" code="2304">Cannot find name 'form'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1352" column="11" code="2304">Cannot find name 'form'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1353" column="11" code="2304">Cannot find name 'form'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1357" column="7" code="2304">Cannot find name 'isOpen'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1357" column="15" code="2304">Cannot find name 'initialSchedule'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1357" column="32" code="2304">Cannot find name 'form'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1361" column="7" code="2304">Cannot find name 'setLoading'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1366" column="20" code="2304">Cannot find name 'session'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1368" column="40" code="2551">Property 'invoice_date' does not exist on type '{ customer_id?: string; customer_name?: string; address?: string; phone_number?: string; schedule_date?: Date; schedule_time?: string; type?: ScheduleType; status?: ScheduleStatus; ... 4 more ...; courier_service?: string; }'. Did you mean 'invoice_id'?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1369" column="36" code="2339">Property 'due_date' does not exist on type '{ customer_id?: string; customer_name?: string; address?: string; phone_number?: string; schedule_date?: Date; schedule_time?: string; type?: ScheduleType; status?: ScheduleStatus; ... 4 more ...; courier_service?: string; }'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1371" column="40" code="2339">Property 'company_name' does not exist on type '{ customer_id?: string; customer_name?: string; address?: string; phone_number?: string; schedule_date?: Date; schedule_time?: string; type?: ScheduleType; status?: ScheduleStatus; ... 4 more ...; courier_service?: string; }'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1372" column="40" code="2339">Property 'total_amount' does not exist on type '{ customer_id?: string; customer_name?: string; address?: string; phone_number?: string; schedule_date?: Date; schedule_time?: string; type?: ScheduleType; status?: ScheduleStatus; ... 4 more ...; courier_service?: string; }'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1373" column="42" code="2339">Property 'payment_status' does not exist on type '{ customer_id?: string; customer_name?: string; address?: string; phone_number?: string; schedule_date?: Date; schedule_time?: string; type?: ScheduleType; status?: ScheduleStatus; ... 4 more ...; courier_service?: string; }'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1375" column="41" code="2339">Property 'customer_type' does not exist on type '{ customer_id?: string; customer_name?: string; address?: string; phone_number?: string; schedule_date?: Date; schedule_time?: string; type?: ScheduleType; status?: ScheduleStatus; ... 4 more ...; courier_service?: string; }'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1376" column="42" code="2339">Property 'payment_method' does not exist on type '{ customer_id?: string; customer_name?: string; address?: string; phone_number?: string; schedule_date?: Date; schedule_time?: string; type?: ScheduleType; status?: ScheduleStatus; ... 4 more ...; courier_service?: string; }'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1380" column="42" code="2339">Property 'invoice_status' does not exist on type '{ customer_id?: string; customer_name?: string; address?: string; phone_number?: string; schedule_date?: Date; schedule_time?: string; type?: ScheduleType; status?: ScheduleStatus; ... 4 more ...; courier_service?: string; }'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1388" column="9" code="2304">Cannot find name 'setLoading'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1393" column="53" code="2339">Property 'items' does not exist on type '{ customer_id?: string; customer_name?: string; address?: string; phone_number?: string; schedule_date?: Date; schedule_time?: string; type?: ScheduleType; status?: ScheduleStatus; ... 4 more ...; courier_service?: string; }'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1395" column="20" code="2304">Cannot find name 'session'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1411" column="11" code="2304">Cannot find name 'setLoading'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1417" column="3" code="2304">Cannot find name 'Refining'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1417" column="12" code="2304">Cannot find name 'Data'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1417" column="17" code="2304">Cannot find name 'Fetching'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="1" code="2304">Cannot find name 'I'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="35" code="2304">Cannot find name 'm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="37" code="2304">Cannot find name 'updating'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="46" code="2304">Cannot find name 'Supabase'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="55" code="2304">Cannot find name 'queries'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="63" code="2304">Cannot find name 'to'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="66" code="2304">Cannot find name 'retrieve'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="75" code="2304">Cannot find name 'complete'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="84" code="2304">Cannot find name 'product'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="92" code="2304">Cannot find name 'data'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="92" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="98" code="2304">Cannot find name 'specifically'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="115" code="2304">Cannot find name 'components'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="126" code="2304">Cannot find name 'such'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="154" code="2304">Cannot find name 'and'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="180" code="2304">Cannot find name 'objective'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="190" code="2304">Cannot find name 'is'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="193" code="2304">Cannot find name 'to'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="196" code="2304">Cannot find name 'retrieve'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="205" code="2304">Cannot find name 'all'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="209" code="2304">Cannot find name 'fields'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="209" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="217" code="2304">Cannot find name 'resolving'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="239" code="2304">Cannot find name 'issues'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="246" code="2304">Cannot find name 'and'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="250" code="2304">Cannot find name 'improving'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="260" code="2304">Cannot find name 'data'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="265" code="2304">Cannot find name 'integrity'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="278" code="2304">Cannot find name 'am'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1419" column="281" code="2304">Cannot find name 'using'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1421" column="2" code="2304">Cannot find name 'n'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1421" column="4" code="2304">Cannot find name 'n'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1426" column="22" code="2304">Cannot find name 'items'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1426" column="30" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1426" column="37" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1427" column="22" code="2304">Cannot find name 'items'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1427" column="30" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1427" column="37" code="2304">Cannot find name 'item_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1428" column="22" code="2304">Cannot find name 'items'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1428" column="30" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1428" column="37" code="2304">Cannot find name 'item_code'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1429" column="22" code="2304">Cannot find name 'items'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1429" column="30" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1429" column="37" code="2304">Cannot find name 'unit_price'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1432" column="22" code="2304">Cannot find name 'items'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1432" column="30" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1432" column="37" code="2304">Cannot find name 'product_id'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1433" column="22" code="2304">Cannot find name 'items'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1433" column="30" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1433" column="37" code="2304">Cannot find name 'item_name'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1434" column="22" code="2304">Cannot find name 'items'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1434" column="30" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1434" column="37" code="2304">Cannot find name 'item_code'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1435" column="22" code="2304">Cannot find name 'items'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1435" column="30" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1435" column="37" code="2304">Cannot find name 'unit_price'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1510" column="18" code="2304">Cannot find name 'Gagal'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1510" column="24" code="2304">Cannot find name 'membuat'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1510" column="41" code="2581">Cannot find name '$'. Do you need to install type definitions for jQuery? Try `npm i --save-dev @types/jquery`.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1510" column="43" code="2304">Cannot find name 'error'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1526" column="92" code="2304">Cannot find name 'select'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1526" column="169" code="2345">Argument of type 'TemplateStringsArray' is not assignable to parameter of type 'StockItemComboboxProps'.
  Type 'TemplateStringsArray' is missing the following properties from type 'StockItemComboboxProps': products, selectedProductId, onSelectProduct, inputValue, onInputValueChange</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1526" column="187" code="2345">Argument of type 'TemplateStringsArray' is not assignable to parameter of type 'AddInvoiceFormProps'.
  Type 'TemplateStringsArray' is missing the following properties from type 'AddInvoiceFormProps': onClose, invoiceId, isOpen, onOpenChange, onSuccess</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1526" column="191" code="2304">Cannot find name 'EditInvoiceForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1526" column="241" code="2693">'Product' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1529" column="4" code="2304">Cannot find name 'javascript'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1530" column="2" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1530" column="9" code="2693">'number' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1530" column="17" code="2304">Cannot find name 'value'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1530" column="24" code="2693">'string' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1531" column="34" code="2304">Cannot find name 'value'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1532" column="23" code="2304">Cannot find name 'fields'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1532" column="30" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1534" column="7" code="2304">Cannot find name 'update'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1534" column="14" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1534" column="26" code="2304">Cannot find name 'fields'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1534" column="33" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1537" column="5" code="2304">Cannot find name 'update'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1537" column="12" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1538" column="10" code="2304">Cannot find name 'fields'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1538" column="17" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1540" column="31" code="2304">Cannot find name 'fields'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1540" column="38" code="2304">Cannot find name 'index'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1546" column="23" code="2304">Cannot find name 'fields'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1548" column="7" code="2304">Cannot find name 'update'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1548" column="26" code="2304">Cannot find name 'fields'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1551" column="5" code="2304">Cannot find name 'update'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1552" column="10" code="2304">Cannot find name 'fields'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1554" column="31" code="2304">Cannot find name 'fields'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1560" column="12" code="2304">Cannot find name 'session'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1567" column="20" code="2304">Cannot find name 'session'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1568" column="30" code="2551">Property 'invoice_date' does not exist on type '{ customer_id?: string; customer_name?: string; address?: string; phone_number?: string; schedule_date?: Date; schedule_time?: string; type?: ScheduleType; status?: ScheduleStatus; ... 4 more ...; courier_service?: string; }'. Did you mean 'invoice_id'?</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1569" column="26" code="2339">Property 'due_date' does not exist on type '{ customer_id?: string; customer_name?: string; address?: string; phone_number?: string; schedule_date?: Date; schedule_time?: string; type?: ScheduleType; status?: ScheduleStatus; ... 4 more ...; courier_service?: string; }'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1571" column="30" code="2339">Property 'company_name' does not exist on type '{ customer_id?: string; customer_name?: string; address?: string; phone_number?: string; schedule_date?: Date; schedule_time?: string; type?: ScheduleType; status?: ScheduleStatus; ... 4 more ...; courier_service?: string; }'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1572" column="30" code="2339">Property 'total_amount' does not exist on type '{ customer_id?: string; customer_name?: string; address?: string; phone_number?: string; schedule_date?: Date; schedule_time?: string; type?: ScheduleType; status?: ScheduleStatus; ... 4 more ...; courier_service?: string; }'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1573" column="32" code="2339">Property 'payment_status' does not exist on type '{ customer_id?: string; customer_name?: string; address?: string; phone_number?: string; schedule_date?: Date; schedule_time?: string; type?: ScheduleType; status?: ScheduleStatus; ... 4 more ...; courier_service?: string; }'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1575" column="31" code="2339">Property 'customer_type' does not exist on type '{ customer_id?: string; customer_name?: string; address?: string; phone_number?: string; schedule_date?: Date; schedule_time?: string; type?: ScheduleType; status?: ScheduleStatus; ... 4 more ...; courier_service?: string; }'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1576" column="32" code="2339">Property 'payment_method' does not exist on type '{ customer_id?: string; customer_name?: string; address?: string; phone_number?: string; schedule_date?: Date; schedule_time?: string; type?: ScheduleType; status?: ScheduleStatus; ... 4 more ...; courier_service?: string; }'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1580" column="32" code="2339">Property 'invoice_status' does not exist on type '{ customer_id?: string; customer_name?: string; address?: string; phone_number?: string; schedule_date?: Date; schedule_time?: string; type?: ScheduleType; status?: ScheduleStatus; ... 4 more ...; courier_service?: string; }'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1596" column="41" code="2339">Property 'items' does not exist on type '{ customer_id?: string; customer_name?: string; address?: string; phone_number?: string; schedule_date?: Date; schedule_time?: string; type?: ScheduleType; status?: ScheduleStatus; ... 4 more ...; courier_service?: string; }'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1598" column="18" code="2304">Cannot find name 'session'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1622" column="7" code="2304">Cannot find name 'queryClient'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1623" column="7" code="2304">Cannot find name 'queryClient'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1625" column="7" code="2304">Cannot find name 'onSuccess'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1635" column="3" code="2304">Cannot find name 'Refining'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1635" column="12" code="2304">Cannot find name 'Query'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1635" column="18" code="2304">Cannot find name 'Selections'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1637" column="1" code="2304">Cannot find name 'I'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1637" column="2" code="2362">The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1637" column="284" code="2363">The right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1639" column="2" code="2304">Cannot find name 'n'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1639" column="4" code="2304">Cannot find name 'n'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1672" column="18" code="2304">Cannot find name 'Gagal'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1672" column="24" code="2304">Cannot find name 'membuat'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1672" column="41" code="2581">Cannot find name '$'. Do you need to install type definitions for jQuery? Try `npm i --save-dev @types/jquery`.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1672" column="43" code="2304">Cannot find name 'error'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1761" column="36" code="2304">Cannot find name 'src'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1761" column="40" code="2304">Cannot find name 'components'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1761" column="66" code="2339">Property 'tsx' does not exist on type '({ onClose, invoiceId, onInvoiceCreated, refetchInvoices, }: AddInvoiceFormProps) =&gt; void'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1761" column="185" code="2304">Cannot find name 'select'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1761" column="206" code="2304">Cannot find name 'products'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1764" column="4" code="2304">Cannot find name 'javascript'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1768" column="20" code="2307">Cannot find module ' zod' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1785" column="8" code="2307">Cannot find module '@/components/ui/ form' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1794" column="26" code="2307">Cannot find module '@/ components/ui/textarea' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1800" column="26" code="2307">Cannot find module '@/integrations/ supabase/client' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1816" column="34" code="2307">Cannot find module '@/lib/validations/invoice' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1817" column="27" code="2307">Cannot find module 'next/router' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1827" column="7" code="2322">Type '({ isOpen, onOpenChange, onSuccess, initialSchedule, refetchInvoices }: AddInvoiceFormProps) =&gt; void' is not assignable to type 'FC&lt;AddInvoiceFormProps&gt;'.
  Type 'void' is not assignable to type 'ReactNode'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1827" column="7" code="2395">Individual declarations in merged declaration 'AddInvoiceForm' must be all exported or all local.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1829" column="11" code="2339">Property 'data' does not exist on type 'SessionContextType'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1862" column="5" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;Product[], Error, Product[], readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;Product[], Error&gt;', gave the following error.
    Type '() =&gt; Promise&lt;void&gt;' is not assignable to type 'QueryFunction&lt;Product[], readonly unknown[]&gt;'.
      Type 'Promise&lt;void&gt;' is not assignable to type 'Product[] | Promise&lt;Product[]&gt;'.
        Type 'Promise&lt;void&gt;' is not assignable to type 'Promise&lt;Product[]&gt;'.
          Type 'void' is not assignable to type 'Product[]'.
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;Product[], Error, Product[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;Product[], Error&gt;', gave the following error.
    Type '() =&gt; Promise&lt;void&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;Product[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;void&gt;' is not assignable to type 'QueryFunction&lt;Product[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;void&gt;' is not assignable to type 'Product[] | Promise&lt;Product[]&gt;'.
          Type 'Promise&lt;void&gt;' is not assignable to type 'Promise&lt;Product[]&gt;'.
            Type 'void' is not assignable to type 'Product[]'.
  Overload 3 of 3, '(options: UseQueryOptions&lt;Product[], Error, Product[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;Product[], Error&gt;', gave the following error.
    Type '() =&gt; Promise&lt;void&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;Product[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;void&gt;' is not assignable to type 'QueryFunction&lt;Product[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;void&gt;' is not assignable to type 'Product[] | Promise&lt;Product[]&gt;'.
          Type 'Promise&lt;void&gt;' is not assignable to type 'Promise&lt;Product[]&gt;'.
            Type 'void' is not assignable to type 'Product[]'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1868" column="19" code="2362">The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1870" column="3" code="2304">Cannot find name 'Refining'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1870" column="12" code="2304">Cannot find name 'Query'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1870" column="12" code="2554">Expected 1 arguments, but got 4.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1870" column="18" code="2304">Cannot find name 'Selections'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1872" column="1" code="2304">Cannot find name 'I'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1872" column="2" code="2362">The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1872" column="281" code="2363">The right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1874" column="2" code="2304">Cannot find name 'n'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1874" column="4" code="2304">Cannot find name 'n'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1960" column="71" code="2304">Cannot find name 'select'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1960" column="234" code="2345">Argument of type 'TemplateStringsArray' is not assignable to parameter of type 'StockItemComboboxProps'.
  Type 'TemplateStringsArray' is missing the following properties from type 'StockItemComboboxProps': products, selectedProductId, onSelectProduct, inputValue, onInputValueChange</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1960" column="252" code="2345">Argument of type 'TemplateStringsArray' is not assignable to parameter of type 'AddInvoiceFormProps'.
  Type 'TemplateStringsArray' is missing the following properties from type 'AddInvoiceFormProps': onClose, invoiceId, isOpen, onOpenChange, onSuccess</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1960" column="259" code="2304">Cannot find name 'EditPurchaseRequestForm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1963" column="4" code="2304">Cannot find name 'javascript'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1967" column="20" code="2307">Cannot find module ' zod' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1984" column="8" code="2307">Cannot find module '@/components/ui/ form' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1987" column="26" code="2307">Cannot find module '@/ components/ui/textarea' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="1993" column="26" code="2307">Cannot find module '@/integrations/ supabase/client' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2005" column="55" code="2307">Cannot find module '@tan stack/react-query' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2008" column="27" code="2307">Cannot find module 'next/router' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2009" column="34" code="2307">Cannot find module '@/lib/validations/invoice' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2019" column="7" code="2322">Type '({ isOpen, onOpenChange, onSuccess, initialSchedule, refetchInvoices, }: AddInvoiceFormProps) =&gt; void' is not assignable to type 'FC&lt;AddInvoiceFormProps&gt;'.
  Type 'void' is not assignable to type 'ReactNode'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2027" column="11" code="2339">Property 'data' does not exist on type 'SessionContextType'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2061" column="5" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;Product[], Error, Product[], readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;Product[], Error&gt;', gave the following error.
    Type '() =&gt; Promise&lt;void&gt;' is not assignable to type 'QueryFunction&lt;Product[], readonly unknown[]&gt;'.
      Type 'Promise&lt;void&gt;' is not assignable to type 'Product[] | Promise&lt;Product[]&gt;'.
        Type 'Promise&lt;void&gt;' is not assignable to type 'Promise&lt;Product[]&gt;'.
          Type 'void' is not assignable to type 'Product[]'.
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;Product[], Error, Product[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;Product[], Error&gt;', gave the following error.
    Type '() =&gt; Promise&lt;void&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;Product[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;void&gt;' is not assignable to type 'QueryFunction&lt;Product[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;void&gt;' is not assignable to type 'Product[] | Promise&lt;Product[]&gt;'.
          Type 'Promise&lt;void&gt;' is not assignable to type 'Promise&lt;Product[]&gt;'.
            Type 'void' is not assignable to type 'Product[]'.
  Overload 3 of 3, '(options: UseQueryOptions&lt;Product[], Error, Product[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;Product[], Error&gt;', gave the following error.
    Type '() =&gt; Promise&lt;void&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;Product[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;void&gt;' is not assignable to type 'QueryFunction&lt;Product[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;void&gt;' is not assignable to type 'Product[] | Promise&lt;Product[]&gt;'.
          Type 'Promise&lt;void&gt;' is not assignable to type 'Promise&lt;Product[]&gt;'.
            Type 'void' is not assignable to type 'Product[]'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2067" column="19" code="2362">The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2069" column="3" code="2304">Cannot find name 'Refining'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2069" column="12" code="2554">Expected 1 arguments, but got 4.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2069" column="19" code="2304">Cannot find name 'Statements'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2071" column="1" code="2304">Cannot find name 'I'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2071" column="2" code="2362">The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2071" column="45" code="2363">The right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2073" column="2" code="2304">Cannot find name 'n'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2073" column="4" code="2304">Cannot find name 'n'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2181" column="31" code="2304">Cannot find name 'select'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2181" column="142" code="2693">'Product' only refers to a type, but is being used as a value here.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2181" column="156" code="2304">Cannot find name 'WarehouseCategory'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2184" column="4" code="2304">Cannot find name 'javascript'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2188" column="20" code="2307">Cannot find module ' zod' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2205" column="8" code="2307">Cannot find module '@/components/ui/ form' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2208" column="26" code="2307">Cannot find module '@/ components/ui/textarea' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2214" column="26" code="2307">Cannot find module '@/integrations/ supabase/client' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2226" column="55" code="2307">Cannot find module '@tan stack/react-query' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2229" column="27" code="2307">Cannot find module 'next/router' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2230" column="34" code="2307">Cannot find module '@/lib/validations/invoice' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2231" column="30" code="2307">Cannot find module 'uuid' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2240" column="7" code="2322">Type '({ isOpen, onOpenChange, onSuccess, initialSchedule, }: AddInvoiceFormProps) =&gt; void' is not assignable to type 'FC&lt;AddInvoiceFormProps&gt;'.
  Type 'void' is not assignable to type 'ReactNode'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2247" column="11" code="2339">Property 'data' does not exist on type 'SessionContextType'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2281" column="5" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;Product[], Error, Product[], readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;Product[], Error&gt;', gave the following error.
    Type '() =&gt; Promise&lt;void&gt;' is not assignable to type 'QueryFunction&lt;Product[], readonly unknown[]&gt;'.
      Type 'Promise&lt;void&gt;' is not assignable to type 'Product[] | Promise&lt;Product[]&gt;'.
        Type 'Promise&lt;void&gt;' is not assignable to type 'Promise&lt;Product[]&gt;'.
          Type 'void' is not assignable to type 'Product[]'.
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;Product[], Error, Product[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;Product[], Error&gt;', gave the following error.
    Type '() =&gt; Promise&lt;void&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;Product[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;void&gt;' is not assignable to type 'QueryFunction&lt;Product[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;void&gt;' is not assignable to type 'Product[] | Promise&lt;Product[]&gt;'.
          Type 'Promise&lt;void&gt;' is not assignable to type 'Promise&lt;Product[]&gt;'.
            Type 'void' is not assignable to type 'Product[]'.
  Overload 3 of 3, '(options: UseQueryOptions&lt;Product[], Error, Product[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;Product[], Error&gt;', gave the following error.
    Type '() =&gt; Promise&lt;void&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;Product[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;void&gt;' is not assignable to type 'QueryFunction&lt;Product[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;void&gt;' is not assignable to type 'Product[] | Promise&lt;Product[]&gt;'.
          Type 'Promise&lt;void&gt;' is not assignable to type 'Promise&lt;Product[]&gt;'.
            Type 'void' is not assignable to type 'Product[]'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2284" column="17" code="2362">The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2296" column="138" code="2363">The right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2296" column="254" code="2345">Argument of type 'TemplateStringsArray' is not assignable to parameter of type 'StockItemComboboxProps'.
  Type 'TemplateStringsArray' is missing the following properties from type 'StockItemComboboxProps': products, selectedProductId, onSelectProduct, inputValue, onInputValueChange</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2296" column="262" code="2448">Block-scoped variable 'AddInvoiceForm' used before its declaration.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2296" column="262" code="2349">This expression is not callable.
  No constituent of type 'ReactNode' is callable.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2296" column="276" code="2345">Argument of type 'TemplateStringsArray' is not assignable to parameter of type 'AddInvoiceFormProps'.
  Type 'TemplateStringsArray' is missing the following properties from type 'AddInvoiceFormProps': isOpen, onOpenChange, onSuccess</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2299" column="4" code="2304">Cannot find name 'javascript'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2303" column="20" code="2307">Cannot find module ' zod' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2320" column="8" code="2307">Cannot find module '@/components/ui/ form' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2323" column="26" code="2307">Cannot find module '@/ components/ui/textarea' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2329" column="26" code="2307">Cannot find module '@/integrations/ supabase/client' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2341" column="55" code="2307">Cannot find module '@tan stack/react-query' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2344" column="27" code="2307">Cannot find module 'next/router' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2345" column="34" code="2307">Cannot find module '@/lib/validations/invoice' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2346" column="30" code="2307">Cannot find module 'uuid' or its corresponding type declarations.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2355" column="7" code="2322">Type '({ isOpen, onOpenChange, onSuccess, initialSchedule, }: AddInvoiceFormProps) =&gt; void' is not assignable to type 'FC&lt;AddInvoiceFormProps&gt;'.
  Type 'void' is not assignable to type 'ReactNode'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2362" column="11" code="2339">Property 'data' does not exist on type 'SessionContextType'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2406" column="3" code="2304">Cannot find name 'Refining'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2406" column="12" code="2304">Cannot find name 'Query'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2406" column="18" code="2304">Cannot find name 'Selections'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="1" code="2304">Cannot find name 'I'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="2" code="2362">The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="84" code="2363">The right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="119" code="2304">Cannot find name 'm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="121" code="2304">Cannot find name 'focusing'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="130" code="2304">Cannot find name 'on'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="133" code="2304">Cannot find name 'components'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="144" code="2304">Cannot find name 'like'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="166" code="2304">Cannot find name 'to'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="169" code="2304">Cannot find name 'address'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="177" code="2304">Cannot find name 'incomplete'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="188" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="194" code="2304">Cannot find name 'and'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2408" column="198" code="2304">Cannot find name 'I'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2410" column="2" code="2304">Cannot find name 'n'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2410" column="4" code="2304">Cannot find name 'n'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2513" column="9" code="2363">The right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2528" column="43" code="2304">Cannot find name 'searchTerm'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2528" column="399" code="2304">Cannot find name 'useDebounce'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2531" column="155" code="2769">No overload matches this call.
  Overload 1 of 2, '(Component: FunctionComponent&lt;object&gt;, propsAreEqual?: (prevProps: object, nextProps: object) =&gt; boolean): NamedExoticComponent&lt;object&gt;', gave the following error.
    Argument of type 'TemplateStringsArray' is not assignable to parameter of type 'FunctionComponent&lt;object&gt;'.
      Type 'TemplateStringsArray' provides no match for the signature '(props: object, deprecatedLegacyContext?: any): ReactNode'.
  Overload 2 of 2, '(Component: ComponentType&lt;any&gt;, propsAreEqual?: (prevProps: Readonly&lt;any&gt;, nextProps: Readonly&lt;any&gt;) =&gt; boolean): MemoExoticComponent&lt;ComponentType&lt;any&gt;&gt;', gave the following error.
    Argument of type 'TemplateStringsArray' is not assignable to parameter of type 'ComponentType&lt;any&gt;'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2531" column="159" code="2304">Cannot find name 'useCallback'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2531" column="178" code="2304">Cannot find name 'useMemo'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2533" column="36" code="2304">Cannot find name 'SELECT'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2534" column="45" code="2304">Cannot find name 'select'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2540" column="23" code="2304">Cannot find name 'useDebounce'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2541" column="34" code="2304">Cannot find name 'useDebounce'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2541" column="51" code="2304">Cannot find name 'src'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2541" column="55" code="2304">Cannot find name 'hooks'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2541" column="61" code="2304">Cannot find name 'use'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="2541" column="65" code="2304">Cannot find name 'debounce'.</problem>
<problem file="src/pages/ScheduleManagementPage.tsx" line="175" column="13" code="2322">Type '{ isOpen: boolean; onOpenChange: Dispatch&lt;SetStateAction&lt;boolean&gt;&gt;; onSuccess: () =&gt; void; initialData: Schedule; }' is not assignable to type 'IntrinsicAttributes &amp; StockItemComboboxProps'.
  Property 'isOpen' does not exist on type 'IntrinsicAttributes &amp; StockItemComboboxProps'.</problem>
<problem file="src/pages/ScheduleManagementPage.tsx" line="268" column="9" code="2322">Type '{ isOpen: boolean; onOpenChange: Dispatch&lt;SetStateAction&lt;boolean&gt;&gt;; onSuccess: () =&gt; void; initialData: Schedule; }' is not assignable to type 'IntrinsicAttributes &amp; StockItemComboboxProps'.
  Property 'isOpen' does not exist on type 'IntrinsicAttributes &amp; StockItemComboboxProps'.</problem>
<problem file="src/components/AddStockItemForm.tsx" line="68" column="5" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;WarehouseCategory[], Error, WarehouseCategory[], readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseCategory[], readonly unknown[]&gt;'.
      Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'WarehouseCategory[] | Promise&lt;WarehouseCategory[]&gt;'.
        Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseCategory[]&gt;'.
          Type '{ id: any; name: any; code: any; }[]' is not assignable to type 'WarehouseCategory[]'.
            Type '{ id: any; name: any; code: any; }' is missing the following properties from type 'WarehouseCategory': user_id, created_at, updated_at
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;WarehouseCategory[], Error, WarehouseCategory[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'WarehouseCategory[] | Promise&lt;WarehouseCategory[]&gt;'.
          Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseCategory[]&gt;'.
            Type '{ id: any; name: any; code: any; }[]' is not assignable to type 'WarehouseCategory[]'.
              Type '{ id: any; name: any; code: any; }' is missing the following properties from type 'WarehouseCategory': user_id, created_at, updated_at
  Overload 3 of 3, '(options: UseQueryOptions&lt;WarehouseCategory[], Error, WarehouseCategory[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'WarehouseCategory[] | Promise&lt;WarehouseCategory[]&gt;'.
          Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseCategory[]&gt;'.
            Type '{ id: any; name: any; code: any; }[]' is not assignable to type 'WarehouseCategory[]'.
              Type '{ id: any; name: any; code: any; }' is missing the following properties from type 'WarehouseCategory': user_id, created_at, updated_at</problem>
<problem file="src/components/AddStockItemForm.tsx" line="84" column="62" code="2339">Property 'length' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/components/AddStockItemForm.tsx" line="106" column="43" code="2339">Property 'find' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/components/AddStockItemForm.tsx" line="294" column="45" code="2339">Property 'map' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/components/ViewStockItemDetailsDialog.tsx" line="32" column="5" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;WarehouseCategory[], Error, WarehouseCategory[], readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseCategory[], readonly unknown[]&gt;'.
      Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'WarehouseCategory[] | Promise&lt;WarehouseCategory[]&gt;'.
        Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseCategory[]&gt;'.
          Type '{ id: any; name: any; code: any; }[]' is not assignable to type 'WarehouseCategory[]'.
            Type '{ id: any; name: any; code: any; }' is missing the following properties from type 'WarehouseCategory': user_id, created_at, updated_at
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;WarehouseCategory[], Error, WarehouseCategory[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'WarehouseCategory[] | Promise&lt;WarehouseCategory[]&gt;'.
          Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseCategory[]&gt;'.
            Type '{ id: any; name: any; code: any; }[]' is not assignable to type 'WarehouseCategory[]'.
              Type '{ id: any; name: any; code: any; }' is missing the following properties from type 'WarehouseCategory': user_id, created_at, updated_at
  Overload 3 of 3, '(options: UseQueryOptions&lt;WarehouseCategory[], Error, WarehouseCategory[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'WarehouseCategory[] | Promise&lt;WarehouseCategory[]&gt;'.
          Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseCategory[]&gt;'.
            Type '{ id: any; name: any; code: any; }[]' is not assignable to type 'WarehouseCategory[]'.
              Type '{ id: any; name: any; code: any; }' is missing the following properties from type 'WarehouseCategory': user_id, created_at, updated_at</problem>
<problem file="src/components/ViewStockItemDetailsDialog.tsx" line="47" column="43" code="2339">Property 'find' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/components/ViewStockItemDetailsDialog.tsx" line="64" column="5" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;WarehouseInventory[], Error, WarehouseInventory[], readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseInventory[], readonly unknown[]&gt;'.
      Type 'Promise&lt;{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]&gt;' is not assignable to type 'WarehouseInventory[] | Promise&lt;WarehouseInventory[]&gt;'.
        Type 'Promise&lt;{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseInventory[]&gt;'.
          Type '{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]' is not assignable to type 'WarehouseInventory[]'.
            Type '{ id: any; product_id: any; warehouse_category: any; quantity: any; }' is missing the following properties from type 'WarehouseInventory': user_id, created_at, updated_at
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;WarehouseInventory[], Error, WarehouseInventory[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;WarehouseInventory[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseInventory[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]&gt;' is not assignable to type 'WarehouseInventory[] | Promise&lt;WarehouseInventory[]&gt;'.
          Type 'Promise&lt;{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseInventory[]&gt;'.
            Type '{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]' is not assignable to type 'WarehouseInventory[]'.
              Type '{ id: any; product_id: any; warehouse_category: any; quantity: any; }' is missing the following properties from type 'WarehouseInventory': user_id, created_at, updated_at
  Overload 3 of 3, '(options: UseQueryOptions&lt;WarehouseInventory[], Error, WarehouseInventory[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;WarehouseInventory[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseInventory[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]&gt;' is not assignable to type 'WarehouseInventory[] | Promise&lt;WarehouseInventory[]&gt;'.
          Type 'Promise&lt;{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseInventory[]&gt;'.
            Type '{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]' is not assignable to type 'WarehouseInventory[]'.
              Type '{ id: any; product_id: any; warehouse_category: any; quantity: any; }' is missing the following properties from type 'WarehouseInventory': user_id, created_at, updated_at</problem>
<problem file="src/components/ViewStockItemDetailsDialog.tsx" line="77" column="5" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;StockLedgerWithProduct[], Error, StockLedgerWithProduct[], readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ product_name: any; product_code: any; id: any; event_type: any; quantity: any; from_warehouse_category: any; to_warehouse_category: any; notes: any; event_date: any; created_at: any; products: { ...; }[]; }[]&gt;' is not assignable to type 'QueryFunction&lt;StockLedgerWithProduct[], readonly unknown[]&gt;'.
      Type 'Promise&lt;{ product_name: any; product_code: any; id: any; event_type: any; quantity: any; from_warehouse_category: any; to_warehouse_category: any; notes: any; event_date: any; created_at: any; products: { ...; }[]; }[]&gt;' is not assignable to type 'StockLedgerWithProduct[] | Promise&lt;StockLedgerWithProduct[]&gt;'.
        Type 'Promise&lt;{ product_name: any; product_code: any; id: any; event_type: any; quantity: any; from_warehouse_category: any; to_warehouse_category: any; notes: any; event_date: any; created_at: any; products: { ...; }[]; }[]&gt;' is not assignable to type 'Promise&lt;StockLedgerWithProduct[]&gt;'.
          Type '{ product_name: any; product_code: any; id: any; event_type: any; quantity: any; from_warehouse_category: any; to_warehouse_category: any; notes: any; event_date: any; created_at: any; products: { ...; }[]; }[]' is not assignable to type 'StockLedgerWithProduct[]'.
            Type '{ product_name: any; product_code: any; id: any; event_type: any; quantity: any; from_warehouse_category: any; to_warehouse_category: any; notes: any; event_date: any; created_at: any; products: { ...; }[]; }' is missing the following properties from type 'StockLedgerWithProduct': user_id, product_id, updated_at
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;StockLedgerWithProduct[], Error, StockLedgerWithProduct[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ product_name: any; product_code: any; id: any; event_type: any; quantity: any; from_warehouse_category: any; to_warehouse_category: any; notes: any; event_date: any; created_at: any; products: { ...; }[]; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;StockLedgerWithProduct[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ product_name: any; product_code: any; id: any; event_type: any; quantity: any; from_warehouse_category: any; to_warehouse_category: any; notes: any; event_date: any; created_at: any; products: { ...; }[]; }[]&gt;' is not assignable to type 'QueryFunction&lt;StockLedgerWithProduct[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ product_name: any; product_code: any; id: any; event_type: any; quantity: any; from_warehouse_category: any; to_warehouse_category: any; notes: any; event_date: any; created_at: any; products: { ...; }[]; }[]&gt;' is not assignable to type 'StockLedgerWithProduct[] | Promise&lt;StockLedgerWithProduct[]&gt;'.
          Type 'Promise&lt;{ product_name: any; product_code: any; id: any; event_type: any; quantity: any; from_warehouse_category: any; to_warehouse_category: any; notes: any; event_date: any; created_at: any; products: { ...; }[]; }[]&gt;' is not assignable to type 'Promise&lt;StockLedgerWithProduct[]&gt;'.
            Type '{ product_name: any; product_code: any; id: any; event_type: any; quantity: any; from_warehouse_category: any; to_warehouse_category: any; notes: any; event_date: any; created_at: any; products: { ...; }[]; }[]' is not assignable to type 'StockLedgerWithProduct[]'.
              Type '{ product_name: any; product_code: any; id: any; event_type: any; quantity: any; from_warehouse_category: any; to_warehouse_category: any; notes: any; event_date: any; created_at: any; products: { ...; }[]; }' is missing the following properties from type 'StockLedgerWithProduct': user_id, product_id, updated_at
  Overload 3 of 3, '(options: UseQueryOptions&lt;StockLedgerWithProduct[], Error, StockLedgerWithProduct[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ product_name: any; product_code: any; id: any; event_type: any; quantity: any; from_warehouse_category: any; to_warehouse_category: any; notes: any; event_date: any; created_at: any; products: { ...; }[]; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;StockLedgerWithProduct[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ product_name: any; product_code: any; id: any; event_type: any; quantity: any; from_warehouse_category: any; to_warehouse_category: any; notes: any; event_date: any; created_at: any; products: { ...; }[]; }[]&gt;' is not assignable to type 'QueryFunction&lt;StockLedgerWithProduct[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ product_name: any; product_code: any; id: any; event_type: any; quantity: any; from_warehouse_category: any; to_warehouse_category: any; notes: any; event_date: any; created_at: any; products: { ...; }[]; }[]&gt;' is not assignable to type 'StockLedgerWithProduct[] | Promise&lt;StockLedgerWithProduct[]&gt;'.
          Type 'Promise&lt;{ product_name: any; product_code: any; id: any; event_type: any; quantity: any; from_warehouse_category: any; to_warehouse_category: any; notes: any; event_date: any; created_at: any; products: { ...; }[]; }[]&gt;' is not assignable to type 'Promise&lt;StockLedgerWithProduct[]&gt;'.
            Type '{ product_name: any; product_code: any; id: any; event_type: any; quantity: any; from_warehouse_category: any; to_warehouse_category: any; notes: any; event_date: any; created_at: any; products: { ...; }[]; }[]' is not assignable to type 'StockLedgerWithProduct[]'.
              Type '{ product_name: any; product_code: any; id: any; event_type: any; quantity: any; from_warehouse_category: any; to_warehouse_category: any; notes: any; event_date: any; created_at: any; products: { ...; }[]; }' is missing the following properties from type 'StockLedgerWithProduct': user_id, product_id, updated_at</problem>
<problem file="src/components/ViewStockItemDetailsDialog.tsx" line="96" column="35" code="2339">Property 'nama_barang' does not exist on type '{ nama_barang: any; kode_barang: any; }[]'.</problem>
<problem file="src/components/ViewStockItemDetailsDialog.tsx" line="97" column="35" code="2339">Property 'kode_barang' does not exist on type '{ nama_barang: any; kode_barang: any; }[]'.</problem>
<problem file="src/components/ViewStockItemDetailsDialog.tsx" line="133" column="35" code="2339">Property 'reduce' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/components/ViewStockItemDetailsDialog.tsx" line="163" column="31" code="2339">Property 'length' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/components/ViewStockItemDetailsDialog.tsx" line="170" column="32" code="2339">Property 'map' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/components/ViewStockItemDetailsDialog.tsx" line="195" column="33" code="2339">Property 'length' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/components/ViewStockItemDetailsDialog.tsx" line="202" column="34" code="2339">Property 'map' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/pages/StockHistoryPage.tsx" line="102" column="14" code="2352">Conversion of type '{ id: any; user_id: any; product_id: any; event_type: any; quantity: any; from_warehouse_category: any; to_warehouse_category: any; notes: any; event_date: any; created_at: any; updated_at: any; products: { ...; }[]; }[]' to type 'StockLedgerWithProduct[]' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type '{ id: any; user_id: any; product_id: any; event_type: any; quantity: any; from_warehouse_category: any; to_warehouse_category: any; notes: any; event_date: any; created_at: any; updated_at: any; products: { ...; }[]; }' is not comparable to type 'StockLedgerWithProduct'.
    Types of property 'products' are incompatible.
      Type '{ nama_barang: any; kode_barang: any; }[]' is missing the following properties from type 'Pick&lt;Product, &quot;kode_barang&quot; | &quot;nama_barang&quot;&gt;': kode_barang, nama_barang</problem>
<problem file="src/pages/StockMovementHistoryPage.tsx" line="102" column="14" code="2352">Conversion of type '{ id: any; user_id: any; product_id: any; event_type: any; quantity: any; from_warehouse_category: any; to_warehouse_category: any; notes: any; event_date: any; created_at: any; updated_at: any; products: { ...; }[]; }[]' to type 'StockLedgerWithProduct[]' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type '{ id: any; user_id: any; product_id: any; event_type: any; quantity: any; from_warehouse_category: any; to_warehouse_category: any; notes: any; event_date: any; created_at: any; updated_at: any; products: { ...; }[]; }' is not comparable to type 'StockLedgerWithProduct'.
    Types of property 'products' are incompatible.
      Type '{ nama_barang: any; kode_barang: any; }[]' is missing the following properties from type 'Pick&lt;Product, &quot;kode_barang&quot; | &quot;nama_barang&quot;&gt;': kode_barang, nama_barang</problem>
<problem file="src/components/AddPurchaseRequestForm.tsx" line="137" column="23" code="2339">Property 'user_id' does not exist on type '{ id: any; kode_barang: any; nama_barang: any; satuan: any; harga_beli: any; harga_jual: any; supplier_id: any; warehouse_inventories: { warehouse_category: any; quantity: any; }[]; }'.</problem>
<problem file="src/components/AddPurchaseRequestForm.tsx" line="138" column="26" code="2339">Property 'created_at' does not exist on type '{ id: any; kode_barang: any; nama_barang: any; satuan: any; harga_beli: any; harga_jual: any; supplier_id: any; warehouse_inventories: { warehouse_category: any; quantity: any; }[]; }'.</problem>
<problem file="src/components/AddPurchaseRequestForm.tsx" line="144" column="32" code="2339">Property 'safe_stock_limit' does not exist on type '{ id: any; kode_barang: any; nama_barang: any; satuan: any; harga_beli: any; harga_jual: any; supplier_id: any; warehouse_inventories: { warehouse_category: any; quantity: any; }[]; }'.</problem>
<problem file="src/components/AddPurchaseRequestForm.tsx" line="155" column="5" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;Supplier[], Error, Supplier[], readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;Supplier[], Error&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;Supplier[], readonly unknown[]&gt;'.
      Type 'Promise&lt;{ id: any; name: any; }[]&gt;' is not assignable to type 'Supplier[] | Promise&lt;Supplier[]&gt;'.
        Type 'Promise&lt;{ id: any; name: any; }[]&gt;' is not assignable to type 'Promise&lt;Supplier[]&gt;'.
          Type '{ id: any; name: any; }[]' is not assignable to type 'Supplier[]'.
            Type '{ id: any; name: any; }' is missing the following properties from type 'Supplier': user_id, contact_person, phone_number, email, and 4 more.
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;Supplier[], Error, Supplier[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;Supplier[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; name: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;Supplier[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; name: any; }[]&gt;' is not assignable to type 'Supplier[] | Promise&lt;Supplier[]&gt;'.
          Type 'Promise&lt;{ id: any; name: any; }[]&gt;' is not assignable to type 'Promise&lt;Supplier[]&gt;'.
            Type '{ id: any; name: any; }[]' is not assignable to type 'Supplier[]'.
              Type '{ id: any; name: any; }' is missing the following properties from type 'Supplier': user_id, contact_person, phone_number, email, and 4 more.
  Overload 3 of 3, '(options: UseQueryOptions&lt;Supplier[], Error, Supplier[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;Supplier[], Error&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;Supplier[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; name: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;Supplier[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; name: any; }[]&gt;' is not assignable to type 'Supplier[] | Promise&lt;Supplier[]&gt;'.
          Type 'Promise&lt;{ id: any; name: any; }[]&gt;' is not assignable to type 'Promise&lt;Supplier[]&gt;'.
            Type '{ id: any; name: any; }[]' is not assignable to type 'Supplier[]'.
              Type '{ id: any; name: any; }' is missing the following properties from type 'Supplier': user_id, contact_person, phone_number, email, and 4 more.</problem>
<problem file="src/components/AddPurchaseRequestForm.tsx" line="172" column="5" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;WarehouseCategory[], Error, WarehouseCategory[], readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseCategory[], readonly unknown[]&gt;'.
      Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'WarehouseCategory[] | Promise&lt;WarehouseCategory[]&gt;'.
        Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseCategory[]&gt;'.
          Type '{ id: any; name: any; code: any; }[]' is not assignable to type 'WarehouseCategory[]'.
            Type '{ id: any; name: any; code: any; }' is missing the following properties from type 'WarehouseCategory': user_id, created_at, updated_at
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;WarehouseCategory[], Error, WarehouseCategory[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'WarehouseCategory[] | Promise&lt;WarehouseCategory[]&gt;'.
          Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseCategory[]&gt;'.
            Type '{ id: any; name: any; code: any; }[]' is not assignable to type 'WarehouseCategory[]'.
              Type '{ id: any; name: any; code: any; }' is missing the following properties from type 'WarehouseCategory': user_id, created_at, updated_at
  Overload 3 of 3, '(options: UseQueryOptions&lt;WarehouseCategory[], Error, WarehouseCategory[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'WarehouseCategory[] | Promise&lt;WarehouseCategory[]&gt;'.
          Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseCategory[]&gt;'.
            Type '{ id: any; name: any; code: any; }[]' is not assignable to type 'WarehouseCategory[]'.
              Type '{ id: any; name: any; code: any; }' is missing the following properties from type 'WarehouseCategory': user_id, created_at, updated_at</problem>
<problem file="src/components/AddPurchaseRequestForm.tsx" line="188" column="62" code="2339">Property 'length' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/components/AddPurchaseRequestForm.tsx" line="475" column="42" code="2339">Property 'length' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/components/AddPurchaseRequestForm.tsx" line="480" column="40" code="2339">Property 'map' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/components/AddPurchaseRequestForm.tsx" line="505" column="49" code="2339">Property 'map' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="160" column="23" code="2339">Property 'user_id' does not exist on type '{ id: any; kode_barang: any; nama_barang: any; satuan: any; harga_beli: any; harga_jual: any; supplier_id: any; warehouse_inventories: { warehouse_category: any; quantity: any; }[]; }'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="161" column="26" code="2339">Property 'created_at' does not exist on type '{ id: any; kode_barang: any; nama_barang: any; satuan: any; harga_beli: any; harga_jual: any; supplier_id: any; warehouse_inventories: { warehouse_category: any; quantity: any; }[]; }'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="167" column="32" code="2339">Property 'safe_stock_limit' does not exist on type '{ id: any; kode_barang: any; nama_barang: any; satuan: any; harga_beli: any; harga_jual: any; supplier_id: any; warehouse_inventories: { warehouse_category: any; quantity: any; }[]; }'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="177" column="5" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;Supplier[], Error, Supplier[], readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;Supplier[], Error&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;Supplier[], readonly unknown[]&gt;'.
      Type 'Promise&lt;{ id: any; name: any; }[]&gt;' is not assignable to type 'Supplier[] | Promise&lt;Supplier[]&gt;'.
        Type 'Promise&lt;{ id: any; name: any; }[]&gt;' is not assignable to type 'Promise&lt;Supplier[]&gt;'.
          Type '{ id: any; name: any; }[]' is not assignable to type 'Supplier[]'.
            Type '{ id: any; name: any; }' is missing the following properties from type 'Supplier': user_id, contact_person, phone_number, email, and 4 more.
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;Supplier[], Error, Supplier[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;Supplier[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; name: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;Supplier[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; name: any; }[]&gt;' is not assignable to type 'Supplier[] | Promise&lt;Supplier[]&gt;'.
          Type 'Promise&lt;{ id: any; name: any; }[]&gt;' is not assignable to type 'Promise&lt;Supplier[]&gt;'.
            Type '{ id: any; name: any; }[]' is not assignable to type 'Supplier[]'.
              Type '{ id: any; name: any; }' is missing the following properties from type 'Supplier': user_id, contact_person, phone_number, email, and 4 more.
  Overload 3 of 3, '(options: UseQueryOptions&lt;Supplier[], Error, Supplier[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;Supplier[], Error&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;Supplier[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; name: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;Supplier[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; name: any; }[]&gt;' is not assignable to type 'Supplier[] | Promise&lt;Supplier[]&gt;'.
          Type 'Promise&lt;{ id: any; name: any; }[]&gt;' is not assignable to type 'Promise&lt;Supplier[]&gt;'.
            Type '{ id: any; name: any; }[]' is not assignable to type 'Supplier[]'.
              Type '{ id: any; name: any; }' is missing the following properties from type 'Supplier': user_id, contact_person, phone_number, email, and 4 more.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="475" column="39" code="2339">Property 'map' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/pages/PurchaseRequestPage.tsx" line="140" column="14" code="2352">Conversion of type '{ id: any; user_id: any; item_name: any; item_code: any; quantity: any; unit_price: any; suggested_selling_price: any; total_price: any; notes: any; status: any; created_at: any; document_url: any; received_quantity: any; ... 11 more ...; suppliers: { ...; }[]; }[]' to type 'PurchaseRequestWithDetails[]' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type '{ id: any; user_id: any; item_name: any; item_code: any; quantity: any; unit_price: any; suggested_selling_price: any; total_price: any; notes: any; status: any; created_at: any; document_url: any; received_quantity: any; ... 11 more ...; suppliers: { ...; }[]; }' is not comparable to type 'PurchaseRequestWithDetails'.
    Types of property 'products' are incompatible.
      Type '{ nama_barang: any; kode_barang: any; satuan: any; }[]' is missing the following properties from type 'Pick&lt;Product, &quot;kode_barang&quot; | &quot;nama_barang&quot; | &quot;satuan&quot;&gt;': kode_barang, nama_barang, satuan</problem>
<problem file="src/components/AddStockTransactionForm.tsx" line="73" column="5" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;WarehouseCategory[], Error, WarehouseCategory[], readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseCategory[], readonly unknown[]&gt;'.
      Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'WarehouseCategory[] | Promise&lt;WarehouseCategory[]&gt;'.
        Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseCategory[]&gt;'.
          Type '{ id: any; name: any; code: any; }[]' is not assignable to type 'WarehouseCategory[]'.
            Type '{ id: any; name: any; code: any; }' is missing the following properties from type 'WarehouseCategory': user_id, created_at, updated_at
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;WarehouseCategory[], Error, WarehouseCategory[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'WarehouseCategory[] | Promise&lt;WarehouseCategory[]&gt;'.
          Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseCategory[]&gt;'.
            Type '{ id: any; name: any; code: any; }[]' is not assignable to type 'WarehouseCategory[]'.
              Type '{ id: any; name: any; code: any; }' is missing the following properties from type 'WarehouseCategory': user_id, created_at, updated_at
  Overload 3 of 3, '(options: UseQueryOptions&lt;WarehouseCategory[], Error, WarehouseCategory[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'WarehouseCategory[] | Promise&lt;WarehouseCategory[]&gt;'.
          Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseCategory[]&gt;'.
            Type '{ id: any; name: any; code: any; }[]' is not assignable to type 'WarehouseCategory[]'.
              Type '{ id: any; name: any; code: any; }' is missing the following properties from type 'WarehouseCategory': user_id, created_at, updated_at</problem>
<problem file="src/components/AddStockTransactionForm.tsx" line="220" column="45" code="2339">Property 'map' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/components/StockAdjustmentForm.tsx" line="66" column="5" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;WarehouseCategory[], Error, WarehouseCategory[], readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseCategory[], readonly unknown[]&gt;'.
      Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'WarehouseCategory[] | Promise&lt;WarehouseCategory[]&gt;'.
        Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseCategory[]&gt;'.
          Type '{ id: any; name: any; code: any; }[]' is not assignable to type 'WarehouseCategory[]'.
            Type '{ id: any; name: any; code: any; }' is missing the following properties from type 'WarehouseCategory': user_id, created_at, updated_at
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;WarehouseCategory[], Error, WarehouseCategory[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'WarehouseCategory[] | Promise&lt;WarehouseCategory[]&gt;'.
          Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseCategory[]&gt;'.
            Type '{ id: any; name: any; code: any; }[]' is not assignable to type 'WarehouseCategory[]'.
              Type '{ id: any; name: any; code: any; }' is missing the following properties from type 'WarehouseCategory': user_id, created_at, updated_at
  Overload 3 of 3, '(options: UseQueryOptions&lt;WarehouseCategory[], Error, WarehouseCategory[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseCategory[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'WarehouseCategory[] | Promise&lt;WarehouseCategory[]&gt;'.
          Type 'Promise&lt;{ id: any; name: any; code: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseCategory[]&gt;'.
            Type '{ id: any; name: any; code: any; }[]' is not assignable to type 'WarehouseCategory[]'.
              Type '{ id: any; name: any; code: any; }' is missing the following properties from type 'WarehouseCategory': user_id, created_at, updated_at</problem>
<problem file="src/components/StockAdjustmentForm.tsx" line="82" column="43" code="2339">Property 'find' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/components/StockAdjustmentForm.tsx" line="88" column="5" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;WarehouseInventory[], Error, WarehouseInventory[], readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseInventory[], readonly unknown[]&gt;'.
      Type 'Promise&lt;{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]&gt;' is not assignable to type 'WarehouseInventory[] | Promise&lt;WarehouseInventory[]&gt;'.
        Type 'Promise&lt;{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseInventory[]&gt;'.
          Type '{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]' is not assignable to type 'WarehouseInventory[]'.
            Type '{ id: any; product_id: any; warehouse_category: any; quantity: any; }' is missing the following properties from type 'WarehouseInventory': user_id, created_at, updated_at
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;WarehouseInventory[], Error, WarehouseInventory[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;WarehouseInventory[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseInventory[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]&gt;' is not assignable to type 'WarehouseInventory[] | Promise&lt;WarehouseInventory[]&gt;'.
          Type 'Promise&lt;{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseInventory[]&gt;'.
            Type '{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]' is not assignable to type 'WarehouseInventory[]'.
              Type '{ id: any; product_id: any; warehouse_category: any; quantity: any; }' is missing the following properties from type 'WarehouseInventory': user_id, created_at, updated_at
  Overload 3 of 3, '(options: UseQueryOptions&lt;WarehouseInventory[], Error, WarehouseInventory[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;WarehouseInventory[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;WarehouseInventory[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]&gt;' is not assignable to type 'WarehouseInventory[] | Promise&lt;WarehouseInventory[]&gt;'.
          Type 'Promise&lt;{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]&gt;' is not assignable to type 'Promise&lt;WarehouseInventory[]&gt;'.
            Type '{ id: any; product_id: any; warehouse_category: any; quantity: any; }[]' is not assignable to type 'WarehouseInventory[]'.
              Type '{ id: any; product_id: any; warehouse_category: any; quantity: any; }' is missing the following properties from type 'WarehouseInventory': user_id, created_at, updated_at</problem>
<problem file="src/components/StockAdjustmentForm.tsx" line="113" column="52" code="2339">Property 'find' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/components/StockAdjustmentForm.tsx" line="122" column="66" code="2339">Property 'find' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/components/StockAdjustmentForm.tsx" line="178" column="72" code="2339">Property 'find' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/components/StockAdjustmentForm.tsx" line="187" column="45" code="2339">Property 'map' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/components/StockAdjustmentForm.tsx" line="189" column="71" code="2339">Property 'find' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="174" column="5" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;Customer[], Error, Customer[], readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;Customer[], Error&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;Customer[], readonly unknown[]&gt;'.
      Type 'Promise&lt;{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]&gt;' is not assignable to type 'Customer[] | Promise&lt;Customer[]&gt;'.
        Type 'Promise&lt;{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]&gt;' is not assignable to type 'Promise&lt;Customer[]&gt;'.
          Type '{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]' is not assignable to type 'Customer[]'.
            Type '{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }' is missing the following properties from type 'Customer': user_id, created_at, updated_at
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;Customer[], Error, Customer[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;Customer[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;Customer[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]&gt;' is not assignable to type 'Customer[] | Promise&lt;Customer[]&gt;'.
          Type 'Promise&lt;{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]&gt;' is not assignable to type 'Promise&lt;Customer[]&gt;'.
            Type '{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]' is not assignable to type 'Customer[]'.
              Type '{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }' is missing the following properties from type 'Customer': user_id, created_at, updated_at
  Overload 3 of 3, '(options: UseQueryOptions&lt;Customer[], Error, Customer[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;Customer[], Error&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;Customer[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;Customer[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]&gt;' is not assignable to type 'Customer[] | Promise&lt;Customer[]&gt;'.
          Type 'Promise&lt;{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]&gt;' is not assignable to type 'Promise&lt;Customer[]&gt;'.
            Type '{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }[]' is not assignable to type 'Customer[]'.
              Type '{ id: any; customer_name: any; company_name: any; address: any; phone_number: any; customer_type: any; }' is missing the following properties from type 'Customer': user_id, created_at, updated_at</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="190" column="5" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;Technician[], Error, Technician[], readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; type: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;Technician[], readonly unknown[]&gt;'.
      Type 'Promise&lt;{ id: any; name: any; type: any; }[]&gt;' is not assignable to type 'Technician[] | Promise&lt;Technician[]&gt;'.
        Type 'Promise&lt;{ id: any; name: any; type: any; }[]&gt;' is not assignable to type 'Promise&lt;Technician[]&gt;'.
          Type '{ id: any; name: any; type: any; }[]' is not assignable to type 'Technician[]'.
            Type '{ id: any; name: any; type: any; }' is missing the following properties from type 'Technician': user_id, phone_number, address, city, and 3 more.
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;Technician[], Error, Technician[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; type: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;Technician[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; name: any; type: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;Technician[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; name: any; type: any; }[]&gt;' is not assignable to type 'Technician[] | Promise&lt;Technician[]&gt;'.
          Type 'Promise&lt;{ id: any; name: any; type: any; }[]&gt;' is not assignable to type 'Promise&lt;Technician[]&gt;'.
            Type '{ id: any; name: any; type: any; }[]' is not assignable to type 'Technician[]'.
              Type '{ id: any; name: any; type: any; }' is missing the following properties from type 'Technician': user_id, phone_number, address, city, and 3 more.
  Overload 3 of 3, '(options: UseQueryOptions&lt;Technician[], Error, Technician[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;Technician[], Error&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; name: any; type: any; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;Technician[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; name: any; type: any; }[]&gt;' is not assignable to type 'QueryFunction&lt;Technician[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; name: any; type: any; }[]&gt;' is not assignable to type 'Technician[] | Promise&lt;Technician[]&gt;'.
          Type 'Promise&lt;{ id: any; name: any; type: any; }[]&gt;' is not assignable to type 'Promise&lt;Technician[]&gt;'.
            Type '{ id: any; name: any; type: any; }[]' is not assignable to type 'Technician[]'.
              Type '{ id: any; name: any; type: any; }' is missing the following properties from type 'Technician': user_id, phone_number, address, city, and 3 more.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="412" column="27" code="2322">Type 'TQueryFnData | undefined[]' is not assignable to type 'Customer[]'.
  Type 'TQueryFnData' is not assignable to type 'Customer[]'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="705" column="29" code="2322">Type 'TQueryFnData | undefined[]' is not assignable to type 'Technician[]'.
  Type 'TQueryFnData' is not assignable to type 'Technician[]'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="706" column="49" code="2339">Property 'find' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/pages/SchedulingRequestPage.tsx" line="82" column="5" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;SchedulingRequestWithDetails[], Error, SchedulingRequestWithDetails[], readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ no: number; invoice_number: any; customer_name_from_customers: any; company_name_from_customers: any; phone_number_from_customers: any; customer_type_from_customers: any; customer_name: any; ... 22 more ...; invoices: { ...; }[]; }[]&gt;' is not assignable to type 'QueryFunction&lt;SchedulingRequestWithDetails[], readonly unknown[]&gt;'.
      Type 'Promise&lt;{ no: number; invoice_number: any; customer_name_from_customers: any; company_name_from_customers: any; phone_number_from_customers: any; customer_type_from_customers: any; customer_name: any; ... 22 more ...; invoices: { ...; }[]; }[]&gt;' is not assignable to type 'SchedulingRequestWithDetails[] | Promise&lt;SchedulingRequestWithDetails[]&gt;'.
        Type 'Promise&lt;{ no: number; invoice_number: any; customer_name_from_customers: any; company_name_from_customers: any; phone_number_from_customers: any; customer_type_from_customers: any; customer_name: any; ... 22 more ...; invoices: { ...; }[]; }[]&gt;' is not assignable to type 'Promise&lt;SchedulingRequestWithDetails[]&gt;'.
          Type '{ no: number; invoice_number: any; customer_name_from_customers: any; company_name_from_customers: any; phone_number_from_customers: any; customer_type_from_customers: any; customer_name: any; ... 22 more ...; invoices: { ...; }[]; }[]' is not assignable to type 'SchedulingRequestWithDetails[]'.
            Property 'customer_type' is missing in type '{ no: number; invoice_number: any; customer_name_from_customers: any; company_name_from_customers: any; phone_number_from_customers: any; customer_type_from_customers: any; customer_name: any; ... 22 more ...; invoices: { ...; }[]; }' but required in type 'SchedulingRequestWithDetails'.
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;SchedulingRequestWithDetails[], Error, SchedulingRequestWithDetails[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ no: number; invoice_number: any; customer_name_from_customers: any; company_name_from_customers: any; phone_number_from_customers: any; customer_type_from_customers: any; customer_name: any; ... 22 more ...; invoices: { ...; }[]; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;SchedulingRequestWithDetails[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ no: number; invoice_number: any; customer_name_from_customers: any; company_name_from_customers: any; phone_number_from_customers: any; customer_type_from_customers: any; customer_name: any; ... 22 more ...; invoices: { ...; }[]; }[]&gt;' is not assignable to type 'QueryFunction&lt;SchedulingRequestWithDetails[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ no: number; invoice_number: any; customer_name_from_customers: any; company_name_from_customers: any; phone_number_from_customers: any; customer_type_from_customers: any; customer_name: any; ... 22 more ...; invoices: { ...; }[]; }[]&gt;' is not assignable to type 'SchedulingRequestWithDetails[] | Promise&lt;SchedulingRequestWithDetails[]&gt;'.
          Type 'Promise&lt;{ no: number; invoice_number: any; customer_name_from_customers: any; company_name_from_customers: any; phone_number_from_customers: any; customer_type_from_customers: any; customer_name: any; ... 22 more ...; invoices: { ...; }[]; }[]&gt;' is not assignable to type 'Promise&lt;SchedulingRequestWithDetails[]&gt;'.
            Type '{ no: number; invoice_number: any; customer_name_from_customers: any; company_name_from_customers: any; phone_number_from_customers: any; customer_type_from_customers: any; customer_name: any; ... 22 more ...; invoices: { ...; }[]; }[]' is not assignable to type 'SchedulingRequestWithDetails[]'.
              Property 'customer_type' is missing in type '{ no: number; invoice_number: any; customer_name_from_customers: any; company_name_from_customers: any; phone_number_from_customers: any; customer_type_from_customers: any; customer_name: any; ... 22 more ...; invoices: { ...; }[]; }' but required in type 'SchedulingRequestWithDetails'.
  Overload 3 of 3, '(options: UseQueryOptions&lt;SchedulingRequestWithDetails[], Error, SchedulingRequestWithDetails[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ no: number; invoice_number: any; customer_name_from_customers: any; company_name_from_customers: any; phone_number_from_customers: any; customer_type_from_customers: any; customer_name: any; ... 22 more ...; invoices: { ...; }[]; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;SchedulingRequestWithDetails[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ no: number; invoice_number: any; customer_name_from_customers: any; company_name_from_customers: any; phone_number_from_customers: any; customer_type_from_customers: any; customer_name: any; ... 22 more ...; invoices: { ...; }[]; }[]&gt;' is not assignable to type 'QueryFunction&lt;SchedulingRequestWithDetails[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ no: number; invoice_number: any; customer_name_from_customers: any; company_name_from_customers: any; phone_number_from_customers: any; customer_type_from_customers: any; customer_name: any; ... 22 more ...; invoices: { ...; }[]; }[]&gt;' is not assignable to type 'SchedulingRequestWithDetails[] | Promise&lt;SchedulingRequestWithDetails[]&gt;'.
          Type 'Promise&lt;{ no: number; invoice_number: any; customer_name_from_customers: any; company_name_from_customers: any; phone_number_from_customers: any; customer_type_from_customers: any; customer_name: any; ... 22 more ...; invoices: { ...; }[]; }[]&gt;' is not assignable to type 'Promise&lt;SchedulingRequestWithDetails[]&gt;'.
            Type '{ no: number; invoice_number: any; customer_name_from_customers: any; company_name_from_customers: any; phone_number_from_customers: any; customer_type_from_customers: any; customer_name: any; ... 22 more ...; invoices: { ...; }[]; }[]' is not assignable to type 'SchedulingRequestWithDetails[]'.
              Property 'customer_type' is missing in type '{ no: number; invoice_number: any; customer_name_from_customers: any; company_name_from_customers: any; phone_number_from_customers: any; customer_type_from_customers: any; customer_name: any; ... 22 more ...; invoices: { ...; }[]; }' but required in type 'SchedulingRequestWithDetails'.</problem>
<problem file="src/pages/SchedulingRequestPage.tsx" line="126" column="39" code="2339">Property 'invoice_number' does not exist on type '{ invoice_number: any; }[]'.</problem>
<problem file="src/pages/SchedulingRequestPage.tsx" line="127" column="54" code="2339">Property 'customer_name' does not exist on type '{ customer_name: any; company_name: any; phone_number: any; customer_type: any; }[]'.</problem>
<problem file="src/pages/SchedulingRequestPage.tsx" line="128" column="53" code="2339">Property 'company_name' does not exist on type '{ customer_name: any; company_name: any; phone_number: any; customer_type: any; }[]'.</problem>
<problem file="src/pages/SchedulingRequestPage.tsx" line="129" column="53" code="2339">Property 'phone_number' does not exist on type '{ customer_name: any; company_name: any; phone_number: any; customer_type: any; }[]'.</problem>
<problem file="src/pages/SchedulingRequestPage.tsx" line="130" column="54" code="2339">Property 'customer_type' does not exist on type '{ customer_name: any; company_name: any; phone_number: any; customer_type: any; }[]'.</problem>
<problem file="src/pages/SchedulingRequestPage.tsx" line="325" column="24" code="2339">Property 'map' does not exist on type 'TQueryFnData'.</problem>
<problem file="src/pages/UserManagementPage.tsx" line="136" column="32" code="2552">Cannot find name 'filteredUsers'. Did you mean 'FileReader'?</problem>
<problem file="src/pages/UserManagementPage.tsx" line="139" column="24" code="2552">Cannot find name 'filteredUsers'. Did you mean 'FileReader'?</problem>
<problem file="src/pages/UserManagementPage.tsx" line="229" column="10" code="2552">Cannot find name 'filteredUsers'. Did you mean 'FileReader'?</problem>
</dyad-problem-report>Baik, saya akan memperbaiki semua error TypeScript yang Anda berikan. Sebagian besar error ini berasal dari masalah penulisan JSX yang tidak lengkap, duplikasi import, dan ketidaksesuaian tipe data yang dikembalikan oleh kueri Supabase dengan interface TypeScript yang diharapkan.

Saya akan melakukan hal berikut:

1.  **Menghapus kode JSX yang tidak lengkap dan komentar yang menyebabkan error parsing.** Ini adalah penyebab utama dari banyak error `',' expected`, `Unexpected token`, dan `JSX expressions must have one parent element`.
2.  **Menghapus duplikasi import** di beberapa file.
3.  **Memperbaiki kueri Supabase `select`** di berbagai komponen (`StockItemCombobox`, `AddInvoiceForm`, `EditInvoiceForm`, `AddPurchaseRequestForm`, `EditPurchaseRequestForm`, `AddEditSchedulingRequestForm`, `AddEditScheduleForm`, `ViewStockItemDetailsDialog`, `ViewNotesDialog`, `SchedulingRequestPage`, `ScheduleManagementPage`, `StockManagementPage`, `StockHistoryPage`, `StockMovementHistoryPage`, `PurchaseRequestPage`, `SupplierManagementPage`, `CustomerCombobox`, `TechnicianCombobox`) untuk memastikan mereka mengambil semua kolom yang diperlukan oleh interface TypeScript. Ini akan mengatasi error `Property '...' does not exist on type 'TQueryFnData'` dan `Type 'Promise<{ ... }[]>' is not assignable to type '...[]'`.
4.  **Memastikan penanganan `TQueryFnData` yang benar** dengan menggunakan *optional chaining* (`?.`) dan *type assertion* (`as Type[]`) jika diperlukan, terutama untuk data yang di-join.
5.  **Memperbaiki penggunaan `filteredUsers`** di `UserManagementPage` karena variabel tersebut tidak didefinisikan secara lokal setelah perubahan kueri. Saya akan mengembalikan logika filter ke sisi klien setelah data diambil, atau memastikan `users` yang dikembalikan dari `useQuery` sudah difilter.

Saya akan mulai dengan memperbaiki `src/components/AddEditScheduleForm.tsx` yang memiliki banyak error parsing, lalu melanjutkan ke file-file lain.

<dyad-write path="src/components/AddEditScheduleForm.tsx" description="Fixing parsing errors, duplicate imports, and refining Supabase select statements for type safety.">
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { Schedule, ScheduleType, ScheduleStatus, Technician, ScheduleProductCategory, Customer } from "@/types/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TechnicianCombobox from "./TechnicianCombobox";
import CustomerCombobox from "./CustomerCombobox";
import { useSession } from "@/components/SessionContextProvider";

const formSchema = z.object({
  customer_id: z.string().uuid().optional().nullable(),
  customer_name: z.string().min(1, "Nama pelanggan harus diisi."),
  address: z.string().optional().nullable(),
  phone_number: z.string().optional().nullable(),
  schedule_date: z.date({ required_error: "Tanggal jadwal harus diisi." }),
  schedule_time: z.string().optional().nullable(),
  type: z.nativeEnum(ScheduleType, { required_error: "Tipe jadwal harus diisi." }),
  product_category: z.nativeEnum(ScheduleProductCategory).optional().nullable(),
  technician_name: z.string().optional().nullable(),
  invoice_id: z.string().optional().nullable(),
  status: z.nativeEnum(ScheduleStatus, { required_error: "Status jadwal harus diisi." }),
  notes: z.string().optional().nullable(),
  courier_service: z.string().optional().nullable(),
});

interface AddEditScheduleFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData?: Schedule | null;
}

const AddEditScheduleForm: React.FC<AddEditScheduleFormProps> = ({ isOpen, onOpenChange, onSuccess, initialData }) => {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_id: null,
      customer_name: "",
      address: null,
      phone_number: null,
      schedule_date: new Date(),
      schedule_time: null,
      type: ScheduleType.INSTALASI,
      product_category: null,
      technician_name: null,
      invoice_id: null,
      status: ScheduleStatus.SCHEDULED,
      notes: null,
      courier_service: null,
    },
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [technicianSearchInput, setTechnicianSearchInput] = useState(initialData?.technician_name || "");
  const [customerSearchInput, setCustomerSearchInput] = useState(initialData?.customer_name || "");

  const { data: technicians, isLoading: loadingTechnicians } = useQuery<Technician[], Error>({
    queryKey: ["technicians"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technicians")
        .select("*") // Select all columns to match Technician interface
        .order("name", { ascending: true });
      if (error) {
        showError("Gagal memuat daftar teknisi.");
        throw error;
      }
      return data as Technician[];
    },
    enabled: isOpen,
  });

  const { data: customers, isLoading: loadingCustomers } = useQuery<Customer[], Error>({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*") // Select all columns to match Customer interface
        .order("customer_name", { ascending: true });
      if (error) {
        showError("Gagal memuat daftar pelanggan.");
        throw error;
      }
      return data as Customer[];
    },
    enabled: isOpen,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          customer_id: initialData.customer_id || null,
          customer_name: initialData.customer_name,
          address: initialData.address || null,
          phone_number: initialData.phone_number || null,
          schedule_date: new Date(initialData.schedule_date),
          schedule_time: initialData.schedule_time || null,
          type: initialData.type,
          product_category: initialData.product_category || null,
          technician_name: initialData.technician_name || null,
          invoice_id: initialData.invoice_id || null,
          status: initialData.status,
          notes: initialData.notes || null,
          courier_service: initialData.courier_service || null,
        });
        setTechnicianSearchInput(initialData.technician_name || "");
        setCustomerSearchInput(initialData.customer_name || "");
      } else {
        form.reset({
          customer_id: null,
          customer_name: "",
          address: null,
          phone_number: null,
          schedule_date: new Date(),
          schedule_time: null,
          type: ScheduleType.INSTALASI,
          product_category: null,
          technician_name: null,
          invoice_id: null,
          status: ScheduleStatus.SCHEDULED,
          notes: null,
          courier_service: null,
        });
        setTechnicianSearchInput("");
        setCustomerSearchInput("");
      }
      setActiveTab("basic");
    }
  }, [isOpen, initialData, form, technicians, customers]); // Added dependencies

  const handleCustomerSelect = (customer: Customer | undefined) => {
    if (customer) {
      form.setValue("customer_id", customer.id);
      form.setValue("customer_name", customer.customer_name);
      form.setValue("address", customer.address || null);
      form.setValue("phone_number", customer.phone_number || null);
      setCustomerSearchInput(customer.customer_name);
      form.clearErrors(["customer_name", "address", "phone_number"]);
    } else {
      form.setValue("customer_id", null);
      form.setValue("customer_name", "");
      form.setValue("address", null);
      form.setValue("phone_number", null);
      setCustomerSearchInput("");
    }
  };

  const handleTechnicianSelect = (technician: Technician | undefined) => {
    if (technician) {
      form.setValue("technician_name", technician.name);
      setTechnicianSearchInput(technician.name);
      form.clearErrors(["technician_name"]);
    } else {
      form.setValue("technician_name", null);
      setTechnicianSearchInput("");
    }
  };

  const saveScheduleMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("Pengguna tidak terautentikasi.");
      }

      const dataToSubmit = {
        user_id: userId,
        customer_id: values.customer_id || null,
        customer_name: values.customer_name.trim(),
        address: values.address?.trim() || null,
        phone_number: values.phone_number?.trim() || null,
        schedule_date: format(values.schedule_date, "yyyy-MM-dd"),
        schedule_time: values.schedule_time?.trim() || null,
        type: values.type,
        product_category: values.product_category || null,
        technician_name: values.technician_name?.trim() || null,
        invoice_id: values.invoice_id || null,
        status: values.status,
        notes: values.notes?.trim() || null,
        courier_service: values.courier_service?.trim() || null,
      };

      if (initialData) {
        const { error } = await supabase
          .from("schedules")
          .update({
            ...dataToSubmit,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("schedules")
          .insert(dataToSubmit);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      showSuccess(initialData ? "Jadwal berhasil diperbarui!" : "Jadwal berhasil ditambahkan!");
      onSuccess();
      onOpenChange(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      queryClient.invalidateQueries({ queryKey: ["technicianSchedules"] }); // Invalidate technician calendar
    },
    onError: (err: any) => {
      showError(`Gagal menyimpan jadwal: ${err.message}`);
      console.error("Error saving schedule:", err);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    saveScheduleMutation.mutate(values);
  };

  if (loadingCustomers || loadingTechnicians) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{initialData ? "Edit Jadwal" : "Tambah Jadwal Baru"}</DialogTitle>
            <DialogDescription>Memuat data...</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Jadwal" : "Tambah Jadwal Baru"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Perbarui detail jadwal ini." : "Isi detail untuk jadwal baru."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Informasi Dasar</TabsTrigger>
                <TabsTrigger value="customer">Pelanggan</TabsTrigger>
                <TabsTrigger value="details">Detail Tambahan</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="schedule_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tanggal Jadwal</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pilih tanggal</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="schedule_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waktu Jadwal (Opsional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 09:00 - 17:00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipe Jadwal</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tipe jadwal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ScheduleType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="product_category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori Produk (Opsional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori produk" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ScheduleProductCategory).map((category) => (
                            <SelectItem key={category} value={category}>
                              {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ScheduleStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="technician_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Teknisi (Opsional)</FormLabel>
                      <FormControl>
                        <TechnicianCombobox
                          technicians={technicians || []}
                          value={technicians?.find(t => t.name === field.value)?.id || undefined}
                          onValueChange={handleTechnicianSelect}
                          inputValue={technicianSearchInput}
                          onInputValueChange={setTechnicianSearchInput}
                          disabled={loadingTechnicians}
                          loading={loadingTechnicians}
                          placeholder="Pilih atau cari teknisi..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="customer" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customer_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pilih Pelanggan</FormLabel>
                      <FormControl>
                        <CustomerCombobox
                          customers={customers || []}
                          value={field.value || undefined}
                          onValueChange={handleCustomerSelect}
                          inputValue={customerSearchInput}
                          onInputValueChange={setCustomerSearchInput}
                          disabled={loadingCustomers}
                          loading={loadingCustomers}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Pelanggan</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!!form.watch("customer_id")} className={cn({ "bg-gray-100": !!form.watch("customer_id") })} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Alamat (Opsional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} readOnly={!!form.watch("customer_id")} className={cn({ "bg-gray-100": !!form.watch("customer_id") })} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon (Opsional)</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!!form.watch("customer_id")} className={cn({ "bg-gray-100": !!form.watch("customer_id") })} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="details" className="mt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="invoice_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Invoice Terkait (Opsional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="courier_service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Layanan Kurir (Opsional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Catatan (Opsional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button type="submit" disabled={saveScheduleMutation.isPending}>
                {saveScheduleMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  initialData ? "Simpan Perubahan" : "Tambah Jadwal"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditScheduleForm;