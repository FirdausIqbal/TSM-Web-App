// Generic page layout skeleton for header and button
export function PageLayoutSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 bg-muted-foreground/20 rounded w-32 mb-2" />
        <div className="h-4 bg-muted-foreground/10 rounded w-48" />
      </div>
    </div>
  );
}


// Revenue Table Skeleton
export function RevenueTableSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-muted rounded-lg p-4 h-28" />
        ))}
      </div>

      {/* Income Table */}
      <div>
        <div className="h-6 bg-muted-foreground/20 rounded w-20 mb-4" />
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted border-b border-border px-4 py-3 flex gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-muted-foreground/20 rounded flex-1" />
            ))}
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-b border-border px-4 py-3 flex gap-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-4 bg-muted-foreground/10 rounded flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Expense Table */}
      <div>
        <div className="h-6 bg-muted-foreground/20 rounded w-20 mb-4" />
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted border-b border-border px-4 py-3 flex gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-muted-foreground/20 rounded flex-1" />
            ))}
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-b border-border px-4 py-3 flex gap-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-4 bg-muted-foreground/10 rounded flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Rentals Table Skeleton (Customer, Car, Duration, Price, Status, Actions)
export function RentalsTableSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 bg-muted-foreground/20 rounded w-32" />
        <div className="h-10 bg-muted-foreground/20 rounded w-24" />
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-muted border-b border-border px-3 py-3 flex gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-4 bg-muted-foreground/20 rounded flex-1" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b border-border px-3 py-3 flex gap-4">
            {Array.from({ length: 7 }).map((_, j) => (
              <div key={j} className="h-4 bg-muted-foreground/10 rounded flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Cars Table Skeleton (Nama Mobil, Plat Nomor, Harga/Hari, Status, Aksi)
export function CarsTableSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-4 bg-muted-foreground/20 rounded w-40" />
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-muted-foreground/20 rounded w-32" />
          <div className="h-10 bg-muted-foreground/20 rounded w-24" />
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted border-b border-border px-3 py-3 flex gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-muted-foreground/20 rounded flex-1" />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-b border-border px-3 py-3 flex gap-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-4 bg-muted-foreground/10 rounded flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Customers Table Skeleton (Name, NIK, Phone, Address, Created At, Actions)
export function CustomersTableSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header and Button Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 bg-muted-foreground/20 rounded w-32" />
        <div className="h-10 bg-muted-foreground/20 rounded w-24" />
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted border-b border-border px-4 py-3 flex gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-4 bg-muted-foreground/20 rounded flex-1" />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-b border-border px-4 py-3 flex gap-4">
              {Array.from({ length: 7 }).map((_, j) => (
                <div key={j} className="h-4 bg-muted-foreground/10 rounded flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Dashboard Monthly Card Skeleton
export function MonthlyStatsSkeleton() {
  return (
    <div className="w-full bg-gray-200 animate-pulse rounded-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-8">
        <div className="w-[60%] h-[80] bg-gray-300 animate-pulse rounded-2xl"></div>
        <div className="w-[60%] h-[80] bg-gray-300 animate-pulse rounded-2xl"></div>
        <div className="w-[60%] h-[80] bg-gray-300 animate-pulse rounded-2xl"></div>
        <div className="w-[60%] h-[80] bg-gray-300 animate-pulse rounded-2xl"></div>
      </div>
    </div>
  )
}

