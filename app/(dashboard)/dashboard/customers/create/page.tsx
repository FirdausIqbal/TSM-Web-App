import CreateCustomerForm from '@/ui/dashboard/customers/CreateCustomerForm';

export default function CreateCustomer() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-2xl mb-2">Create Customer</h1>
        <p className="text-muted-foreground text-sm">Catat customer baru</p>
      </div>

      <div className="bg-card p-4 md:p-6 rounded-2xl border border-border max-w-2xl">
        <CreateCustomerForm />
      </div>
    </div>
  );
}
