"use server"

import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

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

    await prisma.payment.update({
        where: { stripe_payment_intent_id: paymentIntentId },
        data: {
            status: 'captured',
            captured_at: new Date()
        }
    })

    return intent
}

export async function cancelPayment(paymentIntentId: string) {
    const intent = await stripe.paymentIntents.cancel(paymentIntentId)

    await prisma.payment.update({
        where: { stripe_payment_intent_id: paymentIntentId },
        data: {
            status: 'failed',
            updated_at: new Date()
        }
    })

    return intent
}

