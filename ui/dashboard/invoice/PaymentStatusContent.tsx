import { getInvoiceDetail } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { InvoicePaymentRecord } from "@/types/definitions";
import PaymentActionButtons from "@/ui/dashboard/invoice/PaymentActionButtons";

interface PaymentStatusContentProps {
  id: string;
}

export async function PaymentStatusContent({ id }: PaymentStatusContentProps) {
  const invoiceResult = await getInvoiceDetail(id);
  const { invoice, payments } = invoiceResult.data;

  const verifiedAmount = payments
    .filter((payment: InvoicePaymentRecord) => payment.status === "VERIFIED")
    .reduce((sum, payment: InvoicePaymentRecord) => sum + payment.amountPaid, 0);

  const totalDue = invoice.totalAmount - verifiedAmount;

  return (
    <section className="rounded-3xl border border-border bg-card p-6 print-invoice">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Status Pembayaran</h2>
          <p className="text-sm text-muted-foreground">Riwayat transaksi dan verifikasi.</p>
        </div>
        <div className="rounded-full bg-secondary/70 px-4 py-2 text-sm font-semibold text-secondary-foreground">
          Terkonfirmasi: {formatCurrency(verifiedAmount)}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-background p-4 mb-6">
        <div className="grid gap-3 text-sm text-foreground">
          <div className="flex justify-between">
            <span>Tagihan</span>
            <span>{formatCurrency(invoice.totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Dibayar</span>
            <span>{formatCurrency(verifiedAmount)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Sisa</span>
            <span>{formatCurrency(Math.max(0, totalDue))}</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-border bg-card p-4">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-3 px-3">Metode</th>
              <th className="py-3 px-3">Jumlah</th>
              <th className="py-3 px-3">Tanggal</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment.id} className="border-t border-border">
                  <td className="py-3 px-3 text-foreground">{payment.paymentMethod}</td>
                  <td className="py-3 px-3 text-foreground">{formatCurrency(payment.amountPaid)}</td>
                  <td className="py-3 px-3 text-muted-foreground">{formatDate(payment.paymentDate)}</td>
                  <td className="py-3 px-3 text-foreground">{payment.status}</td>
                  <td className="py-3 px-3 space-x-2 no-print">
                    <PaymentActionButtons payment={payment} invoiceId={invoice.id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-6 px-3 text-center text-sm text-muted-foreground">
                  Belum ada catatan pembayaran.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
