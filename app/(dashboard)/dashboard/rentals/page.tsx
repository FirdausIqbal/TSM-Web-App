import { getRentalCount } from "@/lib/data";
import { PaginationControls } from "@/ui/dashboard/PaginationControls";
import AllRentals from "@/ui/dashboard/rentals/AllRentals";
import { RentalsTableSkeleton } from "@/ui/Skeletons";
import { Suspense } from "react";

export default async function page(props: { searchParams: Promise<{page: number, pageSize: number}>}) {
  const [params, totalItems] = await Promise.all([props.searchParams, getRentalCount()]) // Kalau tambah fitur search ubah jadi berdasarkan query search 
  const page = Number(params?.page) || 1;
  const pageSize = Number(params?.pageSize) || 10;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-2xl mb-2">Rentals</h1>
        <p className="text-sm text-muted-foreground">kelola sewa unit</p>
      </div>

      <PaginationControls currentPage={page} totalPages={totalPages} totalItems={totalItems} pageSize={pageSize} showInputs={true} />

      <Suspense fallback={<RentalsTableSkeleton />}>
        <AllRentals page={page} pageSize={pageSize} />
      </Suspense>
    </div>
  );
}
