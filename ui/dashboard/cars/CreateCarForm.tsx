'use client';

import { createCar } from '@/actions/car';
import { useActionState } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface FormState {
  message?: string;
  success?: boolean;
}

export default function CreateCarForm() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    createCar,
    { message: undefined, success: undefined }
  );

  if(state.success){
    redirect('/dashboard/cars')
  }

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
          Nama Mobil
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Contoh: Toyota Avanza 2023"
          required
          disabled={isPending}
          className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />
      </div>

      {/* Plate Number Field */}
      <div className="space-y-2">
        <label htmlFor="plateNumber" className="block text-sm font-medium">
          Plat Nomor
        </label>
        <input
          id="plateNumber"
          name="plateNumber"
          type="text"
          placeholder="Contoh: B 1234 ABC"
          required
          disabled={isPending}
          className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />
      </div>

      {/* Price Per Day Field */}
      <div className="space-y-2">
        <label htmlFor="pricePerDay" className="block text-sm font-medium">
          Harga per Hari (Rp)
        </label>
        <input
          id="pricePerDay"
          name="pricePerDay"
          type="number"
          placeholder="Contoh: 300000"
          required
          min="0"
          disabled={isPending}
          className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />
        <p className="text-xs text-muted-foreground">
          Masukkan dalam format angka tanpa koma atau titik
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Menyimpan...' : 'Simpan Mobil'}
        </button>
        <Link
          href="/dashboard/cars"
          className="flex-1 px-6 py-2 bg-muted text-foreground font-medium rounded-lg hover:bg-muted/80 transition-colors text-center"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
