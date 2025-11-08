import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Carousel from "@/models/Carousel";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const carousels = await Carousel.find().sort({ order: 1 });
    return NextResponse.json(carousels);
  } catch (error) {
    console.error("Error fetching carousels:", error);
    return NextResponse.json(
      { error: "Failed to fetch carousels" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await verifyToken(token);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const carousel = await Carousel.create(body);
    return NextResponse.json(carousel, { status: 201 });
  } catch (error) {
    console.error("Error creating carousel:", error);
    return NextResponse.json(
      { error: "Failed to create carousel" },
      { status: 500 }
    );
  }
}
