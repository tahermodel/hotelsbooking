import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get("Stripe-Signature") as string

    let event
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new Response(`Webhook Error: ${error.message}`, { status: 400 })
    }

    if (event.type === "payment_intent.amount_capturable_updated") {
        const intent = event.data.object as any
        await prisma.payment.update({
            where: { stripe_payment_intent_id: intent.id },
            data: { status: "authorized" }
        })
    }

    if (event.type === "payment_intent.succeeded") {
        const intent = event.data.object as any
        await prisma.payment.update({
            where: { stripe_payment_intent_id: intent.id },
            data: {
                status: "captured",
                captured_at: new Date()
            }
        })
    }

    return new Response(null, { status: 200 })
}
