"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: DateRange;
  onDateChange: (date: DateRange | undefined) => void;
}

export function DateRangePicker({
  className,
  date,
  onDateChange,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd<dyad-problem-report summary="38 problems">
<problem file="src/pages/InvoiceManagementPage.tsx" line="39" column="33" code="2307">Cannot find module '@/components/ui/date-range-picker' or its corresponding type declarations.</problem>
<problem file="src/pages/ScheduleManagementPage.tsx" line="24" column="33" code="2307">Cannot find module '@/components/AddEditScheduleForm' or its corresponding type declarations.</problem>
<problem file="src/pages/StockHistoryPage.tsx" line="22" column="33" code="2307">Cannot find module '@/components/ui/date-range-picker' or its corresponding type declarations.</problem>
<problem file="src/pages/StockHistoryPage.tsx" line="82" column="24" code="2339">Property 'kode_barang' does not exist on type 'Pick&lt;Product, &quot;nama_barang&quot;&gt;'.</problem>
<problem file="src/pages/StockHistoryPage.tsx" line="182" column="47" code="2339">Property 'kode_barang' does not exist on type 'Pick&lt;Product, &quot;nama_barang&quot;&gt;'.</problem>
<problem file="src/pages/StockMovementHistoryPage.tsx" line="22" column="33" code="2307">Cannot find module '@/components/ui/date-range-picker' or its corresponding type declarations.</problem>
<problem file="src/pages/StockMovementHistoryPage.tsx" line="82" column="28" code="2339">Property 'kode_barang' does not exist on type 'Pick&lt;Product, &quot;nama_barang&quot;&gt;'.</problem>
<problem file="src/pages/StockMovementHistoryPage.tsx" line="183" column="50" code="2339">Property 'kode_barang' does not exist on type 'Pick&lt;Product, &quot;nama_barang&quot;&gt;'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="332" column="27" code="2322">Type '{ products: Product[]; selectedProductId: string; onSelectProduct: (productId: string) =&gt; void; inputValue: string; onInputValueChange: Dispatch&lt;SetStateAction&lt;string&gt;&gt;; disabled: boolean; loading: boolean; }' is not assignable to type 'IntrinsicAttributes &amp; StockItemComboboxProps'.
  Property 'inputValue' does not exist on type 'IntrinsicAttributes &amp; StockItemComboboxProps'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="584" column="28" code="2304">Cannot find name 'Popover'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="585" column="30" code="2304">Cannot find name 'PopoverTrigger'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="589" column="46" code="2304">Cannot find name 'cn'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="599" column="36" code="2304">Cannot find name 'CalendarIcon'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="602" column="31" code="2304">Cannot find name 'PopoverTrigger'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="603" column="30" code="2304">Cannot find name 'PopoverContent'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="604" column="32" code="2304">Cannot find name 'Calendar'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="610" column="31" code="2304">Cannot find name 'PopoverContent'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="611" column="29" code="2304">Cannot find name 'Popover'.</problem>
<problem file="src/pages/PurchaseRequestPage.tsx" line="27" column="35" code="2307">Cannot find module '@/components/PurchaseRequestUpload' or its corresponding type declarations.</problem>
<problem file="src/pages/PurchaseRequestPage.tsx" line="35" column="33" code="2307">Cannot find module '@/components/ui/date-range-picker' or its corresponding type declarations.</problem>
<problem file="src/pages/PurchaseRequestPage.tsx" line="305" column="13" code="2322">Type '{ isOpen: boolean; onOpenChange: Dispatch&lt;SetStateAction&lt;boolean&gt;&gt;; purchaseRequest: PurchaseRequestWithDetails; }' is not assignable to type 'IntrinsicAttributes &amp; ViewPurchaseRequestDetailsDialogProps'.
  Property 'onOpenChange' does not exist on type 'IntrinsicAttributes &amp; ViewPurchaseRequestDetailsDialogProps'.</problem>
<problem file="src/pages/PurchaseRequestPage.tsx" line="309" column="14" code="2304">Cannot find name 'DialogContent'.</problem>
<problem file="src/pages/PurchaseRequestPage.tsx" line="310" column="16" code="2304">Cannot find name 'DialogHeader'.</problem>
<problem file="src/pages/PurchaseRequestPage.tsx" line="311" column="18" code="2304">Cannot find name 'DialogTitle'.</problem>
<problem file="src/pages/PurchaseRequestPage.tsx" line="311" column="66" code="2304">Cannot find name 'DialogTitle'.</problem>
<problem file="src/pages/PurchaseRequestPage.tsx" line="312" column="18" code="2304">Cannot find name 'DialogDescription'.</problem>
<problem file="src/pages/PurchaseRequestPage.tsx" line="314" column="19" code="2304">Cannot find name 'DialogDescription'.</problem>
<problem file="src/pages/PurchaseRequestPage.tsx" line="315" column="17" code="2304">Cannot find name 'DialogHeader'.</problem>
<problem file="src/pages/PurchaseRequestPage.tsx" line="324" column="15" code="2304">Cannot find name 'DialogContent'.</problem>
<problem file="src/pages/SupplierManagementPage.tsx" line="26" column="39" code="2307">Cannot find module '@/components/ViewSupplierDetailsDialog' or its corresponding type declarations.</problem>
<problem file="src/pages/SupplierManagementPage.tsx" line="143" column="13" code="2322">Type '{ isOpen: boolean; onOpenChange: Dispatch&lt;SetStateAction&lt;boolean&gt;&gt;; onSuccess: () =&gt; void; }' is not assignable to type 'IntrinsicAttributes &amp; AddSupplierFormProps'.
  Property 'isOpen' does not exist on type 'IntrinsicAttributes &amp; AddSupplierFormProps'.</problem>
<problem file="src/pages/SupplierManagementPage.tsx" line="213" column="13" code="2322">Type '{ isOpen: boolean; onOpenChange: Dispatch&lt;SetStateAction&lt;boolean&gt;&gt;; onSuccess: () =&gt; void; initialData: Supplier; }' is not assignable to type 'IntrinsicAttributes &amp; EditSupplierFormProps'.
  Property 'initialData' does not exist on type 'IntrinsicAttributes &amp; EditSupplierFormProps'.</problem>
<problem file="src/pages/StockManagementPage.tsx" line="287" column="13" code="2322">Type '{ isOpen: boolean; onOpenChange: Dispatch&lt;SetStateAction&lt;boolean&gt;&gt;; onSuccess: () =&gt; void; initialData: Product; }' is not assignable to type 'IntrinsicAttributes &amp; EditProductFormProps'.
  Property 'initialData' does not exist on type 'IntrinsicAttributes &amp; EditProductFormProps'.</problem>
<problem file="src/pages/StockManagementPage.tsx" line="298" column="13" code="2322">Type '{ isOpen: boolean; onOpenChange: Dispatch&lt;SetStateAction&lt;boolean&gt;&gt;; onSuccess: () =&gt; void; product: Product; }' is not assignable to type 'IntrinsicAttributes &amp; AddStockTransactionFormProps'.
  Property 'product' does not exist on type 'IntrinsicAttributes &amp; AddStockTransactionFormProps'. Did you mean 'products'?</problem>
<problem file="src/components/ViewSchedulingRequestDetailsDialog.tsx" line="54" column="81" code="2339">Property 'customer_type' does not exist on type 'SchedulingRequest'.</problem>
<problem file="src/pages/SchedulingRequestPage.tsx" line="230" column="15" code="2339">Property 'invoices' does not exist on type 'SchedulingRequestWithDetails'.</problem>
<problem file="src/pages/SchedulingRequestPage.tsx" line="302" column="37" code="2339">Property 'invoices' does not exist on type 'SchedulingRequestWithDetails'.</problem>
<problem file="src/pages/UserManagementPage.tsx" line="54" column="14" code="2352">Conversion of type '{ id: any; email: any; created_at: any; last_sign_in_at: any; profiles: { first_name: any; last_name: any; role: any; phone_number: any; }; }[]' to type 'UserWithProfile[]' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type '{ id: any; email: any; created_at: any; last_sign_in_at: any; profiles: { first_name: any; last_name: any; role: any; phone_number: any; }; }' is missing the following properties from type 'UserWithProfile': app_metadata, user_metadata, aud</problem>
</dyad-problem-report><think>**Addressing Compile Errors**

I'm currently tackling 38 TypeScript compile-time errors. The initial focus is on creating a missing UI component. I need to build `src/components/ui/date-range-picker.tsx` to resolve the immediate error. Then, I plan to systematically address the others.


**Planning Error Resolutions**

I've got a comprehensive approach to address these 38 TypeScript errors. First, I'll tackle the missing UI components: `date-range-picker.tsx`, `ViewSupplierDetailsDialog.tsx`, and `PurchaseRequestUpload.tsx`. Then, I'll consolidate `AddScheduleForm.tsx` and `EditScheduleForm.tsx` into a streamlined `AddEditScheduleForm.tsx`. Finally, I'll update `src/types/data.ts` by adding missing fields to various types, including `StockLedgerWithProduct`, `SchedulingRequest`, `SchedulingRequestWithDetails`, and `UserWithProfile`.


**Prioritizing Error Solutions**

I'm now prioritizing the error fixes based on the breakdown. Creating the missing UI components and refactoring the schedule forms are up first. Then, I will address the type updates in `src/types/data.ts` and the specific file errors based on the dependencies they introduce.


**Resolving Remaining Issues**

I'm now in the process of addressing the remaining TypeScript errors. I have identified import issues across several pages, including `InvoiceManagementPage.tsx`, `ScheduleManagementPage.tsx`, and `StockHistoryPage.tsx`, and I'm correcting the paths and adding the missing components. I'm updating `StockLedgerWithProduct` and creating new props for components.


**Detailing Specific Fixes**

I am now focusing on the specific file errors. I'm addressing import issues in pages like `InvoiceManagementPage.tsx`, `ScheduleManagementPage.tsx`, and `StockHistoryPage.tsx`, ensuring all necessary components and dependencies are correctly imported. I'm also refining the `StockLedgerWithProduct` type and updating prop names for components like `AddSupplierForm` and `EditStockItemForm` for proper data handling. Finally, I'll be implementing the updated `UserWithProfile` type to address the remaining errors.



**Implementing Component Fixes**

I'm now in the process of creating the missing UI components. I've created `date-range-picker.tsx`, `ViewSupplierDetailsDialog.tsx`, and `PurchaseRequestUpload.tsx`. I've also refactored the schedule forms, merging `AddScheduleForm.tsx` and `EditScheduleForm.tsx` into a new `AddEditScheduleForm.tsx`, and deleted the old ones. Next, I will update `src/types/data.ts`.


</think>Baik, saya akan memperbaiki semua 38 kesalahan kompilasi TypeScript yang Anda laporkan. Ini adalah daftar kesalahan yang cukup panjang, tetapi sebagian besar berasal dari beberapa masalah inti: impor yang hilang, definisi tipe yang tidak konsisten atau tidak lengkap, dan cara properti diakses dari objek yang digabungkan (joined data).

Saya akan melakukan langkah-langkah berikut untuk mengatasi semua masalah ini:

1.  **Membuat Komponen UI yang Hilang**:
    *   `src/components/ui/date-range-picker.tsx`: Komponen ini tidak ada di codebase Anda, jadi saya akan membuatnya.
    *   `src/components/ViewSupplierDetailsDialog.tsx`: Komponen ini juga tidak ada, jadi saya akan membuatnya.
    *   `src/components/PurchaseRequestUpload.tsx`: Komponen ini juga tidak ada, jadi saya akan membuatnya.

2.  **Refaktor Komponen Jadwal**:
    *   Saya akan menggabungkan `src/components/AddScheduleForm.tsx` dan `src/components/EditScheduleForm.tsx` menjadi satu komponen `src/components/AddEditScheduleForm.tsx`. Ini akan mengurangi duplikasi kode dan membuat manajemen jadwal lebih efisien. File-file lama akan dihapus.

3.  **Memperbarui Definisi Tipe (`src/types/data.ts`)**:
    *   Saya akan menambahkan properti `customer_type` ke antarmuka `SchedulingRequest`.
    *   Saya akan menambahkan properti `invoices` (untuk `invoice_number`) ke antarmuka `SchedulingRequestWithDetails`.
    *   Saya akan menambahkan properti `kode_barang` ke `StockLedgerWithProduct` agar sesuai dengan penggunaan di halaman riwayat stok.
    *   Saya akan memperbarui antarmuka `UserWithProfile` untuk menyertakan properti `app_metadata`, `user_metadata`, dan `aud` yang ada di objek `User` dari Supabase.

4.  **Memperbaiki Impor dan Penggunaan Props di Berbagai File**:
    *   Saya akan memperbaiki semua impor yang hilang untuk komponen UI (`DateRangePicker`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `Calendar`, `Popover`, `PopoverContent`, `PopoverTrigger`, `cn`, `CalendarIcon`) di file-file yang relevan.
    *   Saya akan memastikan properti diakses dengan benar dari objek yang digabungkan (misalnya, `request.customers?.customer_type`, `request.invoices?.invoice_number`, `item.products?.kode_barang`).
    *   Saya akan memperbaiki prop `onOpenChange` untuk `ViewPurchaseRequestDetailsDialog` agar menggunakan `onClose` yang benar.
    *   Saya akan menyesuaikan cara `AddSupplierForm` dan `EditSupplierForm` menerima props `isOpen` dan `onOpenChange` agar sesuai dengan pola `Dialog` shadcn/ui.
    *   Saya akan memperbaiki prop `product` untuk `EditStockItemForm` dan `AddStockTransactionForm`.
    *   Saya akan memastikan casting tipe enum dilakukan dengan benar saat mengiterasi `Object.values()`.

Mari kita mulai dengan perubahan ini:

<dyad-write path="src/components/ui/date-range-picker.tsx" description="Membuat komponen DateRangePicker untuk pemilihan rentang tanggal.">
"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: DateRange;
  onDateChange: (date: DateRange | undefined) => void;
}

export function DateRangePicker({
  className,
  date,
  onDateChange,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pilih tanggal</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}