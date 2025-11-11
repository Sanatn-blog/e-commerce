/**
 * Seed Script for Reviews
 *
 * This script helps you create test reviews for development.
 * Run with: npx ts-node scripts/seedReviews.ts
 */

import mongoose from "mongoose";
import Review from "../models/Review";
import Product from "../models/Product";
import Order from "../models/Order";
import Customer from "../models/Customer";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";

async function seedReviews() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Get sample data
    const products = await Product.find().limit(5).lean();
    const customers = await Customer.find().limit(3).lean();
    const orders = await Order.find().limit(5).lean();

    if (
      products.length === 0 ||
      customers.length === 0 ||
      orders.length === 0
    ) {
      console.log(
        "Please ensure you have products, customers, and orders in the database first."
      );
      return;
    }

    // Sample reviews
    const sampleReviews = [
      {
        rating: 5,
        title: "Excellent product!",
        comment:
          "This product exceeded my expectations. The quality is outstanding and it arrived quickly. Highly recommend to anyone looking for a reliable option.",
      },
      {
        rating: 4,
        title: "Very good, minor issues",
        comment:
          "Overall a great purchase. The product works well and looks good. Only minor issue was the packaging could be better, but the product itself is solid.",
      },
      {
        rating: 5,
        title: "Perfect fit and quality",
        comment:
          "Absolutely love this! The fit is perfect, quality is top-notch, and the price is reasonable. Will definitely buy again.",
      },
      {
        rating: 3,
        title: "Decent but not amazing",
        comment:
          "It's okay for the price. Does what it's supposed to do but nothing special. Would consider other options next time.",
      },
      {
        rating: 5,
        title: "Best purchase this year!",
        comment:
          "I can't say enough good things about this product. It's exactly what I needed and the customer service was excellent too.",
      },
    ];

    let reviewsCreated = 0;

    // Create reviews for each product
    for (let i = 0; i < Math.min(products.length, 3); i++) {
      const product = products[i];
      const customer = customers[i % customers.length];
      const order = orders[i % orders.length];

      // Check if review already exists
      const existingReview = await Review.findOne({
        productId: (product._id as mongoose.Types.ObjectId).toString(),
        customerId: (customer._id as mongoose.Types.ObjectId).toString(),
      });

      if (existingReview) {
        console.log(
          `Review already exists for product ${product.name} by ${customer.name}`
        );
        continue;
      }

      const reviewData = sampleReviews[i % sampleReviews.length];

      await Review.create({
        productId: (product._id as mongoose.Types.ObjectId).toString(),
        customerId: (customer._id as mongoose.Types.ObjectId).toString(),
        customerName: customer.name || "Anonymous",
        orderId: (order._id as mongoose.Types.ObjectId).toString(),
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        verified: true,
      });

      reviewsCreated++;
      console.log(`✓ Created review for ${product.name} by ${customer.name}`);
    }

    console.log(`\n✅ Successfully created ${reviewsCreated} reviews`);

    // Show statistics
    const totalReviews = await Review.countDocuments();
    console.log(`📊 Total reviews in database: ${totalReviews}`);
  } catch (error) {
    console.error("Error seeding reviews:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the seed function
seedReviews();
