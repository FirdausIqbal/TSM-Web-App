"use server";

import type { State } from "@/app/types/definitions";
import { auth } from "@/auth";
import { db } from "@/db";
import { cashflow, customers, rentals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addRental(formdata: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const {
    customerName,
    customerId,
    nik,
    phone,
    address,
    carId,
    startDate,
    endDate,
    totalPrice,
  } = Object.fromEntries(formdata);

  try {
    let finalCustomerId = customerId as string;

    const exsistingCustomer = await db
      .select({ id: customers.id })
      .from(customers)
      .where(eq(customers.nik, nik as string))
      .limit(1);

    if (exsistingCustomer.length < 1) {
      const newCustomer = await db
        .insert(customers)
        .values({
          name: customerName as string,
          nik: nik as string,
          phone: phone as string,
          address: address as string,
        })
        .returning({ insertedId: customers.id });

      finalCustomerId = newCustomer[0].insertedId;
    } else {
      finalCustomerId = exsistingCustomer[0].id;
    }

    const newRental = await db
      .insert(rentals)
      .values({
        carId: carId as string,
        customerId: finalCustomerId,
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
        totalPrice: Number(totalPrice),
      })
      .returning({ id: rentals.id });

    await db.insert(cashflow).values({
      type: "INCOME",
      amount: Number(totalPrice),
      category: "Sewa Unit Mobil TSM",
      rentalId: newRental[0].id,
      notes: "Tripelde Booked Unit",
    });

    return {
      success: true,
      message: "Berhasil Mencatat data rental dan cashflow",
    };
  } catch (error) {
    console.log("Error add rental : ", error);
    return {
      success: false,
      message: "Something went wrong while adding rental",
    };
  }

  revalidatePath("/dashboard/rentals");
}

export async function deleteRental(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  try {
    await db.delete(rentals).where(eq(rentals.id, id));
  } catch (error) {
    console.log("Something went wrong while deleting rental: ", error);
    return {
      message: "Terjadi keasalahan pada sistem",
    };
  }
  revalidatePath("/dashboard/rentals");
}

export async function editRental(
  rentalId: string,
  prevState: State,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { carId, startDate, endDate, totalPrice } =
    Object.fromEntries(formData);

  try {
    // 1. FETCH EXISTING RENTAL DATA (minimal query - no customer join)
    // Ambil hanya data rental untuk dibandingkan
    const existingRental = await db
      .select({
        id: rentals.id,
        carId: rentals.carId,
        startDate: rentals.startDate,
        endDate: rentals.endDate,
        totalPrice: rentals.totalPrice,
      })
      .from(rentals)
      .where(eq(rentals.id, rentalId))
      .limit(1);

    if (existingRental.length === 0) {
      return {
        success: false,
        message: "Rental tidak ditemukan",
      };
    }

    const oldData = existingRental[0];
    const newStartDate = new Date(startDate as string);
    const newEndDate = new Date(endDate as string);
    const newTotalPrice = Number(totalPrice);

    // 2. BUILD DYNAMIC UPDATE OBJECT (Hanya update field yang berubah)
    const rentalUpdates: Record<string, unknown> = {};

    if (oldData.carId !== carId) rentalUpdates.carId = carId as string;
    if (oldData.startDate.getTime() !== newStartDate.getTime())
      rentalUpdates.startDate = newStartDate;
    if (oldData.endDate.getTime() !== newEndDate.getTime())
      rentalUpdates.endDate = newEndDate;
    if (oldData.totalPrice !== newTotalPrice)
      rentalUpdates.totalPrice = newTotalPrice;

    // 3. SKIP UPDATE JIKA TIDAK ADA PERUBAHAN
    if (Object.keys(rentalUpdates).length === 0) {
      return {
        success: true,
        message: "Tidak ada perubahan data",
      };
    }

    // 4. UPDATE RENTAL DENGAN FIELDS YANG BERUBAH
    await db.update(rentals).set(rentalUpdates).where(eq(rentals.id, rentalId));

    // 5. UPDATE CASHFLOW (hanya jika totalPrice berubah)
    if (oldData.totalPrice !== newTotalPrice) {
      const existingCashflow = await db
        .select({ id: cashflow.id })
        .from(cashflow)
        .where(eq(cashflow.rentalId, rentalId))
        .limit(1);

      if (existingCashflow.length > 0) {
        await db
          .update(cashflow)
          .set({ amount: newTotalPrice })
          .where(eq(cashflow.id, existingCashflow[0].id));
      }
    }
  } catch (error) {
    console.log("Error edit rental: ", error);
    return {
      success: false,
      message: "Something went wrong while editing rental",
    };
  }

  revalidatePath("/dashboard/rentals");
  return {
    success: true,
    message: "Berhasil mengubah data rental",
  };
}

/**
 * Customer Actions
 */

export async function createCustomer(prevState: unknown, formData: FormData) {
  const { name, nik, phone, address } = Object.fromEntries(formData);

  try {
    const existingNIK = await db
      .select()
      .from(customers)
      .where(eq(customers.nik, nik as string));

    if (existingNIK.length > 0) {
      return {
        message: "NIK sudah terdaftar",
      };
    }

    await db.insert(customers).values({
      name: name as string,
      nik: nik as string,
      phone: phone as string,
      address: address as string | null,
    });
  } catch (error) {
    console.log("Error create customer : ", error);
    return {
      message: "Failed create customer",
    };
  }

  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function deleteCustomer(id: string) {
  try {
    await db.delete(customers).where(eq(customers.id, id));
  } catch (error) {
    console.log("Error delete customer : ", error);
    return { message: "Error Deleting customer" };
  }

  revalidatePath("/dashboard/customers");
}

export async function editCustomer(
  id: string,
  prevState: unknown,
  formData: FormData,
) {
  const { name, nik, phone, address } = Object.fromEntries(formData);

  try {
    await db
      .update(customers)
      .set({
        name: name as string,
        nik: nik as string,
        phone: phone as string,
        address: address as string | null,
      })
      .where(eq(customers.id, id));
  } catch (error) {
    console.log("Error edit customer : ", error);
    return { message: "Error edit customer" };
  }

  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

/**
 * Revenue Actions
 */

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
  } catch (error) {
    console.log("Error create cashflow : ", error);
    return {
      message: "Gagal mencatat data keuangan",
    };
  }
  revalidatePath("/dashboard/revenue");
  redirect("/dashboard/revenue")
}

export async function deleteCashflow(id: string) {
  try {
    await db.delete(cashflow).where(eq(cashflow.id, id));
  } catch (error) {
    console.log('Error delete cashflow : ', error);
    return { message: "Failed deleting cashflow"};
  }
  revalidatePath("/dashboard/revenue")
}