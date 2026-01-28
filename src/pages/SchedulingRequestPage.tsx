"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AddEditSchedulingRequestForm } from "@/components/AddEditSchedulingRequestForm";
import ViewSchedulingRequestDetailsDialog from "@/components/ViewSchedulingRequestDetailsDialog";
import { format } from "date-fns";
import { PencilIcon, EyeIcon, TrashIcon } from "lucide-react";

export default function SchedulingRequestPage() {
  const [schedulingRequests, setSchedulingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [viewingRequest, setViewingRequest] = useState(null);

  useEffect(() => {
    fetchSchedulingRequests();
  }, []);

  const fetchSchedulingRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("scheduling_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      toast.error(error.message);
    } else {
      setSchedulingRequests(data);
    }
    setLoading(false);
  };

  const handleAddClick = () => {
    setEditingRequest(null);
    setIsAddEditDialogOpen(true);
  };

  const handleEditClick = (request) => {
    setEditingRequest(request);
    setIsAddEditDialogOpen(true);
  };

  const handleViewDetailsClick = (request) => {
    setViewingRequest(request);
    setIsViewDetailsDialogOpen(true);
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scheduling request?")) {
      return;
    }
    const { error } = await supabase
      .from("scheduling_requests")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Scheduling request deleted successfully!");
      fetchSchedulingRequests();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Scheduling Requests</h1>
      <div className="flex justify-end mb-4">
        <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddClick}>Add New Request</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingRequest ? "Edit Scheduling Request" : "Add New Scheduling Request"}</DialogTitle>
            </DialogHeader>
            <AddEditSchedulingRequestForm
              request={editingRequest}
              onClose={() => setIsAddEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Requested Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedulingRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{request.customer_name}</TableCell>
                  <TableCell>{format(new Date(request.requested_date), "PPP")}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleViewDetailsClick(request)}>
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleEditClick(request)}>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteRequest(request.id)}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Scheduling Request Details</DialogTitle>
          </DialogHeader>
          {viewingRequest && (
            <ViewSchedulingRequestDetailsDialog
              request={viewingRequest}
              isOpen={isViewDetailsDialogOpen}
              onClose={() => setIsViewDetailsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}