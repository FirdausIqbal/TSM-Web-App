export function InvoiceTableSkeleton() {
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
          {Array.from({ length: 10 }).map((_, index) => (
            <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
              {/* Invoice Number */}
              <td className="py-3 px-3 font-semibold text-foreground">
                <div className="h-5 w-24 bg-muted rounded-lg animate-pulse" />
              </td>

              {/* Order ID */}
              <td className="py-3 px-3 text-muted-foreground">
                <div className="h-5 w-20 bg-muted rounded-lg animate-pulse" />
              </td>

              {/* Total */}
              <td className="py-3 px-3 text-foreground">
                <div className="h-5 w-28 bg-muted rounded-lg animate-pulse" />
              </td>

              {/* Status */}
              <td className="py-3 px-3 text-foreground">
                <div className="h-5 w-16 bg-muted rounded-lg animate-pulse" />
              </td>

              {/* Due Date */}
              <td className="py-3 px-3 text-muted-foreground">
                <div className="h-5 w-24 bg-muted rounded-lg animate-pulse" />
              </td>

              {/* Created Date */}
              <td className="py-3 px-3 text-muted-foreground">
                <div className="h-5 w-24 bg-muted rounded-lg animate-pulse" />
              </td>

              {/* Action Button */}
              <td className="py-3 px-3">
                <div className="h-7 w-32 bg-muted rounded-full animate-pulse" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function InvoiceListPageSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-8 w-32 bg-muted rounded-lg animate-pulse mb-2" />
        <div className="h-5 w-64 bg-muted rounded-lg animate-pulse" />
      </div>

      <InvoiceTableSkeleton />
    </div>
  );
}
