// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
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

// Validate phone number format
export function isValidPhone(phone: string): boolean {
  // Basic validation for international format
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}
