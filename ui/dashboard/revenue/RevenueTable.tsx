import { deleteCashflow } from "@/actions/actions";
import { getExpense, getIncome } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DeleteItemButton } from "@/ui/Buttons";


export default async function RevenueTable() {
  const [ incomeRes, expenseRes ] = await Promise.all([getIncome(), getExpense()]);
  const income = incomeRes.data || [];
  const expense = expenseRes.data || [];
  const incomeTotal = income.reduce((sum, item) => sum + item.amount, 0);
  const expenseTotal = expense.reduce((sum, item) => sum + item.amount, 0);
  const netIncome = incomeTotal - expenseTotal;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-linear-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium">Total Income</p>
          <p className="text-2xl font-bold text-green-700 mt-2">
            {formatCurrency(incomeTotal)}
          </p>
        </div>
        <div className="bg-linear-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600 font-medium">Total Expense</p>
          <p className="text-2xl font-bold text-red-700 mt-2">
            {formatCurrency(expenseTotal)}
          </p>
        </div>
        <div
          className={`bg-linear-to-br border rounded-lg p-4 ${
            netIncome >= 0
              ? "from-blue-50 to-blue-100 border-blue-200"
              : "from-orange-50 to-orange-100 border-orange-200"
          }`}
        >
          <p
            className={`text-sm font-medium ${netIncome >= 0 ? "text-blue-600" : "text-orange-600"}`}
          >
            Net Income
          </p>
          <p
            className={`text-2xl font-bold mt-2 ${netIncome >= 0 ? "text-blue-700" : "text-orange-700"}`}
          >
            {formatCurrency(netIncome)}
          </p>
        </div>
      </div>

      {/* Income Table */}
      <div>
        <h2 className="text-lg font-bold mb-4 text-foreground">Income</h2>
        {income && income.length > 0 ? (
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {income.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border hover:bg-muted/50 transition"
                  >
                    <td className="px-4 py-3 text-sm font-medium">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-600">
                      +{formatCurrency(item.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {item.notes || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      <DeleteItemButton
                        id={item.id}
                        title="Hapus Catatan"
                        message="Apakah anda yakin menghapus catatan ?"
                        onDelete={deleteCashflow}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-muted/50 rounded-lg border border-border">
            <p className="text-muted-foreground">Tidak ada data pemasukan</p>
          </div>
        )}
      </div>

      {/* Expense Table */}
      <div>
        <h2 className="text-lg font-bold mb-4 text-foreground">Expense</h2>
        {expense && expense.length > 0 ? (
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {expense.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border hover:bg-muted/50 transition"
                  >
                    <td className="px-4 py-3 text-sm font-medium">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-red-600">
                      -{formatCurrency(item.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {item.notes || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      <DeleteItemButton
                        id={item.id}
                        title="Hapus Catatan"
                        message="Apakah anda yakin menghapus catatan ?"
                        onDelete={deleteCashflow}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-muted/50 rounded-lg border border-border">
            <p className="text-muted-foreground">Tidak ada data pengeluaran</p>
          </div>
        )}
      </div>
    </div>
  );
}
