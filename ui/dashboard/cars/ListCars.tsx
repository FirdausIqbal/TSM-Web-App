import { getCarsWithPagination } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Edit2, PlusIcon } from "lucide-react";
import Link from "next/link";
import { PaginationControls } from "@/ui/dashboard/PaginationControls";
import { DeleteItemButton } from "@/ui/Buttons";
import { deleteCar } from "@/actions/car";
import Image from "next/image";

interface ListCarsProps {
  page?: number;
  pageSize?: number;
}

export default async function ListCars({
  page = 1,
  pageSize = 10,
}: ListCarsProps) {
  const result = await getCarsWithPagination(page, pageSize);

  if (!result.success) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 shadow-md">
        <p className="text-destructive">
          {result.error || "Failed to load cars"}
        </p>
      </div>
    );
  }

  const { data: carsList, pagination } = result;

  return (
    <div className="space-y-4">
      {/* Pagination Controls - Top */}
      {pagination && (
        <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
        />
      )}

      {/* Table Section */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-md hover:shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            Daftar Unit Mobil
          </h2>
          <Link
            href={"/dashboard/cars/create"}
            className="px-4 py-2 text-sm bg-foreground hover:bg-foreground/80 hover:shadow-sm transition-colors text-secondary cursor-pointer rounded-2xl flex items-center gap-2"
          >
            <PlusIcon size={18} /> Tambah Mobil
          </Link>
        </div>

        {carsList && carsList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="text-sm w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 font-semibold text-muted-foreground whitespace-nowrap">
                    Nama Mobil
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-muted-foreground whitespace-nowrap">
                    Plat Nomor
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-muted-foreground whitespace-nowrap">
                    Harga/Hari
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-muted-foreground whitespace-nowrap">
                    Status
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-muted-foreground whitespace-nowrap">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {carsList.map((car) => (
                  <tr
                    key={car.id}
                    className="border-b border-border hover:bg-primary/10 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        {car.imageUrl && (
                          <Image
                            height={50}
                            width={50}
                            src={car.imageUrl}
                            alt={car.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-foreground">
                            {car.name}
                          </p>
                          <p className="text-xs text-muted-foreground hidden md:block">
                            ID: {car.id.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-foreground font-mono">
                      {car.plateNumber}
                    </td>
                    <td className="py-3 px-3 font-semibold text-foreground">
                      {formatCurrency(car.pricePerDay)}/hari
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          car.status === "AVAILABLE"
                            ? "bg-green-500/20 text-green-500"
                            : car.status === "RENTED"
                              ? "bg-blue-500/20 text-blue-500"
                              : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {car.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/cars/edit/${car.id}`}
                          className="p-2 hover:bg-primary/20 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} className="text-primary" />
                        </Link>
                        <DeleteItemButton
                          title="Hapus Mobil"
                          message={`Anda yakin menghapus unit ${car.name}`}
                          id={car.id}
                          onDelete={deleteCar}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Belum ada data mobil</p>
          </div>
        )}
      </div>

      {/* Pagination Controls - Bottom */}
      {pagination && (
        <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          showInputs={true}
        />
      )}
    </div>
  );
}
