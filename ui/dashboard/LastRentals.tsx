export default function LastRentals() {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-md hover:shadow-lg">
      <h2 className="text-xl font-bold text-foreground mb-2">
        Transaksi Terakhir
      </h2>

      <div className="overflow-x-auto">
        <table className="text-sm w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-3 font-semibold text-muted-foreground">
                Customer
              </th>
              <th className="text-left py-3 px-3 font-semibold text-muted-foreground">
                Car
              </th>
              <th className="text-left py-3 px-3 font-semibold text-muted-foreground">
                Duration
              </th>
              <th className="text-left py-3 px-3 font-semibold text-muted-foreground">
                Price
              </th>
              <th className="text-left py-3 px-3 font-semibold text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border hover:bg-secondary/30 transition-colors">
              <td className="py-3 px-3">
                <div>
                  <p className="font-medium text-foreground">
                    rental.customerName
                  </p>
                  <p className="text-xs text-muted-foreground">
                    rental.customerId
                  </p>
                </div>
              </td>
              <td className="py-3 px-3 text-foreground">rental.carType</td>
              <td className="py-3 px-3 text-muted-foreground">
                <div className="text-xs">
                  <p>rental.startDat</p>
                  <p>to rental.endDate.toD</p>
                </div>
              </td>
              <td className="py-3 px-3 font-semibold text-foreground">
                rental.totalPrice
              </td>
              <td className="py-3 px-3">rental.status</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
