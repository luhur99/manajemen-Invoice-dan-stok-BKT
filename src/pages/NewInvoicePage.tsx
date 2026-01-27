"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const NewInvoicePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const scheduleId = location.state?.scheduleId;

  const [invoiceData, setInvoiceData] = useState<{
    invoice_number: string;
    invoice_date: Date;
    due_date: Date | null;
    customer_name: string;
    company_name: string;
    total_amount: number;
    payment_status: string;
    type: string;
    customer_type: string;
    payment_method: string;
    notes: string;
    courier_service: string;
    invoice_status: string;
    user_id: string;
    customer_id: string;
  }>({
    invoice_number: "",
    invoice_date: new Date(),
    due_date: null,
    customer_name: "",
    company_name: "",
    total_amount: 0,
    payment_status: "pending",
    type: "",
    customer_type: "",
    payment_method: "",
    notes: "",
    courier_service: "",
    invoice_status: "waiting_document_inv",
    user_id: "",
    customer_id: "",
  });

  const { data: schedule, isLoading: isLoadingSchedule, error: scheduleError } = useQuery({
    queryKey: ["schedule", scheduleId],
    queryFn: async () => {
      const { data, error } = await supabase.from("schedules").select("*").eq("id", scheduleId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!scheduleId,
  });

  useEffect(() => {
    if (schedule) {
      setInvoiceData((prev) => ({
        ...prev,
        invoice_number: schedule.do_number || "", // Use DO Number as initial invoice number
        customer_name: schedule.customer_name || "",
        company_name: schedule.company_name || "",
        type: schedule.type || "",
        notes: `Generated from Schedule DO: ${schedule.do_number || ''}. Address: ${schedule.address || ''}. Technician: ${schedule.technician_name || ''}.`,
        user_id: schedule.user_id || "",
        customer_id: schedule.customer_id || "",
      }));
    }
  }, [schedule]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setInvoiceData((prev) => ({
      ...prev,
      [id]: id === "total_amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDateChange = (id: string, date: Date | undefined) => {
    setInvoiceData((prev) => ({
      ...prev,
      [id]: date || null, // Ensure it can be null
    }));
  };

  const createInvoiceMutation = useMutation({
    mutationFn: async (newInvoice: Omit<typeof invoiceData, 'invoice_date' | 'due_date'> & { invoice_date: string, due_date: string | null }) => {
      const { data, error } = await supabase.from("invoices").insert([newInvoice]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Invoice created successfully!");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      navigate("/schedule-management"); // Navigate back to schedule management or invoice list
    },
    onError: (error: any) => {
      toast.error(`Failed to create invoice: ${error.message || "Unknown error"}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to create an invoice.");
      return;
    }

    const formattedInvoiceData = {
      ...invoiceData,
      user_id: user.id, // Ensure user_id is set to the current user
      invoice_date: format(invoiceData.invoice_date, 'yyyy-MM-dd'),
      due_date: invoiceData.due_date ? format(invoiceData.due_date, 'yyyy-MM-dd') : null,
    };

    createInvoiceMutation.mutate(formattedInvoiceData);
  };

  if (isLoadingSchedule) return <div className="container mx-auto p-4">Loading schedule data...</div>;
  if (scheduleError) return <div className="container mx-auto p-4">Error loading schedule: {scheduleError.message}</div>;
  if (!scheduleId) return <div className="container mx-auto p-4">No schedule ID provided. Please go back and select a completed schedule.</div>;

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Create New Invoice from DO: {schedule?.do_number}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoice_number">Invoice Number</Label>
                <Input
                  id="invoice_number"
                  value={invoiceData.invoice_number}
                  onChange={handleChange}
                  placeholder="Auto-generated or enter manually"
                />
              </div>
              <div>
                <Label htmlFor="invoice_date">Invoice Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !invoiceData.invoice_date && "text-muted-foreground"
                      )}
                    >
                      {invoiceData.invoice_date ? format(invoiceData.invoice_date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={invoiceData.invoice_date}
                      onSelect={(date) => handleDateChange("invoice_date", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !invoiceData.due_date && "text-muted-foreground"
                      )}
                    >
                      {invoiceData.due_date ? format(invoiceData.due_date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={invoiceData.due_date}
                      onSelect={(date) => handleDateChange("due_date", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="customer_name">Customer Name</Label>
                <Input
                  id="customer_name"
                  value={invoiceData.customer_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={invoiceData.company_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="type">Invoice Type</Label>
                <Select onValueChange={(value) => handleSelectChange("type", value)} value={invoiceData.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="installation">Installation</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="customer_type">Customer Type</Label>
                <Select onValueChange={(value) => handleSelectChange("customer_type", value)} value={invoiceData.customer_type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select onValueChange={(value) => handleSelectChange("payment_method", value)} value={invoiceData.payment_method}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="total_amount">Total Amount</Label>
                <Input
                  id="total_amount"
                  type="number"
                  value={invoiceData.total_amount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="payment_status">Payment Status</Label>
                <Select onValueChange={(value) => handleSelectChange("payment_status", value)} value={invoiceData.payment_status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="partially_paid">Partially Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="courier_service">Courier Service</Label>
                <Input
                  id="courier_service"
                  value={invoiceData.courier_service}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={invoiceData.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full" disabled={createInvoiceMutation.isPending}>
              {createInvoiceMutation.isPending ? "Creating Invoice..." : "Create Invoice"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewInvoicePage;