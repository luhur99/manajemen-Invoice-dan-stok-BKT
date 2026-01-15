"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, startOfMonth, endOfMonth, isSameDay, parseISO, startOfDay } from "date-fns";
import { id } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { Schedule, WarehouseCategory as WarehouseCategoryType, Technician } from "@/types/data"; // Import Technician interface
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

  const { data: technicians, isLoading: loadingTechnicians, error: techniciansError } = useQuery<Technician[], Error>({
    queryKey: ["technicians"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technicians")
        .select("*")
        .order("name", { ascending: true });
      if (error) {
        showError("Gagal memuat daftar teknisi.");
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
  const technicianColors: Record<string, string> = useMemo(() => {
    const colors: Record<string, string> = {
      "Belum Ditugaskan": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    };
    technicians?.forEach((tech, index) => {
      // Assign a color based on index or a predefined list
      const colorClasses = [
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
        "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
      ];
      colors[tech.name] = colorClasses[index % colorClasses.length];
    });
    return colors;
  }, [technicians]);

  // Define colors for calendar day markers (using HSL for consistency with shadcn/ui)
  const calendarModifierStyles: Record<string, React.CSSProperties> = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    technicians?.forEach((tech, index) => {
      // Assign a color based on index or a predefined list
      const hslColors = [
        'hsl(217.2 91.2% 59.8%)', // Blue-500
        'hsl(142.1 76.2% 36.3%)', // Green-500
        'hsl(27 87% 53%)',       // Orange-500
        'hsl(262.1 83.3% 57.8%)', // Purple-500
        'hsl(340.5 72.6% 55.5%)', // Pink-500
      ];
      styles[tech.name.toLowerCase().replace(/\s/g, '_')] = { backgroundColor: hslColors[index % hslColors.length], color: 'hsl(0 0% 100%)' };
    });
    return styles;
  }, [technicians]);

  const fetchSchedulesForMonth = useCallback(async (monthDate: Date) => {
    setLoading(true);
    setSelectedDaySchedules([]); // Clear schedules for selected day when month changes
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;

      if (!userId) {
        showError("Pengguna tidak terautentikasi.");
        setLoading(false);
        return;
      }

      const startOfMonthDate = format(startOfMonth(monthDate), "yyyy-MM-dd");
      const endOfMonthDate = format(endOfMonth(monthDate), "yyyy-MM-dd");

      const { data, error } = await supabase
        .from("schedules")
        .select("*")
        .eq("user_id", userId)
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
    const modifiers: Record<string, Date[]> = {};
    technicians?.forEach(tech => {
      modifiers[tech.name.toLowerCase().replace(/\s/g, '_')] = [];
    });

    schedules.forEach(s => {
      const scheduleDate = startOfDay(parseISO(s.schedule_date)); // Normalize to start of day
      const technicianKey = s.technician_name?.toLowerCase().replace(/\s/g, '_');
      if (technicianKey && modifiers[technicianKey]) {
        modifiers[technicianKey].push(scheduleDate);
      }
    });

    // Filter out duplicate dates within each technician's array
    for (const key in modifiers) {
      modifiers[key] = Array.from(new Set(modifiers[key].map(d => d.getTime()))) // Compare by timestamp
        .map(timestamp => new Date(timestamp)); // Convert back to Date
    }

    return modifiers;
  }, [schedules, technicians]);

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

  if (loadingCategories || loading || loadingTechnicians) {
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

  if (categoriesError || techniciansError) {
    return <div className="text-red-500">Error loading data: {categoriesError?.message || techniciansError?.message}</div>;
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
            {technicians?.map((tech, index) => (
              <div key={tech.id} className="flex items-center gap-2">
                <span className={`h-4 w-4 rounded-full ${technicianColors[tech.name]?.split(' ')[0]}`}></span>
                <span>{tech.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-gray-500"></span>
              <span>Belum Ditugaskan</span>
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