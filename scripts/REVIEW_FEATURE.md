# Product Review Feature

## Overview

This feature allows logged-in users to review products they have purchased. Each user can submit only one review per product, ensuring authentic and verified feedback.

## Key Features

### 1. Review Restrictions

- **Login Required**: Only authenticated users can submit reviews
- **Purchase Verification**: Users can only review products they have actually purchased
- **One Review Per Product**: Each user can submit only one review per product (enforced at database level)
- **Verified Badge**: All reviews display a "Verified Purchase" badge

### 2. Review Components

#### Review Model (`models/Review.ts`)

- Stores product reviews with customer information
- Fields: productId, customerId, customerName, orderId, rating (1-5), title, comment
- Compound unique index on (productId, customerId) prevents duplicate reviews

#### API Endpoints

**GET `/api/reviews?productId={id}`**

- Fetches all reviews for a product
- Returns reviews array, total count, and average rating
- Public endpoint (no authentication required)

**POST `/api/reviews`**

- Creates a new review
- Requires authentication
- Validates purchase and prevents duplicates
- Body: `{ productId, orderId, rating, title, comment }`

**GET `/api/reviews/check-eligibility?productId={id}`**

- Checks if logged-in user can review a product
- Returns eligibility status and orderId if eligible
- Requires authentication

### 3. UI Components

#### ReviewForm (`app/components/ReviewForm.tsx`)

- Interactive form for submitting reviews
- 5-star rating selector with hover effects
- Title input (max 100 characters)
- Comment textarea (max 1000 characters)
- Real-time character counters
- Validation and error handling

#### ReviewList (`app/components/ReviewList.tsx`)

- Displays all product reviews
- Shows rating summary with average and distribution
- Individual review cards with:
  - Customer name
  - Star rating
  - Verified purchase badge
  - Review date
  - Title and comment

### 4. Product Detail Integration

- Reviews tab in product detail page
- Dynamic review count in tab header
- "Write a Review" button for eligible users
- Login prompt for non-authenticated users
- Real-time review updates after submission

## Usage Flow

1. **User browses product** → Views existing reviews in Reviews tab
2. **User purchases product** → Order is created in database
3. **User returns to product page** → System checks eligibility
4. **Eligible user clicks "Write a Review"** → Review form appears
5. **User submits review** → Validated and saved to database
6. **Review appears immediately** → Page refreshes to show new review

## Database Schema

```typescript
{
  productId: String (indexed),
  customerId: String (indexed),
  customerName: String,
  orderId: String,
  rating: Number (1-5),
  title: String (max 100 chars),
  comment: String (max 1000 chars),
  verified: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- Server-side authentication validation
- Purchase verification before allowing reviews
- Duplicate review prevention at database level
- Input validation and sanitization
- Character limits on text fields

## Future Enhancements

Potential improvements:

- Review editing (within time limit)
- Review images/photos
- Helpful/unhelpful voting
- Review moderation system
- Review sorting options
- Review filtering by rating
