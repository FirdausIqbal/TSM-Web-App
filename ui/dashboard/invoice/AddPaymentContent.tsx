import { getInvoiceDetail } from "@/lib/data";
import AddPaymentForm from "@/ui/dashboard/invoice/AddPaymentForm";

interface AddPaymentContentProps {
  id: string;
}

export async function AddPaymentContent({ id }: AddPaymentContentProps) {
  const invoiceResult = await getInvoiceDetail(id);
  const { invoice } = invoiceResult.data;

  return (
    <section className="rounded-3xl border border-border bg-card p-6 print-invoice">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Tambahkan Bukti Pembayaran</h2>
          <p className="text-sm text-muted-foreground">Gunakan form ini untuk menambahkan bukti transfer atau pembayaran tunai.</p>
        </div>
      </div>

      <AddPaymentForm invoiceId={invoice.id} />
    </section>
  );
}
