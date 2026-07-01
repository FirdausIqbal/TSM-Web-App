"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { cars } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createCar(prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { name, plateNumber, pricePerDay } = Object.fromEntries(formData);

  try {
    const existingPlate = await db
      .select({ plateNumber: cars.plateNumber })
      .from(cars)
      .where(eq(cars.plateNumber, plateNumber as string));
    if (existingPlate.length > 0) {
      return { success: false, message: "Plat nomor sudah digunakan" };
    }

    await db.insert(cars).values({
      name: name as string,
      plateNumber: plateNumber as string,
      pricePerDay: Number(pricePerDay),
    });

    revalidatePath("/dashboard/cars");
    return { success: true, message: "Success creating car" };
  } catch (error) {
    console.log("Error create car : ", error);
    return { success: false, message: "Failed creating car" };
  }
}

export async function deleteCar(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  try {
    await db.delete(cars).where(eq(cars.id, id));
    revalidatePath("/dashboard/cars");
  } catch (error) {
    console.log("Error delete car : ", error);
    return { message: "Failed deleting car" };
  }
}

export async function editCar(
  id: string,
  prevState: unknown,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { name, plateNumber, pricePerDay } = Object.fromEntries(formData);

  try {
    // Check if plate number is already used by another car
    const existingPlate = await db
      .select({ id: cars.id, plateNumber: cars.plateNumber })
      .from(cars)
      .where(eq(cars.plateNumber, plateNumber as string));
    
    // If plate exists and it's not the current car
    if (existingPlate.length > 0 && existingPlate[0].id !== id) {
      return {
        success: false,
        message: "Plat nomor sudah digunakan mobil lain"
      }
    }

    await db.update(cars)
      .set({
        name: name as string,
        plateNumber: plateNumber as string,
        pricePerDay: Number(pricePerDay)
      })
      .where(eq(cars.id, id));

    revalidatePath("/dashboard/cars");
    
    return {
      success: true,
      message: "Berhasil update data mobil"
    }
  } catch (error) {
    console.log("Error updating car : ", error);
    return { success: false, message: "Terjadi kesalahan saat mengupdate data" };
  }
}
