import { getExpense, getIncome } from "@/lib/data"
import RevenueTable from "@/ui/dashboard/revenue/RevenueTable"
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function page() {
  const incomeRes = await getIncome() ??  { data: [] };
  const expenseRes = await getExpense() ?? { data: [] };
  
  const income = incomeRes.data || [];
  const expense = expenseRes.data || [];

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
          <RevenueTable income={income} expense={expense} />
        </div>
    </div>
  )
}
