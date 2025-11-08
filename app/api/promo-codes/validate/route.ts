import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PromoCode from "@/models/PromoCode";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { code, cartTotal } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Promo code is required" },
        { status: 400 }
      );
    }

    // Find the promo code (case-insensitive)
    const promoCode = await PromoCode.findOne({
      code: code.toUpperCase(),
    });

    if (!promoCode) {
      return NextResponse.json(
        { error: "Invalid promo code" },
        { status: 404 }
      );
    }

    // Check if promo code is active
    if (!promoCode.isActive) {
      return NextResponse.json(
        { error: "This promo code is not active" },
        { status: 400 }
      );
    }

    // Check if promo code has started
    const now = new Date();
    if (new Date(promoCode.startDate) > now) {
      return NextResponse.json(
        { error: "This promo code is not yet active" },
        { status: 400 }
      );
    }

    // Check if promo code has expired
    if (new Date(promoCode.endDate) < now) {
      return NextResponse.json(
        { error: "This promo code has expired" },
        { status: 400 }
      );
    }

    // Check usage limit
    if (promoCode.usageLimit && promoCode.usedCount >= promoCode.usageLimit) {
      return NextResponse.json(
        { error: "This promo code has reached its usage limit" },
        { status: 400 }
      );
    }

    // Check minimum purchase amount
    if (cartTotal < promoCode.minPurchaseAmount) {
      return NextResponse.json(
        {
          error: `Minimum purchase amount of ₹${promoCode.minPurchaseAmount} required`,
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (promoCode.discountType === "percentage") {
      discountAmount = (cartTotal * promoCode.discountValue) / 100;
      // Apply max discount cap if set
      if (
        promoCode.maxDiscountAmount &&
        discountAmount > promoCode.maxDiscountAmount
      ) {
        discountAmount = promoCode.maxDiscountAmount;
      }
    } else {
      // Fixed discount
      discountAmount = promoCode.discountValue;
    }

    // Ensure discount doesn't exceed cart total
    discountAmount = Math.min(discountAmount, cartTotal);

    return NextResponse.json({
      success: true,
      promoCode: {
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
      },
      message: "Promo code applied successfully",
    });
  } catch (error) {
    console.error("Error validating promo code:", error);
    return NextResponse.json(
      { error: "Failed to validate promo code" },
      { status: 500 }
    );
  }
}
