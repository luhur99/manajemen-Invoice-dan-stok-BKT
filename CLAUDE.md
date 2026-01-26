# CLAUDE.md - AI Assistant Guide for Invoice & Stock Management System (BKT)

## Project Overview

This is a **React-based Invoice and Stock Management System** for BKT (likely a company name). The application handles:
- Invoice management (creation, tracking, payment status)
- Schedule management (installations, services, deliveries)
- Stock/inventory management across multiple warehouses
- Purchase request workflows
- Customer and supplier management
- Technician management and scheduling

**Language**: The UI is primarily in **Indonesian (Bahasa Indonesia)**.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool and dev server |
| **React Router v6** | Client-side routing |
| **Supabase** | Backend (PostgreSQL database, Auth, Edge Functions, Storage) |
| **TanStack Query (React Query)** | Server state management & caching |
| **React Hook Form + Zod** | Form handling with validation |
| **shadcn/ui + Radix UI** | UI component library |
| **Tailwind CSS** | Styling |
| **date-fns** | Date manipulation |
| **Recharts** | Charts and data visualization |
| **Lucide React** | Icons |
| **Sonner** | Toast notifications |

---

## Directory Structure

```
src/
├── App.tsx                 # Main app with routes (KEEP routes here)
├── main.tsx               # Entry point
├── index.css              # Global styles (Tailwind imports)
├── components/
│   ├── ui/                # shadcn/ui components (DO NOT EDIT)
│   ├── AddXxxForm.tsx     # Add forms (dialog-based)
│   ├── EditXxxForm.tsx    # Edit forms (dialog-based)
│   ├── ViewXxxDialog.tsx  # View detail dialogs
│   ├── XxxCombobox.tsx    # Searchable combobox components
│   ├── MainLayout.tsx     # Main app layout with sidebar
│   ├── SidebarNav.tsx     # Navigation sidebar
│   ├── SessionContextProvider.tsx  # Auth context
│   └── ErrorBoundary.tsx  # Error handling wrapper
├── pages/
│   ├── XxxManagementPage.tsx  # CRUD pages for entities
│   ├── DashboardOverviewPage.tsx  # Main dashboard
│   ├── AuthPage.tsx       # Login/signup
│   └── PrintXxxPage.tsx   # Print-specific pages (no layout)
├── hooks/
│   ├── use-debounce.tsx   # Debounce hook for search
│   ├── use-mobile.tsx     # Mobile detection
│   └── use-toast.ts       # Toast hook (shadcn)
├── types/
│   └── data.ts            # All TypeScript interfaces and enums
├── lib/
│   └── utils.ts           # cn() utility for classnames
├── utils/
│   └── toast.ts           # Toast helper functions
└── integrations/
    └── supabase/
        └── client.ts      # Supabase client (auto-generated, DO NOT EDIT)

supabase/
├── functions/             # Supabase Edge Functions (Deno)
│   ├── get-dashboard-overview/
│   ├── create-invoice/
│   ├── move-stock/
│   └── ...
└── migrations/            # Database migrations (SQL)
```

---

## Key Patterns & Conventions

### 1. Component Organization
- **Pages** go in `src/pages/` - one file per route
- **Components** go in `src/components/` - reusable UI pieces
- **UI primitives** in `src/components/ui/` are from shadcn/ui - **DO NOT EDIT these files**
- Create new components if you need to modify shadcn behavior

### 2. Routing
- All routes are defined in `src/App.tsx` - **KEEP routes here**
- Routes use lazy loading with `React.lazy()` for code splitting
- Main app routes are wrapped with `MainLayout` and `ErrorBoundary`
- Print routes (`/print/*`) have no layout wrapper

### 3. Authentication & Authorization
- Uses Supabase Auth with session management
- `SessionContextProvider` wraps the app and provides `useSession()` hook
- Redirects to `/auth` when not authenticated
- User roles: `user`, `staff`, `admin` (stored in `profiles` table)

### 4. Data Fetching
```typescript
// Use TanStack Query for all data fetching
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Fetching data
const { data, isLoading, error } = useQuery({
  queryKey: ["entityName"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("table_name")
      .select("*");
    if (error) throw error;
    return data;
  },
  enabled: !!session, // Only fetch when authenticated
});

// Mutations with cache invalidation
const mutation = useMutation({
  mutationFn: async (values) => { ... },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["entityName"] });
    showSuccess("Berhasil!");
  },
  onError: (error) => {
    showError(`Gagal: ${error.message}`);
  },
});
```

### 5. Form Handling
```typescript
// Standard form pattern with Zod validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  field_name: z.string().min(1, "Field wajib diisi."),
  optional_field: z.string().optional(),
});

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: { ... },
});
```

### 6. Toast Notifications
```typescript
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";

showSuccess("Berhasil disimpan!");
showError("Gagal menyimpan data.");
```

### 7. Styling
- Use **Tailwind CSS classes** exclusively
- Use the `cn()` utility from `@/lib/utils` for conditional classes
- Dark mode is supported via the `dark:` prefix
- Responsive design with `sm:`, `md:`, `lg:` prefixes

### 8. Path Aliases
- `@/` maps to `src/` directory
- Example: `import { Button } from "@/components/ui/button";`

---

## Database Schema (Key Tables)

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles with role (user/staff/admin) |
| `invoices` | Invoice records |
| `invoice_items` | Line items for invoices |
| `schedules` | Installation/service schedules |
| `scheduling_requests` | Schedule request workflow |
| `products` | Product catalog |
| `warehouse_inventories` | Stock per warehouse |
| `stock_ledger` | Stock movement history |
| `purchase_requests` | Purchase request workflow |
| `customers` | Customer records |
| `suppliers` | Supplier records |
| `technicians` | Technician records |
| `warehouse_categories` | Warehouse types (gudang_utama, gudang_transit, etc.) |
| `sales_details` | Sales transaction details |
| `sales_invoices` | Sales invoice file URLs |

### Key Enums (from `src/types/data.ts`)
- `WarehouseCategoryEnum`: gudang_utama, gudang_transit, gudang_teknisi, gudang_retur
- `EventTypeEnum`: in, out, transfer, adjustment, initial
- `InvoicePaymentStatus`: pending, paid, partial, overdue, cancelled
- `PurchaseRequestStatus`: pending, approved, rejected, waiting_for_received, closed
- `ScheduleStatus`: scheduled, completed, cancelled, rescheduled
- `CustomerTypeEnum`: perorangan, perusahaan, b2c

---

## Supabase Edge Functions

Located in `supabase/functions/`, these handle server-side logic:

| Function | Purpose |
|----------|---------|
| `get-dashboard-overview` | Aggregate dashboard data |
| `create-invoice` | Create invoice with items |
| `move-stock` | Transfer stock between warehouses |
| `adjust-stock` | Stock adjustments |
| `close-purchase-request` | Close PR and update stock |
| `approve-scheduling-request` | Approve schedule request |
| `create-user` / `delete-user` | User management (admin) |
| `list-users` / `update-user-role` | User management (admin) |
| `admin-reset-password` | Reset user password (admin) |
| `create-stock-transaction` | Create stock transactions |

### Edge Function Pattern
```typescript
// Deno-based with CORS headers
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  // ... function logic
});
```

---

## Development Commands

```bash
# Start development server (port 8080)
pnpm dev

# Build for production
pnpm build

# Build for development (with source maps)
pnpm build:dev

# Run linting
pnpm lint

# Preview production build
pnpm preview
```

---

## Important Conventions

### DO:
1. Use TypeScript for all new code
2. Define types in `src/types/data.ts`
3. Use TanStack Query for data fetching (with proper query keys)
4. Use React Hook Form + Zod for forms
5. Use shadcn/ui components from `@/components/ui/`
6. Use Tailwind CSS for styling
7. Use `showSuccess()` / `showError()` for user feedback
8. Keep routes in `src/App.tsx`
9. Wrap pages with `ErrorBoundary` and `MainLayout`
10. Use debouncing for search inputs (`useDebounce` hook)
11. Use Indonesian (Bahasa Indonesia) for UI text

### DON'T:
1. Edit files in `src/components/ui/` - create new components instead
2. Edit `src/integrations/supabase/client.ts` - it's auto-generated
3. Use inline styles - use Tailwind classes
4. Fetch data without TanStack Query
5. Skip form validation
6. Hardcode Indonesian text without considering consistency

---

## Common Query Keys

Use consistent query keys for cache management:
```typescript
["dashboardOverview"]
["invoices"]
["schedules"]
["schedulingRequests"]
["products"]
["stock"]
["stockLedger"]
["purchaseRequests"]
["customers"]
["suppliers"]
["technicians"]
["warehouseCategories"]
["users"]
["profiles"]
```

---

## Performance Optimizations Already Implemented

1. **Lazy Loading**: All page components use `React.lazy()`
2. **Debouncing**: Search inputs use `useDebounce` hook (500ms default)
3. **Query Caching**:
   - `staleTime: 5 * 60 * 1000` (5 minutes)
   - `gcTime: 10 * 60 * 1000` (10 minutes)
4. **Selective Columns**: Use `.select("specific, columns")` instead of `*`

---

## File Upload Storage Buckets

Supabase Storage buckets:
- `invoices` - Invoice document uploads
- `schedule_documents` - Schedule-related documents
- `purchase_request_documents` - Purchase request documents

---

## Error Handling

- Use `ErrorBoundary` component for page-level errors
- Use try/catch in async functions
- Display errors via `showError()` toast
- Log errors to console for debugging

---

## Testing Checklist

When making changes, verify:
1. TypeScript compiles without errors (`pnpm build`)
2. ESLint passes (`pnpm lint`)
3. Forms validate correctly
4. Data fetching works with proper loading states
5. Error states are handled gracefully
6. Toast notifications appear appropriately
7. Cache invalidation works after mutations
