import AddRentals from "@/ui/dashboard/rentals/AddRentals";

export default function page() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-2xl font-bold mb-2">Tambah Booking</h1>
            <p className="text-sm text-muted-foreground">Buat catatan booking unit</p>
        </div>

        <AddRentals />
    </div>
  )
}
