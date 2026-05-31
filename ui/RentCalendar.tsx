"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import { getRentalsByMonth } from "@/lib/data";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { DailyCalendarData, CalendarRentalItem } from "@/app/types/definitions";

export default function RentalCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<DailyCalendarData[]>([]);
  const [isPending, startTransition] = useTransition();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  // Fetch data saat component mount atau bulan berubah
  useEffect(() => {
    startTransition(async () => {
      const result = await getRentalsByMonth(year, month + 1);
      if (result.success && Array.isArray(result.data)) {
        setCalendarData(result.data as DailyCalendarData[]);
      } else {
        setCalendarData([]);
      }
    });
  }, [year, month]);

  // 🧠 jumlah hari & hari pertama
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // 🔥 mapping: tanggal -> rental aktif
  const rentalMap = useMemo(() => {
    const map: Record<string, CalendarRentalItem[]> = {};

    // calendarData adalah DailyCalendarData[], iterate setiap hari
    for (const dailyData of calendarData) {
      const dateStr = dailyData.date; // Sudah dalam format YYYY-MM-DD
      
      // dari setiap hari, ambil rentals dan push ke map
      if (dailyData.rentals && dailyData.rentals.length > 0) {
        if (!map[dateStr]) {
          map[dateStr] = [];
        }
        map[dateStr].push(...dailyData.rentals);
      }
    }

    return map;
  }, [calendarData]);

  // Fetch data saat bulan berubah
  const handleMonthChange = (delta: number) => {
    const newDate = new Date(year, month + delta, 1);
    setCurrentDate(newDate);
    // useEffect akan trigger fetch otomatis
  };

  // Handle month selector change
  const handleMonthSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = parseInt(e.target.value, 10);
    const newDate = new Date(year, selectedMonth, 1);
    setCurrentDate(newDate);
    // useEffect akan trigger fetch otomatis
  };

  // Handle year change
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = parseInt(e.target.value, 10);
    const newDate = new Date(newYear, month, 1);
    setCurrentDate(newDate);
    // useEffect akan trigger fetch otomatis
  };

  return (
    <div className="p-4 border border-border rounded-lg bg-card">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {/* Previous Month Button */}
          <button
            onClick={() => handleMonthChange(-1)}
            disabled={isPending}
            className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Bulan Sebelumnya"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Month Selector */}
          <select
            value={month}
            onChange={handleMonthSelect}
            disabled={isPending}
            className="px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            {[
              "Januari",
              "Februari",
              "Maret",
              "April",
              "Mei",
              "Juni",
              "Juli",
              "Agustus",
              "September",
              "Oktober",
              "November",
              "Desember",
            ].map((monthName, idx) => (
              <option key={idx} value={idx}>
                {monthName}
              </option>
            ))}
          </select>

          {/* Year Selector */}
          <input
            type="number"
            value={year}
            onChange={handleYearChange}
            disabled={isPending}
            min="2000"
            max="2100"
            className="w-20 px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />

          {/* Next Month Button */}
          <button
            onClick={() => handleMonthChange(1)}
            disabled={isPending}
            className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Bulan Berikutnya"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Loading Indicator */}
        {isPending && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        )}
      </div>

      {/* Current Month Display */}
      <h2 className="text-lg font-semibold mb-4">
        {currentDate.toLocaleString("id-ID", {
          month: "long",
          year: "numeric",
        })}
      </h2>

      {/* HARI */}
      <div className="grid grid-cols-7 gap-2 text-center text-sm font-bold mb-4">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
          <div key={d} className="text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-7 gap-2">
        {/* kosong */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-muted/30 rounded" />
        ))}

        {/* tanggal */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const events = rentalMap[dateStr] || [];

          return (
            <div
              key={day}
              className={`rounded-lg p-2 min-h-24 text-xs flex flex-col border transition-colors ${
                events.length > 0
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/30"
              }`}
            >
              <div className="font-bold text-foreground">{day}</div>

              {/* events */}
              <div className="mt-1 space-y-1 overflow-hidden">
                {events.slice(0, 2).map((e) => (
                  <div
                    key={e.rentalId}
                    className={`text-white px-1 py-0.5 rounded truncate text-xs font-medium ${
                      e.status === "ON_GOING"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                    }`}
                    title={`${e.carName} - ${e.customerName}`}
                  >
                    {e.carName}
                  </div>
                ))}

                {events.length > 2 && (
                  <div className="text-xs text-muted-foreground px-1">
                    +{events.length - 2} lagi
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info */}
      {calendarData.length === 0 && !isPending && (
        <div className="mt-6 text-center text-muted-foreground text-sm">
          Tidak ada rental bulan ini
        </div>
      )}
    </div>
  );
}