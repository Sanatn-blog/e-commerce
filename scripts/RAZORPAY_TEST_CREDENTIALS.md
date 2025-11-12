# Razorpay Test Credentials

Use these test credentials for testing payments in test mode.

## Test Cards

### Success Scenarios

**Visa Card (Domestic)**

- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits (e.g., `123`)
- Expiry: Any future date (e.g., `12/25`)
- Name: Any name

**Mastercard (Domestic)**

- Card Number: `5555 5555 5555 4444`
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

**Rupay Card**

- Card Number: `6522 2222 2222 2222`
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

### Failure Scenarios

**Card Declined**

- Card Number: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

**Insufficient Funds**

- Card Number: `4000 0000 0000 9995`
- CVV: Any 3 digits
- Expiry: Any future date

## Test UPI

**Success**

- UPI ID: `success@razorpay`

**Failure**

- UPI ID: `failure@razorpay`

## Test Net Banking

Select any bank from the list and use the test credentials provided on the payment page.

## Test Wallets

All test wallets will work in test mode. Select any wallet and complete the test payment flow.

## Important Notes

1. All test payments are free - no actual money is charged
2. Test mode transactions don't appear in live dashboard
3. You can test payment failures and edge cases safely
4. Switch to live keys only after thorough testing

## Quick Test Flow

1. Add items to cart
2. Proceed to checkout
3. Fill shipping details
4. Select "Pay Online (Razorpay)"
5. Use test card: `4111 1111 1111 1111`
6. Enter any CVV and future expiry date
7. Complete payment
8. Verify order is created successfully

## Need Help?

Check `RAZORPAY_SETUP.md` for complete setup instructions.
