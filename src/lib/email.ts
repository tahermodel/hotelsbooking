import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmationEmail(email: string, reference: string) {
    try {
        await resend.emails.send({
            from: 'StayEase <bookings@stayease.com>',
            to: email,
            subject: `Booking Confirmed: ${reference}`,
            html: `<h1>Thanks for booking with StayEase!</h1><p>Your reservation ${reference} is confirmed.</p>`
        });
    } catch (error) {
        console.error("Failed to send email", error);
    }
}
