import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient()
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const basePrisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export const prisma = basePrisma.$extends({
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

export const privilegedPrisma = basePrisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = basePrisma
