import type { DefaultSession } from "next-auth"

declare module "next-auth" {
    // properti untuk User
    interface User {
        role?: string,
        id?: string
    }

    // properti tambahan Session
    interface Session {
        user: {
            role?: string,
            id?: string
        } & DefaultSession["user"]
    }
}

declare module "next-aut/jwt" {
    // properti tambahan agar data dari db disimpan di JWT
    interface JWT {
        role?: string,
        id?: string
    }
}