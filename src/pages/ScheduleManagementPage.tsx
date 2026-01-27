"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";

const ScheduleManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: schedules, isLoading, error } = useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      const { data, error } = await supabase.from("schedules").select("*").order('created_at', { ascending: false }); // Order by created_at descending
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("schedules").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast.success("Schedule deleted successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to delete schedule: ${error.message}`);
    },
  });

  const updateScheduleStatusMutation = useMutation({
    mutationFn: async ({ scheduleId, newStatus, notes }: { scheduleId: string, newStatus: string, notes?: string }) => {
      const { data, error } = await supabase.functions.invoke('update-schedule-status', {
        body: { schedule_id: scheduleId, new_status: newStatus, notes },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Schedule status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ["schedules"] }); // Invalidate schedules query to refetch data
    },
    onError: (error: any) => {
      toast.error(`Failed to update schedule status: ${error.message || 'Unknown error'}`);
    },
  });

  const handleStatusChange = (scheduleId: string, newStatus: string) => {
    if (['cancelled', 'rescheduled'].includes(newStatus)) {
      const notes = prompt(`Please provide notes for ${newStatus} status:`);
      if (notes === null) return; // User cancelled the prompt
      updateScheduleStatusMutation.mutate({ scheduleId, newStatus, notes });
    } else {
      updateScheduleStatusMutation.mutate({ scheduleId, newStatus });
    }
  };

  const handleDelete = (id) => {
    setScheduleToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (scheduleToDelete) {
      deleteMutation.mutate(scheduleToDelete);
      setIsDeleteDialogOpen(false);
      setScheduleToDelete(null);
    }
  };

  const filteredSchedules = schedules?.filter((schedule) =>
    schedule.do_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.technician_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Schedule Management</h1>
        <Button onClick={() => navigate("/schedules/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Schedule
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search schedules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DO Number</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Schedule Date</TableHead>
              <TableHead>Schedule Time</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchedules?.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{schedule.do_number}</TableCell>
                <TableCell>{schedule.customer_name}</TableCell>
                <TableCell>{schedule.schedule_date}</TableCell>
                <TableCell>{schedule.schedule_time}</TableCell>
                <TableCell>{schedule.technician_name}</TableCell>
                <TableCell>{schedule.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</TableCell>
                <TableCell>{schedule.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => navigate(`/schedules/${schedule.id}`)}>View Details</DropdownMenuItem> {/* New View button */}
                      <DropdownMenuItem onClick={() => navigate(`/schedules/${schedule.id}/edit`)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(schedule.id)}>Delete</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {schedule.status !== 'completed' && schedule.status !== 'cancelled' && (
                        <>
                          <DropdownMenuItem onClick={() => handleStatusChange(schedule.id, 'completed')}>
                            Mark as Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(schedule.id, 'cancelled')}>
                            Mark as Cancelled
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(schedule.id, 'rescheduled')}>
                            Mark as Rescheduled
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the schedule
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ScheduleManagementPage;