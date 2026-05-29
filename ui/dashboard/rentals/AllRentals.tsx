import { deleteRental } from "@/actions/actions";
import { getAllRentals } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DeleteItemButton, StatusRentalButton } from "@/ui/Buttons";
import { Edit, PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function AllRentals() {
  const rentals = await getAllRentals();
  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-md hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground mb-2">Booked Unit</h2>
        <Link
          href={"/dashboard/rentals/add-rental"}
          className="px-2 py-2 text-sm bg-foreground hover:bg-foreground/80 hover:shadow-sm transition-colors text-secondary cursor-pointer rounded-2xl flex items-center gap-4"
        >
          <PlusIcon size={20} /> Booking
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="text-sm w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-3 font-semibold text-muted-foreground whitespace-nowrap">
                Customer
              </th>
              <th className="text-left py-3 px-3 font-semibold text-muted-foreground whitespace-nowrap">
                Car
              </th>
              <th className="text-left py-3 px-3 font-semibold text-muted-foreground whitespace-nowrap">
                Duration
              </th>
              <th className="text-left py-3 px-3 font-semibold text-muted-foreground whitespace-nowrap">
                Price
              </th>
              <th className="text-left py-3 px-3 font-semibold text-muted-foreground whitespace-nowrap">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {rentals.data && rentals.data.length > 0 ? (
              rentals.data?.map((rental) => (
                <tr
                  key={rental.id}
                  className="border-b border-border hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3">
                    <div>
                      <p className="font-medium text-foreground">
                        {rental.customerName}
                      </p>
                      <p className="text-xs text-muted-foreground hidden md:block">
                        {rental.customerId}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-foreground">{rental.carType}</td>
                  <td className="py-3 px-3 text-muted-foreground">
                    <div className="text-xs">
                      <p>{formatDate(rental.startDate)}</p>
                      <p>to {formatDate(rental.endDate)}</p>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-foreground">
                    {formatCurrency(rental.totalPrice)}
                  </td>
                  <td className="py-3 px-3">
                    <StatusRentalButton id={rental.id} currStatus={rental.status} />
                  </td>
                  <td className="p-3">
                    <DeleteItemButton
                      title="Hapus Rental"
                      message="Apakah anda yakin menghapus rental ini ?"
                      id={rental.id}
                      onDelete={deleteRental}
                    />
                  </td>
                  <td className="p-3">
                    <Link href={`/dashboard/rentals/edit/${rental.id}`}>
                      <div className="bg-blue-500 rounded-4xl p-2 text-white flex items-center justify-center">
                          <Edit size={20}/>
                      </div>
                    </Link>
                  </td>
                </tr>
              ))

            ) : (
              <tr>
                <td colSpan={6} className="py-4 text-muted-foreground text-sm font-semibold">
                  <div className="flex items-center justify-center p-4 rounded-2xl border border-border">Belum Ada Catatan</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
