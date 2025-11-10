import mongoose from "mongoose";
import Notification from "../models/Notification";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";

async function seedNotifications() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing notifications
    await Notification.deleteMany({});
    console.log("Cleared existing notifications");

    // Create sample notifications
    const notifications = [
      {
        type: "order",
        title: "New Order Received",
        message: "Order #ORD-12345 has been placed",
        unread: true,
      },
      {
        type: "stock",
        title: "Low Stock Alert",
        message: "Product 'Wireless Headphones' is running low on stock",
        unread: true,
      },
      {
        type: "delivery",
        title: "Order Delivered",
        message: "Order #ORD-12340 has been delivered successfully",
        unread: false,
      },
      {
        type: "product",
        title: "New Product Added",
        message: "Smart Watch Pro has been added to inventory",
        unread: false,
      },
      {
        type: "payment",
        title: "Payment Received",
        message: "Payment of $2,499.00 received for Order #ORD-12345",
        unread: true,
      },
    ];

    await Notification.insertMany(notifications);
    console.log(`Created ${notifications.length} sample notifications`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding notifications:", error);
    process.exit(1);
  }
}

seedNotifications();
