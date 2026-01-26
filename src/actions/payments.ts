"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function createPaymentIntent(amount: number, currency: string = "usd", bookingId: string) {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency,
        capture_method: "manual",
        metadata: { bookingId },
    })

    return { clientSecret: paymentIntent.client_secret }
}

export async function capturePayment(paymentIntentId: string) {
    const intent = await stripe.paymentIntents.capture(paymentIntentId)

    const supabase = await createClient()
    await supabase
        .from('payments')
        .update({ status: 'captured', captured_at: new Date().toISOString() })
        .eq('stripe_payment_intent_id', paymentIntentId)

    return intent
}

export async function cancelPayment(paymentIntentId: string) {
    const intent = await stripe.paymentIntents.cancel(paymentIntentId)

    const supabase = await createClient()
    await supabase
        .from('payments')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('stripe_payment_intent_id', paymentIntentId)

    return intent
}
