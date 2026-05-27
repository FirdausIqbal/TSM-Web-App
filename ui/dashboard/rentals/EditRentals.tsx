"use client";

import { editRental } from "@/actions/actions";
import type { State } from "@/app/types/definitions";
import { calculateDays, formatCurrency } from "@/lib/utils";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useActionState, useMemo, useState } from "react";

// =====================================
// TYPES
// =====================================

type RentalFormData = {
  id: string;
  carId: string;
  carName: string;
  carPrice: number;
  totalPrice: number;
  startDate: Date;
  endDate: Date;
};

// =====================================
// MAIN COMPONENT
// =====================================

export default function EditRentals({
  rentalData,
}: {
  rentalData: RentalFormData;
}) {
  // =====================================
  // SERVER ACTION STATE
  // =====================================
  
  const initialstate: State = { success: null, message: null }
  const editRentalWithId = editRental.bind(null, rentalData.id);
  const [state, formAction, isPending] = useActionState(editRentalWithId, initialstate);

  // =====================================
  // FORM STATE (untuk real-time summary update)
  // =====================================

  const [formData, setFormData] = useState({
    startDate: rentalData.startDate
      ? new Date(rentalData.startDate).toISOString().split("T")[0]
      : "",
    endDate: rentalData.endDate
      ? new Date(rentalData.endDate).toISOString().split("T")[0]
      : "",
  });

  // =====================================
  // CALCULATIONS
  // =====================================

  const totalDays = useMemo(() => {
    return calculateDays(formData.startDate, formData.endDate);
  }, [formData.startDate, formData.endDate]);

  const calculatedPrice = useMemo(() => {
    return rentalData.carPrice * totalDays;
  }, [rentalData.carPrice, totalDays]);

  // =====================================
  // EFFECTS
  // =====================================

  useEffect(() => {
    if (state?.success) {
      redirect("/dashboard/rentals");
    }
  }, [state?.success]);

  // =====================================
  // HANDLERS
  // =====================================

  function handleInputChange(field: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-6 rounded-2xl">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ===================================== */}
        {/* HEADER */}
        {/* ===================================== */}

        <div>
          <h1 className="text-3xl font-bold">Edit Rental</h1>

          <p className="text-gray-500 mt-1">Ubah data transaksi rental</p>
        </div>

        {/* ===================================== */}
        {/* MAIN CONTENT */}
        {/* ===================================== */}

        <div className="grid xl:grid-cols-[1fr_350px] gap-6 items-start">
          {/* ===================================== */}
          {/* FORM */}
          {/* ===================================== */}

          <form
            action={formAction}
            className="bg-white border rounded-2xl p-6 space-y-6"
          >
            {/* Hidden inputs untuk data yang tidak bisa diubah user */}
            <input type="hidden" name="carId" value={rentalData.carId} />
            <input type="hidden" name="totalPrice" value={calculatedPrice.toString()} />

            {/* Error Message */}
            {state?.success === false && state?.message && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                ⚠️ {state.message}
              </div>
            )}

            {/* ===================================== */}
            {/* TANGGAL SECTION */}
            {/* ===================================== */}

            <section className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold">Tanggal Rental</h2>

                <p className="text-sm text-gray-500 mt-1">
                  Ubah tanggal keberangkatan dan kembali
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <InputField
                  label="Tanggal Berangkat"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={(value) =>
                    handleInputChange("startDate", value)
                  }
                />

                <InputField
                  label="Tanggal Kembali"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={(value) => handleInputChange("endDate", value)}
                />
              </div>
            </section>

            {/* ===================================== */}
            {/* PRICE SECTION */}
            {/* ===================================== */}

            <section className="space-y-5 border-t pt-6">
              <div>
                <h2 className="text-lg font-semibold">Detail Perhitungan</h2>

                <p className="text-sm text-gray-500 mt-1">
                  Harga dihitung otomatis berdasarkan durasi rental
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Harga per Hari:</span>
                  <span className="font-semibold">{rentalData.carPrice.toLocaleString(
                    "id-ID"
                  )}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Durasi:</span>
                  <span className="font-semibold">{totalDays} hari</span>
                </div>
                <div className="border-t border-blue-200 pt-2 flex items-center justify-between font-semibold">
                  <span>Total Harga:</span>
                  <span className="text-lg text-blue-600">{formatCurrency(calculatedPrice)}</span>
                </div>
              </div>

              <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                ℹ️ Harga akan otomatis diperbarui saat Anda menyimpan
              </p>
            </section>

            {/* ===================================== */}
            {/* SUBMIT BUTTON */}
            {/* ===================================== */}

            <div className="border-t pt-6 flex gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="bg-black text-white px-5 py-3 rounded-xl hover:opacity-90 disabled:opacity-50"
              >
                {isPending ? "Menyimpan..." : "Simpan Perubahan"}
              </button>

              <button
                type="button"
                onClick={() => redirect("/dashboard/rentals")}
                className="border px-5 py-3 rounded-xl hover:bg-gray-50"
              >
                Batal
              </button>
            </div>
          </form>

          {/* ===================================== */}
          {/* SUMMARY DETAIL */}
          {/* ===================================== */}

          <aside className="bg-white border rounded-2xl p-6 sticky top-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold">Ringkasan Detail</h2>

              <p className="text-sm text-gray-500 mt-1">
                Pratinjau perubahan data
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <SummarySection title="Tanggal Rental">
                <SummaryRow
                  label="Dari"
                  value={formData.startDate || "-"}
                />
                <SummaryRow
                  label="Sampai"
                  value={formData.endDate || "-"}
                />
                <SummaryRow
                  label="Durasi"
                  value={totalDays > 0 ? `${totalDays} hari` : "-"}
                />
              </SummarySection>

              <div className="border-t pt-4"></div>

              <SummarySection title="Data Mobil">
                <SummaryRow
                  label="Mobil"
                  value={rentalData.carName}
                />
                <SummaryRow
                  label="Harga/Hari"
                  value={formatCurrency(rentalData.carPrice)}
                />
              </SummarySection>

              <div className="border-t pt-4 flex items-center justify-between font-semibold text-base">
                <span>Total Harga</span>

                <span>{formatCurrency(calculatedPrice)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// =====================================
// COMPONENTS
// =====================================

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-xl px-4 py-3"
      />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-gray-500">{label}</span>

      <span className="font-medium text-right text-gray-900">{value}</span>
    </div>
  );
}

function SummarySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-900">{title}</h3>

      <div className="space-y-1">{children}</div>
    </div>
  );
}
