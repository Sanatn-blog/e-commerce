import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyCustomerToken } from "@/lib/customerAuth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
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

    await connectDB();
    const orders = await Order.find({ customerId: customer.customerId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
