import NextAuth, { type User } from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from './db'
import Credentials from 'next-auth/providers/credentials'
import { app_user } from './db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from "bcrypt"
import { authConfig } from './auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: DrizzleAdapter(db),
    ...authConfig,
    session: {
      strategy: 'jwt',
      maxAge: 1 * 60 * 5,
    },
    providers: [
        Credentials({
            credentials: {
                username: {},
                password: {}
            },
            async authorize (credentials): Promise<User | null> {
                try {
                    if (!credentials?.username || !credentials?.password) return null;
                    const user = await db.query.app_user.findFirst({
                        where: eq(app_user.username, credentials.username as string)
                    })
                    if (!user) {
                        throw new Error("Email atau password salah");
                    }
                    const isValid = await bcrypt.compare(credentials.password as string, user.password as string)
                    if(!isValid) {
                        throw new Error("Email atau password salah");
                    }
                    return {
                        id: user.id,
                        role: user.role,
                    }
                } catch (error) {
                    return null;
                }
            }
        })
    ],
});
