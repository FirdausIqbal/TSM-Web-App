import { getInvoiceDetail } from "@/lib/data";
import { calculateDays, formatCurrency, formatDate } from "@/lib/utils";
import type { InvoicePaymentRecord } from "@/types/definitions";
import PrintInvoiceButton from "@/ui/dashboard/invoice/PrintInvoiceButton";
import AddPaymentForm from "@/ui/dashboard/invoice/AddPaymentForm";
import PaymentActionButtons from "@/ui/dashboard/invoice/PaymentActionButtons";


export default async function InvoiceDetailPage(props: { params: Promise<{ id: string }> }) {
  const invoiceId = await props.params;
  const invoiceResult = await getInvoiceDetail(invoiceId.id);

  const { invoice, payments, rental } = invoiceResult.data;
  const verifiedAmount = payments
    .filter((payment : InvoicePaymentRecord) => payment.status === "VERIFIED")
    .reduce((sum, payment : InvoicePaymentRecord) => sum + payment.amountPaid, 0);
  const days = rental ? calculateDays(rental.startDate.toISOString(), rental.endDate.toISOString()) : 0;
  const subtotal = rental ? rental.totalPrice : invoice.totalAmount;
  const penalty = 0;
  const totalDue = invoice.totalAmount - verifiedAmount;

  return (
    <div className="space-y-8 printable-area">
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

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <section className="rounded-3xl border border-border bg-card p-6 print-invoice">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div>
              <p className="text-sm text-muted-foreground">Invoice Number</p>
              <p className="text-xl font-semibold text-foreground">{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Dibuat pada</p>
              <p className="font-semibold text-foreground">{formatDate(invoice.createdAt)}</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-background p-4">
              <p className="text-sm font-semibold text-foreground mb-3">Data Penyewa</p>
              {rental ? (
                <div className="space-y-2 text-sm text-foreground">
                  <p className="font-medium">{rental.customerName}</p>
                  <p>Telp: {rental.customerPhone}</p>
                  <p>KTP/SIM: {rental.customerNik}</p>
                  <p>Tanggal Sewa: {formatDate(rental.startDate)} - {formatDate(rental.endDate)}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Data sewa tidak tersedia.</p>
              )}
            </div>

            <div className="rounded-3xl border border-border bg-background p-4">
              <p className="text-sm font-semibold text-foreground mb-3">Detail Mobil</p>
              {rental ? (
                <div className="space-y-2 text-sm text-foreground">
                  <p className="font-medium">{rental.carName}</p>
                  <p>Plat Nomor: {rental.plateNumber}</p>
                  <p>Harga per hari: {formatCurrency(rental.pricePerDay)}</p>
                  <p>Durasi: {days} hari</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Informasi mobil tidak tersedia.</p>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-border bg-background p-4">
            <p className="text-sm font-semibold text-foreground mb-3">Ringkasan Biaya</p>
            <div className="grid gap-3 text-sm text-foreground">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Denda</span>
                <span>{formatCurrency(penalty)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-4 font-semibold">
                <span>Total Biaya</span>
                <span>{formatCurrency(invoice.totalAmount)}</span>
              </div>
            </div>
          </div>
        </section>

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
      </div>

      <section className="rounded-3xl border border-border bg-card p-6 print-invoice">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Tambahkan Bukti Pembayaran</h2>
            <p className="text-sm text-muted-foreground">Gunakan form ini untuk menambahkan bukti transfer atau pembayaran tunai.</p>
          </div>
        </div>

        <AddPaymentForm invoiceId={invoice.id} />
      </section>
    </div>
  );
}
