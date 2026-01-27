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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Profile } from "@/types/data";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import useMutation and useQueryClient

const formSchema = z.object({
  first_name: z.string().optional().nullable().trim(),
  last_name: z.string().optional().nullable().trim(),
  phone_number: z.string().optional().nullable().trim(),
  avatar_url: z.string().url("URL Avatar tidak valid").optional().or(z.literal("")).nullable(),
});

interface EditProfileFormProps {
  profile: Profile;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ profile, isOpen, onOpenChange, onSuccess }) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      phone_number: profile.phone_number || "",
      avatar_url: profile.avatar_url || "",
    },
  });

  useEffect(() => {
    if (isOpen && profile) {
      form.reset({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone_number: profile.phone_number || "",
        avatar_url: profile.avatar_url || "",
      });
    }
  }, [isOpen, profile, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: values.first_name || null,
          last_name: values.last_name || null,
          phone_number: values.phone_number || null,
          avatar_url: values.avatar_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      showSuccess("Profil berhasil diperbarui!");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["userProfile", profile.id] }); // Invalidate specific user profile
      onSuccess();
    },
    onError: (error: any) => {
      showError(`Gagal memperbarui profil: ${error.message}`);
      console.error("Error updating profile<dyad-problem-report summary="119 problems">
<problem file="src/pages/ScheduleDetailPage.tsx" line="61" column="62" code="2339">Property 'company_name' does not exist on type 'Schedule'.</problem>
<problem file="src/pages/NewInvoicePage.tsx" line="32" column="5" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[], Error, { ...; }[], readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]&gt;' is not assignable to type 'QueryFunction&lt;{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[], readonly unknown[]&gt;'.
      Type 'Promise&lt;{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]&gt;' is not assignable to type '{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[] | Promise&lt;...&gt;'.
        Type 'Promise&lt;{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]&gt;' is not assignable to type 'Promise&lt;{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[]&gt;'.
          Type '{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]' is not assignable to type '{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[]'.
            Type '{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }' is not assignable to type '{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }'.
              Types of property 'customers' are incompatible.
                Type '{ company_name: any; customer_type: any; }[]' is missing the following properties from type '{ company_name: string; customer_type: CustomerTypeEnum; }': company_name, customer_type
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[], Error, { ...; }[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]&gt;' is not assignable to type 'QueryFunction&lt;{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]&gt;' is not assignable to type '{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[] | Promise&lt;...&gt;'.
          Type 'Promise&lt;{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]&gt;' is not assignable to type 'Promise&lt;{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[]&gt;'.
            Type '{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]' is not assignable to type '{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[]'.
              Type '{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }' is not assignable to type '{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }'.
                Types of property 'customers' are incompatible.
                  Type '{ company_name: any; customer_type: any; }[]' is missing the following properties from type '{ company_name: string; customer_type: CustomerTypeEnum; }': company_name, customer_type
  Overload 3 of 3, '(options: UseQueryOptions&lt;{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[], Error, { ...; }[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]&gt;' is not assignable to type 'QueryFunction&lt;{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]&gt;' is not assignable to type '{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[] | Promise&lt;...&gt;'.
          Type 'Promise&lt;{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]&gt;' is not assignable to type 'Promise&lt;{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[]&gt;'.
            Type '{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]' is not assignable to type '{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[]'.
              Type '{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }' is not assignable to type '{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }'.
                Types of property 'customers' are incompatible.
                  Type '{ company_name: any; customer_type: any; }[]' is missing the following properties from type '{ company_name: string; customer_type: CustomerTypeEnum; }': company_name, customer_type</problem>
<problem file="src/pages/NewInvoicePage.tsx" line="75" column="15" code="2322">Type 'any[] | TQueryFnData' is not assignable to type '{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[]'.
  Type 'TQueryFnData' is not assignable to type '{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[]'.</problem>
<problem file="src/pages/CustomerManagementPage.tsx" line="196" column="11" code="2322">Type '{ customer: CustomerWithDetails; isOpen: boolean; onOpenChange: Dispatch&lt;SetStateAction&lt;boolean&gt;&gt;; }' is not assignable to type 'IntrinsicAttributes &amp; ViewCustomerDetailsDialogProps'.
  Property 'onOpenChange' does not exist on type 'IntrinsicAttributes &amp; ViewCustomerDetailsDialogProps'.</problem>
<problem file="src/components/ViewInvoiceDetailsDialog.tsx" line="18" column="18" code="2307">Cannot find module 'next/link' or its corresponding type declarations.</problem>
<problem file="src/components/ViewInvoiceDetailsDialog.tsx" line="85" column="35" code="2304">Cannot find name 'cn'.</problem>
<problem file="src/pages/InvoiceManagementPage.tsx" line="25" column="10" code="2305">Module '&quot;@/components/ui/date-range-picker&quot;' has no exported member 'DatePickerWithRange'.</problem>
<problem file="src/pages/InvoiceManagementPage.tsx" line="27" column="18" code="2307">Cannot find module 'next/link' or its corresponding type declarations.</problem>
<problem file="src/pages/InvoiceManagementPage.tsx" line="113" column="5" code="2769">No overload matches this call.
  Overload 1 of 3, '(options: DefinedInitialDataOptions&lt;{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[], Error, { ...; }[], readonly unknown[]&gt;, queryClient?: QueryClient): DefinedUseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]&gt;' is not assignable to type 'QueryFunction&lt;{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[], readonly unknown[]&gt;'.
      Type 'Promise&lt;{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]&gt;' is not assignable to type '{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[] | Promise&lt;...&gt;'.
        Type 'Promise&lt;{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]&gt;' is not assignable to type 'Promise&lt;{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[]&gt;'.
          Type '{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]' is not assignable to type '{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[]'.
            Type '{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }' is not assignable to type '{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }'.
              Types of property 'customers' are incompatible.
                Type '{ company_name: any; customer_type: any; }[]' is missing the following properties from type '{ company_name: string; customer_type: CustomerTypeEnum; }': company_name, customer_type
  Overload 2 of 3, '(options: UndefinedInitialDataOptions&lt;{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[], Error, { ...; }[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]&gt;' is not assignable to type 'QueryFunction&lt;{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]&gt;' is not assignable to type '{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[] | Promise&lt;...&gt;'.
          Type 'Promise&lt;{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]&gt;' is not assignable to type 'Promise&lt;{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[]&gt;'.
            Type '{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]' is not assignable to type '{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[]'.
              Type '{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }' is not assignable to type '{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }'.
                Types of property 'customers' are incompatible.
                  Type '{ company_name: any; customer_type: any; }[]' is missing the following properties from type '{ company_name: string; customer_type: CustomerTypeEnum; }': company_name, customer_type
  Overload 3 of 3, '(options: UseQueryOptions&lt;{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[], Error, { ...; }[], readonly unknown[]&gt;, queryClient?: QueryClient): UseQueryResult&lt;...&gt;', gave the following error.
    Type '() =&gt; Promise&lt;{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]&gt;' is not assignable to type 'unique symbol | QueryFunction&lt;{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[], readonly unknown[], never&gt;'.
      Type '() =&gt; Promise&lt;{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]&gt;' is not assignable to type 'QueryFunction&lt;{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[], readonly unknown[], never&gt;'.
        Type 'Promise&lt;{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]&gt;' is not assignable to type '{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[] | Promise&lt;...&gt;'.
          Type 'Promise&lt;{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]&gt;' is not assignable to type 'Promise&lt;{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[]&gt;'.
            Type '{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }[]' is not assignable to type '{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[]'.
              Type '{ id: any; do_number: any; customer_name: any; schedule_date: any; status: any; type: any; phone_number: any; courier_service: any; customer_id: any; customers: { company_name: any; customer_type: any; }[]; }' is not assignable to type '{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }'.
                Types of property 'customers' are incompatible.
                  Type '{ company_name: any; customer_type: any; }[]' is missing the following properties from type '{ company_name: string; customer_type: CustomerTypeEnum; }': company_name, customer_type</problem>
<problem file="src/pages/InvoiceManagementPage.tsx" line="331" column="9" code="2322">Type 'undefined[] | TQueryFnData' is not assignable to type '{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[]'.
  Type 'TQueryFnData' is not assignable to type '{ id: string; do_number: string; customer_name: string; schedule_date: string; status: string; type: ScheduleType; phone_number: string; courier_service: string; customer_id: string; customers: { ...; }; }[]'.</problem>
<problem file="src/components/AddStockItemForm.tsx" line="37" column="44" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddStockItemForm.tsx" line="112" column="11" code="2365">Operator '&gt;' cannot be applied to types 'unknown' and 'number'.</problem>
<problem file="src/components/EditStockItemForm.tsx" line="29" column="44" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/EditStockItemForm.tsx" line="137" column="6" code="2304">Cannot find name 'Dialog'.</problem>
<problem file="src/components/EditStockItemForm.tsx" line="138" column="8" code="2304">Cannot find name 'DialogContent'.</problem>
<problem file="src/components/EditStockItemForm.tsx" line="139" column="10" code="2304">Cannot find name 'DialogHeader'.</problem>
<problem file="src/components/EditStockItemForm.tsx" line="140" column="12" code="2304">Cannot find name 'DialogTitle'.</problem>
<problem file="src/components/EditStockItemForm.tsx" line="140" column="64" code="2304">Cannot find name 'DialogTitle'.</problem>
<problem file="src/components/EditStockItemForm.tsx" line="141" column="12" code="2304">Cannot find name 'DialogDescription'.</problem>
<problem file="src/components/EditStockItemForm.tsx" line="141" column="65" code="2304">Cannot find name 'DialogDescription'.</problem>
<problem file="src/components/EditStockItemForm.tsx" line="142" column="11" code="2304">Cannot find name 'DialogHeader'.</problem>
<problem file="src/components/EditStockItemForm.tsx" line="268" column="9" code="2304">Cannot find name 'DialogContent'.</problem>
<problem file="src/components/EditStockItemForm.tsx" line="269" column="7" code="2304">Cannot find name 'Dialog'.</problem>
<problem file="src/components/AddPurchaseRequestForm.tsx" line="70" column="44" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddPurchaseRequestForm.tsx" line="79" column="43" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="48" column="44" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="50" column="43" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="57" column="52" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="61" column="105" code="2365">Operator '&lt;=' cannot be applied to types 'unknown' and 'number'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="68" column="91" code="2365">Operator '&lt;=' cannot be applied to types 'unknown' and 'number'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="274" column="39" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="275" column="39" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="281" column="34" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="283" column="32" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="290" column="50" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="291" column="52" code="2345">Argument of type 'unknown' is not assignable to parameter of type 'string | number | Date'.</problem>
<problem file="src/components/EditPurchaseRequestForm.tsx" line="292" column="40" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/pages/PurchaseRequestPage.tsx" line="25" column="59" code="2724">'&quot;@/types/data&quot;' has no exported member named 'WarehouseCategoryEnum'. Did you mean 'WarehouseCategory'?</problem>
<problem file="src/pages/PurchaseRequestPage.tsx" line="325" column="15" code="2322">Type '{ isOpen: boolean; onOpenChange: Dispatch&lt;SetStateAction&lt;boolean&gt;&gt;; onSuccess: () =&gt; void; initialData: PurchaseRequestWithDetails; }' is not assignable to type 'IntrinsicAttributes &amp; EditPurchaseRequestFormProps'.
  Property 'initialData' does not exist on type 'IntrinsicAttributes &amp; EditPurchaseRequestFormProps'.</problem>
<problem file="src/components/AddSalesDetailForm.tsx" line="38" column="48" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddSalesDetailForm.tsx" line="40" column="42" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddSalesDetailForm.tsx" line="41" column="41" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddSalesDetailForm.tsx" line="43" column="52" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddSalesDetailForm.tsx" line="44" column="43" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddSalesDetailForm.tsx" line="45" column="42" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddSalesDetailForm.tsx" line="53" column="43" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddSalesDetailForm.tsx" line="55" column="45" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddSalesDetailForm.tsx" line="56" column="45" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddSalesDetailForm.tsx" line="57" column="45" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddSalesDetailForm.tsx" line="119" column="27" code="2345">Argument of type 'unknown' is not assignable to parameter of type 'string | number | Date'.</problem>
<problem file="src/components/EditSalesDetailForm.tsx" line="45" column="48" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/EditSalesDetailForm.tsx" line="47" column="42" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/EditSalesDetailForm.tsx" line="48" column="41" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/EditSalesDetailForm.tsx" line="50" column="52" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/EditSalesDetailForm.tsx" line="51" column="43" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/EditSalesDetailForm.tsx" line="52" column="42" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/EditSalesDetailForm.tsx" line="60" column="43" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/EditSalesDetailForm.tsx" line="62" column="45" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/EditSalesDetailForm.tsx" line="63" column="45" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/EditSalesDetailForm.tsx" line="64" column="45" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/EditSalesDetailForm.tsx" line="158" column="27" code="2345">Argument of type 'unknown' is not assignable to parameter of type 'string | number | Date'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="45" column="50" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="48" column="53" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="50" column="46" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="52" column="52" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="55" column="52" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="57" column="43" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="59" column="53" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="61" column="57" code="2345">Argument of type 'unknown' is not assignable to parameter of type 'string'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="61" column="100" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="68" column="84" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="125" column="35" code="2339">Property 'INSTALLATION' does not exist on type 'typeof SchedulingRequestType'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="223" column="41" code="2339">Property 'INSTALLATION' does not exist on type 'typeof SchedulingRequestType'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="286" column="38" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="288" column="45" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="289" column="44" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="292" column="50" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="293" column="43" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="294" column="36" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="295" column="32" code="2345">Argument of type 'unknown' is not assignable to parameter of type 'string | number | Date'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="296" column="48" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="297" column="47" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="298" column="43" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="299" column="48" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="301" column="30" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/AddEditSchedulingRequestForm.tsx" line="303" column="50" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/ViewSchedulingRequestDetailsDialog.tsx" line="83" column="32" code="2345">Argument of type 'ScheduleType' is not assignable to parameter of type 'SchedulingRequestType'.</problem>
<problem file="src/pages/SchedulingRequestPage.tsx" line="139" column="49" code="2339">Property 'INSTALLATION' does not exist on type 'typeof SchedulingRequestType'.</problem>
<problem file="src/pages/SchedulingRequestPage.tsx" line="315" column="44" code="2345">Argument of type 'ScheduleType' is not assignable to parameter of type 'SchedulingRequestType'.</problem>
<problem file="src/pages/StockHistoryPage.tsx" line="19" column="50" code="2724">'&quot;@/types/data&quot;' has no exported member named 'WarehouseCategoryEnum'. Did you mean 'WarehouseCategory'?</problem>
<problem file="src/pages/StockMovementHistoryPage.tsx" line="19" column="50" code="2724">'&quot;@/types/data&quot;' has no exported member named 'WarehouseCategoryEnum'. Did you mean 'WarehouseCategory'?</problem>
<problem file="src/components/EditUserRoleForm.tsx" line="43" column="18" code="2339">Property 'profiles' does not exist on type 'UserWithProfile'.</problem>
<problem file="src/components/EditUserRoleForm.tsx" line="50" column="20" code="2339">Property 'profiles' does not exist on type 'UserWithProfile'.</problem>
<problem file="src/pages/UserManagementPage.tsx" line="56" column="24" code="2352">Conversion of type '{ id: any; email: any; created_at: any; last_sign_in_at: any; profiles: { id: any; first_name: any; last_name: any; role: any; phone_number: any; avatar_url: any; updated_at: any; }; }[]' to type 'UserWithProfile[]' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Type '{ id: any; email: any; created_at: any; last_sign_in_at: any; profiles: { id: any; first_name: any; last_name: any; role: any; phone_number: any; avatar_url: any; updated_at: any; }; }' is not comparable to type 'UserWithProfile'.
    Type '{ id: any; email: any; created_at: any; last_sign_in_at: any; profiles: { id: any; first_name: any; last_name: any; role: any; phone_number: any; avatar_url: any; updated_at: any; }; }' is missing the following properties from type 'Profile': first_name, last_name, avatar_url, phone_number, and 2 more.</problem>
<problem file="src/pages/UserManagementPage.tsx" line="77" column="16" code="2339">Property 'profiles' does not exist on type 'UserWithProfile'.</problem>
<problem file="src/pages/UserManagementPage.tsx" line="78" column="16" code="2339">Property 'profiles' does not exist on type 'UserWithProfile'.</problem>
<problem file="src/pages/UserManagementPage.tsx" line="79" column="16" code="2339">Property 'profiles' does not exist on type 'UserWithProfile'.</problem>
<problem file="src/pages/UserManagementPage.tsx" line="254" column="43" code="2339">Property 'profiles' does not exist on type 'UserWithProfile'.</problem>
<problem file="src/pages/UserManagementPage.tsx" line="254" column="78" code="2339">Property 'profiles' does not exist on type 'UserWithProfile'.</problem>
<problem file="src/pages/UserManagementPage.tsx" line="255" column="40" code="2339">Property 'profiles' does not exist on type 'UserWithProfile'.</problem>
<problem file="src/pages/UserManagementPage.tsx" line="255" column="86" code="2339">Property 'profiles' does not exist on type 'UserWithProfile'.</problem>
<problem file="src/pages/UserManagementPage.tsx" line="256" column="40" code="2339">Property 'created_at' does not exist on type 'UserWithProfile'.</problem>
<problem file="src/pages/UserManagementPage.tsx" line="256" column="74" code="2339">Property 'created_at' does not exist on type 'UserWithProfile'.</problem>
<problem file="src/pages/UserManagementPage.tsx" line="257" column="40" code="2339">Property 'last_sign_in_at' does not exist on type 'UserWithProfile'.</problem>
<problem file="src/pages/UserManagementPage.tsx" line="257" column="79" code="2339">Property 'last_sign_in_at' does not exist on type 'UserWithProfile'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="44" column="45" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="45" column="50" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="47" column="51" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="50" column="53" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="53" column="43" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="54" column="53" code="2339">Property 'trim' does not exist on type 'ZodNullable&lt;ZodOptional&lt;ZodString&gt;&gt;'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="203" column="45" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="204" column="34" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="205" column="44" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="206" column="31" code="2345">Argument of type 'unknown' is not assignable to parameter of type 'string | number | Date'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="207" column="46" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="210" column="50" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="213" column="30" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
<problem file="src/components/AddEditScheduleForm.tsx" line="214" column="50" code="2339">Property 'trim' does not exist on type 'unknown'.</problem>
</dyad-problem-report><think>**Addressing TypeScript Errors**

I'm currently tackling a mountain of 119 TypeScript errors. The primary source seems to be incomplete type definitions, particularly around data joined from Supabase queries. The `select` statements appear to be causing issues where related table data is included, but the TypeScript isn't fully aware. My focus is on tightening up those type declarations to accurately reflect the data structure.


**Systematically Resolve Errors**

I'm systematically tackling the TypeScript errors, and am currently focused on pinpointing and resolving the root causes. I'm prioritizing updates to `src/types/data.ts` to address many type-related issues, which is my top focus. I am focusing on enum mismatches and `cn` imports as well. I'm also addressing the `next/link` import and the unknown type issues.


**Prioritizing Type Definitions**

I'm focused on resolving 119 TypeScript errors by methodically tackling the root causes. I'm prioritizing the updates to `src/types/data.ts` and have been working through the identified issues. I am updating my Schedule types to include `company_name`, addressing enum mismatches with `SchedulingRequestType`, and extending `UserWithProfile` with `email`, `created_at`, and `last_sign_in_at` fields. Also, I am adding `WarehouseCategoryEnum`. Next, I will fix any instances of incorrect `.trim().optional().nullable()` usage in the Zod schemas and address `cn` import issues. I am also working on replacing `next/link` imports.


**Methodically Fixing Type Errors**

I'm making swift progress by going through the TypeScript errors one by one. I've begun with `src/types/data.ts`, starting with the `Schedule` type, as many errors are type-related. I've added `company_name: string | null;` and ensured `ScheduleWithDetails` properly extends `Schedule`, and I've also addressed enum mismatches and updated `UserWithProfile`. Also, I am adding `WarehouseCategoryEnum`. Next, I will fix any incorrect `.trim().optional().nullable()` usage in Zod schemas and resolve `cn` import problems. Finally, I will replace all instances of `next/link` imports.


**Systematically Debugging Type Errors**

I'm systematically working through these type errors, making incremental updates to both the type definitions and component imports. Currently, I'm focusing on those in `src/types/data.ts`. I added `company_name: string | null;` to the `Schedule` type, and ensured `ScheduleWithDetails` properly extends `Schedule`. I'm next updating `completedSchedules` in `NewInvoicePage.tsx` to match the return type from Supabase, then, I'm updating `ViewCustomerDetailsDialogProps` with `onOpenChange`. Afterwards, I will correct all `next/link` imports. Finally, I will address enum mismatches, `unknown` types and Zod schemas.


**Refining Type Definitions**

I'm now methodically addressing each TypeScript error, starting with those related to type definitions in `src/types/data.ts`. I added `company_name: string | null` to the `Schedule` type, corrected `ScheduleWithDetails`, fixed enum mismatches and added `WarehouseCategoryEnum`. I also updated `UserWithProfile` with required fields. Currently, I am updating `completedSchedules` in `NewInvoicePage.tsx` to match the return type from Supabase, and updating `ViewCustomerDetailsDialogProps`. Also, I've replaced incorrect `next/link` imports, fixed enum usage and `cn` imports. I am fixing the incorrect Zod schemas by using `z.string().trim().optional().nullable()`.


**Refining Type Definitions**

I've been systematically addressing the TypeScript errors, and have started by focusing on `src/types/data.ts`. I added `company_name: string | null;` to the `Schedule` type, corrected the `ScheduleWithDetails` definition, and fixed enum mismatches and added `WarehouseCategoryEnum`. I also updated `UserWithProfile`. Next, I will update `completedSchedules` in `NewInvoicePage.tsx`, matching the Supabase return type, and update `ViewCustomerDetailsDialogProps` with `onOpenChange`. Then, I will replace all instances of incorrect `next/link` imports with `react-router-dom` imports, fix enum usages, and fix incorrect `cn` imports. Finally, I'm fixing Zod schemas to use `z.string().trim().optional().nullable()`.


**Refining Type Definitions**

I've been systematically addressing the TypeScript errors. I've corrected `Schedule` by adding `company_name: string | null`, and I'm currently focusing on `NewInvoicePage.tsx`. I updated `completedSchedules` to reflect the Supabase return type, and I am correcting the component's types and addressing enum mismatches. Next, I am addressing `ViewCustomerDetailsDialogProps` and will update the import from `next/link`. I am fixing various enum mismatches, `unknown` types, and incorrect Zod schemas by using the proper format.


**Addressing Supabase Type Mismatches**

I've been working through the TypeScript errors systematically, particularly those stemming from Supabase data and enum mismatches. I've updated the `Schedule` type, corrected enum usages, and addressed incorrect Zod schemas by using `z.string().trim().optional().nullable()`. I'm also addressing type mismatches related to the `completedSchedules` query in the `NewInvoicePage.tsx` and have replaced `next/link` imports. Now I'm focusing on `ViewCustomerDetailsDialogProps` and `DateRangePicker` imports.


**Refining Type Definitions**

I've been systematically addressing the TypeScript errors. I've updated the `Schedule` type by adding `company_name: string | null`, and I'm currently focusing on `NewInvoicePage.tsx`. I updated `completedSchedules` to reflect the Supabase return type and corrected the component's types and enum usages. I'm now addressing `ViewCustomerDetailsDialogProps` and will address the import from `next/link`. I am fixing various enum mismatches, `unknown` types and incorrect Zod schemas, especially for use of `.trim().optional().nullable()`.


</think>Baik, mari kita perbaiki semua kesalahan TypeScript ini secara sistematis. Banyak dari kesalahan ini berasal dari definisi tipe yang tidak lengkap atau tidak konsisten, serta beberapa penggunaan Zod dan impor yang tidak tepat.

Saya akan melakukan perubahan berikut:

1.  **Perbarui `src/types/data.ts`**:
    *   Tambahkan `company_name: string | null;` ke tipe `Schedule`.
    *   Perbaiki `SchedulingRequest.type` untuk menggunakan `SchedulingRequestType` enum.
    *   Tambahkan `inventories?: WarehouseInventory[];` ke tipe `Product`.
    *   Definisikan `WarehouseCategoryEnum` untuk digunakan di `StockHistoryPage` dan `StockMovementHistoryPage`.
    *   Perbaiki struktur `UserWithProfile` agar sesuai dengan data yang dikembalikan oleh Edge Function `list-users`.

2.  **Perbarui skema Zod**:
    *   Untuk bidang string opsional/nullable yang menggunakan `.trim()`, pastikan urutan Zod adalah `z.string().trim().optional().nullable()`.

3.  **Perbarui file-file komponen dan halaman**:
    *   Ganti `import Link from "next/link";` dengan `import { Link } from "react-router-dom";` di `ViewInvoiceDetailsDialog.tsx` dan `InvoiceManagementPage.tsx`.
    *   Tambahkan `import { cn } from "@/lib/utils";` di `ViewInvoiceDetailsDialog.tsx`.
    *   Perbaiki impor `DatePickerWithRange` menjadi `DateRangePicker` di `InvoiceManagementPage.tsx`.
    *   Tambahkan impor `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter` di `EditStockItemForm.tsx`.
    *   Tambahkan `as Date` untuk `format()` jika nilai tanggal berasal dari `unknown`.
    *   Perbaiki penggunaan enum `SchedulingRequestType.INSTALLATION` menjadi `SchedulingRequestType.INSTALASI` di `AddEditSchedulingRequestForm.tsx` dan `SchedulingRequestPage.tsx`.
    *   Perbaiki `onOpenChange` menjadi `onClose` di `ViewCustomerDetailsDialogProps`.

Berikut adalah perubahan kode yang akan saya terapkan:

<dyad-write path="src/types/data.ts" description="Memperbarui definisi tipe untuk mengatasi kesalahan TypeScript di seluruh aplikasi.">
export enum ScheduleType {
  KIRIM = "kirim",
  INSTALASI = "instalasi",
  SERVICE = "service",
}

export enum SchedulingRequestType { // Defined based on usage
  DELIVERY = "delivery", // Changed from KIRIM to match common usage
  INSTALLATION = "installation", // Changed from INSTALASI
  SERVICE_UNBILL = "service_unbill",
  SERVICE_BILL = "service_bill",
}

export enum SchedulingRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  RESCHEDULED = "rescheduled",
  CANCELLED = "cancelled",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export enum PurchaseRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  WAITING_FOR_RECEIVED = "waiting for received",
  CLOSED = "closed",
}

export enum DeliveryOrderStatus {
  PENDING = "pending",
  SCHEDULED = "scheduled",
  IN_TRANSIT = "in_transit",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum InvoicePaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  PARTIALLY_PAID = "partially_paid",
  OVERDUE = "overdue",
  CANCELLED = "cancelled",
}

export enum InvoiceType {
  KIRIM_BARANG = "kirim_barang",
  INSTALASI = "instalasi",
  SERVICE = "service",
}

export enum CustomerTypeEnum {
  INDIVIDUAL = "individual",
  COMPANY = "company",
}

export enum InvoiceDocumentStatus {
  WAITING_DOCUMENT_INV = "waiting_document_inv",
  DOCUMENT_SENT = "document_sent",
  DOCUMENT_RECEIVED = "document_received",
  COMPLETED = "completed",
}

export enum TechnicianType {
  INTERNAL = "internal",
  EXTERNAL = "external",
}

export enum ProductCategory {
  GPS = "GPS",
  CCTV = "CCTV",
  LAINNYA = "Lainnya",
}

export enum StockEventType {
  IN = "IN",
  OUT = "OUT",
  TRANSFER = "TRANSFER",
  ADJUSTMENT = "ADJUSTMENT",
  INITIAL = "INITIAL",
}

export enum ScheduleStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  RESCHEDULED = "rescheduled",
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
}

export enum WarehouseCategoryEnum { // Defined for explicit usage in StockHistoryPage
  GUDANG_UTAMA = "gudang_utama",
  GUDANG_TRANSIT = "gudang_transit",
  GUDANG_TEKNISI = "gudang_teknisi",
  GUDANG_RETUR = "gudang_retur",
  SIAP_JUAL = "siap_jual",
}

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  role: string;
  updated_at: string | null;
};

export type Product = {
  id: string;
  user_id: string | null;
  kode_barang: string;
  nama_barang: string;
  satuan: string | null;
  harga_beli: number;
  harga_jual: number;
  safe_stock_limit: number | null;
  supplier_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  inventories?: WarehouseInventory[]; // Added inventories
};

export type WarehouseCategory = {
  id: string;
  user_id: string | null;
  name: string;
  code: string;
  created_at: string | null;
  updated_at: string | null;
};

export type WarehouseInventory = {
  id: string;
  product_id: string;
  warehouse_category: string; // Assuming this is a string for simplicity, could be enum or foreign key
  quantity: number;
  user_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  products?: Product; // Joined product data
  warehouse_categories?: WarehouseCategory; // Joined category data
};

export type StockLedger = {
  id: string;
  user_id: string | null;
  product_id: string | null;
  event_type: StockEventType;
  quantity: number;
  from_warehouse_category: string | null;
  to_warehouse_category: string | null;
  notes: string | null;
  event_date: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type StockLedgerWithProduct = StockLedger & {
  products?: Product; // Joined product data
};

export type Customer = {
  id: string;
  user_id: string | null;
  customer_name: string;
  company_name: string | null;
  address: string | null;
  phone_number: string | null;
  customer_type: CustomerTypeEnum;
  created_at: string | null;
  updated_at: string | null;
};

export type CustomerWithDetails = Customer & {
  profiles?: Profile; // Assuming customer might have a related profile
};

export type Supplier = {
  id: string;
  user_id: string | null;
  name: string;
  contact_person: string | null;
  phone_number: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type Technician = {
  id: string;
  user_id: string | null;
  name: string;
  phone_number: string | null;
  type: TechnicianType;
  address: string | null;
  city: string | null;
  province: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type TechnicianWithDetails = Technician & {
  profiles?: Profile; // Assuming technician might have a related profile
};

export type SchedulingRequest = {
  id: string;
  user_id: string | null;
  type: SchedulingRequestType; // Changed to SchedulingRequestType
  full_address: string;
  landmark: string | null;
  requested_date: string;
  requested_time: string | null;
  contact_person: string;
  payment_method: string | null;
  status: SchedulingRequestStatus;
  notes: string | null;
  created_at: string | null;
  sr_number: string | null;
  invoice_id: string | null;
  customer_id: string | null;
  vehicle_details: string | null;
  company_name: string | null;
  customer_name: string | null;
  phone_number: string | null;
  updated_at: string | null;
  technician_name: string | null;
  product_category: ProductCategory | null;
  customer_type: CustomerTypeEnum | null; // Added customer_type
};

export type SchedulingRequestWithDetails = SchedulingRequest & {
  customers?: Customer;
  invoices?: Invoice;
};

export type Schedule = {
  id: string;
  user_id: string | null;
  schedule_date: string;
  schedule_time: string | null;
  type: ScheduleType;
  customer_name: string;
  address: string | null;
  technician_name: string | null;
  invoice_id: string | null;
  status: ScheduleStatus; // Changed to ScheduleStatus enum
  notes: string | null;
  created_at: string | null;
  phone_number: string | null;
  courier_service: string | null;
  document_url: string | null;
  scheduling_request_id: string | null;
  do_number: string | null;
  updated_at: string | null;
  product_category: ProductCategory | null;
  customer_id: string | null;
  sr_number: string | null; // Added sr_number
  invoices?: Invoice; // Added invoices for joined data
  company_name: string | null; // Added company_name
};

export type ScheduleWithDetails = Schedule & {
  customers?: { company_name: string | null; customer_type: CustomerTypeEnum | null } | null;
};

export type InvoiceItem = {
  id: string;
  invoice_id: string | null;
  user_id: string | null;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string | null;
  unit_type: string | null;
  product_id: string | null;
  item_code: string | null;
  updated_at: string | null;
  products?: Product; // Joined product data
};

export type Invoice = {
  id: string;
  user_id: string | null;
  invoice_number: string;
  invoice_date: string;
  due_date: string | null;
  customer_name: string;
  company_name: string | null;
  total_amount: number;
  payment_status: InvoicePaymentStatus;
  type: InvoiceType | null;
  customer_type: CustomerTypeEnum | null;
  payment_method: string | null;
  notes: string | null;
  document_url: string | null;
  courier_service: string | null;
  invoice_status: InvoiceDocumentStatus;
  created_at: string | null;
  updated_at: string | null;
  do_number: string | null;
};

export type InvoiceWithDetails = Invoice & {
  invoice_items?: InvoiceItem[]; // Joined invoice items
};

export type PurchaseRequest = {
  id: string;
  user_id: string | null;
  item_name: string;
  item_code: string;
  quantity: number;
  unit_price: number;
  suggested_selling_price: number;
  total_price: number;
  notes: string | null;
  status: PurchaseRequestStatus;
  created_at: string | null;
  document_url: string | null;
  received_quantity: number | null;
  returned_quantity: number | null;
  damaged_quantity: number | null;
  target_warehouse_category: string | null;
  received_notes: string | null;
  received_at: string | null;
  product_id: string | null;
  supplier_id: string | null;
  satuan: string | null;
  pr_number: string | null;
  updated_at: string | null;
};

export type PurchaseRequestWithDetails = PurchaseRequest & {
  products?: Product; // Joined product data
  suppliers?: Supplier; // Joined supplier data
};

export type DeliveryOrder = {
  id: string;
  request_id: string | null; // This could be scheduling_request_id or invoice_id
  user_id: string | null;
  do_number: string;
  items_json: any | null; // JSONB type, can be more specific if schema is known
  delivery_date: string;
  delivery_time: string | null;
  status: DeliveryOrderStatus;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type SalesInvoice = {
  id: string;
  no_transaksi: string;
  invoice_file_url: string | null;
  created_at: string | null;
};

export type SalesDetail = {
  id: string;
  user_id: string | null;
  no: number;
  kirim_install: string;
  no_transaksi: string;
  invoice_number: string;
  new_old: string | null;
  perusahaan: string | null;
  tanggal: string;
  hari: string | null;
  jam: string | null;
  customer: string;
  alamat_install: string | null;
  no_hp: string | null;
  type: string | null;
  qty_unit: number | null;
  stock: number | null;
  harga: number | null;
  web: string | null;
  qty_web: number | null;
  kartu: string | null;
  qty_kartu: number | null;
  paket: string | null;
  pulsa: number | null;
  teknisi: string | null;
  payment: string | null;
  catatan: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type UserWithProfile = {
  id: string;
  email: string;
  created_at: string | null;
  last_sign_in_at: string | null;
  profiles: Profile | null; // Nested profile object
};