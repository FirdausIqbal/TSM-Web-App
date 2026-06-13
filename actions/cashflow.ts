"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { cashflow } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCashflow(prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { type, amount, category, date, notes } = Object.fromEntries(formData);

  try {
    if (!type || !amount || !category || !date) {
      return {
        success: false,
        message: "Semua field harus diisi",
      };
    }

    await db.insert(cashflow).values({
      type: type as "INCOME" | "EXPENSE",
      category: category as string,
      amount: Number(amount),
      notes: (notes as string) || null,
      date: new Date(date as string),
    });
    revalidatePath("/dashboard/revenue");
    revalidatePath("/dashboard");
  } catch (error) {
    console.log("Error create cashflow : ", error);
    return {
      message: "Gagal mencatat data keuangan",
    };
  }
  
  redirect("/dashboard/revenue");
}

export async function deleteCashflow(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  try {
    await db.delete(cashflow).where(eq(cashflow.id, id));
    revalidatePath("/dashboard/revenue");
    revalidatePath("/dashboard");
  } catch (error) {
    console.log("Error delete cashflow : ", error);
    return { message: "Failed deleting cashflow" };
  }
  
}
