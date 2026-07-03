export function InvoiceDetailHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="h-9 w-48 bg-muted rounded-lg animate-pulse mb-3" />
        <div className="h-4 w-64 bg-muted rounded-lg animate-pulse" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="h-10 w-32 bg-muted rounded-2xl animate-pulse" />
        <div className="h-8 w-40 bg-muted rounded-3xl animate-pulse" />
      </div>
    </div>
  );
}

export function InvoiceDetailSectionSkeleton() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <div className="h-4 w-24 bg-muted rounded-lg animate-pulse mb-2" />
          <div className="h-6 w-32 bg-muted rounded-lg animate-pulse" />
        </div>
        <div className="text-right">
          <div className="h-4 w-20 bg-muted rounded-lg animate-pulse mb-2" />
          <div className="h-6 w-32 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Grid of info boxes */}
      <div className="grid gap-4 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-3xl border border-border bg-background p-4">
            <div className="h-4 w-28 bg-muted rounded-lg animate-pulse mb-3" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-4 w-40 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary section */}
      <div className="mt-6 rounded-3xl border border-border bg-background p-4">
        <div className="h-4 w-24 bg-muted rounded-lg animate-pulse mb-3" />
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-16 bg-muted rounded-lg animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PaymentStatusSectionSkeleton() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <div className="h-6 w-32 bg-muted rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-48 bg-muted rounded-lg animate-pulse" />
        </div>
        <div className="h-8 w-40 bg-muted rounded-full animate-pulse" />
      </div>

      <div className="rounded-3xl border border-border bg-background p-4 mb-6">
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-16 bg-muted rounded-lg animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Payment table */}
      <div className="overflow-x-auto rounded-3xl border border-border bg-card p-4">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs">
              {[1, 2, 3, 4, 5].map((i) => (
                <th key={i} className="py-3 px-3">
                  <div className="h-4 w-16 bg-muted rounded-lg animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((row) => (
              <tr key={row} className="border-t border-border">
                {[1, 2, 3, 4, 5].map((col) => (
                  <td key={col} className="py-3 px-3">
                    <div className="h-4 w-20 bg-muted rounded-lg animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function AddPaymentFormSkeleton() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-6 w-40 bg-muted rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-80 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="grid gap-4">
        {/* 3 column input fields */}
        <div className="grid gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-4 w-24 bg-muted rounded-lg animate-pulse mb-2" />
              <div className="h-10 w-full bg-muted rounded-2xl animate-pulse" />
            </div>
          ))}
        </div>

        {/* Full width input */}
        <div>
          <div className="h-4 w-32 bg-muted rounded-lg animate-pulse mb-2" />
          <div className="h-10 w-full bg-muted rounded-2xl animate-pulse" />
        </div>

        {/* Submit button */}
        <div className="h-11 w-56 bg-muted rounded-3xl animate-pulse" />
      </div>
    </section>
  );
}

export function InvoiceDetailPageSkeleton() {
  return (
    <div className="space-y-8 printable-area">
      <InvoiceDetailHeaderSkeleton />

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <InvoiceDetailSectionSkeleton />
        <PaymentStatusSectionSkeleton />
      </div>

      <AddPaymentFormSkeleton />
    </div>
  );
}
