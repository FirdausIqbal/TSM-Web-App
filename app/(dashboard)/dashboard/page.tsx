import LastRentals from "@/ui/dashboard/LastRentals";
import MonthlyStats from "@/ui/dashboard/MonthlyStats";
import RentalCalendar from "@/ui/RentCalendar";

export default async function page() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-2xl mb-2">
          Dashboard Triplede Sejahtera Mobilindo
        </h1>
        <p className="text-sm text-muted-foreground">welcome back, ADMIN</p>
      </div>

      {/* Monthly Stats */}
      <MonthlyStats />

      {/* Rental Calendar */}
      <RentalCalendar />

      {/* Recent Rentals */}
      <LastRentals />
    </div>
  );
}