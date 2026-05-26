import AllRentals from "@/ui/dashboard/rentals/AllRentals";

export default function page() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-2xl mb-2">Rentals</h1>
        <p className="text-sm text-muted-foreground">kelola sewa unit</p>
      </div>

      <AllRentals />
    </div>
  );
}
