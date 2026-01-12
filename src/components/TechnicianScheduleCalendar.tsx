"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, startOfMonth, endOfMonth, isSameDay, parseISO } from "date-fns";
import { id } from "date-fns/locale"; // Import Indonesian locale
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { Schedule } from "@/types/data";
import { Loader2, CalendarDays, User, Clock, MapPin, Info } from "lucide-react";

interface TechnicianScheduleCalendarProps {
  // No props needed for now, it will manage its own state and data fetching
}

const TechnicianScheduleCalendar: React.FC<TechnicianScheduleCalendarProps> = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDaySchedules, setSelectedDaySchedules] = useState<Schedule[]>([]);

  // Define colors for different technicians
  const technicianColors: Record<string, string> = {
    "Jubed": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    "Daffa": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    "Teknisi Lain": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
    "Belum Ditugaskan": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  };

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
      const daySchedules = schedules.filter(s => isSameDay(parseISO(s.schedule_date), date));
      setSelectedDaySchedules(daySchedules);
    }
  }, [date, schedules]);

  const daysWithSchedules = schedules.map(s => parseISO(s.schedule_date));

  const modifiers = {
    hasSchedules: daysWithSchedules,
  };

  const modifiersStyles = {
    hasSchedules: {
      backgroundColor: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
      borderRadius: '0.375rem', // rounded-md
    },
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

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Kalender Jadwal Teknisi</CardTitle>
        <CardDescription>Lihat dan kelola jadwal instalasi/pengiriman teknisi.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDaySelect}
            className="rounded-md border shadow"
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            locale={id} // Set locale to Indonesian
            onMonthChange={(newMonth) => setDate(newMonth)} // Update date state when month changes
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