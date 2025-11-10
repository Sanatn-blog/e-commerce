# Real-Time Notifications Feature

## Overview

The admin dashboard now includes a real-time notification system that automatically updates every 10 seconds to show new notifications about orders, products, stock levels, and deliveries.

## Features

### 1. Notification Types

- **Order**: New orders placed by customers
- **Stock**: Low stock alerts for products
- **Delivery**: Order delivery confirmations
- **Product**: New products added to inventory
- **Payment**: Payment received confirmations
- **User**: User-related notifications

### 2. Real-Time Updates

- Notifications are fetched automatically every 10 seconds
- Unread count badge updates in real-time
- Visual indicators for unread notifications

### 3. User Interactions

- Click on a notification to mark it as read
- "Mark all read" button to clear all unread notifications
- Notifications sidebar with smooth animations
- Time ago display (e.g., "2 minutes ago", "1 hour ago")

## API Endpoints

### GET /api/admin/notifications

Fetch notifications with optional filters

- Query params:
  - `limit`: Number of notifications to fetch (default: 20)
  - `unreadOnly`: Filter only unread notifications (true/false)
- Returns: List of notifications and unread count

### PATCH /api/admin/notifications/[id]

Mark a specific notification as read/unread

- Body: `{ unread: boolean }`

### POST /api/admin/notifications/mark-all-read

Mark all notifications as read

### POST /api/admin/notifications

Create a new notification (used internally)

- Body: `{ type, title, message, relatedId?, relatedModel? }`

## Database Model

```typescript
{
  type: "order" | "stock" | "delivery" | "product" | "user" | "payment",
  title: string,
  message: string,
  relatedId?: string,      // ID of related entity (order, product, etc.)
  relatedModel?: string,   // Model name (Order, Product, etc.)
  unread: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Automatic Notification Triggers

Notifications are automatically created when:

1. **New Order**: When a customer places an order

   - Triggered in: `/api/customer/orders` (POST)

2. **Order Delivered**: When admin marks order as delivered

   - Triggered in: `/api/admin/orders` (PATCH)

3. **New Product**: When a new product is added
   - Triggered in: `/api/products` (POST)

## Helper Functions

Located in `lib/notificationHelper.ts`:

- `createNotification()`: Generic notification creator
- `notifyNewOrder()`: Create notification for new orders
- `notifyLowStock()`: Create notification for low stock
- `notifyOrderDelivered()`: Create notification for deliveries
- `notifyNewProduct()`: Create notification for new products
- `notifyPaymentReceived()`: Create notification for payments

## Usage Example

To add a notification trigger in your code:

```typescript
import { notifyNewOrder } from "@/lib/notificationHelper";

// After creating an order
await notifyNewOrder(order._id.toString(), order.orderNumber);
```

## Testing

To seed sample notifications for testing:

```bash
npx tsx scripts/seedNotifications.ts
```

This will create 5 sample notifications of different types.

## UI Components

The notification UI is integrated into the AdminHeader component:

- Bell icon with unread count badge
- Dropdown sidebar with notification list
- Color-coded icons for different notification types
- Click outside to close functionality
- Responsive design

## Future Enhancements

Potential improvements:

- WebSocket integration for instant notifications
- Push notifications
- Notification preferences/settings
- Notification history page
- Filter notifications by type
- Search notifications
- Email notifications for critical alerts
