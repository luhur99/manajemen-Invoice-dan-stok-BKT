"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Schedule, ScheduleStatus, ScheduleType, ProductCategory } from "@/types/data"; // Import enums

const ScheduleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: schedule, isLoading, error } = useQuery<Schedule, Error>({
    queryKey: ["schedule", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("schedules").select("*").eq("id", id).single();
      if (error) throw error;
      return data as Schedule;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="container mx-auto p-4">Loading schedule details...</div>;
  if (error) return <div className="container mx-auto p-4">Error: {error.message}</div>;
  if (!schedule) return <div className="container mx-auto p-4">Schedule not found.</div>;

  const formatStatus = (status: ScheduleStatus) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatType = (type: ScheduleType) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatProductCategory = (category: ProductCategory | null) => {
    if (!category) return '-';
    return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Schedule Details: {schedule.do_number}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Customer Name</p>
              <p className="text-lg font-semibold">{schedule.customer_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Company Name</p>
              <p className="text-lg font-semibold">{schedule.company_name || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="text-lg font-semibold">{schedule.address}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone Number</p>
              <p className="text-lg font-semibold">{schedule.phone_number || '-'}</p>
            </div>
            <Separator className="md:col-span-2 my-2" />
            <div>
              <p className="text-sm font-medium text-gray-500">Schedule Date</p>
              <p className="text-lg font-semibold">{schedule.schedule_date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Schedule Time</p>
              <p className="text-lg font-semibold">{schedule.schedule_time || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Technician</p>
              <p className="text-lg font-semibold">{schedule.technician_name || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p className="text-lg font-semibold">{formatType(schedule.type)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Product Category</p>
              <p className="text-lg font-semibold">{formatProductCategory(schedule.product_category)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="text-lg font-semibold">{formatStatus(schedule.status)}</p>
            </div>
            <Separator className="md:col-span-2 my-2" />
            <div>
              <p className="text-sm font-medium text-gray-500">Notes</p>
              <p className="text-lg font-semibold">{schedule.notes || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p className="text-lg font-semibold">{new Date(schedule.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p className="text-lg font-semibold">{new Date(schedule.updated_at).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleDetailPage;