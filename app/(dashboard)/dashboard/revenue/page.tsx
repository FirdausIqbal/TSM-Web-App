import RevenueTable from "@/ui/dashboard/revenue/RevenueTable"
import { RevenueTableSkeleton } from "@/ui/Skeletons";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function page() {
  return (
    <div className="space-y-8">
        <div>
          <h1 className="font-bold text-2xl mb-2">Revenue</h1>
          <p className="text-muted-foreground text-sm">kelola catatan keuangan</p>
        </div>

        <div className="bg-card p-4 md:p-6 rounded-2xl border border-border">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
            <h3 className="font-bold text-xl text-foreground">Catatan Pemasukan dan Pengeluaran</h3>
            <Link href={'/dashboard/revenue/create'} className="rounded-2xl text-sm py-2 px-2 bg-foreground text-secondary flex items-center gap-4 hover:bg-foreground/70 transition-colors duration-200">
              <PlusIcon size={20} /> Buat catatan baru
            </Link>
          </div>
          <Suspense fallback={<RevenueTableSkeleton />}>
            <RevenueTable/>
          </Suspense>
        </div>
    </div>
  )
}