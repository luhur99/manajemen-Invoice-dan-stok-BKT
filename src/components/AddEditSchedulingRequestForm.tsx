"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const formSchema = z.object({
  type: z.enum(["installation", "maintenance", "survey", "delivery"]),
  full_address: z.string().min(1, "Full address is required"),
  landmark: z.string().optional(),
  requested_date: z.date({ required_error: "Requested date is required" }),
  requested_time: z.string().optional(),
  contact_person: z.string().min(1, "Contact person is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  payment_method: z.string().optional(),
  notes: z.string().optional(),
  customer_id: z.string().optional(),
  customer_name: z.string().optional(),
  company_name: z.string().optional(),
  vehicle_details: z.string().optional(),
  product_category: z.enum(["Jawara Tracker", "Powerdash", "Lainnya"], {
    required_error: "Product category is required",
  }),
});

export function AddEditSchedulingRequestForm({ request, onClose }) {
  const isEdit = !!request;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: request?.type || "installation",
      full_address: request?.full_address || "",
      landmark: request?.landmark || "",
      requested_date: request?.requested_date ? new Date(request.requested_date) : undefined,
      requested_time: request?.requested_time || "",
      contact_person: request?.contact_person || "",
      phone_number: request?.phone_number || "",
      payment_method: request?.payment_method || "",
      notes: request?.notes || "",
      customer_id: request?.customer_id || "",
      customer_name: request?.customer_name || "",
      company_name: request?.company_name || "",
      vehicle_details: request?.vehicle_details || "",
      product_category: request?.product_category || undefined,
    },
  });

  useEffect(() => {
    if (request) {
      form.reset({
        type: request.type,
        full_address: request.full_address,
        landmark: request.landmark,
        requested_date: new Date(request.requested_date),
        requested_time: request.requested_time,
        contact_person: request.contact_person,
        phone_number: request.phone_number,
        payment_method: request.payment_method,
        notes: request.notes,
        customer_id: request.customer_id,
        customer_name: request.customer_name,
        company_name: request.company_name,
        vehicle_details: request.vehicle_details,
        product_category: request.product_category,
      });
    }
  }, [request, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      toast.error("You must be logged in to create or update a scheduling request.");
      return;
    }

    const payload = {
      ...values,
      user_id: user.data.user.id,
      requested_date: format(values.requested_date, "yyyy-MM-dd"),
    };

    if (isEdit) {
      const { error } = await supabase
        .from("scheduling_requests")
        .update(payload)
        .eq("id", request.id);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Scheduling request updated successfully!");
        onClose();
        window.location.reload(); // Use window.location.reload() for a full page refresh
      }
    } else {
      const { error } = await supabase
        .from("scheduling_requests")
        .insert(payload);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Scheduling request created successfully!");
        onClose();
        window.location.reload(); // Use window.location.reload() for a full page refresh
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="installation">Installation</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="survey">Survey</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
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
              <FormLabel>Product Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori produk" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Jawara Tracker">Jawara Tracker</SelectItem>
                  <SelectItem value="Powerdash">Powerdash</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="full_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter full address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="landmark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Landmark</FormLabel>
              <FormControl>
                <Input placeholder="Enter nearby landmark" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="requested_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Requested Date</FormLabel>
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
                        <span>Pick a date</span>
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
                    disabled={(date) => date < new Date("1900-01-01")}
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
          name="requested_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requested Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact_person"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Person</FormLabel>
              <FormControl>
                <Input placeholder="Enter contact person's name" {...field} />
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
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payment_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <FormControl>
                <Input placeholder="Enter payment method" {...field} />
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
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter customer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vehicle_details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Details</FormLabel>
              <FormControl>
                <Input placeholder="Enter vehicle details" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Add any notes here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {isEdit ? "Update Request" : "Create Request"}
        </Button>
      </form>
    </Form>
  );
}