import { getInvoiceDetail } from "@/lib/data";
import PrintInvoiceButton from "@/ui/dashboard/invoice/PrintInvoiceButton";

interface InvoiceDetailHeaderProps {
  id: string;
}

export async function InvoiceDetailHeader({ id }: InvoiceDetailHeaderProps) {
  const invoiceResult = await getInvoiceDetail(id);
  const { invoice } = invoiceResult.data;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Detail Invoice</h1>
        <p className="text-sm text-muted-foreground mt-1">Lihat ringkasan status pembayaran dan data penyewa.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <PrintInvoiceButton />
        <div className="rounded-3xl bg-secondary/60 px-4 py-2 text-sm font-semibold text-secondary-foreground">
          Status: {invoice.status}
        </div>
      </div>
    </div>
  );
}
