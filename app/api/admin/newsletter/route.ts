import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";
import { verifyAdminToken } from "@/lib/auth";

// GET - Fetch all newsletter subscribers
export async function GET(request: NextRequest) {
  try {
    const adminId = await verifyAdminToken(request);
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });

    const stats = {
      total: subscribers.length,
      active: subscribers.filter((s) => s.isActive).length,
      inactive: subscribers.filter((s) => !s.isActive).length,
    };

    return NextResponse.json({ subscribers, stats });
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a subscriber
export async function DELETE(request: NextRequest) {
  try {
    const adminId = await verifyAdminToken(request);
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Subscriber ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const subscriber = await Newsletter.findByIdAndDelete(id);

    if (!subscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Subscriber removed successfully",
    });
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return NextResponse.json(
      { error: "Failed to delete subscriber" },
      { status: 500 }
    );
  }
}

// PATCH - Toggle subscriber status
export async function PATCH(request: NextRequest) {
  try {
    const adminId = await verifyAdminToken(request);
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, isActive } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Subscriber ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const subscriber = await Newsletter.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!subscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Subscriber status updated",
      subscriber,
    });
  } catch (error) {
    console.error("Error updating subscriber:", error);
    return NextResponse.json(
      { error: "Failed to update subscriber" },
      { status: 500 }
    );
  }
}
