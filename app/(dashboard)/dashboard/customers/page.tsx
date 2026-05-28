import CustomersTable from "@/ui/dashboard/customers/table";
import { getFilteredCustomer } from "@/lib/data";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

export default async function page() {
  const result = await getFilteredCustomer();
  const customers = result.data || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-2xl">Customer</h1>
        <p className="text-sm text-muted-foreground mt-2">
          kelola data customer
        </p>
      </div>
      <div className="bg-card p-4 md:p-6 rounded-2xl border border-border">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Daftar Customer</h3>
          <Link
            href={"/dashboard/customers/create"}
            className="rounded-2xl text-sm py-2 px-2 bg-foreground text-secondary flex items-center gap-4 hover:bg-foreground/70 transition-colors duration-200"
          >
            <PlusIcon size={20} /> Add Customer
          </Link>
        </div>
        <CustomersTable customers={customers} />
      </div>
    </div>
  );
}
