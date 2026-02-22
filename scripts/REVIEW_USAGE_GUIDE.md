# Review Feature - Usage Guide

## For Users

### How to Leave a Review

1. **Purchase a Product**

   - Add product to cart and complete checkout
   - Wait for order confirmation

2. **Navigate to Product Page**

   - Go to the product you purchased
   - Click on the "Reviews" tab

3. **Write Your Review**

   - If eligible, you'll see a "Write a Review" button
   - Click the button to open the review form
   - Select a star rating (1-5 stars)
   - Enter a review title (3-100 characters)
   - Write your review (10-1000 characters)
   - Click "Submit Review"

4. **View Your Review**
   - Your review appears immediately after submission
   - It will show a "Verified Purchase" badge

### Review Requirements

✅ **You CAN review if:**

- You are logged in
- You have purchased the product
- You haven't reviewed this product before

 **You CANNOT review if:**

- You are not logged in
- You haven't purchased the product
- You already reviewed this product

## For Developers

### Testing the Feature

1. **Create a Test Order**

   ```bash
   # Login as a customer
   # Add products to cart
   # Complete checkout process
   ```

2. **Test Review Submission**

   ```bash
   # Navigate to product detail page
   # Click Reviews tab
   # Click "Write a Review"
   # Fill out form and submit
   ```

3. **Test Restrictions**
   ```bash
   # Try to review without login → Should redirect to login
   # Try to review unpurchased product → Button won't appear
   # Try to review same product twice → Should show error
   ```

### API Testing

**Check Eligibility:**

```bash
GET /api/reviews/check-eligibility?productId=PRODUCT_ID
# Returns: { canReview: boolean, orderId?: string, reason?: string }
```

**Get Reviews:**

```bash
GET /api/reviews?productId=PRODUCT_ID
# Returns: { reviews: [], totalReviews: number, averageRating: number }
```

**Submit Review:**

```bash
POST /api/reviews
Content-Type: application/json

{
  "productId": "PRODUCT_ID",
  "orderId": "ORDER_ID",
  "rating": 5,
  "title": "Great product!",
  "comment": "I really enjoyed this product. Highly recommended!"
}
```

### Database Queries

**Find all reviews for a product:**

```javascript
db.reviews.find({ productId: "PRODUCT_ID" });
```

**Check if user reviewed a product:**

```javascript
db.reviews.findOne({
  productId: "PRODUCT_ID",
  customerId: "CUSTOMER_ID",
});
```

**Get average rating:**

```javascript
db.reviews.aggregate([
  { $match: { productId: "PRODUCT_ID" } },
  { $group: { _id: null, avgRating: { $avg: "$rating" } } },
]);
```

## Troubleshooting

### "You must be logged in to submit a review"

- Ensure user is authenticated
- Check customer session/token is valid

### "Order not found or does not belong to you"

- Verify orderId is correct
- Ensure order belongs to the logged-in customer

### "You can only review products you have purchased"

- Check if product is in the order items
- Verify productId matches

### "You have already reviewed this product"

- User can only submit one review per product
- Check database for existing review

### Review form not appearing

- User must be logged in
- User must have purchased the product
- User must not have already reviewed it

## Best Practices

### For Users

- Be honest and constructive in reviews
- Provide specific details about your experience
- Rate fairly based on product quality
- Keep reviews relevant to the product

### For Developers

- Always validate user authentication
- Verify purchase before allowing reviews
- Sanitize user input
- Handle errors gracefully
- Provide clear feedback messages
