import { Car, Dock, DollarSign, User2 } from "lucide-react";
import StatCard from "./StatCard";
import { fetchMonthlyData } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default async function MonthlyStats() {
  const { monthlyIncome, totalUnit, totalRental, totalCustomer } = await fetchMonthlyData();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Pendapatan"
        value={formatCurrency(monthlyIncome)}
        description="Pendapatan bulan ini"
        icon={<DollarSign size={28} />}
      />
      <StatCard
        title="Unit"
        value={`${totalUnit}`}
        description="Jumlah unit"
        icon={<Car size={28} />}
      />
      <StatCard
        title="Rentals"
        value={`${totalRental}`}
        description="Jumlah sewa bulan ini"
        icon={<Dock size={28} />}
      />
      <StatCard
        title="Customer"
        value={`${totalCustomer}`}
        description="Jumlah customer aktif"
        icon={<User2 size={28} />}
      />
      {/* buat component card untuk setiap view (pendapatan, rental, mobil tersedia, total unit, bulan ini) */}
    </div>
  );
}
