"use client";

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { ScheduleWithDetails, ScheduleType, CustomerTypeEnum } from "@/types/data";
import AddInvoiceForm from "@/components/AddInvoiceForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const NewInvoicePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialSchedule = location.state?.initialSchedule ? (location.state as { initialSchedule: ScheduleWithDetails }).initialSchedule : null;

  const [isAddFormOpen, setIsAddFormOpen] = React.useState(true); // State to control the form dialog

  const { data: completedSchedules = [], isLoading: isLoadingSchedules, error: schedulesError } = useQuery<
    ScheduleWithDetails[], // Use ScheduleWithDetails type
    Error
  >({
    queryKey: ["completedSchedulesForNewInvoicePage"],
    queryFn: async () => {
      console.log("Fetching completed schedules for NewInvoicePage...");
      
      const { data, error } = await supabase
        .from("schedules")
        .select(`
          *,
          customers (
            company_name,
            customer_type
          )
        `)
        .eq("status", "completed")
        .not("do_number", "is", null)
        .order("schedule_date", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching schedules in NewInvoicePage:", error);
        throw error;
      }
      
      console.log("Fetched schedules data in NewInvoicePage:", data);
      
      return data.map(s => ({
        ...s,
        customers: Array.isArray(s.customers) ? s.customers[0] : s.customers, // Ensure customers is an object or null
      })) as ScheduleWithDetails[];
    },
  });

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Buat Invoice Baru {initialSchedule?.do_number ? `dari DO: ${initialSchedule.do_number}` : ""}</CardTitle>
          <CardDescription>Isi detail invoice baru di sini. Nomor Invoice akan dibuat otomatis.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSchedules || !completedSchedules ? ( // Check for completedSchedules existence
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : schedulesError ? (
            <div className="text-red-500">Error memuat jadwal: {schedulesError.message}</div>
          ) : (
            <AddInvoiceForm
              isOpen={isAddFormOpen}
              onOpenChange={setIsAddFormOpen}
              onSuccess={() => navigate("/invoices")}
              initialSchedule={initialSchedule}
              completedSchedules={completedSchedules}
              isLoadingSchedules={isLoadingSchedules}
              schedulesError={schedulesError}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewInvoicePage;