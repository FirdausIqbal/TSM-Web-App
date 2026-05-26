"use server"

import { auth } from "@/auth";
import { db } from "@/db";
import { cashflow, customers, rentals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addRental(formdata:FormData) {
    const session = await auth();
    if (!session?.user){
        throw new Error("Unauthorized");
    }

    const { customerName, customerId, nik, phone, address, carId, startDate, endDate, totalPrice } = Object.fromEntries(formdata);

    try {
        let finalCustomerId = customerId as string;

        const exsistingCustomer = await db
        .select({ id: customers.id})
        .from(customers)
        .where(eq(customers.nik, nik as string))
        .limit(1);

        if(exsistingCustomer.length < 1) {
            const newCustomer = await db
            .insert(customers)
            .values({
                name: customerName as string,
                nik: nik as string,
                phone: phone as string,
                address: address as string
            }).returning({ insertedId: customers.id});

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
            totalPrice: Number(totalPrice)
        }).returning({ id: rentals.id});

        await db.insert(cashflow).values({
            type: "INCOME",
            amount: Number(totalPrice),
            category: "Sewa Unit Mobil TSM",
            rentalId: newRental[0].id,
            notes: "Tripelde Booked Unit"
        });

        revalidatePath("/dashboard/rentals");

        return {
            success: true,
            message: "Berhasil Mencatat data rental dan cashflow"
        }

    } catch (error) {
        console.log("Error add rental : ", error)
        return {
            success: false,
            message: "Something went wrong while adding rental"
        }
    }
    
}

export async function deleteRental(id:string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Unauthorized");
    }
    try {
        await db.delete(rentals).where(eq(rentals.id, id));
    } catch (error) {
        console.log("Something went wrong while deleting rental: ", error)
        return {
            message: "Terjadi keasalahan pada sistem"
        }
    }
    revalidatePath("/dashboard/rentals");
    
}
