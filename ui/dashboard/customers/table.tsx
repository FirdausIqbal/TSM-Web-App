import { deleteCustomer } from "@/actions/actions";
import { getFilteredCustomer } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { DeleteItemButton } from "@/ui/Buttons";
import { Edit2 } from "lucide-react";
import Link from "next/link";


export default async function CustomersTable({page, pageSize}: {page: number, pageSize: number}) {
   const result = await getFilteredCustomer(page, pageSize);
  const customers = result.data || [];
  if (customers.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No customers found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground whitespace-nowrap">
              Name
            </th>
            <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground whitespace-nowrap">
              NIK
            </th>
            <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground whitespace-nowrap">
              Phone
            </th>
            <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground whitespace-nowrap">
              Address
            </th>
            <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground whitespace-nowrap">
              Created At
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className="border-b border-border hover:bg-muted cursor-pointer transition-colors"
            >
              <td className="py-3 px-4 text-sm font-semibold">
                {customer.name}
              </td>
              <td className="py-3 px-4 text-sm">{customer.nik}</td>
              <td className="py-3 px-4 text-sm">{customer.phone}</td>
              <td className="py-3 px-4 text-sm">{customer.address || "-"}</td>
              <td className="py-3 px-4 text-sm">
                {formatDate(customer.createdAt)}
              </td>
              <td className="py-3 px-4">
                <DeleteItemButton
                  id={customer.id}
                  title="Hapus Customer"
                  message={`Anda yakin menghapus data customer ${customer.name} ?`}
                  onDelete={deleteCustomer}
                />
              </td>
              <td className="py-3 px-4">
                <Link href={`/dashboard/customers/edit/${customer.id}`}>
                  <div className="bg-blue-500 hover:bg-blue-300 transition-colors duration-300 rounded-4xl p-2 text-white flex items-center justify-center">
                    <Edit2 size={20} />
                  </div>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
