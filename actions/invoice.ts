"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { invoices, payments } from "@/db/schema";
import { and, eq, sum } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { AddPaymentState, VerifyPaymentState } from "@/types/definitions";

function generateInvoiceNumber() {
  const now = new Date();
  const serial = Math.floor(1000 + Math.random() * 9000);
  return `INV-${now.getFullYear()}-${serial}`;
}

export async function createInvoice(
  orderId: string,
  dueDate: string | Date,
  totalAmount: number,
) {
  if (!orderId || !dueDate || Number.isNaN(Number(totalAmount))) {
    return {
      success: false,
      message: "Data invoice tidak lengkap",
    };
  }

  const dueDateValue = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  const invoiceNumber = generateInvoiceNumber();

  const existing = await db
    .select()
    .from(invoices)
    .where(eq(invoices.orderId, orderId))
    .limit(1);

  if (existing.length > 0) {
    return {
      success: true,
      data: existing[0],
    };
  }

  const [inserted] = await db
    .insert(invoices)
    .values({
      orderId,
      invoiceNumber,
      totalAmount: Number(totalAmount),
      dueDate: dueDateValue,
    })
    .returning({
      id: invoices.id,
      orderId: invoices.orderId,
      invoiceNumber: invoices.invoiceNumber,
      totalAmount: invoices.totalAmount,
      status: invoices.status,
      dueDate: invoices.dueDate,
      createdAt: invoices.createdAt,
    });

  revalidatePath(`/dashboard/invoice/${inserted.id}`);

  return {
    success: true,
    data: inserted,
  };
}

export async function addPaymentRecord(prevState: AddPaymentState | null, formData: FormData): Promise<AddPaymentState> {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: "Anda tidak diizinkan untuk melakukan aksi ini",
      errors: undefined,
    };
  }

  const invoiceId = formData.get("invoiceId")?.toString() ?? "";
  const paymentMethod = formData.get("paymentMethod")?.toString() ?? "TRANSFER";
  const amountPaid = Number(formData.get("amountPaid") ?? 0);
  const paymentDateValue = formData.get("paymentDate")
    ? new Date(formData.get("paymentDate")?.toString() ?? "")
    : new Date();
  const proofOfPayment = formData.get("proofOfPayment")?.toString() ?? "";

  const errors: AddPaymentState["errors"] = {};

  if (!invoiceId) {
    errors.invoiceId = ["Invoice ID tidak ditemukan"];
  }

  if (!["TRANSFER", "CASH", "QRIS"].includes(paymentMethod)) {
    errors.paymentMethod = ["Metode pembayaran tidak valid"];
  }

  if (Number.isNaN(amountPaid) || amountPaid <= 0) {
    errors.amountPaid = ["Jumlah pembayaran harus lebih dari 0"];
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Data pembayaran tidak valid",
      errors,
    };
  }

  const invoice = await db
    .select()
    .from(invoices)
    .where(eq(invoices.id, invoiceId))
    .limit(1);

  if (invoice.length === 0) {
    return {
      success: false,
      message: "Invoice tidak ditemukan",
      errors: { invoiceId: ["Invoice dengan ID ini tidak ada"] },
    };
  }

  const [insertedPayment] = await db
    .insert(payments)
    .values({
      invoiceId,
      paymentMethod: paymentMethod as "TRANSFER" | "CASH" | "QRIS",
      amountPaid: Math.round(amountPaid),
      paymentDate: paymentDateValue,
      proofOfPayment: proofOfPayment || null,
      status: "PENDING",
    })
    .returning({
      id: payments.id,
      invoiceId: payments.invoiceId,
      amountPaid: payments.amountPaid,
      paymentMethod: payments.paymentMethod,
      paymentDate: payments.paymentDate,
    });

  revalidatePath(`/dashboard/invoice/${invoiceId}`);

  return {
    success: true,
    message: "Bukti pembayaran berhasil dicatat, tunggu verifikasi admin",
    data: {
      paymentId: insertedPayment.id,
      invoiceId: insertedPayment.invoiceId,
      amountPaid: insertedPayment.amountPaid,
      paymentMethod: insertedPayment.paymentMethod as "TRANSFER" | "CASH" | "QRIS",
      paymentDate: insertedPayment.paymentDate,
    },
  };
}

export async function verifyPaymentAction(prevState: VerifyPaymentState | null, formData: FormData): Promise<VerifyPaymentState> {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: "Anda tidak diizinkan untuk melakukan aksi ini",
      errors: undefined,
    };
  }

  const paymentId = formData.get("paymentId")?.toString() ?? "";
  const invoiceId = formData.get("invoiceId")?.toString() ?? "";
  const actionValue = formData.get("actionValue")?.toString() ?? "";

  const errors: VerifyPaymentState["errors"] = {};

  if (!paymentId) {
    errors.paymentId = ["Payment ID tidak ditemukan"];
  }

  if (!invoiceId) {
    errors.invoiceId = ["Invoice ID tidak ditemukan"];
  }

  if (!["VERIFIED", "REJECTED"].includes(actionValue)) {
    errors.actionValue = ["Aksi verifikasi tidak valid"];
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Data verifikasi tidak valid",
      errors,
    };
  }

  const existingPayment = await db
    .select()
    .from(payments)
    .where(eq(payments.id, paymentId))
    .limit(1);

  if (existingPayment.length === 0) {
    return {
      success: false,
      message: "Catatan pembayaran tidak ditemukan",
      errors: { paymentId: ["Payment dengan ID ini tidak ada"] },
    };
  }

  await db
    .update(payments)
    .set({ status: actionValue as "VERIFIED" | "REJECTED" })
    .where(eq(payments.id, paymentId));

  const invoiceRows = await db
    .select()
    .from(invoices)
    .where(eq(invoices.id, invoiceId))
    .limit(1);

  if (invoiceRows.length === 0) {
    return {
      success: false,
      message: "Invoice tidak ditemukan",
      errors: { invoiceId: ["Invoice dengan ID ini tidak ada"] },
    };
  }

  const invoice = invoiceRows[0];
  const [{ totalPaid }] = await db
    .select({ totalPaid: sum(payments.amountPaid).as("totalPaid") })
    .from(payments)
    .where(and(eq(payments.invoiceId, invoiceId), eq(payments.status, "VERIFIED")));

  const verifiedAmount = Number(totalPaid ?? 0);
  const nextInvoiceStatus =
    verifiedAmount >= invoice.totalAmount
      ? "PAID"
      : verifiedAmount > 0
      ? "PARTIAL"
      : "UNPAID";

  await db
    .update(invoices)
    .set({ status: nextInvoiceStatus })
    .where(eq(invoices.id, invoiceId));

  revalidatePath(`/dashboard/invoice/${invoiceId}`);

  return {
    success: true,
    message: `Pembayaran berhasil ${actionValue === "VERIFIED" ? "diverifikasi" : "ditolak"}`,
    data: {
      paymentId,
      invoiceId,
      status: actionValue as "VERIFIED" | "REJECTED",
      invoiceStatus: nextInvoiceStatus,
      verifiedAmount,
    },
  };
}
