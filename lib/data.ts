"use server";
import type { StatusValueType } from "@/app/types/definitions";
import { db } from "@/db";
import { customers, rentals, cars, cashflow } from "@/db/schema";
import { and, desc, eq, gte, lte, notExists } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * fetch all rentals func
 * no params get
 * all rentals
 */
export async function getAllRentals() {
  try {
    const res = await db
      .select({
        id: rentals.id,
        customerId: customers.id,
        customerName: customers.name,
        carType: cars.name,
        startDate: rentals.startDate,
        endDate: rentals.endDate,
        status: rentals.status,
        totalPrice: rentals.totalPrice,
      })
      .from(rentals)
      .innerJoin(cars, eq(rentals.carId, cars.id))
      .innerJoin(customers, eq(rentals.customerId, customers.id))
      .orderBy(desc(rentals.createdAt));

    return { success: true, data: res };
  } catch (error) {
    console.log(error);
    return { success: false, error: "failed to fetch rentals" };
  }
}

/**
 * Cek Ketersediaan mobil
 * params (startDate, endDate)
 */
export async function getAvailableCars(startDate: Date, endDate: Date) {
  try {
    const availableCars = await db
      .select()
      .from(cars)
      .where(
        notExists(
          db
            .select()
            .from(rentals)
            .where(
              and(
                eq(rentals.carId, cars.id),

                lte(rentals.startDate, endDate),
                gte(rentals.endDate, startDate),
              ),
            ),
        ),
      );

    return {
      success: true,
      data: availableCars,
    };
  } catch (error) {
    console.log(error);
    throw new Error("Error get available cars");
  }
}

export async function changeRentalStatus(id: string, currentStatus: string) {
  try {
    await db
      .update(rentals)
      .set({ status: currentStatus as StatusValueType })
      .where(eq(rentals.id, id));
    revalidatePath("/dashboard/rentals");
  } catch (error) {
    console.log(error);
    throw new Error("terjadi kesalahan saat mengubah status");
  }
}

export async function getAllCustomers() {
  try {
    const res = await db.select().from(customers);
    return {
      success: true,
      data: res,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "failed to get customers",
    };
  }
}

export async function getCustomerWithId(id: string) {
  try {
    const res = await db.select().from(customers).where(eq(customers.id, id));
    return {
      success: true,
      data: res[0],
    };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch customer data");
  }
}

export async function getRentalFormData(id: string) {
  try {
    const res = await db
      .select({
        id: rentals.id,
        carId: cars.id,
        carName: cars.name,
        carPrice: cars.pricePerDay,
        totalPrice: rentals.totalPrice,
        startDate: rentals.startDate,
        endDate: rentals.endDate,
      })
      .from(rentals)
      .innerJoin(cars, eq(rentals.carId, cars.id))
      .where(eq(rentals.id, id));

    return {
      data: res[0],
    };
  } catch (error) {
    console.log("Error to fetch rental data : ", error);
    throw new Error("Failed to fetch rental data");
  }
}

/**
 * Customer Data 
 */

export async function getFilteredCustomer() {
  // sementara get all customer dulu (jika sudah ada pagination ubah params)
  try {
    const res = await db.select().from(customers);
    return {
      data: res
    }
  } catch (error) {
    console.log("Error to fetch customer data : ", error);
    throw new Error("Failed to fetch customer data");
  }
}

export async function getCustomerData(id: string) {
  try {
    const res = await db.select().from(customers).where(eq(customers.id, id));
    return {
      data: res[0]
    }
  } catch (error) {
    console.log("Error to fetch customer data : ", error);
    throw new Error("Failed to fetch customer data");
  }
}


/**
 * Revenue Data
 */

export async function getIncome() {
  try {
    const res = await db.select().from(cashflow).where(eq(cashflow.type, "INCOME"));

    return {
      data: [...res]
    }
  } catch (error) {
    console.log("Error to fetch income data : ", error);
    throw new Error("Failed to fetch Income data");
  }
}

export async function getExpense() {
  try {
    const res = await db.select().from(cashflow).where(eq(cashflow.type, "EXPENSE"));

    return {
      data: [...res]
    }
  } catch (error) {
    console.log("Error to fetch expense data : ", error);
    throw new Error("Failed to fetch expense data");
  }
}