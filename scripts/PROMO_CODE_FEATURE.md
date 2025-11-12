# Promo Code Management Feature

## Overview

A complete promo code management system has been added to the admin panel, allowing administrators to create, edit, and manage promotional discount codes.

## Features

### Promo Code Properties

- **Code**: Unique alphanumeric code (automatically converted to uppercase)
- **Description**: Optional description for internal reference
- **Discount Type**:
  - Percentage (%) discount
  - Fixed amount ($) discount
- **Discount Value**: The discount amount or percentage
- **Min Purchase Amount**: Minimum cart value required to use the code
- **Max Discount Amount**: Optional cap on the discount (useful for percentage discounts)
- **Usage Limit**: Optional limit on how many times the code can be used
- **Start Date**: When the promo code becomes active
- **End Date**: When the promo code expires
- **Active Status**: Toggle to enable/disable the code

### Admin Panel Pages

1. **Promo Codes List** (`/admin/promo-codes`)

   - View all promo codes in a table
   - See status (Active, Inactive, Expired, Upcoming)
   - Copy code to clipboard
   - Edit or delete promo codes
   - Track usage count vs limit

2. **Add Promo Code** (`/admin/promo-codes/add`)

   - Create new promo codes
   - Set all properties
   - Validation for required fields

3. **Edit Promo Code** (`/admin/promo-codes/edit/[id]`)
   - Update existing promo codes
   - All fields are editable
   - Cannot change usage count (tracked automatically)

### API Endpoints

- `GET /api/admin/promo-codes` - List all promo codes
- `POST /api/admin/promo-codes` - Create new promo code
- `GET /api/admin/promo-codes/[id]` - Get single promo code
- `PUT /api/admin/promo-codes/[id]` - Update promo code
- `DELETE /api/admin/promo-codes/[id]` - Delete promo code

All endpoints require admin authentication.

### Database Model

Location: `models/PromoCode.ts`

Fields:

- code (String, unique, uppercase)
- description (String)
- discountType (enum: "percentage" | "fixed")
- discountValue (Number)
- minPurchaseAmount (Number)
- maxDiscountAmount (Number, optional)
- usageLimit (Number, optional)
- usedCount (Number, default: 0)
- startDate (Date)
- endDate (Date)
- isActive (Boolean)
- timestamps (createdAt, updatedAt)

## Usage Examples

### Example 1: Percentage Discount

- Code: SUMMER20
- Type: Percentage
- Value: 20%
- Min Purchase: $1000
- Max Discount: $500
- Result: 20% off on orders above $1000, capped at $500 discount

### Example 2: Fixed Discount

- Code: FLAT100
- Type: Fixed
- Value: $100
- Min Purchase: $500
- Result: $100 off on orders above $500

### Example 3: Limited Usage

- Code: FIRST50
- Type: Fixed
- Value: $50
- Usage Limit: 100
- Result: First 100 customers get $50 off

## Integration Notes

To integrate promo code validation in the checkout process:

1. Create a validation endpoint to check if a code is valid
2. Verify:
   - Code exists and is active
   - Current date is between start and end dates
   - Cart total meets minimum purchase amount
   - Usage limit not exceeded (if set)
3. Calculate discount based on type and apply max discount cap if set
4. Increment usedCount when order is completed

## Admin Sidebar

The "Promo Codes" menu item has been added to the admin sidebar with a ticket icon, positioned between "Categories" and "Carousel".
