import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
})

export async function sendEmail({
    to,
    subject,
    text,
    html,
}: {
    to: string
    subject: string
    text: string
    html?: string
}) {
    try {
        const info = await transporter.sendMail({
            from: `"StayEase" <${process.env.EMAIL_SERVER_USER}>`,
            to,
            subject,
            text,
            html,
        })
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error("Error sending email:", error)
        return { success: false, error }
    }
}
