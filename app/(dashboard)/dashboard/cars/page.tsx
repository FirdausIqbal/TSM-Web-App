import ListCars from "@/ui/dashboard/cars/ListCars";
import { Suspense } from "react";

interface CarsPageProps {
  searchParams: Promise<{ page?: string; pageSize?: string }>;
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const pageSize = params.pageSize ? parseInt(params.pageSize, 10) : 10;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-2xl mb-2">Cars</h1>
        <p className="text-muted-foreground text-sm">kelola data unit mobil</p>
      </div>

      <Suspense fallback={<CarsLoadingFallback />}>
        <ListCars page={page} pageSize={pageSize} />
      </Suspense>
    </div>
  );
}

function CarsLoadingFallback() {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-md">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-1/4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
