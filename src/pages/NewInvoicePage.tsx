"use client";

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"; // Keep useQuery here
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Keep Card for page layout
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { ScheduleWithDetails, ScheduleType, CustomerTypeEnum } from "@/types/data"; // Import ScheduleType and CustomerTypeEnum
import AddInvoiceForm from "@/components/AddInvoiceForm"; // Corrected import

const NewInvoicePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialSchedule = location.state?.initialSchedule ? (location.state as { initialSchedule: ScheduleWithDetails }).initialSchedule : null;

  // Fetch completed DOs from schedules table
  const { data: completedSchedules = [], isLoading: isLoadingSchedules, error: schedulesError } = useQuery({
    queryKey: ["completedSchedulesForNewInvoicePage"], // Unique key
    queryFn: async () => {
      console.log("Fetching completed schedules for NewInvoicePage...");
      
      const { data, error } = await supabase
        .from("schedules")
        .select("id, do_number, customer_name, schedule_date, status, type, phone_number, courier_service, customer_id, customers(company_name, customer_type)")
        .eq("status", "completed")
        .not("do_number", "is", null)
        .order("schedule_date", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching schedules in NewInvoicePage:", error);
        throw error;
      }
      
      console.log("Fetched schedules data in NewInvoicePage:", data);
      
      return data || [];
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
          {isLoadingSchedules ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : schedulesError ? (
            <div className="text-red-500">Error memuat jadwal: {schedulesError.message}</div>
          ) : (
            <AddInvoiceForm
              isOpen={true} // Always open when on this page
              onOpenChange={() => navigate("/invoices")} // Navigate back to invoices list on close
              onSuccess={() => navigate("/invoices")} // Navigate to invoices list on success
              initialSchedule={initialSchedule}
              completedSchedules={completedSchedules as any[]} // Cast to match AddInvoiceFormProps
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