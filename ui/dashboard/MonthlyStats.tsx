import { Car, Dock, DollarSign, User2 } from "lucide-react";
import StatCard from "./StatCard";

export default function MonthlyStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Pendapatan"
        value="Rp. 500.000"
        description="Pendapatan bulan ini"
        icon={<DollarSign size={28} />}
      />
      <StatCard
        title="Unit"
        value="3"
        description="Jumlah unit"
        icon={<Car size={28} />}
      />
      <StatCard
        title="Rentals"
        value="12"
        description="Jumlah sewa bulan ini"
        icon={<Dock size={28} />}
      />
      <StatCard
        title="Customer"
        value="1"
        description="Jumlah customer aktif"
        icon={<User2 size={28} />}
      />
      {/* buat component card untuk setiap view (pendapatan, rental, mobil tersedia, total unit, bulan ini) */}
    </div>
  );
}
