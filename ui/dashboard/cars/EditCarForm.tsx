'use client';

import { editCar } from '@/actions/car';
import { useActionState } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface CarData {
  id: string;
  name: string;
  plateNumber: string;
  pricePerDay: number;
}

interface FormState {
  success?: boolean;
  message?: string;
}

interface EditCarFormProps {
  car: CarData;
}

export default function EditCarForm({ car }: EditCarFormProps) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    editCar.bind(null, car.id),
    { success: undefined, message: undefined }
  );

  // Handle success redirect
  if(state.success) {
    redirect('/dashboard/cars')
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Error Message */}
      {state?.message && !state?.success && (
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
          defaultValue={car.name}
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
          defaultValue={car.plateNumber}
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
          defaultValue={car.pricePerDay}
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
          disabled={isPending || state?.success}
          className="flex-1 px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
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
