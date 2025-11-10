import Notification from "@/models/Notification";

export async function createNotification(
  type: "order" | "stock" | "delivery" | "product" | "user" | "payment",
  title: string,
  message: string,
  relatedId?: string,
  relatedModel?: string
) {
  try {
    await Notification.create({
      type,
      title,
      message,
      relatedId,
      relatedModel,
      unread: true,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

export async function notifyNewOrder(orderId: string, orderNumber: string) {
  await createNotification(
    "order",
    "New Order Received",
    `Order #${orderNumber} has been placed`,
    orderId,
    "Order"
  );
}

export async function notifyLowStock(productId: string, productName: string) {
  await createNotification(
    "stock",
    "Low Stock Alert",
    `Product '${productName}' is running low on stock`,
    productId,
    "Product"
  );
}

export async function notifyOrderDelivered(
  orderId: string,
  orderNumber: string
) {
  await createNotification(
    "delivery",
    "Order Delivered",
    `Order #${orderNumber} has been delivered successfully`,
    orderId,
    "Order"
  );
}

export async function notifyNewProduct(productId: string, productName: string) {
  await createNotification(
    "product",
    "New Product Added",
    `${productName} has been added to inventory`,
    productId,
    "Product"
  );
}

export async function notifyPaymentReceived(orderId: string, amount: number) {
  await createNotification(
    "payment",
    "Payment Received",
    `Payment of $${amount.toFixed(2)} received`,
    orderId,
    "Order"
  );
}
