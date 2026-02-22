import { Resend } from 'resend';

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via Email
export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      console.log(`OTP for ${email}: ${otp} (Email service not configured)`);
      return false;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Use verified sender or default Resend testing email
    const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    console.log(`Attempting to send OTP to ${email} from ${fromEmail}`);

    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Verification Code</h2>
          <p style="color: #666; font-size: 16px;">Your verification code is:</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2563eb; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });

    console.log(`OTP sent successfully to ${email}. Email ID:`, result.data?.id);
    return true;
  } catch (error: any) {
    console.error("Error sending OTP email:", error);
    console.error("Error details:", error.message || error);
    // Log OTP to console as fallback for development
    console.log(`OTP for ${email}: ${otp} (Email failed to send)`);
    return false;
  }
}

// Send OTP via SMS (integrate with your SMS provider)
export async function sendOTP(phone: string, otp: string): Promise<boolean> {
  try {
    // TODO: Integrate with SMS provider (Twilio, AWS SNS, etc.)
    // For development, log the OTP
    console.log(`OTP for ${phone}: ${otp}`);

    // Example Twilio integration (uncomment and configure):
    /*
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    
    await client.messages.create({
      body: `Your verification code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    */

    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number format
export function isValidPhone(phone: string): boolean {
  // Basic validation for international format
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}
