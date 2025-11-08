import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PromoCode from "@/models/PromoCode";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
    return NextResponse.json(promoCodes);
  } catch (error) {
    console.error("Error fetching promo codes:", error);
    return NextResponse.json(
      { error: "Failed to fetch promo codes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();

    const promoCode = await PromoCode.create(data);
    return NextResponse.json(promoCode, { status: 201 });
  } catch (error) {
    console.error("Error creating promo code:", error);
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json(
        { error: "Promo code already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create promo code" },
      { status: 500 }
    );
  }
}
