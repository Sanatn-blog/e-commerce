# Razorpay Payment Gateway Integration

This guide will help you set up Razorpay payment gateway for your e-commerce application.

## Setup Instructions

### 1. Create Razorpay Account

1. Go to [https://razorpay.com/](https://razorpay.com/)
2. Sign up for a free account
3. Complete the verification process

### 2. Get Test API Keys

1. Login to your Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. Click on **Generate Test Key** (for testing)
4. You'll get:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (keep this secret!)

### 3. Configure Environment Variables

Add these to your `.env` file:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

**Important:**

- Use `rzp_test_` keys for testing
- Never commit `.env` file to git
- Keep your secret key secure

### 4. Test Payment

For testing, use these test card details:

#### Test Cards

- **Card Number:** 4111 1111 1111 1111
- **CVV:** Any 3 digits
- **Expiry:** Any future date
- **Name:** Any name

#### Test UPI

- **UPI ID:** success@razorpay
- **Status:** Will succeed

#### Test Net Banking

- Select any bank and use the test credentials provided

### 5. Payment Flow

1. Customer selects items and proceeds to checkout
2. Customer fills shipping details
3. Customer selects "Pay Online (Razorpay)"
4. Razorpay payment modal opens
5. Customer completes payment
6. Payment is verified on backend
7. Order is created and cart is cleared

### 6. Go Live (Production)

When ready for production:

1. Complete KYC verification in Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. Generate **Live Keys** (starts with `rzp_live_`)
4. Update your `.env` with live keys:

```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
```

5. Test thoroughly before going live
6. Enable required payment methods in Dashboard

### 7. Features Implemented

- ✅ Create Razorpay order
- ✅ Payment verification with signature
- ✅ Support for all Razorpay payment methods (Cards, UPI, Wallets, Net Banking)
- ✅ Cash on Delivery option
- ✅ Secure payment handling
- ✅ Order creation after successful payment

### 8. API Routes

- **POST** `/api/razorpay/create-order` - Creates a Razorpay order
- **POST** `/api/razorpay/verify-payment` - Verifies payment signature

### 9. Testing Checklist

- [ ] Test with test card
- [ ] Test with test UPI
- [ ] Test payment cancellation
- [ ] Test payment failure
- [ ] Test Cash on Delivery
- [ ] Verify order creation
- [ ] Check cart clearing after payment

### 10. Important Notes

- Razorpay charges a transaction fee (check their pricing)
- Test mode has no transaction limits
- Live mode requires KYC completion
- Keep your secret keys secure
- Never expose secret keys in frontend code
- Always verify payment signature on backend

### 11. Support

- Razorpay Documentation: [https://razorpay.com/docs/](https://razorpay.com/docs/)
- Support: [https://razorpay.com/support/](https://razorpay.com/support/)

## Troubleshooting

### Payment Modal Not Opening

- Check if Razorpay script is loaded
- Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set correctly
- Check browser console for errors

### Payment Verification Failed

- Ensure `RAZORPAY_KEY_SECRET` is correct
- Check signature verification logic
- Verify order ID matches

### Order Not Created

- Check backend logs
- Verify payment verification succeeded
- Ensure database connection is working
