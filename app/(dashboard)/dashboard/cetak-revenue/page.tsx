"use client";

import { useState } from "react";

export default function CetakDashboardPage() {
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [month, setMonth] = useState<string>(defaultMonth);
  const [loading, setLoading] = useState(false);

  const handleExport = () => {
    setLoading(true);

    const url = `/api/export/revenue?month=${month}`;

    // Trigger download by navigating to API route
    window.location.href = url;

    // reset loading after short delay
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-2xl mb-2">Cetak Revenue</h1>
        <p className="text-muted-foreground text-sm">Pilih bulan untuk mencetak laporan keuangan dashboard TripleDe Sejahtera Mobilindo dalam format excel .xlsx</p>
      </div>

      <div className="bg-card p-6 rounded-2xl border border-border max-w-md">
        <label className="block text-sm font-medium text-foreground mb-2">Bulan</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full p-2 rounded-lg border border-border mb-4"
        />

        <button
          onClick={handleExport}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm text-sm transition-all"
        >
          {loading ? 'Menyusun Laporan Excel...' : 'Cetak / Ekspor (.xlsx)'}
        </button>
      </div>
    </div>
  );
}
