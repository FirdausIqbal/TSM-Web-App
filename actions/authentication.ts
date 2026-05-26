"use server";

import { signIn, signOut } from "@/auth";
import { LoginSchema } from "@/lib/validation";
import { AuthError } from "next-auth";

export async function loginAction(prevState: unknown, formData: FormData) {
  try {
    const validateData = LoginSchema.safeParse(
      Object.fromEntries(formData.entries()),
    );

    if (!validateData.success) {
      return {
        error: "kombinasi kredensials tidak memenuhi standard !",
      };
    }
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Username atau Password Salah" };
        default:
          return { error: "Terjadi Kesalahan Pada Sistem" };
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
