import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient().$extends({
        query: {
            user: {
                async update({ args, query }) {
                    if (args.data.role !== undefined) {
                        throw new Error("SECURITY_RESTRICTION: User roles can only be modified via Prisma Studio.")
                    }
                    return query(args)
                },
                async updateMany({ args, query }) {
                    if (args.data.role !== undefined) {
                        throw new Error("SECURITY_RESTRICTION: User roles can only be modified via Prisma Studio.")
                    }
                    return query(args)
                },
                async upsert({ args, query }) {
                    if (args.update.role !== undefined) {
                        throw new Error("SECURITY_RESTRICTION: User roles can only be modified via Prisma Studio.")
                    }
                    return query(args)
                }
            }
        }
    })
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
