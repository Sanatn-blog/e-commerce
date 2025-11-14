import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Customer from "@/models/Customer";
import { notifyOrderDelivered } from "@/lib/notificationHelper";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Fetch all orders sorted by creation date (newest first)
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();

    // Fetch customer details for each order
    const ordersWithCustomers = await Promise.all(
      orders.map(async (order) => {
        const customer = (await Customer.findOne({
          customerId: order.customerId,
        }).lean()) as { name?: string; email?: string } | null;

        return {
          id: String(order._id),
          orderNumber: order.orderNumber,
          customer: {
            name: customer?.name || order.shippingAddress.fullName,
            email: customer?.email || "N/A",
            phone: order.shippingAddress.phone,
          },
          date: order.createdAt,
          items: order.items.length,
          subtotal: order.subtotal,
          shipping: order.shipping,
          tax: order.tax,
          total: order.total,
          status: order.status,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          shippingAddress: order.shippingAddress,
          orderItems: order.items,
        };
      })
    );

    return NextResponse.json({ orders: ordersWithCustomers });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Missing orderId or status" },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Create notification when order is delivered
    if (status === "delivered") {
      await notifyOrderDelivered(order._id.toString(), order.orderNumber);
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
