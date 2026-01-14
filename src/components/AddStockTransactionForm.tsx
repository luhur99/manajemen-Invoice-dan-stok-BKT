"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Product } from "@/types/data"; // Changed from StockItem

// Schema validasi menggunakan Zod
const formSchema = z.object({
  quantity: z.coerce.number().min(1, "Kuantitas harus lebih besar dari 0"),
  transaction_date: z.date({ required_error: "Tanggal transaksi wajib diisi" }),
  notes: z.string().optional(),
  transaction_type: z.enum(["in", "out", "return", "damage_loss"], {
    required_error: "Tipe transaksi wajib dipilih",
  }),
  warehouse_category: z.enum(["siap_jual", "riset", "retur"], { // New field
    required_error: "Kategori Gudang wajib dipilih",
  }).default("siap_jual"),
});

interface AddStockTransactionFormProps {
  product: Product; // Changed from stockItem: StockItem
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialTransactionType?: "in" | "out" | "return" | "damage_loss";
}

const AddStockTransactionForm: React.FC<AddStockTransactionFormProps> = ({
  product, // Changed from stockItem
  isOpen,
  onOpenChange,
  onSuccess,
  initialTransactionType,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      transaction_date: new Date(),
      notes: "",
      transaction_type: initialTransactionType || "in",
      warehouse_category: "siap_jual", // Default value for new field
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        quantity: 1,
        transaction_date: new Date(),
        notes: "",
        transaction_type: initialTransactionType || "in",
        warehouse_category: "siap_jual",<dyad-problem-report summary="24 problems">
<problem file="src/pages/DashboardOverviewPage.tsx" line="120" column="42" code="2339">Property 'safe_stock_limit' does not exist on type '{ safe_stock_limit: any; }[]'.</problem>
<problem file="src/pages/DashboardOverviewPage.tsx" line="120" column="91" code="2339">Property 'safe_stock_limit' does not exist on type '{ safe_stock_limit: any; }[]'.</problem>
<problem file="src/pages/DashboardOverviewPage.tsx" line="120" column="133" code="2339">Property 'safe_stock_limit' does not exist on type '{ safe_stock_limit: any; }[]'.</problem>
<problem file="src/pages/DashboardOverviewPage.tsx" line="179" column="72" code="2352">Conversion of type '{ id: any; transaction_type: any; quantity: any; notes: any; created_at: any; products: { nama_barang: any; }[]; }[]' to type 'StockTransactionWithProduct[]' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type '{ id: any; transaction_type: any; quantity: any; notes: any; created_at: any; products: { nama_barang: any; }[]; }' is not comparable to type 'StockTransactionWithProduct'.
    Types of property 'products' are incompatible.
      Property 'nama_barang' is missing in type '{ nama_barang: any; }[]' but required in type '{ nama_barang: string; }'.</problem>
<problem file="src/pages/DashboardOverviewPage.tsx" line="180" column="66" code="2352">Conversion of type '{ id: any; from_category: any; to_category: any; quantity: any; reason: any; created_at: any; products: { nama_barang: any; }[]; }[]' to type 'StockMovementWithProduct[]' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type '{ id: any; from_category: any; to_category: any; quantity: any; reason: any; created_at: any; products: { nama_barang: any; }[]; }' is not comparable to type 'StockMovementWithProduct'.
    Types of property 'products' are incompatible.
      Property 'nama_barang' is missing in type '{ nama_barang: any; }[]' but required in type '{ nama_barang: string; }'.</problem>
<problem file="src/components/AddInvoiceForm.tsx" line="115" column="21" code="2352">Conversion of type '{ id: any; kode_barang: any; nama_barang: any; harga_beli: any; harga_jual: any; satuan: any; }[]' to type 'Product[]' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type '{ id: any; kode_barang: any; nama_barang: any; harga_beli: any; harga_jual: any; satuan: any; }' is missing the following properties from type 'Product': &quot;KODE BARANG&quot;, &quot;NAMA BARANG&quot;, SATUAN, &quot;HARGA BELI&quot;, &quot;HARGA JUAL&quot;</problem>
<problem file="src/components/EditInvoiceForm.tsx" line="107" column="21" code="2352">Conversion of type '{ id: any; kode_barang: any; nama_barang: any; harga_beli: any; harga_jual: any; satuan: any; }[]' to type 'Product[]' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type '{ id: any; kode_barang: any; nama_barang: any; harga_beli: any; harga_jual: any; satuan: any; }' is missing the following properties from type 'Product': &quot;KODE BARANG&quot;, &quot;NAMA BARANG&quot;, SATUAN, &quot;HARGA BELI&quot;, &quot;HARGA JUAL&quot;</problem>
<problem file="src/components/AddStockTransactionForm.tsx" line="27" column="10" code="2305">Module '&quot;@/types/data&quot;' has no exported member 'StockItem'.</problem>
<problem file="src/components/StockMovementForm.tsx" line="23" column="10" code="2305">Module '&quot;@/types/data&quot;' has no exported member 'StockItem'.</problem>
<problem file="src/components/StockAdjustmentForm.tsx" line="22" column="10" code="2305">Module '&quot;@/types/data&quot;' has no exported member 'StockItem'.</problem>
<problem file="src/components/ViewStockItemDetailsDialog.tsx" line="6" column="10" code="2305">Module '&quot;@/types/data&quot;' has no exported member 'StockItem'.</problem>
<problem file="src/pages/StockPage.tsx" line="8" column="10" code="2305">Module '&quot;@/types/data&quot;' has no exported member 'StockItem'.</problem>
<problem file="src/pages/StockPage.tsx" line="354" column="11" code="2322">Type '{ stockItem: any; isOpen: boolean; onOpenChange: Dispatch&lt;SetStateAction&lt;boolean&gt;&gt;; onSuccess: () =&gt; Promise&lt;void&gt;; }' is not assignable to type 'IntrinsicAttributes &amp; EditProductFormProps'.
  Property 'stockItem' does not exist on type 'IntrinsicAttributes &amp; EditProductFormProps'.</problem>
<problem file="src/pages/StockHistoryPage.tsx" line="135" column="16" code="2339">Property 'stock_items' does not exist on type 'StockTransactionWithItemName'.</problem>
<problem file="src/pages/StockHistoryPage.tsx" line="136" column="16" code="2339">Property 'stock_items' does not exist on type 'StockTransactionWithItemName'.</problem>
<problem file="src/pages/StockHistoryPage.tsx" line="142" column="38" code="2339">Property 'stock_items' does not exist on type 'StockTransactionWithItemName'.</problem>
<problem file="src/pages/StockHistoryPage.tsx" line="471" column="47" code="2339">Property 'stock_items' does not exist on type 'StockTransactionWithItemName'.</problem>
<problem file="src/pages/StockHistoryPage.tsx" line="472" column="47" code="2339">Property 'stock_items' does not exist on type 'StockTransactionWithItemName'.</problem>
<problem file="src/pages/StockHistoryPage.tsx" line="479" column="66" code="2339">Property 'stock_items' does not exist on type 'StockTransactionWithItemName'.</problem>
<problem file="src/pages/StockMovementHistoryPage.tsx" line="129" column="16" code="2339">Property 'stock_items' does not exist on type 'StockMovementWithItemName'.</problem>
<problem file="src/pages/StockMovementHistoryPage.tsx" line="130" column="16" code="2339">Property 'stock_items' does not exist on type 'StockMovementWithItemName'.</problem>
<problem file="src/pages/StockMovementHistoryPage.tsx" line="387" column="44" code="2339">Property 'stock_items' does not exist on type 'StockMovementWithItemName'.</problem>
<problem file="src/pages/StockMovementHistoryPage.tsx" line="388" column="44" code="2339">Property 'stock_items' does not exist on type 'StockMovementWithItemName'.</problem>
<problem file="src/components/AddPurchaseRequestForm.tsx" line="22" column="10" code="2305">Module '&quot;@/types/data&quot;' has no exported member 'StockItem'.</problem>
</dyad-problem-report><think>**Diagnosing TypeScript Issues**

I'm currently focused on the 24 TypeScript errors. My initial analysis indicates that schema changes are the root cause. Specifically, the `stock_items` table was renamed to `products`, and stock-related fields have been relocated, likely leading to type mismatches and broken references in the codebase. I need to pinpoint each error's source and its relationship with database model alterations.


**Pinpointing Type Mismatches**

I'm making progress in fixing the TypeScript errors. I've identified that errors 1-11 and 24 all stem from the deprecated `StockItem` interface. I'm actively replacing instances of `StockItem` with `Product` or `WarehouseInventory` within various components such as `DashboardOverviewPage.tsx`, `StockItemCombobox.tsx`, and `AddInvoiceForm.tsx`, and `EditInvoiceForm.tsx`, and `EditScheduleForm.tsx`. I've also noted that  `EditStockItemForm.tsx` was renamed to `EditProductForm` and am working through the changes.


**Refactoring Data Structures**

I'm now dealing with the shift from `stock_items` to `products` in the Supabase query results. This affects `StockTransactionWithItemName` and `StockMovementWithItemName` interfaces, which now have a `products` property instead of `stock_items`. I'm going to fix the type mismatches that arise. I need to update imports and data access across multiple components, including `StockHistoryPage.tsx` and `StockMovementHistoryPage.tsx`. This impacts data handling in those pages where the array is now replaced by a single object.


**Addressing Data Structures**

I'm now tackling the remaining errors related to the moved stock fields and interface changes. I need to replace `StockItem` with either `Product` or `WarehouseInventory` appropriately across several files, including `StockAdjustmentForm.tsx`, `ViewStockItemDetailsDialog.tsx`, `StockPage.tsx`, and `AddPurchaseRequestForm.tsx`. I also need to correct the  `StockTransactionWithItemName` and `StockMovementWithItemName` interface access. Specifically, I'll change `item.stock_items?.[0]` to `item.products?` in  `StockHistoryPage.tsx` and `StockMovementHistoryPage.tsx`, to correctly reference the joined data. Moreover, I'm adjusting type casting in `DashboardOverviewPage.tsx` since `products` are expected to be singular now.


**Addressing Remaining Errors**

I'm now focusing on fixing the remaining errors related to type mismatches and interface changes. Specifically, I'm adjusting the Supabase query and type casting in `DashboardOverviewPage.tsx` to ensure that the `products` property is correctly handled as a single object. I'm also mapping fetched data to the `Product` interface in `AddInvoiceForm.tsx` and `EditInvoiceForm.tsx` to address the type errors there, as well as fixing the prop name from `stockItem` to `product` in `StockPage.tsx` to match the rename from `EditStockItemForm` to `EditProductForm`. This includes changing imports and component prop types to match these updates.


**Updating Data Types**

I'm now implementing the fixes to the TypeScript errors. I've been replacing `StockItem` with `Product` or `WarehouseInventory` as needed across the files. In `DashboardOverviewPage.tsx`, I am working on the type casting issues. I've reviewed the Supabase query to ensure it returns a single `products` object instead of an array and updated the data types to match, and will resolve casting to `StockTransactionWithProduct[]` or `StockMovementWithProduct[]`. I'm also ensuring all imports are correct and that the component's state and props use the appropriate interfaces, to match the database changes.


**Aligning Data Structures**

I'm now making adjustments to the data types to fix the type mismatches. I'm updating `StockTransactionWithProduct` and `StockMovementWithProduct` within `DashboardOverviewPage.tsx` to match the data structure defined in `types/data.ts` for consistency. Also, I'll ensure Supabase queries return the expected data format for the single `products` object, not an array. I'm preparing for the changes.

I've reviewed Supabase queries to confirm the data is now shaped as a single object, to ensure consistency with the interface definitions.


**Refining Type Declarations**

I'm now revising the type definitions for data fetched from Supabase, particularly for joins with the `products` table, to eliminate casting errors. I am ensuring that Supabase queries align with my type definitions in `types/data.ts`. I'm aligning the structure of the returned data. I will fix the remaining imports and type annotations for `products`, fixing errors in `AddInvoiceForm.tsx`, and `EditInvoiceForm.tsx`.


**Fixing Data Typing Issues**

I've already begun implementing the corrections. My focus is now on correcting the `stock_items` to `products` transition and related type declarations. This involves revising imports and updating data access within components like `DashboardOverviewPage.tsx`,  `StockHistoryPage.tsx`, and others. Furthermore, I'll be adjusting Supabase queries to reflect the database schema changes and ensure the correct typing and casting for all affected data structures to avoid type mismatch errors.


**Addressing Typings Updates**

I'm now implementing the corrections related to the type definition mismatches. In `DashboardOverviewPage.tsx`, I am updating the `StockTransactionWithProduct` and `StockMovementWithProduct` interfaces, to match the `types/data.ts` definitions. I will also check the supbase queries to match the changes. I'm also addressing type mapping issues to correctly process fetched data as `Product` within `AddInvoiceForm.tsx` and `EditInvoiceForm.tsx`. I am correcting the property names from 'stockItem' to 'product' in `StockPage.tsx`.



**Finalizing Data Structure Alignment**

I'm now making final revisions to resolve the remaining type errors. I've ensured Supabase queries return the correct singular `products` objects and updated interfaces like `StockTransactionWithProduct` to match `types/data.ts`. I'm going through the files again, and updating type casting. I've corrected property names and made the necessary import adjustments. I am ensuring that the correct interfaces are used. I'll make sure the database queries return the proper data.


**Addressing Type Casting Issues**

I'm currently dealing with the type-casting problems in `DashboardOverviewPage.tsx`, specifically when handling `products` data. I will modify my Supabase queries. I'll also double-check my type definitions and consider explicit type assertions as needed to eliminate the mismatches when casting Supabase query results to `StockTransactionWithProduct[]` and `StockMovementWithProduct[]`.



**Fixing Type Mismatches**

I'm making progress in reconciling the type definitions with the database structure changes. I've corrected the `DashboardOverviewPage.tsx` file to match the type declarations for `products` as a single object, and will fix the type issues in `AddInvoiceForm.tsx` and `EditInvoiceForm.tsx`, ensuring that the fetched data correctly maps to the `Product` interface. I'm also addressing prop name updates, such as fixing `stockItem` to `product` in `StockPage.tsx`, to guarantee compatibility with the refactored data models.


**Refining Data Type Casting**

I'm now focusing on fixing type-casting issues, particularly in `DashboardOverviewPage.tsx`, and ensuring alignment between Supabase query results and my data structures. I've re-examined the Supabase queries, and identified a need to explicitly define return types for improved type safety. I'm double-checking the Supabase join logic, since the `products` property is expected as a single object but might be returned as an array, causing the casting errors. I'll need to use `as any` to properly resolve this.


**Adjusting Type Definitions**

I'm now revising my type definitions in `types/data.ts` to ensure consistency. I'm focusing on `StockTransactionWithProduct`, `StockMovementWithProduct` and will resolve the issues in `DashboardOverviewPage.tsx`. I'll make sure Supabase queries align to return single `products` objects and not arrays. I'm also planning to use explicit type assertions for data fetched from Supabase queries in the dashboard to resolve any potential type mismatches.


</think>Baik, saya akan memperbaiki semua kesalahan kompilasi TypeScript yang Anda laporkan. Kesalahan-kesalahan ini sebagian besar disebabkan oleh perubahan skema database yang baru-baru ini kita lakukan, di mana tabel `stock_items` diganti namanya menjadi `products`, dan detail stok per kategori gudang dipindahkan ke tabel `warehouse_inventories` yang baru.

Saya akan melakukan hal berikut:

1.  **Mengganti `StockItem` menjadi `Product` atau `WarehouseInventory`**: Semua impor dan referensi tipe `StockItem` akan diubah menjadi `Product` atau `WarehouseInventory` sesuai konteksnya.
2.  **Mengganti `item.stock_items` menjadi `item.products`**: Di mana pun data transaksi atau pergerakan stok bergabung dengan informasi produk, properti `stock_items` akan diubah menjadi `products`.
3.  **Memperbarui logika terkait stok**: Fungsi-fungsi yang berinteraksi dengan stok (menambah, mengurangi, memindahkan, menyesuaikan) akan diadaptasi untuk menggunakan tabel `products` dan `warehouse_inventories` yang baru. Ini termasuk pembaruan pada kueri Supabase dan logika penanganan data.
4.  **Menyesuaikan tampilan UI**: Komponen-komponen yang menampilkan informasi stok akan diperbarui untuk mencerminkan struktur data yang baru.
5.  **Memperbaiki penanganan tipe data**: Memastikan bahwa data yang diambil dari Supabase sesuai dengan antarmuka TypeScript yang didefinisikan, terutama untuk properti yang digabungkan (`products`).

Berikut adalah perubahan pada file-file yang terpengaruh:

<dyad-write path="src/pages/DashboardOverviewPage.tsx" description="Memperbarui impor tipe, antarmuka, dan logika pengambilan data untuk mencerminkan skema stok baru.">
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReceiptText, CalendarDays, Package, ShoppingCart } from "lucide-react"; // Import ShoppingCart icon
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { format, parseISO, subMonths, startOfMonth, endOfMonth } from "date-fns";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"; // Import Legend
import { Product, WarehouseInventory } from "@/types/data"; // Import Product and WarehouseInventory types
import TechnicianScheduleCalendar from "@/components/TechnicianScheduleCalendar"; // Import the new component
import { Link } from "react-router-dom"; // For navigation

// Define a type for combined activities
interface LatestActivity {
  id: string;
  type: 'invoice' | 'schedule' | 'stock_transaction' | 'stock_movement' | 'purchase_request'; // Added purchase_request
  description: string;
  date: string; // ISO date string
}

// Define interface for stock transaction data with joined products
interface StockTransactionWithProduct {
  id: string;
  transaction_type: string;
  quantity: number;
  notes: string | null;
  created_at: string;
  products: { "NAMA BARANG": string } | null; // Changed to match Product interface property
}

// Define interface for stock movement data with joined products
interface StockMovementWithProduct {
  id: string;
  from_category: string;
  to_category: string;
  quantity: number;
  reason: string | null;
  created_at: string;
  products: { "NAMA BARANG": string } | null; // Changed to match Product interface property
}

// Chart configuration
const chartConfig = {
  invoices: {
    label: "Invoices",
    color: "hsl(var(--primary))",
  },
  stock_in: {
    label: "Stok Masuk",
    color: "hsl(142.1 76.2% 36.3%)", // Green
  },
  stock_out: {
    label: "Stok Keluar",
    color: "hsl(0 84.2% 60.2%)", // Red
  },
} satisfies ChartConfig;

const DashboardOverviewPage = () => {
  const [pendingInvoices, setPendingInvoices] = useState(0);
  const [todaySchedules, setTodaySchedules] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [pendingPurchaseRequests, setPendingPurchaseRequests] = useState(0); // New state for pending purchase requests
  const [latestActivities, setLatestActivities] = useState<LatestActivity[]>([]);
  const [monthlyInvoiceData, setMonthlyInvoiceData] = useState<{ month: string; invoices: number }[]>([]);
  const [monthlyStockData, setMonthlyStockData] = useState<{ month: string; stock_in: number; stock_out: number }[]>([]); // New state for stock chart
  const [loading, setLoading] = useState(true);

  const getCategoryDisplay = (category: string) => {
    switch (category) {
      case "siap_jual": return "Siap Jual";
      case "riset": return "Riset";
      case "retur": return "Retur";
      default: return category;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Pending Invoices
        const { count: invoicesCount, error: invoicesError } = await supabase
          .from("invoices")
          .select("id", { count: "exact" })
          .eq("payment_status", "pending");

        if (invoicesError) throw invoicesError;
        setPendingInvoices(invoicesCount || 0);

        // Fetch Today's Schedules
        const today = format(new Date(), "yyyy-MM-dd");
        const { count: schedulesCount, error: schedulesError } = await supabase
          .from("schedules")
          .select("id", { count: "exact" })
          .eq("schedule_date", today);

        if (schedulesError) throw schedulesError;
        setTodaySchedules(schedulesCount || 0);

        // Fetch Low Stock Items (using safe_stock_limit from products and quantity from warehouse_inventories)
        const { data: warehouseInventoriesData, error: stockError } = await supabase
          .from("warehouse_inventories")
          .select(`
            quantity,
            products ("safe_stock_limit")
          `) as { data: (WarehouseInventory & { products: { safe_stock_limit: number | null } | null })[] | null, error: any }; // Explicitly type the data

        if (stockError) throw stockError;

        let lowStockCount = 0;
        if (warehouseInventoriesData) {
          warehouseInventoriesData.forEach((item) => {
            const limit = item.products?.safe_stock_limit !== undefined && item.products?.safe_stock_limit !== null ? item.products.safe_stock_limit : 10; // Default to 10 if limit not set
            if (item.quantity < limit) {
              lowStockCount++;
            }
          });
        }
        setLowStockItems(lowStockCount);

        // Fetch Pending Purchase Requests
        const { count: purchaseRequestsCount, error: purchaseRequestsError } = await supabase
          .from("purchase_requests")
          .select("id", { count: "exact" })
          .eq("status", "pending");

        if (purchaseRequestsError) throw purchaseRequestsError;
        setPendingPurchaseRequests(purchaseRequestsCount || 0);

        // Fetch Latest Activities
        const { data: recentInvoices, error: recentInvoicesError } = await supabase
          .from("invoices")
          .select("id, invoice_number, customer_name, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        if (recentInvoicesError) throw recentInvoicesError;

        const { data: recentSchedules, error: recentSchedulesError } = await supabase
          .from("schedules")
          .select("id, customer_name, type, schedule_date, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        if (recentSchedulesError) throw recentSchedulesError;

        const { data: recentStockTransactionsData, error: recentStockTransactionsError } = await supabase
          .from("stock_transactions")
          .select(`id, transaction_type, quantity, notes, created_at, products("NAMA BARANG")`) // Changed to products("NAMA BARANG")
          .order("created_at", { ascending: false })
          .limit(5);

        if (recentStockTransactionsError) throw recentStockTransactionsError;

        const { data: recentStockMovementsData, error: recentStockMovementsError } = await supabase
          .from("stock_movements")
          .select(`id, from_category, to_category, quantity, reason, created_at, products("NAMA BARANG")`) // Changed to products("NAMA BARANG")
          .order("created_at", { ascending: false })
          .limit(5);

        if (recentStockMovementsError) throw recentStockMovementsError;

        const { data: recentPurchaseRequestsData, error: recentPurchaseRequestsError } = await supabase
          .from("purchase_requests")
          .select("id, item_name, quantity, status, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        if (recentPurchaseRequestsError) throw recentPurchaseRequestsError;

        // Cast the data to the defined interface
        const recentStockTransactions: StockTransactionWithProduct[] = recentStockTransactionsData as StockTransactionWithProduct[];
        const recentStockMovements: StockMovementWithProduct[] = recentStockMovementsData as StockMovementWithProduct[];

        const allActivities: LatestActivity[] = [];

        recentInvoices.forEach(inv => {
          allActivities.push({
            id: inv.id,
            type: 'invoice',
            description: `Invoice baru #${inv.invoice_number} untuk ${inv.customer_name}`,
            date: inv.created_at,
          });
        });

        recentSchedules.forEach(sch => {
          allActivities.push({
            id: sch.id,
            type: 'schedule',
            description: `Jadwal ${sch.type} untuk ${sch.customer_name} pada ${format(parseISO(sch.schedule_date), 'dd-MM-yyyy')}`,
            date: sch.created_at,
          });
        });

        recentStockTransactions.forEach(trans => {
          // Access the products object directly
          const itemName = trans.products?.["NAMA BARANG"] || "Item Tidak Dikenal"; // Corrected access
          let desc = "";
          if (trans.transaction_type === 'initial') {
            desc = `Stok awal ${trans.quantity} unit untuk ${itemName}`;
          } else if (trans.transaction_type === 'in') {
            desc = `Stok masuk ${trans.quantity} unit untuk ${itemName}`;
          } else if (trans.transaction_type === 'out') {
            desc = `Stok keluar ${trans.quantity} unit dari ${itemName}`;
          } else if (trans.transaction_type === 'return') {
            desc = `Retur ${trans.quantity} unit untuk ${itemName}`;
          } else if (trans.transaction_type === 'damage_loss') {
            desc = `Rusak/Hilang ${trans.quantity} unit dari ${itemName}`;
          } else if (trans.transaction_type === 'adjustment') {
            desc = `Penyesuaian stok ${trans.quantity} unit untuk ${itemName}`;
          }
          allActivities.push({
            id: trans.id,
            type: 'stock_transaction',
            description: desc,
            date: trans.created_at,
          });
        });

        recentStockMovements.forEach(mov => {
          const itemName = mov.products?.["NAMA BARANG"] || "Item Tidak Dikenal"; // Corrected access
          const fromCategory = getCategoryDisplay(mov.from_category);
          const toCategory = getCategoryDisplay(mov.to_category);
          allActivities.push({
            id: mov.id,
            type: 'stock_movement',
            description: `Pindah ${mov.quantity} unit ${itemName} dari ${fromCategory} ke ${toCategory}`,
            date: mov.created_at,
          });
        });

        recentPurchaseRequestsData.forEach(req => {
          allActivities.push({
            id: req.id,
            type: 'purchase_request',
            description: `Pengajuan pembelian ${req.quantity} unit ${req.item_name} (${req.status})`,
            date: req.created_at,
          });
        });

        // Sort all activities by date and take the latest 5
        allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setLatestActivities(allActivities.slice(0, 5));

        // Fetch data for monthly invoice chart
        const sixMonthsAgo = subMonths(new Date(), 5); // Start 5 months ago to include current month = 6 months total
        const startDate = startOfMonth(sixMonthsAgo);

        const { data: allInvoicesForChart, error: chartInvoicesError } = await supabase
          .from("invoices")
          .select("created_at")
          .gte("created_at", format(startDate, "yyyy-MM-dd"));

        if (chartInvoicesError) throw chartInvoicesError;

        const monthlyCounts: { [key: string]: number } = {};
        for (let i = 0; i < 6; i++) {
          const month = format(subMonths(new Date(), i), "MMM yyyy");
          monthlyCounts[month] = 0;
        }

        allInvoicesForChart.forEach(invoice => {
          const month = format(parseISO(invoice.created_at), "MMM yyyy");
          if (monthlyCounts[month] !== undefined) {
            monthlyCounts[month]++;
          }
        });

        const sortedMonthlyInvoiceData = Object.keys(monthlyCounts)
          .sort((a, b) => parseISO(`01 ${a}`).getTime() - parseISO(`01 ${b}`).getTime())
          .map(month => ({
            month,
            invoices: monthlyCounts[month],
          }));
        
        setMonthlyInvoiceData(sortedMonthlyInvoiceData);

        // Fetch data for monthly stock transactions chart
        const { data: allStockTransactionsForChart, error: chartStockTransactionsError } = await supabase
          .from("stock_transactions")
          .select("transaction_type, quantity, created_at")
          .gte("created_at", format(startDate, "yyyy-MM-dd"));

        if (chartStockTransactionsError) throw chartStockTransactionsError;

        const monthlyStockAggregates: { [key: string]: { stock_in: number; stock_out: number } } = {};
        for (let i = 0; i < 6; i++) {
          const month = format(subMonths(new Date(), i), "MMM yyyy");
          monthlyStockAggregates[month] = { stock_in: 0, stock_out: 0 };
        }

        allStockTransactionsForChart.forEach(transaction => {
          const month = format(parseISO(transaction.created_at), "MMM yyyy");
          if (monthlyStockAggregates[month]) {
            if (['in', 'initial', 'return'].includes(transaction.transaction_type)) {
              monthlyStockAggregates[month].stock_in += transaction.quantity;
            } else if (['out', 'damage_loss', 'adjustment'].includes(transaction.transaction_type)) {
              monthlyStockAggregates[month].stock_out += transaction.quantity;
            }
          }
        });

        const sortedMonthlyStockData = Object.keys(monthlyStockAggregates)
          .sort((a, b) => parseISO(`01 ${a}`).getTime() - parseISO(`01 ${b}`).getTime())
          .map(month => ({
            month,
            ...monthlyStockAggregates[month],
          }));
        
        setMonthlyStockData(sortedMonthlyStockData);

      } catch (error: any) {
        showError(`Gagal memuat data dashboard: ${error.message}`);
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard Budi Karya Teknologi</h1>
      <p className="text-gray-600 dark:text-gray-300">Selamat datang di aplikasi manajemen penjualan dan stok Anda. Berikut adalah ringkasan aktivitas terbaru.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"> {/* Changed to lg:grid-cols-4 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoice Pending</CardTitle>
            <ReceiptText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-6 w-12 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{pendingInvoices}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {pendingInvoices > 0 ? `${pendingInvoices} invoice menunggu pembayaran` : "Belum ada invoice pending"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jadwal Hari Ini</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-6 w-12 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{todaySchedules}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {todaySchedules > 0 ? `${todaySchedules} jadwal hari ini` : "Tidak ada jadwal hari ini"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Item Stok Rendah</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-6 w-12 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{lowStockItems}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {lowStockItems > 0 ? `${lowStockItems} item stok rendah` : "Semua stok aman"}
            </p>
            {lowStockItems > 0 && (
              <Link to="/stock" className="text-sm text-blue-500 hover:underline mt-2 block">
                Lihat Item Stok Rendah
              </Link>
            )}
          </CardContent>
        </Card>
        <Card> {/* New Card for Pending Purchase Requests */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengajuan Pembelian Pending</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-6 w-12 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{pendingPurchaseRequests}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {pendingPurchaseRequests > 0 ? `${pendingPurchaseRequests} pengajuan menunggu persetujuan` : "Tidak ada pengajuan pembelian pending"}
            </p>
            {pendingPurchaseRequests > 0 && (
              <Link to="/purchase-requests" className="text-sm text-blue-500 hover:underline mt-2 block">
                Lihat Pengajuan
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Dibuat per Bulan</CardTitle>
            <CardDescription>Jumlah invoice yang dibuat selama 6 bulan terakhir.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
            ) : (
              <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                <BarChart accessibilityLayer data={monthlyInvoiceData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="invoices" fill="var(--color-invoices)" radius={4} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* New Card for Monthly Stock Transactions Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pergerakan Stok per Bulan</CardTitle>
            <CardDescription>Total stok masuk dan keluar selama 6 bulan terakhir.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
            ) : (
              <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                <BarChart accessibilityLayer data={monthlyStockData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend /> {/* Add legend to distinguish bars */}
                  <Bar dataKey="stock_in" fill="var(--color-stock_in)" radius={4} />
                  <Bar dataKey="stock_out" fill="var(--color-stock_out)" radius={4} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2"> {/* Span two columns for better layout */}
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Lihat ringkasan 5 aktivitas penjualan dan stok terbaru Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ) : latestActivities.length > 0 ? (
              <ul className="space-y-2">
                {latestActivities.map((activity) => (
                  <li key={activity.id} className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span>{activity.description}</span>
                    <span className="text-xs text-muted-foreground">{format(parseISO(activity.date), 'dd MMM yyyy HH:mm')}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">Belum ada aktivitas terbaru.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* New Technician Schedule Calendar */}
      <TechnicianScheduleCalendar />
    </div>
  );
};

export default DashboardOverviewPage;