# Customer Authentication with Mobile OTP

This guide explains the mobile OTP authentication system for customers.

## Features

- 📱 Mobile OTP-based authentication
- 🔐 Secure JWT session management
- ⏱️ OTP expiry (10 minutes)
- 🔄 Resend OTP functionality
- 👤 Customer profile management
- 🎨 Beautiful, responsive UI

## File Structure

```
app/
├── login/page.tsx              # Login page
├── register/page.tsx           # Registration page
├── components/
│   └── AuthButton.tsx          # Auth status button
├── context/
│   └── AuthContext.tsx         # Auth state management
└── api/auth/
    ├── send-otp/route.ts       # Send OTP endpoint
    ├── verify-otp/route.ts     # Verify OTP endpoint
    ├── me/route.ts             # Get current customer
    └── logout/route.ts         # Logout endpoint

lib/
├── customerAuth.ts             # Customer JWT functions
└── otp.ts                      # OTP generation & sending

models/
└── Customer.ts                 # Customer database model
```

## Setup Instructions

### 1. Environment Variables

Add to your `.env` file:

```env
# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this

# MongoDB Connection
MONGODB_URI=your-mongodb-connection-string

# SMS Provider (Optional - for production)
# Twilio Example:
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Or use other providers like AWS SNS, Vonage, etc.
```

### 2. Install Dependencies (if needed)

For SMS integration with Twilio:

```bash
npm install twilio
```

For AWS SNS:

```bash
npm install @aws-sdk/client-sns
```

### 3. Configure SMS Provider

Edit `lib/otp.ts` to integrate your SMS provider:

#### Twilio Example:

```typescript
import twilio from "twilio";

export async function sendOTP(phone: string, otp: string): Promise<boolean> {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    await client.messages.create({
      body: `Your verification code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
}
```

#### AWS SNS Example:

```typescript
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

export async function sendOTP(phone: string, otp: string): Promise<boolean> {
  try {
    const client = new SNSClient({ region: process.env.AWS_REGION });

    await client.send(
      new PublishCommand({
        Message: `Your verification code is: ${otp}. Valid for 10 minutes.`,
        PhoneNumber: phone,
      })
    );

    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
}
```

## Usage

### Customer Registration Flow

1. Customer visits `/register`
2. Enters name, phone number, and optional email
3. Clicks "Send OTP"
4. Receives 6-digit OTP via SMS
5. Enters OTP to verify and create account
6. Automatically logged in after verification

### Customer Login Flow

1. Customer visits `/login`
2. Enters phone number
3. Clicks "Send OTP"
4. Receives 6-digit OTP via SMS
5. Enters OTP to verify and login
6. Redirected to homepage

### Using Auth in Components

```typescript
import { useAuth } from "@/app/context/AuthContext";

export default function MyComponent() {
  const { customer, loading, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!customer) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <p>Welcome, {customer.name}!</p>
      <p>Phone: {customer.phone}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes

Create a middleware or component wrapper:

```typescript
// app/components/ProtectedRoute.tsx
"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { customer, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !customer) {
      router.push("/login");
    }
  }, [customer, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!customer) return null;

  return <>{children}</>;
}
```

## API Endpoints

### POST /api/auth/send-otp

Send OTP to phone number

**Request:**

```json
{
  "phone": "+1234567890"
}
```

**Response:**

```json
{
  "message": "OTP sent successfully",
  "expiresIn": 600
}
```

### POST /api/auth/verify-otp

Verify OTP and login/register

**Request:**

```json
{
  "phone": "+1234567890",
  "otp": "123456",
  "name": "John Doe" // Optional, for registration
}
```

**Response:**

```json
{
  "message": "Login successful",
  "customer": {
    "id": "...",
    "phone": "+1234567890",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### GET /api/auth/me

Get current authenticated customer

**Response:**

```json
{
  "customer": {
    "id": "...",
    "phone": "+1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "isVerified": true
  }
}
```

### POST /api/auth/logout

Logout current customer

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

## Security Features

- ✅ OTP expires after 10 minutes
- ✅ JWT tokens stored in httpOnly cookies
- ✅ Phone number validation
- ✅ Rate limiting recommended (add middleware)
- ✅ Secure session management

## Customization

### Change OTP Length

Edit `lib/otp.ts`:

```typescript
export function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit
}
```

### Change OTP Expiry

Edit `app/api/auth/send-otp/route.ts`:

```typescript
const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
```

### Change Session Duration

Edit `lib/customerAuth.ts`:

```typescript
.setExpirationTime("7d") // 7 days instead of 30
```

## Testing (Development)

During development, OTP is logged to console. Check your terminal:

```
OTP for +1234567890: 123456
```

## Production Checklist

- [ ] Configure SMS provider (Twilio, AWS SNS, etc.)
- [ ] Set strong JWT_SECRET in production
- [ ] Enable HTTPS
- [ ] Add rate limiting for OTP requests
- [ ] Add CAPTCHA for bot protection
- [ ] Monitor SMS costs
- [ ] Set up error tracking
- [ ] Add analytics

## Troubleshooting

**OTP not received:**

- Check SMS provider configuration
- Verify phone number format includes country code
- Check SMS provider logs/dashboard

**Invalid OTP error:**

- OTP may have expired (10 min limit)
- Check for typos in OTP entry
- Request new OTP

**Session not persisting:**

- Check cookie settings
- Verify JWT_SECRET is set
- Check browser cookie settings

## Support

For issues or questions, check:

- MongoDB connection
- Environment variables
- SMS provider status
- Browser console for errors
