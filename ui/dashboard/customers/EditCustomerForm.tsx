"use client";

import { editCustomer } from "@/actions/actions";
import Link from "next/link";
import { useActionState } from "react";

interface Customer {
  id: string;
  name: string;
  nik: string;
  phone: string;
  address: string | null;
  createdAt: Date;
}

interface FormState {
  message?: string;
}

interface EditCustomerFormProps {
  customer: Customer;
}

export default function EditCustomerForm({ customer }: EditCustomerFormProps) {
  const boundAction = editCustomer.bind(null, customer.id);

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    boundAction,
    { message: undefined },
  );

  return (
    <form action={formAction} className="space-y-6">
      {/* Error Message */}
      {state?.message && (
        <div className="bg-red-500/10 border border-red-500 text-red-600 px-4 py-3 rounded-lg text-sm">
          {state.message}
        </div>
      )}

      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">
          Nama Customer
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Masukkan nama customer"
          defaultValue={customer.name}
          required
          disabled={isPending}
          className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />
      </div>

      {/* NIK Field */}
      <div className="space-y-2">
        <label htmlFor="nik" className="block text-sm font-medium">
          NIK
        </label>
        <input
          id="nik"
          name="nik"
          type="text"
          placeholder="Masukkan NIK customer"
          defaultValue={customer.nik}
          required
          disabled={isPending}
          className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />
      </div>

      {/* Phone Field */}
      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium">
          No. Telepon
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="Masukkan nomor telepon"
          defaultValue={customer.phone}
          required
          disabled={isPending}
          className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />
      </div>

      {/* Address Field */}
      <div className="space-y-2">
        <label htmlFor="address" className="block text-sm font-medium">
          Alamat (Opsional)
        </label>
        <textarea
          id="address"
          name="address"
          placeholder="Masukkan alamat customer"
          defaultValue={customer.address || ""}
          rows={4}
          disabled={isPending}
          className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
        <Link
          href={"/dashboard/customers"}
          className="px-6 py-2 bg-red-500 text-secondary font-medium rounded-lg hover:bg-red-300"
        >
          Kembali
        </Link>
      </div>
    </form>
  );
}
