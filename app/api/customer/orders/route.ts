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

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const {
      items,
      customerDetails,
      paymentMethod,
      paymentDetails,
      total,
      status,
    } = body;

    if (
      !items ||
      !items.length ||
      !customerDetails ||
      !paymentMethod ||
      !total
    ) {
      return NextResponse.json(
        { error: "Missing required order information" },
        { status: 400 }
      );
    }

    await connectDB();

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Map cart items to order items format
    const orderItems = items.map((item: any) => ({
      productId: item.id || item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));

    // Create shipping address from customer details
    const shippingAddress = {
      fullName: customerDetails.name,
      phone: customerDetails.phone,
      addressLine1: customerDetails.address,
      addressLine2: customerDetails.address2 || "",
      city: customerDetails.city,
      state: customerDetails.state,
      zipCode: customerDetails.zipCode,
      country: "India",
    };

    // Create order
    const order = new Order({
      customerId: customer.customerId,
      orderNumber,
      items: orderItems,
      subtotal: total,
      shipping: 0,
      tax: 0,
      total,
      status: status || "pending",
      shippingAddress,
      paymentMethod,
      paymentStatus: status === "paid" ? "paid" : "pending",
    });

    await order.save();

    return NextResponse.json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
