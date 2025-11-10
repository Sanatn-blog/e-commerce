import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyCustomerToken } from "@/lib/customerAuth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("customer-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    const customer = await verifyCustomerToken(token);
    if (!customer) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();

    // Get all orders (for debugging)
    const allOrders = await Order.find({}).limit(10);

    // Get orders for this customer
    const customerOrders = await Order.find({
      customerId: customer.customerId,
    });

    return NextResponse.json({
      customer: {
        customerId: customer.customerId,
        phone: customer.phone,
        name: customer.name,
      },
      totalOrdersInDB: allOrders.length,
      customerOrders: customerOrders.length,
      allOrders: allOrders.map((o) => ({
        id: o._id,
        orderNumber: o.orderNumber,
        customerId: o.customerId,
        total: o.total,
      })),
      customerOrdersList: customerOrders.map((o) => ({
        id: o._id,
        orderNumber: o.orderNumber,
        customerId: o.customerId,
        total: o.total,
      })),
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      {
        error: "Debug failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
