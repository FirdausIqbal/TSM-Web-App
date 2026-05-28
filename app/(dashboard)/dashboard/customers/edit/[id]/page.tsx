import { getCustomerData } from "@/lib/data"
import EditCustomerForm from "@/ui/dashboard/customers/EditCustomerForm";

export default async function page(props: {params: Promise<{id:string}>}) {
    const params = await props.params
    const result = await getCustomerData(params.id);
    const customer = result.data;

    if (!customer) {
      return (
        <div className="space-y-8">
          <div>
            <h1 className="font-bold text-2xl mb-2">Edit Customer</h1>
            <p className="text-muted-foreground text-sm">Edit data customer</p>
          </div>
          <div className="bg-red-500/10 border border-red-500 text-red-600 px-4 py-3 rounded-lg">
            Customer tidak ditemukan
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-bold text-2xl mb-2">Edit Customer</h1>
          <p className="text-muted-foreground text-sm">Edit data customer</p>
        </div>
        
        <div className="bg-card p-4 md:p-6 rounded-2xl border border-border max-w-2xl">
          <EditCustomerForm customer={customer} />
        </div>
      </div>
    )
}
