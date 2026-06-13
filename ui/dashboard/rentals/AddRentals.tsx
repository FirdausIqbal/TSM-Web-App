"use client";

import { addRental } from "@/actions/rental";
import { getAllCustomers, getAvailableCars } from "@/lib/data";
import { calculateDays, formatCurrency } from "@/lib/utils";
import { redirect } from "next/navigation";
import { useMemo, useState } from "react";

// =====================================
// TYPES
// =====================================

type Car = {
  id: string;
  name: string;
  plateNumber: string;
  pricePerDay: number;
  imageUrl: string | null;
};

type Customer = {
  id: string;
  name: string;
  nik: string;
  phone: string;
  address: string | null;
};

// =====================================
// MAIN PAGE
// =====================================

export default function RentalCreatePage() {
  // =====================================
  // STEP STATE
  // =====================================

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // =====================================
  // RENTAL STATE
  // =====================================

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [availableCars, setAvailableCars] = useState<Car[]>([]);

  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // =====================================
  // CUSTOMER STATE
  // =====================================

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const [customers, setCustomers] = useState<Customer[]>([])

  const [customerData, setCustomerData] = useState({
    customerId: "",
    name: "",
    nik: "",
    phone: "",
    address: "",
  });

  // =====================================
  // CALCULATIONS
  // =====================================

  const totalDays = useMemo(() => {
    return calculateDays(startDate, endDate);
  }, [startDate, endDate]);

  const totalPrice = useMemo(() => {
    if (!selectedCar) return 0;

    return selectedCar.pricePerDay * totalDays;
  }, [selectedCar, totalDays]);

  // =====================================
  // ACTIONS
  // =====================================

  async function handleCheckAvailability() {
    setIsLoading(true);
    if (!startDate || !endDate) {
      alert("Tanggal wajib diisi");
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      alert("Tanggal selesai harus lebih besar");
      return;
    }

    const cars = await getAvailableCars(new Date(startDate), new Date(endDate));
    const customer = await getAllCustomers();
    setAvailableCars(cars.data);
    setCustomers(customer.data ?? []);
    setStep(2);
    setIsLoading(false);
  }

  function handleSelectCar(car: Car) {
    setSelectedCar(car);
    setStep(3);
  }

  function handleSelectCustomer(customer: Customer) {
    setCustomerData({
      customerId: customer.id,
      name: customer.name,
      nik: customer.nik,
      phone: customer.phone,
      address: customer.address || "",
    });

    setIsCustomerModalOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true)

    if (!selectedCar) {
      alert("Pilih mobil terlebih dahulu");
      return;
    }

    // =====================================
    // TEMPLATE FORMDATA
    // =====================================

    const formData = new FormData();

    formData.append("startDate", startDate);
    formData.append("endDate", endDate);

    formData.append("carId", selectedCar.id);

    formData.append("customerId", customerData.customerId);
    formData.append("customerName", customerData.name);
    formData.append("nik", customerData.nik);
    formData.append("phone", customerData.phone);
    formData.append("address", customerData.address);

    formData.append("totalPrice", totalPrice.toString());

    const res = await addRental(formData)
    setIsLoading(false);
    if(res?.success){
      redirect("/dashboard/rentals")
    }else{
      alert(`${res.message}`);
    }

  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-6 rounded-2xl">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ===================================== */}
        {/* HEADER */}
        {/* ===================================== */}

        <div>
          <h1 className="text-3xl font-bold">Tambah Rental</h1>

          <p className="text-gray-500 mt-1">Buat transaksi rental baru</p>
        </div>

        {/* ===================================== */}
        {/* STEPPER */}
        {/* ===================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StepCard active={step >= 1} number={1} title="Tanggal" />

          <StepCard active={step >= 2} number={2} title="Pilih Mobil" />

          <StepCard active={step >= 3} number={3} title="Data Penyewa" />
        </div>

        <div className="grid xl:grid-cols-[1fr_350px] gap-6 items-start">
          {/* ===================================== */}
          {/* MAIN CONTENT */}
          {/* ===================================== */}

          <div className="space-y-6">
            {/* ===================================== */}
            {/* STEP 1 */}
            {/* ===================================== */}

            <section className="bg-white border rounded-2xl p-6 space-y-5">
              <div>
                <h2 className="text-xl font-semibold">Pilih Tanggal Rental</h2>

                <p className="text-sm text-gray-500 mt-1">
                  Tentukan tanggal keberangkatan dan kembali
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Tanggal Berangkat
                  </label>

                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tanggal Kembali</label>

                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>
              </div>

              <button
                onClick={handleCheckAvailability}
                disabled={isLoading}
                className="bg-black text-white px-5 py-3 rounded-xl hover:opacity-90"
              >
                {isLoading ? "Loading..." : "Cek Unit Tersedia"}
              </button>
            </section>

            {/* ===================================== */}
            {/* STEP 2 */}
            {/* ===================================== */}

            {step >= 2 && (
              <section className="bg-white border rounded-2xl p-6 space-y-5">
                <div>
                  <h2 className="text-xl font-semibold">Pilih Unit Mobil</h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Pilih mobil yang tersedia pada tanggal tersebut
                  </p>
                </div>

                <div className="grid md:grid-cols-1 gap-4">
                  {availableCars.map((car) => {
                    const isSelected = selectedCar?.id === car.id;

                    return (
                      <button
                        key={car.id}
                        type="button"
                        onClick={() => handleSelectCar(car)}
                        className={`border rounded-2xl p-2 text-left transition-all ${
                          isSelected
                            ? "border-black bg-black text-white"
                            : "hover:border-black bg-white"
                        }`}
                      >
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold text-sm md:text-lg">
                              {car.name}
                            </h3>

                            <p className="text-sm opacity-70">
                              {car.plateNumber}
                            </p>
                          </div>

                          <div className="font-semibold text-sm md:text-lg">
                            {formatCurrency(car.pricePerDay)} / hari
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ===================================== */}
            {/* STEP 3 */}
            {/* ===================================== */}

            {step >= 3 && (
              <form
                onSubmit={handleSubmit}
                className="bg-white border rounded-2xl p-6 space-y-6"
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-xl font-semibold">Data Penyewa</h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Isi data customer atau pilih customer tersimpan
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCustomerModalOpen(true)}
                    className="border px-4 py-2 rounded-xl hover:bg-gray-50"
                  >
                    Pilih Saved Customer
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <InputField
                    label="Nama"
                    value={customerData.name}
                    onChange={(value) =>
                      setCustomerData((prev) => ({
                        ...prev,
                        name: value,
                      }))
                    }
                  />

                  <InputField
                    label="NIK"
                    value={customerData.nik}
                    onChange={(value) =>
                      setCustomerData((prev) => ({
                        ...prev,
                        nik: value,
                      }))
                    }
                  />

                  <InputField
                    label="No. Telepon"
                    value={customerData.phone}
                    onChange={(value) =>
                      setCustomerData((prev) => ({
                        ...prev,
                        phone: value,
                      }))
                    }
                  />

                  <InputField
                    label="Alamat"
                    value={customerData.address}
                    onChange={(value) =>
                      setCustomerData((prev) => ({
                        ...prev,
                        address: value,
                      }))
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="bg-black text-white px-5 py-3 rounded-xl hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Simpan Rental"}
                </button>
              </form>
            )}
          </div>

          {/* ===================================== */}
          {/* SUMMARY */}
          {/* ===================================== */}

          <aside className="bg-white border rounded-2xl p-6 sticky top-6 space-y-5">
            <div>
              <h2 className="text-xl font-semibold">Ringkasan Rental</h2>

              <p className="text-sm text-gray-500 mt-1">
                Detail transaksi rental
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <SummaryRow
                label="Tanggal"
                value={startDate && endDate ? `${startDate} - ${endDate}` : "-"}
              />

              <SummaryRow
                label="Durasi"
                value={totalDays > 0 ? `${totalDays} hari` : "-"}
              />

              <SummaryRow label="Mobil" value={selectedCar?.name || "-"} />

              <SummaryRow
                label="Harga / Hari"
                value={
                  selectedCar ? formatCurrency(selectedCar.pricePerDay) : "-"
                }
              />
            </div>

            <div className="border-t pt-4 flex items-center justify-between font-semibold text-lg">
              <span>Total</span>

              <span>{totalPrice > 0 ? formatCurrency(totalPrice) : "-"}</span>
            </div>
          </aside>
        </div>
      </div>

      {/* ===================================== */}
      {/* CUSTOMER MODAL */}
      {/* ===================================== */}

      {isCustomerModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl border overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-xl">Saved Customer</h2>

                <p className="text-sm text-gray-500 mt-1">
                  Pilih customer yang sudah tersimpan
                </p>
              </div>

              <button
                onClick={() => setIsCustomerModalOpen(false)}
                className="text-sm border px-3 py-2 rounded-lg"
              >
                Tutup
              </button>
            </div>

            <div className="max-h-125 overflow-y-auto p-5 space-y-3">
              {customers.map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  onClick={() => handleSelectCustomer(customer)}
                  className="w-full border rounded-2xl p-4 text-left hover:border-black transition-all"
                >
                  <div className="space-y-1">
                    <h3 className="font-semibold">{customer.name}</h3>

                    <p className="text-sm text-gray-500">{customer.phone}</p>

                    <p className="text-sm text-gray-500">{customer.address}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================
// COMPONENTS
// =====================================

function StepCard({
  active,
  number,
  title,
}: {
  active: boolean;
  number: number;
  title: string;
}) {
  return (
    <div
      className={`border rounded-2xl p-4 flex items-center gap-3 ${
        active ? "bg-black text-white border-black" : "bg-white"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold ${
          active ? "bg-white text-black" : "bg-gray-100"
        }`}
      >
        {number}
      </div>

      <div>
        <p className="text-sm opacity-70">Step {number}</p>
        <h3 className="font-semibold">{title}</h3>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-xl px-4 py-3"
        required
      />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-gray-500">{label}</span>

      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
