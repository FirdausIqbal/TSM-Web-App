import CreateCarForm from '@/ui/dashboard/cars/CreateCarForm';

export default function CreateCarsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-2xl mb-2">Tambah Mobil Baru</h1>
        <p className="text-muted-foreground text-sm">Catat unit mobil baru ke dalam armada</p>
      </div>

      <div className="bg-card p-4 md:p-6 rounded-2xl border border-border max-w-2xl">
        <CreateCarForm />
      </div>
    </div>
  );
}