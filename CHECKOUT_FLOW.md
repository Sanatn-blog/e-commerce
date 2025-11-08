# Checkout Flow Documentation

## Overview

This checkout flow is designed for Indian e-commerce with India-specific address format (PIN code-based), Indian Rupee (₹) currency, and GST calculation. It allows both logged-in users and guest users to complete purchases. Guest users provide their details and verify their phone number via OTP before proceeding to payment.

## Flow Steps

### 1. Cart Page (`/cart`)

- Users review their cart items
- Click "Proceed to Checkout" button to start checkout process

### 2. Checkout Page (`/checkout`)

- **For Logged-in Users:**

  - Pre-fills name, email, and phone from their profile
  - Users only need to provide shipping address
  - Click "Proceed to Payment" to continue

- **For Guest Users:**
  - Collects customer information:
    - Full Name
    - Phone Number (10 digits - Indian mobile number)
    - Email Address
    - Shipping Address (India):
      - House/Flat No., Building Name (required)
      - Area, Street, Sector, Village (optional)
      - Landmark (optional)
      - PIN Code (required - 6 digits) - Auto-fills City and State
      - City/District (required) - Auto-filled from PIN Code
      - State (required) - Auto-filled from PIN Code
  - Validates all fields
  - Click "Verify & Continue" button
  - Sends OTP to provided phone number
  - Shows OTP verification modal
  - User enters 6-digit OTP
  - On successful verification:
    - Creates/updates customer account
    - Stores customer details in session
    - Redirects to payment page

### 3. Payment Page (`/payment`)

- Displays order summary with shipping details
- Shows all cart items and total amount
- Payment method options:

  - **Credit/Debit Card:**
    - Card Number (16 digits)
    - Cardholder Name
    - Expiry Date (MM/YY)
    - CVV (3 digits)
  - **Cash on Delivery (COD):**
    - No card details required
    - Pay when order is delivered

- Click "Place Order" to complete purchase
- Shows success message with order confirmation
- Clears cart and redirects to home page

## API Endpoints

### `/api/auth/session` (GET)

- Returns current customer session if logged in
- Used to check authentication status

### `/api/auth/send-otp` (POST)

- Sends OTP to customer's phone number
- Creates or updates customer record
- Body: `{ phone: string }`

### `/api/auth/verify-otp` (POST)

- Verifies OTP and creates session
- Updates customer verification status
- Body: `{ phone: string, otp: string, name: string }`

### `/api/auth/update-profile` (POST)

- Updates customer profile with additional details
- Requires authenticated session
- Body: `{ email, address, address2?, city, state, zipCode, landmark? }`

## Data Models

### Customer Model

```typescript
{
  phone: string (required, unique)
  name?: string
  email?: string
  address?: string
  address2?: string
  city?: string
  state?: string
  zipCode?: string
  landmark?: string
  otp?: string
  otpExpiry?: Date
  isVerified: boolean
  createdAt: Date
  lastLogin?: Date
}
```

## Session Storage

- `checkoutDetails`: Stores customer and shipping information
- `orderTotal`: Stores final order amount

## Features

- Form validation for all input fields
- Phone number format validation (10 digits - Indian mobile)
- Email format validation
- **PIN Code Auto-fill**: Automatically fills City/District and State when 6-digit PIN code is entered (uses India Postal PIN Code API)
- OTP expiry (10 minutes)
- Resend OTP functionality
- Secure session management with JWT
- Card number formatting (spaces every 4 digits)
- Expiry date formatting (MM/YY)
- CVV validation (3 digits)
- Free shipping for orders over ₹500
- 18% GST (Goods and Services Tax) calculation for India
- Order success confirmation

## Security

- OTP-based phone verification
- JWT token authentication
- HTTP-only cookies for session
- Input validation and sanitization
- Secure payment processing simulation
