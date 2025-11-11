import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";
import Order from "@/models/Order";
import { getCustomerSession } from "@/lib/customerAuth";

// GET - Check if user can review a product
export async function GET(request: NextRequest) {
  try {
    const session = await getCustomerSession();

    if (!session?.customerId) {
      return NextResponse.json(
        { canReview: false, reason: "Not logged in" },
        { status: 200 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const customerId = session.customerId;

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      productId,
      customerId,
    });

    if (existingReview) {
      return NextResponse.json({
        canReview: false,
        reason: "Already reviewed",
        existingReview,
      });
    }

    // Check if user has purchased this product
    const orders = await Order.find({
      customerId: customerId,
      "items.productId": productId,
    });

    if (orders.length === 0) {
      return NextResponse.json({
        canReview: false,
        reason: "Not purchased",
      });
    }

    // Return the first order that contains this product
    const eligibleOrder = orders[0];

    return NextResponse.json({
      canReview: true,
      orderId: eligibleOrder._id,
      orderNumber: eligibleOrder.orderNumber,
    });
  } catch (error) {
    console.error("Error checking review eligibility:", error);
    return NextResponse.json(
      { error: "Failed to check eligibility" },
      { status: 500 }
    );
  }
}
