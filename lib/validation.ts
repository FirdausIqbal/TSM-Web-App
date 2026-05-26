import * as z from "zod";

export const LoginSchema = z.object({
    username: z.string().min(8, "Username Minimal 8 Karakter"),
    password: z.string().min(8, "Password Minimal 8 Karakter").max(32, "Password Maksimal 32 Karakter")
})