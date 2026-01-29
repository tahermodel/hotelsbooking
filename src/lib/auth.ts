


import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"

class UserNotFound extends CredentialsSignin {
    code = "user_not_found"
}

class InvalidPassword extends CredentialsSignin {
    code = "invalid_password"
}

class EmailNotVerified extends CredentialsSignin {
    code = "email_not_verified"
}

import type { Adapter } from "next-auth/adapters"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        ...authConfig.providers,
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const normalizedEmail = (credentials.email as string).toLowerCase().trim()

                const user = await prisma.user.findUnique({
                    where: { email: normalizedEmail }
                })

                if (!user || user.password === null) {
                    throw new UserNotFound()
                }

                if (!user.is_verified) {
                    throw new EmailNotVerified()
                }

                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (!isValid) {
                    throw new InvalidPassword()
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                }
            },
        }),
    ],
})

