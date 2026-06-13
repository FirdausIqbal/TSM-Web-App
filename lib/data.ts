"use server"

import type { DailyCalendarData } from "@/types/definitions";
import { db } from "@/db";
import { customers, rentals, cars, cashflow } from "@/db/schema";
import {
  and,
  or,
  desc,
  eq,
  gte,
  lte,
  notExists,
  count,
  sql,
} from "drizzle-orm";

/**
 * fetch all rentals func
 * no params get
 * all rentals
 */
export async function getFilteredRentals(page: number, pageSize: number) {
  try {
    const validPage = Math.max(1, page);
    const validPageSize = Math.max(1, Math.min(pageSize, 100));
    const offset = (validPage - 1) * validPageSize;

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
      .orderBy(desc(rentals.createdAt))
      .limit(validPageSize)
      .offset(offset);

    return { success: true, data: res };
  } catch (error) {
    console.log(error);
    return { success: false, error: "failed to fetch rentals" };
  }
}

export async function getRentalCount() {
  try {
    const [res] = await db.select({ count: count() }).from(rentals);
    return res.count;
  } catch (error) {
    console.log("Error to fetch Rental : ", error);
    throw new Error("Failed to fetch Rental");
  }
}

export async function getRentalsByMonth(year: number, month: number) {
  try {
    // Tentukan tanggal awal dan akhir bulan
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Query rentals dengan car details untuk bulan yang diminta
    const monthRentals = await db
      .select({
        id: rentals.id,
        carId: rentals.carId,
        carName: cars.name,
        plateNumber: cars.plateNumber,
        startDate: rentals.startDate,
        endDate: rentals.endDate,
        status: rentals.status,
        customerName: customers.name,
        totalPrice: rentals.totalPrice,
      })
      .from(rentals)
      .innerJoin(cars, eq(rentals.carId, cars.id))
      .innerJoin(customers, eq(rentals.customerId, customers.id))
      .where(
        and(
          // Rental yang overlapping dengan bulan ini
          gte(rentals.endDate, startDate),
          lte(rentals.startDate, endDate),
          // Hanya tampilkan rental yang aktif atau booking
          or(eq(rentals.status, "BOOKED"), eq(rentals.status, "ON_GOING")),
        ),
      )
      .orderBy(rentals.startDate);

    // Transform data untuk format calendar
    // Kita perlu expand rentals yang span multiple days
    const calendarDataMap: Record<string, DailyCalendarData> = {};

    for (const rental of monthRentals) {
      const startDateObj =
        rental.startDate instanceof Date
          ? rental.startDate
          : new Date(rental.startDate);
      const endDateObj =
        rental.endDate instanceof Date
          ? rental.endDate
          : new Date(rental.endDate);

      // Loop melalui setiap hari antara startDate dan endDate
      const currentDay = new Date(startDateObj);

      while (currentDay <= endDateObj) {
        const dateStr = currentDay.toISOString().split("T")[0];

        // Hanya include jika dalam bulan yang ditampilkan
        if (currentDay >= startDate && currentDay <= endDate) {
          if (!calendarDataMap[dateStr]) {
            calendarDataMap[dateStr] = {
              date: dateStr,
              cars: [],
              rentals: [],
            };
          }

          calendarDataMap[dateStr].cars.push(rental.carName);
          calendarDataMap[dateStr].rentals.push({
            rentalId: rental.id,
            carId: rental.carId,
            carName: rental.carName,
            status: rental.status,
            endDate: endDateObj.toISOString().split("T")[0],
            customerName: rental.customerName,
          });
        }

        // Move to next day
        currentDay.setDate(currentDay.getDate() + 1);
      }
    }

    // Remove duplicates dalam cars array untuk setiap date
    const calendarData = Object.values(calendarDataMap).map((item) => ({
      ...item,
      cars: [...new Set(item.cars)], // Remove duplicates
    }));

    return {
      success: true,
      data: calendarData,
    };
  } catch (error) {
    console.error("Failed to fetch rentals by month:", error);
    return { success: false, error: "Failed to fetch rentals by month" };
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

export async function fetchCustomerCount() {
  try {
    const [res] = await db.select({ count: count() }).from(customers);
    return res.count;
  } catch (error) {
    console.log("Error to fetch customer count : ", error);
    throw new Error("Failed to fetch customer count");
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

export async function getFilteredCustomer(page: number, pageSize: number) {
  // sementara get all customer dulu (jika sudah ada pagination ubah params)
  try {
    const validPage = Math.max(1, page);
    const validPageSize = Math.max(1, Math.min(pageSize, 100));
    const offset = (validPage - 1) * validPageSize;
    const res = await db
      .select()
      .from(customers)
      .limit(validPageSize)
      .offset(offset);
    return {
      data: res,
    };
  } catch (error) {
    console.log("Error to fetch customer data : ", error);
    throw new Error("Failed to fetch customer data");
  }
}

export async function getCustomerData(id: string) {
  try {
    const res = await db.select().from(customers).where(eq(customers.id, id));
    return {
      data: res[0],
    };
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
    const res = await db
      .select()
      .from(cashflow)
      .where(eq(cashflow.type, "INCOME"));

    return {
      data: [...res],
    };
  } catch (error) {
    console.log("Error to fetch income data : ", error);
    throw new Error("Failed to fetch Income data");
  }
}

export async function getExpense() {
  try {
    const res = await db
      .select()
      .from(cashflow)
      .where(eq(cashflow.type, "EXPENSE"));

    return {
      data: [...res],
    };
  } catch (error) {
    console.log("Error to fetch expense data : ", error);
    throw new Error("Failed to fetch expense data");
  }
}

/**
 * Cars Data
 */

/**
 * Fetch cars dengan pagination
 * params (page, pageSize)
 * Returns paginated cars data dengan metadata
 */
export async function getCarsWithPagination(
  page: number = 1,
  pageSize: number = 10,
) {
  try {
    // Validasi pagination params
    const validPage = Math.max(1, page);
    const validPageSize = Math.max(1, Math.min(pageSize, 100)); // Max 100 items per page

    // Hitung offset
    const offset = (validPage - 1) * validPageSize;

    // Get total count of cars
    const [{ total }] = await db.select({ total: count() }).from(cars);

    // Fetch paginated cars
    const carsList = await db
      .select()
      .from(cars)
      .orderBy(desc(cars.createdAt))
      .limit(validPageSize)
      .offset(offset);

    // Calculate total pages
    const totalPages = Math.ceil(total / validPageSize);

    return {
      success: true,
      data: carsList,
      pagination: {
        currentPage: validPage,
        pageSize: validPageSize,
        totalItems: total,
        totalPages: totalPages,
        hasNextPage: validPage < totalPages,
        hasPrevPage: validPage > 1,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "failed to fetch cars",
    };
  }
}

export async function getCarData(id: string) {
  try {
    const res = await db.select().from(cars).where(eq(cars.id, id));
    return { data: res[0] };
  } catch (error) {
    console.log("Error fetching car data : ", error);
    throw new Error("Failed fetch car data");
  }
}

export async function fetchMonthlyData() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
    const monthlyIncomePromise = db
      .select({
        // 3. LANGSUNG HITUNG BERSIHNYA (Income - Expense)
        netProfit: sql<number>`COALESCE(
        SUM(CASE WHEN ${cashflow.type} = 'INCOME' THEN ${cashflow.amount} ELSE 0 END) - 
        SUM(CASE WHEN ${cashflow.type} = 'EXPENSE' THEN ${cashflow.amount} ELSE 0 END), 
        0
      )`.mapWith(Number),
      })
      .from(cashflow)
      .where(
        and(gte(cashflow.date, startOfMonth), lte(cashflow.date, endOfMonth)),
      );
    const totalUnitPromise = db.select({ total: count() }).from(cars);
    const totalRentalPromise = db
      .select({ total: count() })
      .from(rentals)
      .where(
        and(
          gte(rentals.createdAt, startOfMonth),
          lte(rentals.createdAt, endOfMonth),
        ),
      );
    const totalCustomerPromise = db.select({ total: count() }).from(customers);

    const data = await Promise.all([
      monthlyIncomePromise,
      totalUnitPromise,
      totalRentalPromise,
      totalCustomerPromise,
    ]);

    const monthlyIncome = data[0][0].netProfit ?? "0";
    const totalUnit = data[1][0].total ?? "0";
    const totalRental = data[2][0].total ?? "0";
    const totalCustomer = data[3][0].total ?? "0";

    return {
      monthlyIncome,
      totalUnit,
      totalRental,
      totalCustomer,
    };
  } catch (error) {
    console.log("Error to fetch MonthlyData : ", error);
    throw new Error("Failed to fetch MonthlyData");
  }
}

export async function fetchLatestRentals() {
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
      .orderBy(desc(rentals.createdAt))
      .limit(10);
    return { data: [...res] };
  } catch (error) {
    console.log("Error to fetch latest Rentals : ", error);
    throw new Error("Failed to fetch latest Rentals");
  }
}
