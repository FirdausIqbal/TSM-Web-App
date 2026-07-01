"use server";

import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
