import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Carousel from "@/models/Carousel";
import { verifyToken } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    const body = await request.json();
    const carousel = await Carousel.findByIdAndUpdate(id, body, { new: true });

    if (!carousel) {
      return NextResponse.json(
        { error: "Carousel not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(carousel);
  } catch (error) {
    console.error("Error updating carousel:", error);
    return NextResponse.json(
      { error: "Failed to update carousel" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    const carousel = await Carousel.findByIdAndDelete(id);

    if (!carousel) {
      return NextResponse.json(
        { error: "Carousel not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Carousel deleted successfully" });
  } catch (error) {
    console.error("Error deleting carousel:", error);
    return NextResponse.json(
      { error: "Failed to delete carousel" },
      { status: 500 }
    );
  }
}
