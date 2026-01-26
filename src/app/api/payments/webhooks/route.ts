import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

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

    const supabase = await createClient()

    if (event.type === "payment_intent.amount_capturable_updated") {
        const intent = event.data.object
        await supabase
            .from("payments")
            .update({ status: "authorized" })
            .eq("stripe_payment_intent_id", intent.id)
    }

    if (event.type === "payment_intent.succeeded") {
        const intent = event.data.object
        await supabase
            .from("payments")
            .update({ status: "captured", captured_at: new Date().toISOString() })
            .eq("stripe_payment_intent_id", intent.id)
    }

    return new Response(null, { status: 200 })
}
