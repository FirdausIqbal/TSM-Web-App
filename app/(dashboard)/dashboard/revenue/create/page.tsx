import CreateCashflowForm from "@/ui/dashboard/revenue/CreateCashflowForm";

export default function CreateCashflowPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-2xl mb-2">Tambah Catatan Keuangan</h1>
        <p className="text-muted-foreground text-sm">Catat data keuangan baru (pemasukan atau pengeluaran)</p>
      </div>

      <div className="bg-card p-4 md:p-6 rounded-2xl border border-border max-w-2xl">
        <CreateCashflowForm />
      </div>
    </div>
  );
}
