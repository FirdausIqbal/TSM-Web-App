"use client";

import { addPaymentRecord } from "@/actions/invoice";
import type { AddPaymentState } from "@/types/definitions";
import { useActionState } from "react";
import { useState, useEffect } from "react";

interface AddPaymentFormProps {
  invoiceId: string;
}

export default function AddPaymentForm({ invoiceId }: AddPaymentFormProps) {
  const [state, formAction, isPending] = useActionState<AddPaymentState | null, FormData>(
    async (prevState, formData) => {
      return await addPaymentRecord(prevState, formData);
    },
    null
  );

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [state?.success]);

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="invoiceId" value={invoiceId} />

      {/* Success Message */}
      {showSuccess && state?.success && (
        <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-sm text-green-800">
          <p className="font-semibold">✓ {state.message}</p>
          {state.data && (
            <p className="text-xs mt-2 text-green-700">
              Payment ID: {state.data.paymentId}
            </p>
          )}
        </div>
      )}

      {/* Error Message */}
      {state && !state.success && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-800">
          <p className="font-semibold">✕ {state.message}</p>
          {state.errors && Object.keys(state.errors).length > 0 && (
            <ul className="text-xs mt-2 list-disc list-inside text-red-700">
              {Object.entries(state.errors).map(([field, messages]) =>
                messages?.map((msg) => (
                  <li key={`${field}-${msg}`}>{msg}</li>
                ))
              )}
            </ul>
          )}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-sm text-foreground">
          <span className="text-muted-foreground">Metode Pembayaran *</span>
          <select
            name="paymentMethod"
            defaultValue="TRANSFER"
            disabled={isPending}
            className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground disabled:opacity-50"
          >
            <option value="TRANSFER">Transfer</option>
            <option value="CASH">Cash</option>
            <option value="QRIS">QRIS</option>
          </select>
          {state?.errors?.paymentMethod && (
            <p className="text-xs text-red-600 mt-1">{state.errors.paymentMethod[0]}</p>
          )}
        </label>

        <label className="block text-sm text-foreground">
          <span className="text-muted-foreground">Jumlah Dibayar *</span>
          <input
            type="number"
            min="1"
            name="amountPaid"
            required
            disabled={isPending}
            className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground disabled:opacity-50"
            placeholder="0"
          />
          {state?.errors?.amountPaid && (
            <p className="text-xs text-red-600 mt-1">{state.errors.amountPaid[0]}</p>
          )}
        </label>

        <label className="block text-sm text-foreground">
          <span className="text-muted-foreground">Tanggal Pembayaran</span>
          <input
            type="date"
            name="paymentDate"
            disabled={isPending}
            className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground disabled:opacity-50"
          />
          {state?.errors?.paymentDate && (
            <p className="text-xs text-red-600 mt-1">{state.errors.paymentDate[0]}</p>
          )}
        </label>
      </div>

      <label className="block text-sm text-foreground">
        <span className="text-muted-foreground">URL Bukti Pembayaran</span>
        <input
          type="url"
          name="proofOfPayment"
          placeholder="https://..."
          disabled={isPending}
          className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground disabled:opacity-50"
        />
        {state?.errors?.proofOfPayment && (
          <p className="text-xs text-red-600 mt-1">{state.errors.proofOfPayment[0]}</p>
        )}
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="no-print inline-flex items-center justify-center rounded-3xl bg-foreground px-5 py-3 text-sm font-semibold text-white transition hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Menyimpan..." : "Simpan Bukti Pembayaran"}
      </button>
    </form>
  );
}
