"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, startOfMonth, endOfMonth, isSameDay, parseISO, startOfDay } from "date-fns";
import { id } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { Schedule, WarehouseCategory as WarehouseCategoryType, Technician, ScheduleProductCategory } from "@/types/data"; // Import Technician and ScheduleProductCategory
import { Loader2, CalendarDays, User, Clock, MapPin, Info, AlertTriangle, Package } from "lucide-react"; // Added Package
import { useQuery } from "@tanstack/react-query"; // Import useQuery
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components

interface TechnicianScheduleCalendarProps {
  // No props needed for now, it will manage its own state and data fetching
}

const TechnicianScheduleCalendar: React.FC<TechnicianScheduleCalendarProps> = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Define a palette of colors for technicians
  const colorPalette = useMemo(() => [
    { bgClass: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100", hsl: 'hsl(217.2 91.2% 59.8%)' }, // Blue
    { bgClass: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100", hsl: 'hsl(142.1 76.2% 36.3%)' }, // Green
    { bgClass: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100", hsl: 'hsl(27 87% 53%)' },   // Orange
    { bgClass: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100", hsl: 'hsl(262.1 83.3% 57.8%)' }, // Purple
    { bgClass: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100", hsl: 'hsl(340.5 72.6% 55.5%)' }, // Pink
    { bgClass: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100", hsl: 'hsl(230 69% 61%)' }, // Indigo
    { bgClass: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100", hsl: 'hsl(174 72% 48%)' }, // Teal
  ], []);

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

  // Dynamically assign colors to technicians
  const technicianColorMap = useMemo(() => {
    const map: Record<string, { bgClass: string; hsl: string }> = {
      "Belum Ditugaskan": { bgClass: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200", hsl: 'hsl(210 40% 96.1%)' },
    };
    technicians?.forEach((tech, index) => {
      const color = colorPalette[index % colorPalette.length];
      map[tech.name] = color;
    });
    return map;
  }, [technicians, colorPalette]);

  const getTechnicianBgClass = useCallback((technicianName: string | null | undefined) => {
    return technicianColorMap[technicianName || "Belum Ditugaskan"]?.bgClass || technicianColorMap["Belum Ditugaskan"].bgClass;
  }, [technicianColorMap]);

  // Define colors for calendar day markers
  const calendarModifierStyles: Record<string, React.CSSProperties> = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    technicians?.forEach((tech) => {
      const key = tech.name.toLowerCase().replace(/\s/g, '_');
      styles[key] = { backgroundColor: technicianColorMap[tech.name]?.hsl || 'hsl(0 0% 100%)', color: 'hsl(0 0% 100%)' };
    });
    return styles;
  }, [technicians, technicianColorMap]);

  const { isLoading: loadingCategories, error: categoriesError } = useQuery<WarehouseCategoryType[], Error>({
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

  const { data: schedules = [], isLoading: loadingSchedules } = useQuery<Schedule[], Error>({
    queryKey: ["schedules", format(currentMonth, "yyyy-MM")],
    queryFn: async () => {
      const startOfMonthDate = format(startOfMonth(currentMonth), "yyyy-MM-dd");
      const endOfMonthDate = format(endOfMonth(currentMonth), "yyyy-MM-dd");

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
      return data as Schedule[];
    },
  });

  const selectedDaySchedules = useMemo(() => {
    if (!date) return [];
    const normalizedSelectedDate = startOfDay(date);
    return schedules.filter(s => isSameDay(startOfDay(parseISO(s.schedule_date)), normalizedSelectedDate));
  }, [date, schedules]);

  const technicianDayModifiers = useMemo(() => {
    const modifiers: Record<string, Date[]> = {};
    technicians?.forEach(tech => {
      modifiers[tech.name.toLowerCase().replace(/\s/g, '_')] = [];
    });

    schedules.forEach(s => {
      const scheduleDate = startOfDay(parseISO(s.schedule_date));
      const technicianKey = s.technician_name?.toLowerCase().replace(/\s/g, '_');
      if (technicianKey && modifiers[technicianKey]) {
        modifiers[technicianKey].push(scheduleDate);
      }
    });

    for (const key in modifiers) {
      modifiers[key] = Array.from(new Set(modifiers[key].map(d => d.getTime())))
        .map(timestamp => new Date(timestamp));
    }

    return modifiers;
  }, [schedules, technicians]);

  const allModifiers = {
    ...technicianDayModifiers,
    selected: date ? [date] : [],
  };

  const groupedSchedules = useMemo(() => {
    return selectedDaySchedules.reduce((acc, schedule) => {
      const technician = schedule.technician_name || "Belum Ditugaskan";
      if (!acc[technician]) {
        acc[technician] = [];
      }
      acc[technician].push(schedule);
      return acc;
    }, {} as Record<string, Schedule[]>);
  }, [selectedDaySchedules]);

  const numberOfDistinctTechniciansToday = Object.keys(groupedSchedules).filter(techName => techName !== "Belum Ditugaskan").length;

  if (loadingCategories || loadingSchedules || loadingTechnicians) {
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
            {technicians?.map((tech) => (
              <div key={tech.id} className="flex items-center gap-2">
                <span className={`h-4 w-4 rounded-full ${getTechnicianBgClass(tech.name).split(' ')[0]}`}></span>
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
            onSelect={setDate}
            className="rounded-md border shadow"
            modifiers={allModifiers}
            modifiersStyles={calendarModifierStyles}
            locale={id}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
          />
        </div>
        <div className="flex-1 lg:max-h-[400px] overflow-y-auto p-4 border rounded-md bg-gray-50 dark:bg-gray-700">
          <h3 className="text-lg font-semibold mb-4">
            Jadwal untuk {date ? format(date, "dd MMMM yyyy", { locale: id }) : "Pilih tanggal"}
          </h3>
          {loadingSchedules ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : selectedDaySchedules.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">Tidak ada jadwal untuk tanggal ini.</p>
          ) : (
            <div className="space-y-4">
              {numberOfDistinctTechniciansToday > 1 && (
                <Alert variant="default" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Perhatian!</AlertTitle>
                  <AlertDescription>
                    Ada {numberOfDistinctTechniciansToday} teknisi berbeda yang dijadwalkan pada tanggal ini. Periksa potensi bentrok.
                  </AlertDescription>
                </Alert>
              )}
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
                      <li key={schedule.id} className={`p-3 rounded-md shadow-sm text-sm ${getTechnicianBgClass(schedule.technician_name)}`}>
                        <p className="flex items-center"><Clock className="h-4 w-4 mr-2 text-current" /> {schedule.schedule_time || "Waktu tidak ditentukan"}</p>
                        <p className="flex items-center"><Info className="h-4 w-4 mr-2 text-current" /> {schedule.type.charAt(0).toUpperCase() + schedule.type.slice(1)} untuk {schedule.customer_name}</p>
                        {schedule.product_category && <p className="flex items-center"><Package className="h-4 w-4 mr-2 text-current" /> Kategori Produk: {schedule.product_category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>} {/* Display product category */}
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