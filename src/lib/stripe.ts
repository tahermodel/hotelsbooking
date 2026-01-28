import Stripe from 'stripe'

let stripeInstance: Stripe | null = null;

export const getStripe = () => {
    const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock';
    if (!stripeInstance) {
        stripeInstance = new Stripe(apiKey, {
            apiVersion: '2025-01-27.acacia' as any,
        })
    }
    return stripeInstance
}

export const stripe = getStripe();
