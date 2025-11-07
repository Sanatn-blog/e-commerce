import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyCustomerToken } from "@/lib/customerAuth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("customer-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customer = await verifyCustomerToken(token);
    if (!customer) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const order = await Order.findOne({
      _id: id,
      customerId: customer.customerId,
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
