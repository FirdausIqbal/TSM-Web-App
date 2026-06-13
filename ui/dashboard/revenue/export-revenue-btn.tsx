// components/dashboard/revenue-export-btn.tsx
'use client';

import { useState } from 'react';

export default function RevenueExportButton() {
  const [loading, setLoading] = useState(false);

  const triggerDownload = () => {
    setLoading(true);
    
    // Membuka jalur streaming API route tanpa reload page aplikasi React
    window.location.href = '/api/export/revenue';

    // Matikan efek loading tombol setelah perkiraan file diterima browser
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  };

  return (
    <button
      onClick={triggerDownload}
      disabled={loading}
      className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm text-sm transition-all flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      {loading ? 'Menyusun Laporan Excel...' : 'Ekspor Laporan Bulanan (.xlsx)'}
    </button>
  );
}