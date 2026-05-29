"use client";

import { Loader2, Banknote, Tag, Calendar, FileText } from "lucide-react";
import { useActionState, useState } from "react";
import { createCashflow } from "@/actions/actions";

interface CreateCashflowFormState {
  message?: string;
}

const EXPENSE_CATEGORIES = [
  "Perawatan Mobil",
  "Biaya Transportasi",
  "Biaya Driver",
  "Biaya Lainnya"
];

const INCOME_CATEGORIES = [
  "Pendapatan Sewa Mobil",
  "Pendapatan Biaya Antar",
  "Pendapatan Komisi",
  "Kas Kecil",
  "Pendapatan Lainnya"
];

export default function CreateCashflowForm() {
  const [state, formAction, pending] = useActionState(createCashflow, null as CreateCashflowFormState | null);
  const [selectedType, setSelectedType] = useState("INCOME");
  
  // Set default date to today
  const today = new Date().toISOString().split('T')[0];
  
  // Get categories based on selected type
  const categories = selectedType === "EXPENSE" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <form action={formAction} className="space-y-5">
      
      {/* Error Message */}
      {state?.message && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          ✕ {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Type Selection */}
        <div>
          <label htmlFor="type" className="text-sm font-medium block mb-2">
            Tipe Transaksi <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Banknote
              className="absolute left-3 top-3.5 text-muted-foreground"
              size={18}
            />
            <select
              id="type"
              name="type"
              required
              disabled={pending}
              defaultValue="INCOME"
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
            >
              <option value="INCOME">Pemasukan (Income)</option>
              <option value="EXPENSE">Pengeluaran (Expense)</option>
            </select>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="text-sm font-medium block mb-2">
            Jumlah <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <p className="absolute left-3 top-3 text-muted-foreground">RP</p>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="1000"
              placeholder="0"
              required
              disabled={pending}
              className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Category Input */}
      <div>
        <label htmlFor="category" className="text-sm font-medium block mb-2">
          Kategori <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Tag
            className="absolute left-3 top-3.5 text-muted-foreground"
            size={18}
          />
          <select
            id="category"
            name="category"
            required
            disabled={pending}
            className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
          >
            <option value="">-- Pilih Kategori --</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date Input */}
      <div>
        <label htmlFor="date" className="text-sm font-medium block mb-2">
          Tanggal <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Calendar
            className="absolute left-3 top-3.5 text-muted-foreground"
            size={18}
          />
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={today}
            required
            disabled={pending}
            className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Notes Input */}
      <div>
        <label htmlFor="notes" className="text-sm font-medium block mb-2">
          Catatan (Opsional)
        </label>
        <div className="relative">
          <FileText
            className="absolute left-3 top-3.5 text-muted-foreground"
            size={18}
          />
          <textarea
            id="notes"
            name="notes"
            placeholder="Tambahkan catatan atau deskripsi..."
            disabled={pending}
            rows={3}
            className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={pending}
        className="w-full cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {pending ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Menyimpan...
          </>
        ) : (
          "Simpan Catatan Keuangan"
        )}
      </button>
    </form>
  );
}
