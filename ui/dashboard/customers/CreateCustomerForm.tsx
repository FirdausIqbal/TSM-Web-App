'use client';

import { createCustomer } from '@/actions/customer';
import { useActionState } from 'react';

interface FormState {
  message?: string;
}

export default function CreateCustomerForm() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    createCustomer,
    { message: undefined }
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
          {isPending ? 'Menyimpan...' : 'Simpan Customer'}
        </button>
      </div>
    </form>
  );
}
