import { Suspense } from "react";
import InvoiceTable from "@/ui/dashboard/invoice/InvoiceTable";
import { InvoiceListPageSkeleton } from "@/ui/dashboard/invoice/InvoiceSkeleton";

export const dynamic = "force-dynamic";

export default function InvoiceListPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-2xl mb-2">Invoice</h1>
        <p className="text-muted-foreground text-sm">Kelola tagihan dan status pembayaran pelanggan.</p>
      </div>

      <Suspense fallback={<InvoiceListPageSkeleton />}>
        <InvoiceTable page={1} pageSize={50} />
      </Suspense>
    </div>
  );
}
