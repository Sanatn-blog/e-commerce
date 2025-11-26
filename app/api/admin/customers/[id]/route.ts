import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Order from "@/models/Order";
import Address from "@/models/Address";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const customerId = id;

    // Fetch customer details
    const customer = await Customer.findById(customerId)
      .select("-otp -otpExpiry")
      .lean();

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Fetch customer orders
    const ordersData = await Order.find({ customerId: customerId })
      .select("orderNumber total status createdAt items")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Transform orders to include items count
    const orders = ordersData.map((order) => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      items: Array.isArray(order.items) ? order.items.length : 0,
    }));

    // Fetch customer addresses
    const addresses = await Address.find({ customerId: customerId })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean();

    // Calculate statistics
    const allOrders = await Order.find({ customerId: customerId }).lean();
    const totalOrders = allOrders.length;
    const totalSpent = allOrders.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    return NextResponse.json({
      customer,
      orders,
      addresses,
      stats: {
        totalOrders,
        totalSpent,
        averageOrderValue,
      },
    });
  } catch (error) {
    console.error("Error fetching customer details:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer details" },
      { status: 500 }
    );
  }
}
