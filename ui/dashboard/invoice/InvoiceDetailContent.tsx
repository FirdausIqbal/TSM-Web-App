import { getInvoiceDetail } from "@/lib/data";
import { calculateDays, formatCurrency, formatDate } from "@/lib/utils";
import type { InvoicePaymentRecord } from "@/types/definitions";

interface InvoiceDetailContentProps {
  id: string;
}

export async function InvoiceDetailContent({ id }: InvoiceDetailContentProps) {
  const invoiceResult = await getInvoiceDetail(id);
  const { invoice, rental } = invoiceResult.data;

  const days = rental ? calculateDays(rental.startDate.toISOString(), rental.endDate.toISOString()) : 0;
  const subtotal = rental ? rental.totalPrice : invoice.totalAmount;
  const penalty = 0;

  return (
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
  );
}
