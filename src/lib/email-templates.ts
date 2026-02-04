export const EmailTemplates = {
    frame: (content: string, previewText: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StayEase</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');
        body { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important; }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7f9; -webkit-font-smoothing: antialiased;">
    <div style="display: none; max-height: 0px; overflow: hidden;">${previewText}</div>
    <div style="width: 100%; table-layout: fixed; background-color: #f4f7f9; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);">
            <div style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 50px 40px; text-align: center;">
                <div style="display: inline-block; padding: 12px 24px; border: 1px solid rgba(255,255,255,0.2); border-radius: 16px; backdrop-filter: blur(10px);">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.03em; text-transform: uppercase;">StayEase</h1>
                </div>
                <p style="color: rgba(255,255,255,0.5); margin: 15px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 600;">Excellence in Hospitality</p>
            </div>
            
            <div style="padding: 60px 50px;">
                ${content}
            </div>
            
            <div style="background-color: #fafbfc; padding: 40px 50px; text-align: center; border-top: 1px solid #f1f5f9;">
                <div style="margin-bottom: 25px;">
                    <a href="#" style="color: #000; text-decoration: none; margin: 0 15px; font-size: 13px; font-weight: 600;">My Bookings</a>
                    <a href="#" style="color: #000; text-decoration: none; margin: 0 15px; font-size: 13px; font-weight: 600;">Support</a>
                    <a href="#" style="color: #000; text-decoration: none; margin: 0 15px; font-size: 13px; font-weight: 600;">Account</a>
                </div>
                <p style="color: #94a3b8; font-size: 12px; line-height: 1.8; margin: 0;">
                    This email was sent by StayEase Luxury Hotels & Resorts.<br>
                    123 Luxury Avenue, Suite 500, Global City<br>
                    &copy; 2026 StayEase. All rights reserved.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
`,

    verification: (name: string, code: string) => EmailTemplates.frame(`
        <h2 style="color: #000; font-size: 28px; font-weight: 800; margin: 0 0 20px 0; letter-spacing: -0.02em;">Welcome to the Elite, ${name}</h2>
        <p style="color: #64748b; font-size: 17px; line-height: 1.6; margin: 0 0 40px 0;">To begin your journey with StayEase, please use the secure verification code below to authenticate your account.</p>
        
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 24px; padding: 40px; text-align: center; margin-bottom: 40px;">
            <p style="color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 15px 0;">Your Verification Code</p>
            <div style="font-size: 56px; font-weight: 800; color: #000; letter-spacing: 12px; font-family: 'Courier New', monospace;">${code}</div>
        </div>
        
        <p style="color: #94a3b8; font-size: 14px; text-align: center; margin: 0; font-style: italic;">
            This code will expire in <span style="color: #000; font-weight: 700;">10 minutes</span> for your security.
        </p>
    `, "Verify your StayEase Account"),

    securityAlert: (message: string) => EmailTemplates.frame(`
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; background: #fff1f2; color: #e11d48; padding: 8px 16px; border-radius: 100px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Security Notice</div>
        </div>
        <h2 style="color: #000; font-size: 24px; font-weight: 800; margin: 0 0 20px 0; letter-spacing: -0.02em; text-align: center;">Account Security Update</h2>
        <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0 0 40px 0; text-align: center;">${message}</p>
        
        <div style="background: #000; border-radius: 16px; padding: 25px; text-align: center;">
            <p style="color: #fff; font-size: 14px; margin: 0; line-height: 1.5;">If you did not authorize this change, please contact our emergency security team immediately.</p>
        </div>
    `, "Security Alert: Account Updated"),

    bookingConfirmed: (ref: string, checkIn: string) => EmailTemplates.frame(`
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; background: #f0fdf4; color: #16a34a; padding: 8px 16px; border-radius: 100px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Booking Confirmed</div>
        </div>
        <h2 style="color: #000; font-size: 28px; font-weight: 800; margin: 0 0 20px 0; letter-spacing: -0.02em;">Your escape is ready.</h2>
        <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0 0 40px 0;">We are delighted to confirm your upcoming stay. Your luxury experience at StayEase is meticulously prepared for your arrival.</p>
        
        <div style="border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden;">
            <div style="padding: 25px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #64748b; font-size: 14px;">Reference</span>
                <span style="color: #000; font-size: 14px; font-weight: 700;">${ref}</span>
            </div>
            <div style="padding: 25px; background: #fafbfc; display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #64748b; font-size: 14px;">Check-in Date</span>
                <span style="color: #000; font-size: 14px; font-weight: 700;">${new Date(checkIn).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
        </div>
        
        <div style="margin-top: 40px; text-align: center;">
            <a href="#" style="display: inline-block; background: #000; color: #fff; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: 700; font-size: 15px;">View Booking Details</a>
        </div>
    `, "Your StayEase Booking is Confirmed"),

    bookingCancelled: (ref: string, refundAmount: number) => EmailTemplates.frame(`
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; background: #f1f5f9; color: #64748b; padding: 8px 16px; border-radius: 100px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Cancellation</div>
        </div>
        <h2 style="color: #000; font-size: 24px; font-weight: 800; margin: 0 0 20px 0; letter-spacing: -0.02em;">Booking Cancelled</h2>
        <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0 0 40px 0;">As requested, your booking (<b>${ref}</b>) has been cancelled. We hope to welcome you back in the future.</p>
        
        <div style="background: #f8fafc; border-radius: 24px; padding: 30px; text-align: center;">
            <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">Refund Status</p>
            <div style="font-size: 32px; font-weight: 800; color: #000;">$${refundAmount.toFixed(2)}</div>
            <p style="color: #94a3b8; font-size: 12px; margin: 10px 0 0 0;">Processed to your original payment method</p>
        </div>
    `, "Your StayEase Booking has been Cancelled")
}
