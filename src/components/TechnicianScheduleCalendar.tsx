"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, startOfMonth, endOfMonth, isSameDay, parseISO, startOfDay } from "date-fns";
import { id } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { Schedule, WarehouseCategory as WarehouseCategoryType } from "@/types/data"; // Import the interface
import { Loader2, CalendarDays, User, Clock, MapPin, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query"; // Import useQuery

interface TechnicianScheduleCalendarProps {
  // No props needed for now, it will manage its own state and data fetching
}

const TechnicianScheduleCalendar: React.FC<TechnicianScheduleCalendarProps> = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDaySchedules, setSelectedDaySchedules] = useState<Schedule[]>([]);

  const { data: warehouseCategories, isLoading: loadingCategories, error: categoriesError } = useQuery<WarehouseCategoryType[], Error>({
    queryKey: ["warehouseCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warehouse_categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        showError("Gagal memuat kategori gudang.");
        throw error;
      }
      return data;
    },
  });

  const getCategoryDisplayName = (code: string) => {
    const category = warehouseCategories?.find(cat => cat.code === code);
    return category ? category.name : code;
  };

  // Define colors for different technicians in the schedule list
  const technicianColors: Record<string, string> = {
    "Jubed": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    "Daffa": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    "Teknisi Lain": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
    "Belum Ditugaskan": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  };

  // Define colors for calendar day markers (using HSL for consistency with shadcn/ui)
  // Order matters here for `modifiersStyles` if a day has multiple technician schedules.
  // The last defined style for a property (e.g., backgroundColor) will take precedence.
  // Priority: Jubed > Daffa > Other
  const calendarModifierStyles: Record<string, React.CSSProperties> = {
    other: { backgroundColor: 'hsl(27 87% 53%)', color: 'hsl(0 0% 100%)' }, // Orange-500 equivalent
    daffa: { backgroundColor: 'hsl(142.1 76.2% 36.3%)', color: 'hsl(0 0% 100%)' }, // Green-500 equivalent
    jubed: { backgroundColor: 'hsl(217.2 91.2% 59.8%)', color: 'hsl(0 0% 100%)' }, // Blue-500 equivalent
  };

  const fetchSchedulesForMonth = useCallback(async (monthDate: Date) => {
    setLoading(true);
    setSelectedDaySchedules([]); // Clear schedules for selected day when month changes
    try {
      const startOfMonthDate = format(startOfMonth(monthDate), "yyyy-MM-dd");
      const endOfMonthDate = format(endOfMonth(monthDate), "yyyy-MM-dd");

      // Removed .eq("user_id", userId) to allow fetching all schedules allowed by RLS policies
      const { data, error } = await supabase
        .from("schedules")
        .select("*")
        .gte("schedule_date", startOfMonthDate)
        .lte("schedule_date", endOfMonthDate)
        .order("schedule_date", { ascending: true })
        .order("schedule_time", { ascending: true });

      if (error) {
        throw error;
      }
      setSchedules(data as Schedule[]);
    } catch (err: any) {
      showError(`Gagal memuat jadwal: ${err.message}`);
      console.error("Error fetching schedules for month:", err);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (date) {
      fetchSchedulesForMonth(date);
    }
  }, [date, fetchSchedulesForMonth]);

  // Update selectedDaySchedules when schedules or selected date changes
  useEffect(() => {
    if (date) {
      const normalizedSelectedDate = startOfDay(date); // Normalize selected date
      const daySchedules = schedules.filter(s => isSameDay(startOfDay(parseISO(s.schedule_date)), normalizedSelectedDate));
      setSelectedDaySchedules(daySchedules);
    }
  }, [date, schedules]);

  // Create modifiers for each technician for the calendar
  const technicianDayModifiers = useMemo(() => {
    const modifiers: Record<string, Date[]> = {
      jubed: [],
      daffa: [],
      other: [], // For "Teknisi Lain"
      // 'unassigned' is intentionally excluded from calendar modifiers
    };

    schedules.forEach(s => {
      const scheduleDate = startOfDay(parseISO(s.schedule_date)); // Normalize to start of day
      if (s.technician_name === "Jubed") {
        modifiers.jubed.push(scheduleDate);
      } else if (s.technician_name === "Daffa") {
        modifiers.daffa.push(scheduleDate);
      } else if (s.technician_name === "Teknisi Lain") {
        modifiers.other.push(scheduleDate);
      }
      // Schedules with "Belum Ditugaskan" are intentionally not added to modifiers
    });

    // Filter out duplicate dates within each technician's array
    for (const key in modifiers) {
      modifiers[key] = Array.from(new Set(modifiers[key].map(d => d.getTime()))) // Compare by timestamp
        .map(timestamp => new Date(timestamp)); // Convert back to Date
    }

    return modifiers;
  }, [schedules]);

  // Combine all modifiers for the Calendar component
  const allModifiers = {
    ...technicianDayModifiers,
    selected: date, // Keep the selected date modifier
  };

  const handleDaySelect = (selectedDay: Date | undefined) => {
    setDate(selectedDay);
  };

  // Group schedules by technician for display
  const groupedSchedules = selectedDaySchedules.reduce((acc, schedule) => {
    const technician = schedule.technician_name || "Belum Ditugaskan";
    if (!acc[technician]) {
      acc[technician] = [];
    }
    acc[technician].push(schedule);
    return acc;
  }, {} as Record<string, Schedule[]>);

  if (loadingCategories || loading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Kalender Jadwal Teknisi</CardTitle>
          <CardDescription>Memuat kalender jadwal...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (categoriesError) {
    return <div className="text-red-500">Error loading categories: {categoriesError.message}</div>;
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Kalender Jadwal Teknisi</CardTitle>
        <CardDescription>Lihat dan kelola jadwal instalasi/pengiriman teknisi.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="mb-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-blue-500"></span>
              <span>Jubed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-green-500"></span>
              <span>Daffa</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-orange-500"></span>
              <span>Teknisi Lain</span>
            </div>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDaySelect}
            className="rounded-md border shadow"
            modifiers={allModifiers}
            modifiersStyles={calendarModifierStyles}
            locale={id}
            onMonthChange={(newMonth) => setDate(newMonth)}
          />
        </div>
        <div className="flex-1 lg:max-h-[400px] overflow-y-auto p-4 border rounded-md bg-gray-50 dark:bg-gray-700">
          <h3 className="text-lg font-semibold mb-4">
            Jadwal untuk {date ? format(date, "dd MMMM yyyy", { locale: id }) : "Pilih tanggal"}
          </h3>
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : selectedDaySchedules.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">Tidak ada jadwal untuk tanggal ini.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedSchedules).map(([technician, schedules]) => (
                <div key={technician} className="border-b pb-3 last:border-b-0">
                  <h4 className="font-bold text-md mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    {technician}
                    {schedules.length > 1 && (
                      <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        {schedules.length} Jadwal (Potensi Bentrok)
                      </span>
                    )}
                  </h4>
                  <ul className="space-y-2">
                    {schedules.map((schedule) => (
                      <li key={schedule.id} className={`p-3 rounded-md shadow-sm text-sm ${technicianColors[schedule.technician_name || "Belum Ditugaskan"]}`}>
                        <p className="flex items-center"><Clock className="h-4 w-4 mr-2 text-current" /> {schedule.schedule_time || "Waktu tidak ditentukan"}</p>
                        <p className="flex items-center"><Info className="h-4 w-4 mr-2 text-current" /> {schedule.type.charAt(0).toUpperCase() + schedule.type.slice(1)} untuk {schedule.customer_name}</p>
                        {schedule.address && <p className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-current" /> {schedule.address}</p>}
                        {schedule.notes && <p className="text-xs text-current mt-1">Catatan: {schedule.notes}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianScheduleCalendar;