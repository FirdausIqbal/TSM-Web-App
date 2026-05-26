"use client";

import { useState, useMemo } from "react";

type Rental = {
  id: string;
  carName: string;
  startDate: string;
  endDate: string;
};

export default function RentalCalendar({ rentals }: { rentals: Rental[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  // 🧠 jumlah hari & hari pertama
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // 🔥 mapping: tanggal -> rental aktif
  const rentalMap = useMemo(() => {
    const map: Record<string, Rental[]> = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);

      const active = rentals.filter((r) => {
        const start = new Date(r.startDate);
        const end = new Date(r.endDate);
        return date >= start && date <= end;
      });

      if (active.length > 0) {
        const key = `${year}-${month + 1}-${day}`;
        map[key] = active;
      }
    }

    return map;
  }, [rentals, year, month]);

  const changeMonth = (delta: number) => {
    setCurrentDate(new Date(year, month + delta, 1));
  };

  return (
    <div className="p-4 border border-border rounded-lg">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <button onClick={() => changeMonth(-1)}>←</button>
        <h2>
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button onClick={() => changeMonth(1)}>→</button>
      </div>

      {/* HARI */}
      <div className="grid grid-cols-7 gap-2 text-center text-sm font-bold">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-7 gap-2 mt-2">
        {/* kosong */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={i} />
        ))}

        {/* tanggal */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const key = `${year}-${month + 1}-${day}`;
          const events = rentalMap[key] || [];

          return (
            <div
              key={day}
              className="border rounded p-2 h-24 text-xs flex flex-col"
            >
              <div className="font-bold">{day}</div>

              {/* events */}
              <div className="mt-1 space-y-1 overflow-hidden">
                {events.slice(0, 2).map((e) => (
                  <div
                    key={e.id}
                    className="bg-blue-500 text-white px-1 rounded truncate"
                  >
                    {e.carName}
                  </div>
                ))}

                {events.length > 2 && (
                  <div className="text-gray-500 text-[10px]">
                    +{events.length - 2}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}