import Link from "next/link";
import { getInvoiceList } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { InvoiceListItem } from "@/types/definitions";

interface InvoiceTableProps {
  page?: number;
  pageSize?: number;
}

export default async function InvoiceTable({ page = 1, pageSize = 50 }: InvoiceTableProps) {
  const invoiceResponse = await getInvoiceList(page, pageSize);
  const invoices: InvoiceListItem[] = invoiceResponse.data ?? [];

  return (
    <div className="rounded-3xl border border-border bg-card p-6 overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="py-3 px-3">Invoice</th>
            <th className="py-3 px-3">Order ID</th>
            <th className="py-3 px-3">Total</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-3">Due Date</th>
            <th className="py-3 px-3">Dibuat</th>
            <th className="py-3 px-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-3 px-3 font-semibold text-foreground">{invoice.invoiceNumber}</td>
                <td className="py-3 px-3 text-muted-foreground">{invoice.orderId}</td>
                <td className="py-3 px-3 text-foreground">{formatCurrency(invoice.totalAmount)}</td>
                <td className="py-3 px-3 text-foreground">{invoice.status}</td>
                <td className="py-3 px-3 text-muted-foreground">{formatDate(invoice.dueDate)}</td>
                <td className="py-3 px-3 text-muted-foreground">{formatDate(invoice.createdAt)}</td>
                <td className="py-3 px-3">
                  <Link href={`/dashboard/invoice/${invoice.id}`} className="rounded-full bg-foreground px-3 py-1 text-white text-xs font-semibold hover:bg-foreground/90 transition">
                    Lihat Invoice
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="py-8 text-center text-muted-foreground">Belum ada invoice tersedia.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
