"use client";

import { verifyPaymentAction } from "@/actions/invoice";
import type { VerifyPaymentState } from "@/types/definitions";
import type { InvoicePaymentRecord } from "@/types/definitions";
import { useActionState, useTransition } from "react";
import { useState } from "react";

interface PaymentActionButtonsProps {
  payment: InvoicePaymentRecord;
  invoiceId: string;
}

export default function PaymentActionButtons({
  payment,
  invoiceId,
}: PaymentActionButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const [lastAction, setLastAction] = useState<VerifyPaymentState | null>(null);

  const handleVerify = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("invoiceId", invoiceId);
      formData.append("paymentId", payment.id);
      formData.append("actionValue", "VERIFIED");
      
      const result = await verifyPaymentAction(null, formData);
      setLastAction(result);
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("invoiceId", invoiceId);
      formData.append("paymentId", payment.id);
      formData.append("actionValue", "REJECTED");
      
      const result = await verifyPaymentAction(null, formData);
      setLastAction(result);
    });
  };

  // Show action buttons only if payment is PENDING
  if (payment.status !== "PENDING") {
    return (
      <span className="rounded-full bg-secondary/60 px-3 py-1 text-xs font-semibold text-secondary-foreground">
        Tidak ada aksi
      </span>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleVerify}
          disabled={isPending}
          className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Memproses..." : "Verifikasi"}
        </button>
        <button
          type="button"
          onClick={handleReject}
          disabled={isPending}
          className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Memproses..." : "Tolak"}
        </button>
      </div>

      {/* Show feedback if action was taken */}
      {lastAction && (
        <div
          className={`text-xs rounded-full px-3 py-1 font-semibold ${
            lastAction.success
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {lastAction.message}
          {lastAction.success && lastAction.data && (
            <span className="ml-1 text-[11px]">
              ({lastAction.data.status})
            </span>
          )}
        </div>
      )}
    </div>
  );
}
