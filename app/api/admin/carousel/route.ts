import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Carousel from "@/models/Carousel";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected, fetching carousels...");
    const carousels = await Carousel.find().sort({ order: 1 });
    console.log("Carousels fetched successfully:", carousels.length);
    return NextResponse.json(carousels);
  } catch (error) {
    console.error("Error fetching carousels:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return NextResponse.json(
      {
        error: "Failed to fetch carousels",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/admin/carousel - Starting...");
    const token = request.cookies.get("admin-token")?.value;
    if (!token) {
      console.log("No admin token found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Verifying admin token...");
    const admin = await verifyToken(token);
    if (!admin) {
      console.log("Invalid admin token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Admin verified, connecting to database...");
    await connectDB();
    console.log("Database connected, parsing request body...");
    const body = await request.json();
    console.log("Creating carousel with data:", body);
    const carousel = await Carousel.create(body);
    console.log("Carousel created successfully:", carousel._id);
    return NextResponse.json(carousel, { status: 201 });
  } catch (error) {
    console.error("Error creating carousel:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return NextResponse.json(
      {
        error: "Failed to create carousel",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
