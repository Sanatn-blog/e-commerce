import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Carousel from "@/models/Carousel";
import { verifyToken } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("PUT /api/admin/carousel/[id] - Starting...");
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
    const { id } = await params;
    console.log("Updating carousel with ID:", id);
    const body = await request.json();
    console.log("Update data:", body);
    const carousel = await Carousel.findByIdAndUpdate(id, body, { new: true });

    if (!carousel) {
      console.log("Carousel not found with ID:", id);
      return NextResponse.json(
        { error: "Carousel not found" },
        { status: 404 }
      );
    }

    console.log("Carousel updated successfully");
    return NextResponse.json(carousel);
  } catch (error) {
    console.error("Error updating carousel:", error);
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
        error: "Failed to update carousel",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("DELETE /api/admin/carousel/[id] - Starting...");
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
    const { id } = await params;
    console.log("Deleting carousel with ID:", id);
    const carousel = await Carousel.findByIdAndDelete(id);

    if (!carousel) {
      console.log("Carousel not found with ID:", id);
      return NextResponse.json(
        { error: "Carousel not found" },
        { status: 404 }
      );
    }

    console.log("Carousel deleted successfully");
    return NextResponse.json({ message: "Carousel deleted successfully" });
  } catch (error) {
    console.error("Error deleting carousel:", error);
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
        error: "Failed to delete carousel",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
