import { getCarData } from "@/lib/data";
import EditCarForm from "@/ui/dashboard/cars/EditCarForm";

export default async function EditCarPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const result = await getCarData(params.id);
  const car = result.data;
  console.log(car)

  if (!car) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-bold text-2xl mb-2">Edit Cars</h1>
          <p className="text-muted-foreground text-sm">Edit data unit mobil</p>
        </div>
        <div className="bg-red-500/10 border border-red-500 text-red-600 px-4 py-3 rounded-lg">
          Data unit mobil tidak ditemukan
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-2xl mb-2">Edit Car</h1>
        <p className="text-muted-foreground text-sm">Edit data unit mobil</p>
      </div>

      <div className="bg-card p-4 md:p-6 rounded-2xl border border-border max-w-2xl">
        <EditCarForm car={car} />
      </div>
    </div>
  );
}
